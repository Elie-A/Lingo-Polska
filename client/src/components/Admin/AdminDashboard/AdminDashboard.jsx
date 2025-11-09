import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield } from "react-icons/fa";
import VocabularyManager from "./VocabularyManager/VocabularyManager";
import AdminIntroduction from "./AdminIntroduction/AdminIntroduction";
import ExerciseManager from "./ExerciseManager/ExerciseManager";

import "./AdminDashboard.css";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("intro");
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        navigate("/panel");
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h2><FaUserShield /> Admin Panel</h2>
                <button onClick={logout} className="logout-btn">Logout</button>
            </header>

            <nav className="dashboard-nav">
                <button
                    className={activeTab === "intro" ? "active" : ""}
                    onClick={() => setActiveTab("intro")}
                >
                    Introduction
                </button>
                <button
                    className={activeTab === "vocab" ? "active" : ""}
                    onClick={() => setActiveTab("vocab")}
                >
                    Vocabulary
                </button>
                <button
                    className={activeTab === "exercise" ? "active" : ""}
                    onClick={() => setActiveTab("exercise")}
                >
                    Exercises
                </button>
            </nav>

            <main className="dashboard-content">
                {activeTab === "intro" && <AdminIntroduction setActiveTab={setActiveTab} />}
                {activeTab === "vocab" && <VocabularyManager />}
                {activeTab === "exercise" && <ExerciseManager />}
            </main>
        </div>
    );
}
