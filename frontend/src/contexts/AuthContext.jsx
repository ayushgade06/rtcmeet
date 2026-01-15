import axios from "axios";
import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const handleLogin = async (username, password) => {
        try {
            const response = await axios.post("http://localhost:3000/api/v1/users/login", {
                username,
                password,
            });
            setUser(response.data.user);
            setToken(response.data.token);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const handleRegister = async (name, username, password) => {
        try {
            const response = await axios.post("http://localhost:3000/api/v1/users/register", {
                name,
                username,
                password,
            });
            setUser(response.data.user);
            setToken(response.data.token);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, handleLogin, handleRegister }}>
            {children}
        </AuthContext.Provider>
    );
};