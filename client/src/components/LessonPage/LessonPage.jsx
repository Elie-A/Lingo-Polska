import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import Collapse from "../Collapse/Collapse";
import VocabularyPage from "../Vocabulary/VocabularyPage";
import PracticePage from "../Practice/PracticePage";
import ConjugationPage from "../Conjugation/ConjugationPage";
import ReferencePage from "../References/ReferencePage";

import "./LessonPage.css";

import PolandFlag from "../../assets/poland-flag.svg";

const FLAGS = {
    PL: PolandFlag,
};

const LessonPage = ({ lessonTitle, classes, lessonFolder }) => {
    const location = useLocation();
    const passedIcon = location.state?.icon; // 👈 emoji or flag code passed from LessonCard

    const [lessonExplanation, setLessonExplanation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openExplanation, setOpenExplanation] = useState(false);

    const classArray = Array.isArray(classes) ? classes : [];
    const [openClasses, setOpenClasses] = useState(() => classArray.map(() => false));

    const explanationRef = useRef(null);

    const toggleClass = (idx) => {
        setOpenClasses((prev) => {
            const newState = [...prev];
            newState[idx] = !newState[idx];
            return newState;
        });
    };

    const toggleExplanation = () => setOpenExplanation((prev) => !prev);

    // Only load explanation if lesson type is not special
    const shouldLoadExplanation =
        lessonFolder !== "practice" &&
        lessonFolder !== "vocabulary" &&
        lessonFolder !== "references";

    const loadLessonExplanation = useCallback(() => {
        if (!lessonFolder || !shouldLoadExplanation) return;

        setLessonExplanation(null);
        setLoading(true);
        setError(null);

        import(`../../data/explanations/${lessonFolder}-explanation.json`)
            .then((module) => {
                setLessonExplanation(module.default || module);
                setLoading(false);
            })
            .catch((err) => {
                console.warn(`Lesson explanation not found for "${lessonFolder}":`, err);
                setError("Lesson explanation not available.");
                setLoading(false);
            });
    }, [lessonFolder, shouldLoadExplanation]);

    useEffect(() => {
        setOpenExplanation(false);
        loadLessonExplanation();
    }, [lessonFolder, loadLessonExplanation]);

    // Render VocabularyPage if this lesson is vocabulary
    if (lessonFolder === "vocabulary") {
        return <VocabularyPage />;
    }

    // Render PracticePage if this lesson is practice
    if (lessonFolder === "practice") {
        return <PracticePage />;
    }

    if (lessonFolder == "conjugation") {
        return <ConjugationPage />;
    }

    if (lessonFolder == "references") {
        return <ReferencePage />;
    }

    // Determine how to display the icon
    const renderIcon = () => {
        if (!passedIcon) return null;
        if (typeof passedIcon === "string" && passedIcon.length === 2 && FLAGS[passedIcon.toUpperCase()]) {
            const FlagSVG = FLAGS[passedIcon.toUpperCase()];
            return <img src={FlagSVG} alt={`${passedIcon} flag`} className="lesson-page-flag" />;
        }
        return <span className="lesson-icon">{passedIcon}</span>;
    };

    return (
        <div className="lesson-page">
            {/* Header */}
            <div className="lesson-header">
                <h1 className="lesson-title">
                    {renderIcon()} {lessonTitle}
                </h1>
            </div>

            {/* Lesson Explanation */}
            {shouldLoadExplanation && (
                <>
                    {loading && (
                        <div className="loading">
                            <div className="spinner"></div>
                            <p>Loading lesson explanation...</p>
                        </div>
                    )}

                    {error && (
                        <div className="error">
                            <p>{error}</p>
                            <button onClick={loadLessonExplanation}>Retry</button>
                        </div>
                    )}

                    {lessonExplanation && (
                        <div className={`lesson-explanation ${openExplanation ? "open" : ""}`}>
                            <div className="lesson-explanation-header" onClick={toggleExplanation}>
                                <h2>Lesson Explanation</h2>
                                <span className="toggle-btn">{openExplanation ? "−" : "+"}</span>
                            </div>
                            <div
                                className="explanation-content"
                                ref={explanationRef}
                                style={{
                                    maxHeight: openExplanation
                                        ? explanationRef.current?.scrollHeight + "px"
                                        : "0px",
                                }}
                            >
                                {lessonExplanation.sections?.map((section, idx) => (
                                    <div key={idx} className="explanation-section">
                                        <h3>{section.heading}</h3>
                                        {section.content?.map((item, i) => {
                                            if (typeof item === "string") {
                                                return <p key={i}>{item}</p>;
                                            } else if (Array.isArray(item)) {
                                                return (
                                                    <ul key={i}>
                                                        {item.map((line, j) => (
                                                            <li key={j}>{line}</li>
                                                        ))}
                                                    </ul>
                                                );
                                            } else if (item?.type === "table" && Array.isArray(item.rows)) {
                                                return (
                                                    <table key={i} className="lesson-table">
                                                        {item.caption && <caption>{item.caption}</caption>}
                                                        {item.headers && (
                                                            <thead>
                                                                <tr>
                                                                    {item.headers.map((head, h) => (
                                                                        <th key={h}>{head}</th>
                                                                    ))}
                                                                </tr>
                                                            </thead>
                                                        )}
                                                        <tbody>
                                                            {item.rows.map((row, r) => (
                                                                <tr key={r}>
                                                                    {row.map((cell, c) => (
                                                                        <td key={c}>{cell}</td>
                                                                    ))}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                );
                                            } else {
                                                return null;
                                            }
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Classes */}
            {classArray.map((classData, idx) => (
                <div key={idx} className={`class-block ${openClasses[idx] ? "open" : ""}`}>
                    <h2
                        className={`class-title ${openClasses[idx] ? "active" : ""}`}
                        onClick={() => toggleClass(idx)}
                    >
                        {classData.class || `Class ${idx + 1}`}
                        <span className="toggle-btn">{openClasses[idx] ? "−" : "+"}</span>
                    </h2>
                    <div className={`class-content ${openClasses[idx] ? "active" : ""}`}>
                        <Collapse data={classData.exercises || []} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LessonPage;
