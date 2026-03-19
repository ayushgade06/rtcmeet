# RTCMeet - Real-Time Video Conferencing Platform

RTCMeet is a comprehensive, full-stack video conferencing application designed for seamless real-time communication. Built with the MERN stack (MongoDB, Express, React, Node.js) and powered by WebRTC and Socket.io, it provides a robust platform for video calls, instant messaging, and meeting management.

## 🚀 Features

- **Real-Time Video & Audio**: High-quality, low-latency video and audio communication using WebRTC.
- **Instant Messaging**: Integrated chat system allowing users to exchange messages during live meetings.
- **Secure Authentication**: Robust user registration and login system with encrypted credentials using Bcrypt.
- **Meeting Management**: Easily create new meetings or join existing ones using unique room IDs.
- **Meeting History**: Keep track of past meetings and communication sessions.
- **Responsive Design**: A modern, sleek user interface built with Material UI that works across various devices and screen sizes.
- **Peer-to-Peer Signaling**: Efficient signaling server using Socket.io to establish stable peer connections.

## 🛠️ Tech Stack

### Frontend
- **React.js**: Modern component-based UI development.
- **Vite**: Ultra-fast frontend build tool.
- **Material UI (MUI)**: Premium component library for high-quality design aesthetics.
- **Socket.io-client**: Real-time bidirectional event-based communication.
- **Axios**: Promised-based HTTP client for API requests.
- **React Router**: Declarative routing for single-page applications.

### Backend
- **Node.js & Express**: Scalable and fast server-side environment and framework.
- **Socket.io**: Real-time engine for signaling and messaging.
- **Mongoose**: Elegant MongoDB object modeling for Node.js.
- **Bcrypt**: Library for hashing passwords and ensuring user security.
- **CORS**: Middleware for cross-origin resource sharing.

### Database
- **MongoDB**: NoSQL database for flexible and scalable data storage.

## 📂 Project Structure

```text
rtcmeet/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers & logic (Socket & User)
│   │   ├── models/         # Database schemas
│   │   ├── routes/         # API endpoints definitions
│   │   └── app.js          # Main entry point
│   └── package.json        # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── pages/          # Application views (VideoMeet, Home, Auth)
│   │   ├── components/     # Reusable UI parts
│   │   ├── contexts/       # Global state management
│   │   └── utils/          # Helper functions
│   ├── index.html          # HTML template
│   └── package.json        # Frontend dependencies
└── README.md               # Project documentation
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (running locally or a cloud instance)
- npm or yarn

### 1. Clone the repository
```bash
git clone <repository-url>
cd rtcmeet
```

### 2. Backend Setup
```bash
cd backend
npm install
```
*Create a `.env` file (if applicable) or ensure your MongoDB connection string is correctly configured in `app.js`.*

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

## 🚀 Running the Application

### Start the Backend
```bash
cd backend
# Using nodemon for development
npx nodemon src/app.js
```
The backend server will typically start on `http://localhost:3000`.

### Start the Frontend
```bash
cd frontend
npm run dev
```
The frontend application will be available at `http://localhost:5173` (or the port specified by Vite).

## 💡 Usage

1. **Sign Up / Login**: Create a new account or sign in with existing credentials.
2. **Dashboard**: On the home screen, enter a unique room ID to join a call or create a new room.
3. **Video Meeting**: Once inside, give permission for camera and microphone. Share the room ID with others to join.
4. **Chat**: Use the sidebar to send messages to all participants in the room.
5. **History**: Check the history page to see details of your previous interactions.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
