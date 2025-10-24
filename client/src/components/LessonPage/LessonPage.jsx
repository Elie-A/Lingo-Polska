import React, { useState, useEffect, useCallback, useRef } from "react";
import Collapse from "../Collapse/Collapse";

import "./LessonPage.css";

const LessonPage = ({ lessonTitle, classes, lessonFolder }) => {
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

    const toggleExplanation = () => setOpenExplanation(!openExplanation);

    // Only load explanation for lessons that are NOT practice or vocabulary
    const shouldLoadExplanation = lessonFolder !== "practice" && lessonFolder !== "vocabulary" && lessonFolder !== "references";

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

    return (
        <div className="lesson-page">
            {/* Header */}
            <div className="lesson-header">
                <h1 className="lesson-title">{lessonTitle}</h1>
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
                                style={{ maxHeight: openExplanation ? explanationRef.current?.scrollHeight + "px" : "0px" }}
                            >
                                {lessonExplanation.sections.map((section, idx) => (
                                    <div key={idx} className="explanation-section">
                                        <h3>{section.heading}</h3>
                                        {Array.isArray(section.content) ? (
                                            <ul>
                                                {section.content.map((line, i) => (
                                                    <li key={i}>{line}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>{section.content}</p>
                                        )}
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
