import User from "../models/user.model.js";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import crypto from "crypto";

export const register = async (req, res) => {
    const { name, username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(httpStatus.FOUND).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: name,
            username: username,
            password: hashedPassword
        });

        await newUser.save();

        res.status(httpStatus.CREATED).json({ message: "User Registered Successfully" })

    } catch (e) {
        res.status(500).json({ message: `Something went wrong ${e}` })
    }
}

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User not Found" })
        }

        let isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (isPasswordCorrect) {
            let token = crypto.randomBytes(20).toString("hex");

            user.token = token;
            await user.save();
            return res.status(httpStatus.OK).json({ token: token, message: "Login Successful" })
        } else {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid Password" })
        }

    } catch (e) {
        return res.status(500).json({ message: `Something went wrong ${e}` })
    }
}



export const getUserActivity = async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
        }
        res.status(httpStatus.OK).json(user.meetings);
    } catch (e) {
        res.status(500).json({ message: `Something went wrong ${e}` });
    }
}

export const addToActivity = async (req, res) => {
    const { token, meeting_code, date } = req.body;

    try {
        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
        }

        const newMeeting = {
            meetingCode: meeting_code,
            date: date
        };

        user.meetings.push(newMeeting);
        await user.save();

        res.status(httpStatus.ACCEPTED).json({ message: "Added to activity" });
    } catch (e) {
        res.status(500).json({ message: `Something went wrong ${e}` });
    }
}
