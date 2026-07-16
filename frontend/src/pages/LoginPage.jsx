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
            navigate("/profile");
        } catch (err) {
            toast.error(err.response?.data || "Invalid login credentials");
        }
    };

    const containerStyle = {
        maxWidth: "400px",
        margin: "80px auto",
        padding: "24px",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        background: "var(--bg)",
        textAlign: "left"
    };

    const inputStyle = {
        width: "100%",
        padding: "10px",
        margin: "8px 0 16px",
        borderRadius: "6px",
        border: "1px solid var(--border)",
        background: "var(--bg)",
        color: "var(--text-h)",
        boxSizing: "border-box"
    };

    const buttonStyle = {
        width: "100%",
        padding: "12px",
        background: "var(--accent)",
        color: "#000",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "16px"
    };

    return (
        <div style={containerStyle}>
            <h2 style={{ textAlign: "center", marginBottom: "24px" }}>Sign In</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
                </div>
                <button type="submit" style={buttonStyle}>Log In</button>
            </form>
            <p style={{ marginTop: "16px", textAlign: "center", fontSize: "14px" }}>
                New around here? <Link to="/register" style={{ color: "var(--accent)" }}>Register here</Link>
            </p>
        </div>
    );
}

export default LoginPage;