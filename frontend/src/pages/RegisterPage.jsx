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

    return (
        <div className="auth-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="auth-form-group">
                    <label>Full Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        className="auth-input"
                    />
                    {errors.name && <span className="auth-error">{errors.name}</span>}
                </div>

                <div className="auth-form-group">
                    <label>Username</label>
                    <input 
                        type="text" 
                        name="username" 
                        value={formData.username} 
                        onChange={handleChange} 
                        className="auth-input"
                    />
                    {errors.username && <span className="auth-error">{errors.username}</span>}
                </div>

                <div className="auth-form-group">
                    <label>Email Address</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        className="auth-input"
                    />
                    {errors.email && <span className="auth-error">{errors.email}</span>}
                </div>

                <div className="auth-form-group">
                    <label>Phone Number</label>
                    <input 
                        type="text" 
                        name="phoneNumber" 
                        value={formData.phoneNumber} 
                        onChange={handleChange} 
                        className="auth-input"
                    />
                    {errors.phoneNumber && <span className="auth-error">{errors.phoneNumber}</span>}
                </div>

                {errors.contact && <div className="auth-error">{errors.contact}</div>}

                <div className="auth-form-group">
                    <label>Password</label>
                    <input 
                        type="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        className="auth-input"
                    />
                    {errors.password && <span className="auth-error">{errors.password}</span>}
                </div>

                <button type="submit" className="auth-button">
                    Register Account
                </button>
            </form>
            <p className="auth-link">
                Already registered? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
}

export default RegisterPage;