import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Signup.css";

function Signup() {
    const [signupData, setSignupData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        activityFrequency: "",
        activityLevel: "",
    });

    const handleChange = (e) => {
        setSignupData({
            ...signupData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle signup logic here
        console.log("Signup submitted: ", signupData);
    };
    
    return (
        <div className="signup-container">
            <div className="signup-card">
                <h1 className="signup-title">Join the Constellation</h1>
                <p className="signup-subtitle">Create your account to start exploring the universe.</p>

                <form className="signup-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" name="name" placeholder="Enter name" onChange={handleChange} required />
                    </div>

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

                    <button type="submit" className="signup-btn">
                        Embark on Your Journey
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