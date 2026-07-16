import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

function ProfilePage() {
    const { user, token, setUser } = useAuth();

    const [editMode, setEditMode] = useState(false);
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const [passMode, setPassMode] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    useEffect(() => {
        if (user) {
            setEmail(user.email || "");
            setPhoneNumber(user.phoneNumber || "");
        }
    }, [user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!email && !phoneNumber) {
            toast.error("At least one contact point is required");
            return;
        }

        try {
            const res = await axios.put("http://localhost:8080/api/users/me/update", {
                email: email || null,
                phoneNumber: phoneNumber || null
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data);
            toast.success("Profile saved successfully!");
            setEditMode(false);
        } catch (err) {
            toast.error(err.response?.data || "Update failed");
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!oldPassword || !newPassword) {
            toast.error("Please fill in password fields");
            return;
        }

        try {
            await axios.put("http://localhost:8080/api/users/me/change-password", {
                oldPassword,
                newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Password changed successfully!");
            setOldPassword("");
            setNewPassword("");
            setPassMode(false);
        } catch (err) {
            toast.error(err.response?.data || "Failed to update password");
        }
    };

    if (!user) return <p style={{ marginTop: "80px" }}>Loading Profile...</p>;

    const cardStyle = {
        maxWidth: "600px",
        margin: "40px auto",
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

    const actionBtn = {
        padding: "8px 16px",
        background: "var(--accent)",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
        marginRight: "10px"
    };

    const cancelBtn = {
        ...actionBtn,
        background: "transparent",
        color: "var(--text)",
        border: "1px solid var(--border)"
    };

    return (
        <div style={cardStyle}>
            <h2 style={{ marginBottom: "20px" }}>User Profile Card</h2>
            <div style={{ marginBottom: "24px", lineHeight: "1.6" }}>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email || "Empty"}</p>
                <p><strong>Phone:</strong> {user.phoneNumber || "Empty"}</p>
            </div>

            <div style={{ marginBottom: "24px" }}>
                {!editMode ? (
                    <button onClick={() => setEditMode(true)} style={actionBtn}>Edit Profile Details</button>
                ) : (
                    <form onSubmit={handleUpdateProfile} style={{ borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
                        <h3>Edit Contact info</h3>
                        <label>Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />

                        <label>Phone Number</label>
                        <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} style={inputStyle} />

                        <button type="submit" style={actionBtn}>Save</button>
                        <button type="button" onClick={() => setEditMode(false)} style={cancelBtn}>Cancel</button>
                    </form>
                )}
            </div>

            <div style={{ marginBottom: "24px" }}>
                {!passMode ? (
                    <button onClick={() => setPassMode(true)} style={actionBtn}>Change Password</button>
                ) : (
                    <form onSubmit={handleChangePassword} style={{ borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
                        <h3>Update Password</h3>
                        <label>Current Password</label>
                        <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} style={inputStyle} />

                        <label>New Password</label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={inputStyle} />

                        <button type="submit" style={actionBtn}>Submit Changes</button>
                        <button type="button" onClick={() => setPassMode(false)} style={cancelBtn}>Cancel</button>
                    </form>
                )}
            </div>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "20px" }}>
                <h3>Published Articles</h3>
                {user.articles && user.articles.length > 0 ? (
                    <ul style={{ paddingLeft: "20px" }}>
                        {user.articles.map(article => (
                            <li key={article.id} style={{ marginBottom: "8px" }}>
                                <a href={`/articles/${article.title}`} style={{ color: "var(--accent)", textDecoration: "none", fontWeight: "500" }}>
                                    {article.title}
                                </a>
                                <span style={{ fontSize: "14px", color: "var(--text)", marginLeft: "10px" }}>
                                    ({new Date(article.publishTime).toLocaleDateString()})
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={{ color: "var(--text)", fontStyle: "italic" }}>No authored articles published yet.</p>
                )}
            </div>
        </div>
    );
}

export default ProfilePage;