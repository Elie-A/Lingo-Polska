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

    const normalize = (str = "") =>
        str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    // Highlight stem + ending wherever it occurs in the Polish sentence
    const highlightStemEnding = (polish = "", stem = "", ending = "") => {
        if (!polish || !stem) return polish;

        const fullVerb = stem + ending;
        const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        // Use normalized strings for matching
        const regex = new RegExp(`(${escapeRegex(fullVerb)})( się)?`, "i");

        const normalizedPolish = normalize(polish);
        const normalizedFullVerb = normalize(fullVerb);

        const matchIndex = normalizedPolish.indexOf(normalizedFullVerb);
        if (matchIndex === -1) return polish;

        return (
            <>
                {polish.slice(0, matchIndex)}
                <span className="stem">{stem}</span>
                {ending && <span className="ending">{ending}</span>}
                {polish.slice(matchIndex + fullVerb.length)}
            </>
        );
    };

    return (
        <div className="collapse-container">
            {exercises.map((exerciseData, idx) => {
                const rows = Array.isArray(exerciseData.rows) ? exerciseData.rows : [];

                // Dynamically determine additional fields, excluding "polishRest"
                const extraColumns = rows.length > 0
                    ? Object.keys(rows[0]).filter(
                        key => !["polish", "stem", "ending", "english", "polishRest"].includes(key)
                    )
                    : [];

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
                                                    {extraColumns.map((col) => (
                                                        <th key={col}>{col[0].toUpperCase() + col.slice(1)}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rows.length > 0 ? (
                                                    rows.map((row, rIdx) => (
                                                        <tr key={rIdx}>
                                                            <td className="polish">
                                                                {highlightStemEnding(
                                                                    row.polish || "",
                                                                    row.stem || "",
                                                                    row.ending || ""
                                                                )}
                                                            </td>
                                                            <td>{row.english || "-"}</td>
                                                            {extraColumns.map((col) => (
                                                                <td key={col}>{row[col] || "-"}</td>
                                                            ))}
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={2 + extraColumns.length} style={{ textAlign: "center" }}>
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
