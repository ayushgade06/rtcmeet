import express from "express";
import dotenv from "dotenv";

import { createServer } from "http";

import { Server } from "socket.io";
import mongoose from "mongoose";
import { connectToServer } from "./controllers/socketManager.js";

import cors from "cors";
import userRoutes from "./routes/users.routes.js";

dotenv.config();

const app = express();

const server = createServer(app);

const io = connectToServer(server);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", userRoutes);

app.get("/ping", (req, res) => {
    res.status(200).json({ status: "ok", uptime: process.uptime() });
});

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/rtcmeet`);
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1);
    }
};

connectDB();


io.on("connection", (socket) => {
    console.log("a user connected");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});
