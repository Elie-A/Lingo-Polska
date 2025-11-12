import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/login`,
                { email, password },
                { headers: { "Content-Type": "application/json" } }
            );

            // Axios automatically parses JSON
            const data = response.data;

            // Save token and user info
            localStorage.setItem("adminToken", data.token);
            localStorage.setItem("adminUser", JSON.stringify(data.user));

            navigate("/admin");
        } catch (err) {
            // Axios error handling
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError(err.message || "Login failed");
            }
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
                <h2>Admin Panel Login</h2>
                {error && <p className="error">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
