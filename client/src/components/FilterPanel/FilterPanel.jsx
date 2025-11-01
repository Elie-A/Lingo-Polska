import React from "react";
import "./FilterPanel.css";

const FiltersPanel = ({ filters = {}, selected, setSelected, startPractice }) => {
    // Provide default empty arrays for safety
    const { topics = [], levels = [], types = [] } = filters;

    const handleChange = (key, value) => {
        setSelected(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="filter-panel">
            <h2>Choose Your Filters</h2>

            <div className="filter-group">

                <div className="filter-item">
                    <label>Topic</label>
                    <select
                        value={selected.topic}
                        onChange={e => handleChange("topic", e.target.value)}
                    >
                        <option value="">Select topic</option>
                        {topics.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-item">
                    <label>Level</label>
                    <select
                        value={selected.level}
                        onChange={e => handleChange("level", e.target.value)}
                    >
                        <option value="">Select level</option>
                        {levels.map(l => (
                            <option key={l} value={l}>{l}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-item">
                    <label>Type</label>
                    <select
                        value={selected.type}
                        onChange={e => handleChange("type", e.target.value)}
                    >
                        <option value="">Select type</option>
                        {types.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-item">
                    <label>Number of Questions</label>
                    <input
                        type="number"
                        value={selected.count}
                        onChange={e => handleChange("count", e.target.value)}
                        min="5"
                        max="50"
                    />
                </div>

                <div className="filter-item">
                    <label htmlFor="quiz-time">Quiz Time (minutes):</label>
                    <input
                        type="number"
                        id="quiz-time"
                        min="1"
                        max="60"
                        value={selected.quizTime}
                        onChange={(e) => setSelected(prev => ({ ...prev, quizTime: Number(e.target.value) }))}
                    />
                </div>

            </div>

            <button className="filter-btn" onClick={startPractice}>
                Start Practice
            </button>
        </div>
    );

};

export default FiltersPanel;