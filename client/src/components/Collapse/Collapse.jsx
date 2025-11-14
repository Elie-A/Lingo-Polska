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

    const highlightStemEnding = (polish = "", stem = "", ending = "", polishRest = "") => {
        if (!stem) return polish || "";

        const fullVerb = stem + ending;
        const normalizedPolish = normalize(polish);
        const normalizedFullVerb = normalize(fullVerb);
        const matchIndex = normalizedPolish.indexOf(normalizedFullVerb);

        if (matchIndex === -1)
            return (
                <>
                    {polish}
                    {polishRest && <span className="polish-rest">{polishRest}</span>}
                </>
            );

        return (
            <>
                {polish.slice(0, matchIndex)}
                <span className="stem">{stem}</span>
                {ending && <span className="ending">{ending}</span>}
                {polish.slice(matchIndex + fullVerb.length)}
                {polishRest && <span className="polish-rest">{polishRest}</span>}
            </>
        );
    };

    return (
        <div className="collapse-container">
            {exercises.map((exerciseData, idx) => {
                const rows = Array.isArray(exerciseData.rows) ? exerciseData.rows : [];

                // Gather all possible keys from rows
                const allKeys = rows.reduce((acc, row) => {
                    Object.keys(row).forEach((k) => {
                        if (!acc.includes(k)) acc.push(k);
                    });
                    return acc;
                }, []);

                // Dynamically include extra columns
                const extraColumns = allKeys.filter(
                    (key) => !["polish", "stem", "ending", "english", "polishRest"].includes(key)
                );

                // Helper function to get gender color class
                const getGenderClass = (gender) => {
                    if (!gender) return "";
                    const normalized = gender.toLowerCase().trim();
                    // Check for Polish and English gender names
                    if (normalized.includes("męski") || normalized.includes("masculine") || normalized === "m") {
                        return "gender-masculine";
                    }
                    if (normalized.includes("żeński") || normalized.includes("feminine") || normalized === "f") {
                        return "gender-feminine";
                    }
                    if (normalized.includes("nijaki") || normalized.includes("neuter") || normalized === "n") {
                        return "gender-neuter";
                    }
                    return "";
                };

                // If stems exist, we'll add a computed "Plural" column
                const hasStemData = rows.some((r) => r.stem);

                return (
                    <div className="collapse" key={idx}>
                        <h2
                            className={`collapse-header ${openIndex === idx ? "active" : ""}`}
                            onClick={() => toggleCollapse(idx)}
                        >
                            {exerciseData.exercise || `Exercise ${idx + 1}`}{" "}
                            <span className="toggle-btn">
                                {openIndex === idx ? "−" : "+"}
                            </span>
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
                                                        <th key={col}>
                                                            {col[0].toUpperCase() + col.slice(1)}
                                                        </th>
                                                    ))}
                                                    {hasStemData && <th>Plural</th>}
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
                                                                    row.ending || "",
                                                                    // row.polishRest || ""
                                                                )}
                                                            </td>
                                                            <td>{row.english || "-"}</td>
                                                            {extraColumns.map((col) => (
                                                                <td
                                                                    key={col}
                                                                    className={col === "gender" ? getGenderClass(row[col]) : ""}
                                                                >
                                                                    {row[col] || "-"}
                                                                </td>
                                                            ))}
                                                            {hasStemData && (
                                                                <td className="polish">
                                                                    <span className="stem">{row.stem || ""}</span>
                                                                    <span className="ending">{row.ending || ""}</span>
                                                                </td>
                                                            )}
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td
                                                            colSpan={
                                                                2 + extraColumns.length + (hasStemData ? 1 : 0)
                                                            }
                                                            style={{ textAlign: "center" }}
                                                        >
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