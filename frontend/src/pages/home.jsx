import React, { useContext, useState } from "react";
import withAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { Button, IconButton, TextField, InputAdornment } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import LogoutIcon from "@mui/icons-material/Logout";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import { AuthContext } from "../contexts/AuthContext";

function HomeComponent() {
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");

  const { addToUserHistory } = useContext(AuthContext);

  const handleJoinVideoCall = async () => {
    // ✅ Validation
    if (!meetingCode.trim()) {
      // In a real app we'd use a Snackbar here too, but alert is fine for now as per instructions not to add libs
      alert("Please enter a meeting code");
      return;
    }

    // ✅ History should NOT block joining
    try {
      await addToUserHistory(meetingCode.trim());
    } catch (err) {
      console.error("Failed to add meeting to history:", err);
    }

    // ✅ Always navigate
    navigate(`/${meetingCode.trim()}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <>
      {/* ---------- NAVBAR ---------- */}
      <div className="navBar">
        <div style={{ display: "flex", alignItems: "center", gap: '10px' }}>
             <VideoCallIcon sx={{color: '#1a73e8', fontSize: 32}} />
             <h2>RTCMeet</h2>
        </div>

        <div className="navLinks">
          <div className="navLink" onClick={() => navigate("/history")}>
            <RestoreIcon />
            <span>History</span>
          </div>

          <Button 
            onClick={handleLogout} 
            variant="outlined" 
            color="error"
            startIcon={<LogoutIcon />}
            sx={{borderRadius: 20, textTransform: 'capitalize'}}
          >
            Logout
          </Button>
        </div>
      </div>

      {/* ---------- MAIN CONTENT ---------- */}
      <div className="meetContainer">
        <div className="leftPanel">
            <h2>
              Premium Video Meetings. <br/>
              Now Free for Everyone.
            </h2>
            <p style={{fontSize: '1.1rem', color: 'var(--text-secondary-light)', marginBottom: '2rem'}}>
                re-engineered the service we built for secure business meetings, making it free and available for all.
            </p>

            <div style={{ display: "flex", gap: "10px", alignItems: 'center', maxWidth: '500px' }}>
                <TextField
                    value={meetingCode}
                    onChange={(e) => setMeetingCode(e.target.value)}
                    placeholder="Enter a code or link"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <KeyboardIcon color="action" />
                            </InputAdornment>
                        ),
                        sx: {
                            borderRadius: '8px', 
                            backgroundColor: 'var(--bg-white)',
                        }
                    }}
                />

                <Button
                    onClick={handleJoinVideoCall}
                    variant="contained"
                    size="large"
                    sx={{ 
                        whiteSpace: "nowrap", 
                        minHeight: '56px',
                        padding: '0 30px', 
                        textTransform: 'none',
                        fontSize: '1rem'
                    }}
                    disabled={!meetingCode}
                >
                    Join
                </Button>
            </div>
          
           <div style={{marginTop: '2rem', borderTop: '1px solid #ddd', paddingTop: '1rem'}}>
               <p style={{fontSize: '0.9rem', color: '#666'}}>
                   <a href="#" style={{color: '#1a73e8'}}>Learn more</a> about Apna Video Call
               </p>
           </div>
        </div>

        <div className="rightPanel">
          <img src="/logo3.png" alt="Video Call Illustration" />
        </div>
      </div>
    </>
  );
}

export default withAuth(HomeComponent);
