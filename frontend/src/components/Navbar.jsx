import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const navStyle = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 24px",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg)",
    };

    const linkStyle = {
        textDecoration: "none",
        color: "var(--text)",
        marginRight: "16px",
        fontSize: "16px",
        fontWeight: "500",
    };

    const activeLinkStyle = {
        ...linkStyle,
        color: "var(--accent)"
    };

    return (
        <nav style={navStyle}>
            <div style={{ fontWeight: "bold", fontSize: "20px" }}>
                <Link to="/" style={{ ...linkStyle, color: "var(--text-h)" }}>ScholarHub</Link>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <Link to="/" style={linkStyle}>Articles</Link>
                {user ? (
                    <>
                        <Link to="/create" style={linkStyle}>Create Article</Link>
                        <Link to="/profile" style={activeLinkStyle}>Profile ({user.username})</Link>
                        <button
                            onClick={handleLogout}
                            style={{
                                background: "none",
                                border: "1px solid var(--accent)",
                                color: "var(--accent)",
                                borderRadius: "4px",
                                padding: "6px 12px",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: "600",
                            }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={linkStyle}>Login</Link>
                        <Link to="/register" style={{
                            ...linkStyle,
                            background: "var(--accent)",
                            color: "#fff",
                            padding: "6px 12px",
                            borderRadius: "4px",
                        }}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;