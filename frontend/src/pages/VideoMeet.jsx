import React, { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import { Badge, IconButton, TextField, Tooltip, Container, Paper, Typography } from '@mui/material';
import { Button } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import styles from "../styles/videoComponent.module.css";
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import server from '../environment';

const server_url = server;

var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

export default function VideoMeetComponent() {

    var socketRef = useRef();
    let socketIdRef = useRef();

    let localVideoref = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);

    let [audioAvailable, setAudioAvailable] = useState(true);

    let [video, setVideo] = useState(true);

    let [audio, setAudio] = useState(true);

    let [screen, setScreen] = useState();

    let [showModal, setModal] = useState(false);

    let [screenAvailable, setScreenAvailable] = useState();

    let [messages, setMessages] = useState([])

    let [message, setMessage] = useState("");

    let [newMessages, setNewMessages] = useState(0);

    let [askForUsername, setAskForUsername] = useState(true);

    let [username, setUsername] = useState("");

    const videoRef = useRef([])

    let [videos, setVideos] = useState([])

    useEffect(() => {
        getPermissions();
    }, [])

    useEffect(() => {
        if (!askForUsername && localVideoref.current && window.localStream) {
            localVideoref.current.srcObject = window.localStream;
        }
    }, [askForUsername])

    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }

    const getPermissions = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (stream) {
                setVideoAvailable(true);
                setAudioAvailable(true);
                window.localStream = stream;
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
             // Logic for video/audio init if needed, but permissions handle most.
             // We don't want to recall getUserMedia on state toggle if we just toggle tracks
        }
    }, [video, audio])

    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();
    }

    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            for (let id in connections) {
                connections[id].addStream(window.localStream)

                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
            }
        })
    }

    let getUserMedia = () => {
        // This function seems redundant for simple toggling if we have tracks
        // Keeping it if logic needs full restart, but for strict toggle better to use tracks
        if ((video && videoAvailable) || (audio && audioAvailable)) {
             // Logic to refresh stream if needed
        } 
    }

    let getDislayMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            getUserMedia()

        })
    }

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }

    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false })

        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href)
            socketIdRef.current = socketRef.current.id

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
            })

            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {

                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
                    // Wait for their ice candidate       
                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }

                    // Wait for their video stream
                    connections[socketListId].onaddstream = (event) => {
                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                        if (videoExists) {
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true
                            };

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };

                    // Add the local video stream
                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream)
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()])
                        window.localStream = blackSilence()
                        connections[socketListId].addStream(window.localStream)
                    }
                })

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue

                        try {
                            connections[id2].addStream(window.localStream)
                        } catch (e) { }

                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
                                })
                                .catch(e => console.log(e))
                        })
                    }
                }
            })
        })
    }

    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }
    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    let handleVideo = () => {
        setVideo(!video);
        
        let streamToCheck = window.localStream;
        if(localVideoref.current && localVideoref.current.srcObject) {
            streamToCheck = localVideoref.current.srcObject;
        }

        if (streamToCheck) {
             const videoTrack = streamToCheck.getVideoTracks()[0];
             if (videoTrack) videoTrack.enabled = !video;
        }
    }
    let handleAudio = () => {
        setAudio(!audio)

        let streamToCheck = window.localStream;
        if(localVideoref.current && localVideoref.current.srcObject) {
            streamToCheck = localVideoref.current.srcObject;
        }

        if (streamToCheck) {
             const audioTrack = streamToCheck.getAudioTracks()[0];
             if (audioTrack) audioTrack.enabled = !audio;
        }
    }

    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    }, [screen])
    let handleScreen = () => {
        setScreen(!screen);
    }

    let handleEndCall = () => {
        try {
            let tracks = localVideoref.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) { }
        window.location.href = "/"
    }

    let openChat = () => {
        setModal(true);
        setNewMessages(0);
    }
    let closeChat = () => {
        setModal(false);
    }
    let handleMessage = (e) => {
        setMessage(e.target.value);
    }

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };

    let sendMessage = () => {
        console.log(socketRef.current);
        socketRef.current.emit('chat-message', message, username)
        setMessage("");
    }
    
    let connect = () => {
        setAskForUsername(false);
        getMedia();
    }

    return (
        <div className={styles.meetVideoContainer}>
            {askForUsername === true ? (
                <div style={{
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100vh', 
                    width: '100vw',
                    background: 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)'
                }}>
                    <Paper elevation={10} sx={{
                        p: 5, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        gap: 3,
                        borderRadius: 3,
                        minWidth: 400
                    }}>
                        <Typography variant="h4" fontWeight="bold">Ready to join?</Typography>
                        
                        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: '12px', overflow: 'hidden' }}>
                            <video 
                                ref={(ref) => {
                                    localVideoref.current = ref;
                                    if (ref && window.localStream) {
                                        ref.srcObject = window.localStream;
                                    }
                                }} 
                                autoPlay 
                                muted 
                                playsInline 
                                style={{width: '100%', height: '100%', objectFit: 'cover'}}
                            ></video>
                        </div>

                        <TextField 
                            label="Display Name" 
                            value={username} 
                            onChange={e => setUsername(e.target.value)} 
                            variant="outlined" 
                            fullWidth
                            autoFocus
                        />
                        
                        <Button 
                            variant="contained" 
                            size="large" 
                            onClick={connect} 
                            fullWidth
                            disabled={!username}
                        >
                            Connect
                        </Button>
                    </Paper>
                </div>
            ) : (
                <div className={styles.meetVideoContainer}>
                    {/* Chat Drawer/Modal */}
                    {showModal ? (
                        <div className={styles.chatRoom}>
                            <div className={styles.chatContainer}>
                                <div className={styles.chatHeader}>
                                    <h3>Chat</h3>
                                    <IconButton onClick={closeChat} sx={{color: 'white'}}>
                                        <CloseIcon />
                                    </IconButton>
                                </div>

                                <div className={styles.chattingDisplay}>
                                    {messages.length !== 0 ? messages.map((item, index) => {
                                        return (
                                            <div style={{ marginBottom: "15px", display: 'flex', flexDirection: 'column', alignItems: item.sender === username ? 'flex-end' : 'flex-start' }} key={index}>
                                                <p style={{ fontWeight: "bold", fontSize: '0.8rem', marginBottom: '4px', color: '#666' }}>{item.sender}</p>
                                                <div style={{ 
                                                    background: item.sender === username ? '#1a73e8' : '#e0e0e0', 
                                                    color: item.sender === username ? 'white' : 'black',
                                                    padding: '10px 14px', 
                                                    borderRadius: '12px', 
                                                    maxWidth: '80%',
                                                    wordWrap: 'break-word',
                                                    borderBottomRightRadius: item.sender === username ? '2px' : '12px',
                                                    borderBottomLeftRadius: item.sender === username ? '12px' : '2px'
                                                }}>
                                                    <p style={{margin: 0, fontSize: '0.95rem'}}>{item.data}</p>
                                                </div>
                                            </div>
                                        )
                                    }) : <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.5}}>
                                            <p>No messages yet</p>
                                         </div>}
                                </div>

                                <div className={styles.chattingArea}>
                                    <TextField 
                                        value={message} 
                                        onChange={(e) => setMessage(e.target.value)} 
                                        placeholder="Type a message..." 
                                        variant="outlined" 
                                        fullWidth
                                        size="small"
                                        InputProps={{
                                            style: { color: 'black', backgroundColor: 'white' }
                                        }}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                sendMessage();
                                            }
                                        }}
                                    />
                                    <IconButton onClick={sendMessage} color="primary">
                                        <SendIcon />
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                    ) : null}


                    {/* Controls */}
                    <div className={styles.buttonContainers}>
                        <Tooltip title={video ? "Turn Off Video" : "Turn On Video"}>
                            <IconButton onClick={handleVideo} className={styles.controlBtn} style={{ backgroundColor: video ? '#3c4043' : '#ea4335' }}>
                                {(video === true) ? <VideocamIcon /> : <VideocamOffIcon />}
                            </IconButton>
                        </Tooltip>

                        <Tooltip title={audio ? "Mute" : "Unmute"}>
                            <IconButton onClick={handleAudio} className={styles.controlBtn} style={{ backgroundColor: audio ? '#3c4043' : '#ea4335' }}>
                                {audio === true ? <MicIcon /> : <MicOffIcon />}
                            </IconButton>
                        </Tooltip>

                        {screenAvailable === true && (
                            <Tooltip title="Share Screen">
                                <IconButton onClick={handleScreen} className={styles.controlBtn} style={{ backgroundColor: screen ? '#8ab4f8' : '#3c4043', color: screen ? 'black' : 'white' }}>
                                    {screen === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                                </IconButton>
                            </Tooltip>
                        )}

                        <Tooltip title="End Call">
                            <IconButton onClick={handleEndCall} className={styles.controlBtn} style={{ backgroundColor: '#ea4335' }}>
                                <CallEndIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Chat">
                            <Badge badgeContent={newMessages} max={999} color='error'>
                                <IconButton onClick={() => setModal(!showModal)} className={styles.controlBtn} style={{ backgroundColor: showModal ? '#8ab4f8' : '#3c4043', color: showModal ? 'black' : 'white' }}>
                                    <ChatIcon />
                                </IconButton>
                            </Badge>
                        </Tooltip>
                    </div>


                    {/* My Video */}
                    <video 
                        className={`${styles.meetUserVideo} ${showModal ? styles.userVideoLeft : ''}`} 
                        ref={(ref) => {
                            localVideoref.current = ref;
                            if (ref && window.localStream) {
                                ref.srcObject = window.localStream;
                            }
                        }} 
                        autoPlay 
                        muted 
                        playsInline
                    ></video>


                    {/* Remote Videos */}
                    <div className={styles.conferenceView}>
                        {videos.map((video) => (
                            <div key={video.socketId} className={styles.remoteVideoWrapper}>
                                <video
                                    data-socket={video.socketId}
                                    ref={ref => {
                                        if (ref && video.stream) {
                                            ref.srcObject = video.stream;
                                        }
                                    }}
                                    autoPlay
                                ></video>
                            </div>
                        ))}
                    </div>

                </div>
            )}
        </div>
    )
}
