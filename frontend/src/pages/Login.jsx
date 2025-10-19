import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

function Login() {
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
    });

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Logging submitted: ', credentials);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">Welcome Back, Stargazer</h1>
                <p className="login-subtitle">Log in to continue your cosmic journey.</p>

                <form className="login-form" onSubmit={handleSubmit}>
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="celestial-traveler"
                        value={credentials.username}
                        onChange={handleChange}
                        required
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit" className="login-btn">
                        Enter the Cosmos
                    </button>
                </form>

                <div className="create-account-text">
                    Don't have an account?{" "}
                    <Link to="/signup">Chart a new course</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;