import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import { IconButton, Grid, Container } from '@mui/material';

export default function History() {
    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([])
    const routeTo = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                setMeetings(history);
            } catch {
                // IMPLEMENT SNACKBAR
            }
        }
        fetchHistory();
    }, [])

    let formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0")
        const year = date.getFullYear();
        return `${day}/${month}/${year}`
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-light)' }}>
            {/* Navbar for History Page */}
            <div className="navBar" style={{marginBottom: '2rem'}}>
                <div style={{ display: "flex", alignItems: "center", gap: '10px' }}>
                    <IconButton onClick={() => routeTo("/home")}>
                        <HomeIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                        Your Meeting History
                    </Typography>
                </div>
            </div>

            <Container maxWidth="lg">
                {meetings.length === 0 ? (
                   <Box sx={{
                       display: 'flex', 
                       flexDirection: 'column', 
                       alignItems: 'center', 
                       justifyContent: 'center', 
                       height: '50vh',
                       color: 'text.secondary'
                   }}>
                       <CalendarTodayIcon sx={{ fontSize: 60, opacity: 0.5, mb: 2 }} />
                       <Typography variant="h6">No meeting history found</Typography>
                       <Typography variant="body2">Join a meeting to see it listed here.</Typography>
                   </Box>
                ) : (
                    <Grid container spacing={3}>
                        {meetings.map((e, i) => {
                            return (
                                <Grid item xs={12} sm={6} md={4} key={i}>
                                    <Card variant="outlined" sx={{ 
                                        borderRadius: 3, 
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 'var(--shadow-md)',
                                            borderColor: 'var(--primary)'
                                        }
                                    }}>
                                        <CardContent>
                                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 2}}>
                                                <VideoCallIcon color="primary" />
                                                <Typography variant="h6" component="div">
                                                    {e.meetingCode}
                                                </Typography>
                                            </Box>
                                            
                                            <Typography sx={{ fontSize: 14, display: 'flex', alignItems: 'center', gap: 1 }} color="text.secondary">
                                                <CalendarTodayIcon fontSize="small" />
                                                {formatDate(e.date)}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )
                        })}
                    </Grid>
                )}
            </Container>
        </div>
    )
}
