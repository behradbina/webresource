import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            axios.get("http://localhost:8080/api/users/me", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((res) => {
                setUser(res.data);
            })
            .catch(() => {
                logout();
            })
            .finally(() => {
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (username, password) => {
        const res = await axios.post("http://localhost:8080/api/auth/login", { username, password });
        const jwt = res.data.token;
        localStorage.setItem("token", jwt);
        setToken(jwt);
        return res.data;
    };

    const register = async (userData) => {
        await axios.post("http://localhost:8080/api/auth/register", userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);