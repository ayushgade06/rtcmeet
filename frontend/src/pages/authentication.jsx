import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Snackbar } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a73e8',
    },
    secondary: {
      main: '#f50057',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '1rem',
          padding: '10px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#e0e0e0',
            },
            '&:hover fieldset': {
              borderColor: '#1a73e8',
            },
          }
        }
      }
    }
  },
});

export default function Authentication() {

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");

  const [formState, setFormState] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const { handleRegister, handleLogin } = React.useContext(AuthContext);
  const router = useNavigate();

  const handleAuth = async () => {
    try {
      if (formState === 0) {
        await handleLogin(username, password);
        router("/home");
      }
      if (formState === 1) {
        let result = await handleRegister(name, username, password);
        setUsername("");
        setMessage(result.message);
        setOpen(true);
        setError("")
        setFormState(0)
        setPassword("")
      }
    } catch (err) {
      console.log(err);
      let message = (err.response.data.message);
      setError(message);
    }
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: 2
      }}>
        <CssBaseline />
        <Paper
          elevation={4}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 4,
            width: '100%',
            maxWidth: 450,
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
            <LockOutlinedIcon fontSize="large" />
          </Avatar>
          
          <Typography component="h1" variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#333' }}>
            {formState === 0 ? "Welcome Back" : "Join Us"}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {formState === 0 ? "Sign in to start your video calls" : "Create an account to get started"}
          </Typography>

          <Box component="form" noValidate sx={{ mt: 1, width: '100%' }}>
            {formState === 1 && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="fullName"
                label="Full Name"
                name="fullName"
                value={name}
                autoFocus
                onChange={(e) => setName(e.target.value)}
                InputProps={{ sx: { borderRadius: 2 } }}
              />
            )}
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              value={username}
              // Only autofocus if logging in, otherwise name has focus
              autoFocus={formState === 0}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{ sx: { borderRadius: 2 } }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{ sx: { borderRadius: 2 } }}
            />

            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                {error}
              </Typography>
            )}

            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, height: 48 }}
              onClick={handleAuth}
            >
              {formState === 0 ? "Sign In" : "Sign Up"}
            </Button>
            
            <Grid container justifyContent="center">
              <Grid item>
                <Button 
                  onClick={() => {
                    setFormState(formState === 0 ? 1 : 0);
                    setError("");
                  }} 
                  variant="text"
                  disableRipple
                  sx={{ '&:hover': { background: 'transparent', textDecoration: 'underline' } }}
                >
                  {formState === 0 ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={open}
        autoHideDuration={4000}
        message={message}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </ThemeProvider>
  );
}
