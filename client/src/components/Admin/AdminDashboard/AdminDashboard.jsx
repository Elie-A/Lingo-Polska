import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminDashboard() {
    const [vocabularies, setVocabularies] = useState([]);
    const navigate = useNavigate();

    const fetchData = async () => {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vocabulary`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setVocabularies(data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const logout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        navigate("/panel");
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h2>Vocabulary Manager</h2>
                <button onClick={logout} className="logout-btn">
                    Logout
                </button>
            </header>

            <div className="vocab-list">
                {vocabularies.map((vocab) => (
                    <div key={vocab._id} className="vocab-item">
                        <p>
                            <strong>{vocab.word}</strong> — {vocab.translation}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
