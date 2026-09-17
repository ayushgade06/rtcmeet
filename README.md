# RTCMeet

RTCMeet is a video calling app built on the MERN stack. You sign up, enter a room code, and get a peer-to-peer video call with audio, screen sharing and a live chat. It uses WebRTC for the media and Socket.io for signalling and messages. Past meetings are saved to your history.

## Features

- Peer-to-peer audio and video over WebRTC
- Screen sharing
- Real-time chat inside a call
- Email/password auth with bcrypt-hashed passwords
- Meeting history per user

Rooms are just codes in the URL. There's no pre-booking; a room exists as long as people are connected to it, and chat is kept in memory for the duration of the call.

## Stack

- Frontend: React 19, Vite, Material UI, Socket.io client
- Backend: Express 5, Socket.io, Mongoose, bcrypt
- Database: MongoDB
- NAT traversal: Google STUN servers and the public Open Relay TURN servers

## Setup

### Backend

```bash
cd backend
npm install
```

Copy `.env.sample` to `.env` and set:

```
MONGODB_URI=your_mongodb_connection_string
PORT=8000
```

### Frontend

```bash
cd frontend
npm install
```

Set `VITE_API_URL` to the backend URL (defaults to `http://localhost:8000`).

## Run

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

The frontend runs on http://localhost:5173 and talks to the backend for auth and history while Socket.io handles the calls.

## Layout

```
backend/src/
  app.js                     server, Mongo connection, Socket.io setup
  controllers/socketManager  join-call, signal, chat, disconnect handlers
  controllers/user           register, login, activity
  models/                    User and Meeting schemas
  routes/                    auth and activity endpoints
frontend/src/
  pages/VideoMeet.jsx        the call: WebRTC, screen share, chat
  pages/                     landing, auth, home, history
  contexts/AuthContext.jsx   auth state and API calls
```
