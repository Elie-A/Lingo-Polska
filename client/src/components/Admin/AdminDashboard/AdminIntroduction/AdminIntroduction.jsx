import React from "react";
import { FaBook, FaUserShield } from "react-icons/fa";
import "./AdminIntroduction.css";

export default function AdminIntroduction({ setActiveTab }) {
    return (
        <div className="intro-tab">
            <h3>Welcome to the Admin Dashboard</h3>
            <p>Manage the application content efficiently. Click a card below to navigate:</p>

            <div className="cards-grid">
                <div className="card-container" onClick={() => setActiveTab("vocab")}>
                    <div className="card-glow-hover"></div>
                    <div className="card-decorative-bg"></div>
                    <div className="card-base">
                        <div className="card-content">
                            <div className="card-icon-container">
                                <FaBook />
                            </div>
                            <h4 className="card-title">Vocabulary</h4>
                            <p className="card-description">
                                Add, edit, and manage vocabulary entries.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="card-container" onClick={() => setActiveTab("exercise")}>
                    <div className="card-glow-hover"></div>
                    <div className="card-decorative-bg"></div>
                    <div className="card-base">
                        <div className="card-content">
                            <div className="card-icon-container">
                                <FaUserShield />
                            </div>
                            <h4 className="card-title">Exercises</h4>
                            <p className="card-description">
                                Manage exercises (coming soon, currently under rework).
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <p>You can switch sections using the navigation tabs above or by clicking one of the cards.</p>
        </div>
    );
}
