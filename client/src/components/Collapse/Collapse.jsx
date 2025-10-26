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

    // Helper to normalize Polish diacritics for reliable matching
    const normalize = (str) =>
        str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

    // Highlight the stem + ending wherever it occurs in the full Polish sentence even if followed by " się"
    const highlightStemEnding = (polish = "", stem = "", ending = "") => {
        if (!stem) return polish;

        const fullVerb = stem + ending;

        // Escape regex special characters in stem/ending
        const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        // Match fullVerb optionally followed by " się", case-insensitive
        const regex = new RegExp(`(${escapeRegex(fullVerb)})( się)?`, "i");

        const match = polish.match(regex);
        if (!match) return polish;

        const startIdx = match.index;
        const matchedVerb = match[1];
        const reflexive = match[2] || "";

        return (
            <>
                {polish.slice(0, startIdx)}
                <span className="stem">{stem}</span>
                {ending && <span className="ending">{ending}</span>}
                {reflexive}
                {polish.slice(startIdx + matchedVerb.length + reflexive.length)}
            </>
        );
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
                                                                {highlightStemEnding(
                                                                    row.polish,
                                                                    row.stem,
                                                                    row.ending
                                                                )}
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
