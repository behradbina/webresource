import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            await login(username, password);
            toast.success("Welcome back!");
            navigate("/");
        } catch (err) {
            toast.error(err.response?.data || "Invalid login credentials");
        }
    };

    return (
        <div className="auth-container">
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
                <div className="auth-form-group">
                    <label>Username</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        className="auth-input"
                    />
                </div>
                <div className="auth-form-group">
                    <label>Password</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="auth-input"
                    />
                </div>
                <button type="submit" className="auth-button">
                    Log In
                </button>
            </form>
            <p className="auth-link">
                New around here? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
}

export default LoginPage;