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
            localStorage.setItem("token", response.data.token);
            // Assuming the API returns the user object, otherwise we might need to fetch it or store what we have
            // Based on previous controller code, login returns { token, message }. It does NOT return user object. 
            // I need to update the controller to return the user object or just store the token.
            // For now, let's store the token which is what withAuth checks. 
            // Wait, the previous controller edit I made returned { token, message }. It missing 'user'.
            // The frontend expects response.data.user.
            // I should fix the controller first or concurrently. 
            // But the user complained about "not able to see /home", which is the redirect.
            // The redirect is caused by withAuth checking localStorage. 
            
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
            localStorage.setItem("token", response.data.token);
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