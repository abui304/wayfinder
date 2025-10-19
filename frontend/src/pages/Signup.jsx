import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [signupData, setSignupData] = useState({
        username: "",
        email: "",
        password: "",
        activityFrequency: "",
        activityLevel: "",
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setSignupData({
            ...signupData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const payload = {
                username: signupData.username,
                email: signupData.email,
                password: signupData.password,
                personality: {
                    activityFrequency: signupData.activityFrequency,
                    activityLevel: signupData.activityLevel,
                }
            };

            console.log("Attempting to register with payload:", payload);
            
            const response = await fetch('http://localhost:6969/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            console.log("Received response from backend:", { status: response.status, body: data });

            if (!response.ok) {
                throw new Error(data.msg || 'Failed to create account.');
            }
            console.log("Signup successful. Navigating to home page...");
            navigate('/home');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        
    };
    
    return (
        <div className="signup-container">
            <div className="signup-card">
                <h1 className="signup-title">Join the Constellation</h1>
                <p className="signup-subtitle">Create your account to start exploring the universe.</p>

                <form className="signup-form" onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" name="username" placeholder="Choose a username" onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" placeholder="Enter email" onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>How busy do you want your schedule to be?</label>
                        <select name="activityFrequency" value={signupData.activityFrequency} onChange={handleChange} required>
                            <option value="" disabled>Select your pace...</option>
                            <option value="relaxed">Relaxed</option>
                            <option value="moderate">Moderate</option>
                            <option value="packed">Packed</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>How active do you want to be during your trips?</label>
                        <select name="activityLevel" value={signupData.activityLevel} onChange={handleChange} required>
                            <option value="" disabled>Select activity level...</option>
                            <option value="chill">Chill</option>
                            <option value="moderate">Moderate</option>
                            <option value="active">Active</option>
                        </select>
                    </div>

                    <button type="submit" className="signup-btn" disabled={loading || success}>
                        {loading ? 'Embarking...' : 'Embark on Your Journey'}
                    </button>
                </form>

                <div className="login-text">
                    Already a traveler? <Link to="/login">Log in here</Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;