import React, { useState } from 'react';
import './ReferencePersonalPronouns.css';
import personalPronounsData from "../DataRef/personalPronounsData";

const ReferencePersonalPronouns = () => {
    const [activeModal, setActiveModal] = useState(null);

    const openModal = (id) => setActiveModal(id);
    const closeModal = () => setActiveModal(null);

    const sections = personalPronounsData.pronouns.sections;
    const activeSection = sections.find(s => s.id === activeModal);

    return (
        <div className="pronouns-cases-page">
            <h1>📝 Polish Personal Pronouns</h1>

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

                        {/* Tables */}
                        {activeSection.tables && activeSection.tables.map((table, idx) => (
                            <div key={idx} className="table-section">
                                <h3>{table.title}</h3>
                                <p><b>Subject pronoun:</b> {table.subjectPronoun}</p>
                                <table className={`pronouns-case-table ${activeSection.id}`}>
                                    <thead>
                                        <tr>
                                            {table.columns.map((col, i) => (
                                                <th key={i}>{col}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {table.rows.map((row, rowIdx) => (
                                            <tr key={rowIdx}>
                                                {row.map((cell, cellIdx) => (
                                                    <td key={cellIdx}>{cell}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReferencePersonalPronouns;