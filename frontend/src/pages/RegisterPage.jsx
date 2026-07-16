import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        password: "",
        email: "",
        phoneNumber: ""
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const errs = {};
        if (!formData.name) errs.name = "Name is required";
        if (!formData.username) errs.username = "Username is required";

        if (!formData.email && !formData.phoneNumber) {
            errs.contact = "At least one of Email or Phone Number is required";
        }

        if (formData.email) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!emailRegex.test(formData.email)) errs.email = "Invalid email format";
        }

        if (formData.phoneNumber) {
            const phoneRegex = /^\+?[0-9]{10,15}$/;
            if (!phoneRegex.test(formData.phoneNumber)) errs.phoneNumber = "Phone must be between 10-15 digits";
        }

        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
        if (!formData.password) {
            errs.password = "Password is required";
        } else if (!passRegex.test(formData.password)) {
            errs.password = "Must contain 6+ chars, 1 uppercase, 1 lowercase, 1 number";
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const submissionPayload = { ...formData };
            if (!submissionPayload.email) submissionPayload.email = null;
            if (!submissionPayload.phoneNumber) submissionPayload.phoneNumber = null;

            await register(submissionPayload);
            toast.success("Success! Let's sign in.");
            navigate("/login");
        } catch (err) {
            toast.error(err.response?.data || "Registration failed");
        }
    };

    const containerStyle = {
        maxWidth: "400px",
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
        color: "#dad3d3",
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
            <h2 style={{ textAlign: "center", marginBottom: "24px" }}>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle} />
                    {errors.name && <span style={{ color: "red", fontSize: "12px" }}>{errors.name}</span>}
                </div>

                <div>
                    <label>Username</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} style={inputStyle} />
                    {errors.username && <span style={{ color: "red", fontSize: "12px" }}>{errors.username}</span>}
                </div>

                <div>
                    <label>Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} />
                    {errors.email && <span style={{ color: "red", fontSize: "12px" }}>{errors.email}</span>}
                </div>

                <div>
                    <label>Phone Number</label>
                    <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} style={inputStyle} />
                    {errors.phoneNumber && <span style={{ color: "red", fontSize: "12px" }}>{errors.phoneNumber}</span>}
                </div>

                {errors.contact && <div style={{ color: "red", fontSize: "12px", marginBottom: "16px" }}>{errors.contact}</div>}

                <div>
                    <label>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} style={inputStyle} />
                    {errors.password && <span style={{ color: "red", fontSize: "12px" }}>{errors.password}</span>}
                </div>

                <button type="submit" style={buttonStyle}>Register Account</button>
            </form>
            <p style={{ marginTop: "16px", textAlign: "center", fontSize: "14px" }}>
                Already registered? <Link to="/login" style={{ color: "var(--accent)" }}>Login here</Link>
            </p>
        </div>
    );
}

export default RegisterPage;