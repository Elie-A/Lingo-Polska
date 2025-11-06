import React, { useState } from "react";
import "./ReferenceCalendar.css";
import calendarData from "../DataRef/calendarData";

const ReferenceCalendar = () => {
    const [activeModal, setActiveModal] = useState(null);

    const openModal = (id) => setActiveModal(id);
    const closeModal = () => setActiveModal(null);

    const { title, sections } = calendarData.calendar;

    return (
        <div className="calendar-page">
            {/* Header */}
            <h1>📅 {title}</h1>

            {/* Section Grid */}
            <section className="calendar-grid">
                {sections.map((section) => (
                    <div
                        key={section.id}
                        className={`calendar-card ${section.id}`}
                        onClick={() => openModal(section.id)}
                    >
                        <h3>{section.title}</h3>
                        <p>{section.description}</p>
                    </div>
                ))}
            </section>

            {/* Modals */}
            {activeModal && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={closeModal}>
                            &times;
                        </span>

                        {/* Current section */}
                        {(() => {
                            const current = sections.find((s) => s.id === activeModal);
                            if (!current) return null;

                            return (
                                <>
                                    <h2>{current.modalTitle}</h2>

                                    {/* Render basic sections (days, months) */}
                                    {current.rows && (

                                        <table className="calendar-table">
                                            <thead>
                                                <tr>
                                                    {current.columns.map((col, i) => (
                                                        <th key={i}>{col}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {current.rows.map((row, index) => (
                                                    <tr key={index}>
                                                        {row.map((cell, i) => (
                                                            <td key={i}>{cell}</td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}

                                    {/* Render nested sections for 'time' */}
                                    {current.id === "time" && (
                                        <div className="time-section">
                                            {/* Question Section */}
                                            <div className="time-subsection">
                                                <h3>{current.questionSection.heading}</h3>
                                                <p>{current.questionSection.meaning}</p>
                                                <table className="calendar-table">
                                                    <thead>
                                                        <tr>
                                                            {current.questionSection.columns.map((col, i) => (
                                                                <th key={i}>{col}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {current.questionSection.examples.map(
                                                            (row, index) => (
                                                                <tr key={index}>
                                                                    {row.map((cell, i) => (
                                                                        <td key={i}>{cell}</td>
                                                                    ))}
                                                                </tr>
                                                            )
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Grammar Section */}
                                            <div className="time-subsection">
                                                <h3>{current.grammarSection.heading}</h3>
                                                <p>{current.grammarSection.explanation}</p>
                                                <div class="table-wrapper">
                                                    <table className="calendar-table">
                                                        <thead>
                                                            <tr>
                                                                {current.grammarSection.columns.map((col, i) => (
                                                                    <th key={i}>{col}</th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {current.grammarSection.rows.map((row, index) => (
                                                                <tr key={index}>
                                                                    {row.map((cell, i) => (
                                                                        <td key={i}>{cell}</td>
                                                                    ))}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            {/* Sentence Section */}
                                            <div className="time-subsection">
                                                <h3>{current.sentenceSection.heading}</h3>
                                                <p>
                                                    <strong>Example Question:</strong>{" "}
                                                    {current.sentenceSection.exampleQuestion}
                                                </p>
                                                <p>{current.sentenceSection.explanation}</p>
                                                <div className="table-wrapper">
                                                    <table className="calendar-table">
                                                        <thead>
                                                            <tr>
                                                                {current.sentenceSection.columns.map((col, i) => (
                                                                    <th key={i}>{col}</th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {current.sentenceSection.rows.map((row, index) => (
                                                                <tr key={index}>
                                                                    {row.map((cell, i) => (
                                                                        <td key={i}>{cell}</td>
                                                                    ))}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            );
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReferenceCalendar;
