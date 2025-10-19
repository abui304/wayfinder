import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:6969/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Login failed. Please check your credentials.');
            }

            localStorage.setItem('token', data.token);

            navigate('/');

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">Welcome Back, Traveler</h1>
                <p className="login-subtitle">Log in to continue your cosmic journey.</p>

                <form className="login-form" onSubmit={handleSubmit}>
                    {/* Group 1: Username */}
                    {error && <div className="error-message">{error}</div>}
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter your username"
                            value={credentials.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Group 2: Password */}
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

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