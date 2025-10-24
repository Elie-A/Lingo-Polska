import React, { useState } from "react";
import "./CollapseHeader.css";
import "./CollapseContent.css";
import "./ExerciseTable.css";

const Collapse = ({ data }) => {
    const [openIndex, setOpenIndex] = useState(null);
    const exercises = Array.isArray(data) ? data : [];

    const toggleCollapse = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="collapse-container">
            {exercises.map((exerciseData, idx) => {
                const rows = Array.isArray(exerciseData.rows) ? exerciseData.rows : [];

                return (
                    <div className="collapse" key={idx}>
                        <h2
                            className={`collapse-header ${openIndex === idx ? "active" : ""}`}
                            onClick={() => toggleCollapse(idx)}
                        >
                            {exerciseData.exercise || `Exercise ${idx + 1}`}{" "}
                            <span className="toggle-btn">{openIndex === idx ? "−" : "+"}</span>
                        </h2>

                        <div className={`collapse-content ${openIndex === idx ? "open" : ""}`}>
                            <div className="exercise-card">
                                <div className="exercise-card-glow"></div>
                                <div className="card-decorative-bg"></div>
                                <div className="exercise-card-content">
                                    <div className="table-wrapper">
                                        <table className="exercise-table">
                                            <thead>
                                                <tr>
                                                    <th>Polish</th>
                                                    <th>English</th>
                                                    <th>Infinitive</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rows.length > 0 ? (
                                                    rows.map((row, rIdx) => (
                                                        <tr key={rIdx}>
                                                            <td className="polish">
                                                                <span className="stem">{row.stem}</span>
                                                                <span className="ending-present">{row.ending}</span>
                                                                {row.polishRest}
                                                            </td>
                                                            <td>{row.english}</td>
                                                            <td>{row.infinitive}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={3} style={{ textAlign: "center" }}>
                                                            No rows available
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Collapse;
