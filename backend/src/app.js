import express from "express";
import { createServer } from "http";

import { Server } from "socket.io";
import mongoose from "mongoose";
import { connectToServer } from "./controllers/socketManager.js";

import cors from "cors";
import userRoutes from "./routes/users.routes.js";

const app = express();
const server = createServer(app);

const io = connectToServer(server);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", userRoutes);

mongoose.connect("mongodb://localhost:27017/rtcmeet");

io.on("connection", (socket) => {
    console.log("a user connected");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});
