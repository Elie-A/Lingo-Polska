import React, { useState } from 'react';
import './ReferencePossessivePronouns.css';
import possessivePronounsData from "../DataRef/possessivePronounsData";

const ReferencePossessivePronouns = () => {
    const [activeModal, setActiveModal] = useState(null);

    const openModal = (id) => setActiveModal(id);
    const closeModal = () => setActiveModal(null);

    const sections = possessivePronounsData.pronouns.sections;
    const activeSection = sections.find(s => s.id === activeModal);

    return (
        <div className="pronouns-cases-page">
            <h1>🏷️ Polish Possessive Pronouns</h1>

            {/* Pronouns Grid */}
            <section className="pronouns-cases-grid">
                {sections.map((section) => (
                    <div
                        key={section.id}
                        className={`pronouns-case-card ${section.id}`}
                        onClick={() => openModal(section.id)}
                    >
                        <h3>{section.title}</h3>
                        <p className="questions">{section.questions}</p>
                        <p className="usage">{section.usage}</p>
                    </div>
                ))}
            </section>

            {/* Modal */}
            {activeModal && activeSection && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={closeModal}>
                            &times;
                        </span>

                        <h2>{activeSection.modalTitle}</h2>
                        <p><b>Usage:</b> {activeSection.description}</p>

                        {/* Special table for reflexive-personal */}
                        {activeSection.specialTable ? (
                            <div className="table-section">
                                <table className={`pronouns-case-table ${activeSection.id}`}>
                                    <thead>
                                        <tr>
                                            {activeSection.specialTable.columns.map((col, i) => (
                                                <th key={i}>{col}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activeSection.specialTable.rows.map((row, rowIdx) => (
                                            <tr key={rowIdx}>
                                                {row.map((cell, cellIdx) => (
                                                    <td key={cellIdx}>{cell}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            /* Gender tables */
                            activeSection.genders && activeSection.genders.map((gender, idx) => (
                                <div key={idx} className="table-section">
                                    <h3>{gender.gender}</h3>
                                    <p><b>Used with subject pronouns:</b> {gender.subjectPronouns}</p>
                                    <table className={`pronouns-case-table ${activeSection.id}`}>
                                        <thead>
                                            <tr>
                                                {gender.columns.map((col, i) => (
                                                    <th key={i}>{col}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {gender.rows.map((row, rowIdx) => (
                                                <tr key={rowIdx}>
                                                    {row.map((cell, cellIdx) => (
                                                        <td key={cellIdx}>{cell}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReferencePossessivePronouns;