import React, { useState } from 'react';
import './ReferenceAdverbs.css';
import adverbsData from "../DataRef/adverbsData";

const ReferenceAdverbs = () => {
    const [activeModal, setActiveModal] = useState(null);

    const openModal = (id) => setActiveModal(id);
    const closeModal = () => setActiveModal(null);

    const sections = adverbsData.adverbs.sections;
    const activeSection = sections.find((s) => s.id === activeModal);

    return (
        <div className="adverbs-page">
            <h1>💥 Polish Adverbs</h1>

            {/* INTRO */}
            <section className="adverb-hero">
                <p>{adverbsData.adverbs.description}</p>
            </section>

            {/* Sections Grid */}
            <section className="adverb-grid">
                {sections.map((section) => (
                    <div
                        key={section.id}
                        className={`adverb-card ${section.id}`}
                        onClick={() => openModal(section.id)}
                    >
                        <h3>{section.title}</h3>
                        <p>{section.description}</p>
                    </div>
                ))}
            </section>

            {/* Modal */}
            {activeModal && activeSection && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={closeModal}>&times;</span>

                        <h2>{activeSection.modalTitle || activeSection.title}</h2>
                        {activeSection.modalDescription && <p>{activeSection.modalDescription}</p>}

                        {/* Table for rows */}
                        {Array.isArray(activeSection.rows) && activeSection.rows.length > 0 && (
                            <table className={`adverbs-table ${activeSection.id}`}>
                                <thead>
                                    <tr>
                                        {activeSection.columns?.map((col, idx) => (
                                            <th key={idx}>{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeSection.rows.map((row, rowIdx) => (
                                        <tr key={rowIdx}>
                                            {row.map((cell, cellIdx) => (
                                                <td key={cellIdx}>{cell}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {/* Optional Examples Table */}
                        {Array.isArray(activeSection.examples) && activeSection.examples.length > 0 && (
                            <table className="adverbs-table formation-table">
                                <thead>
                                    <tr>
                                        <th>Example</th>
                                        <th>Meaning</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeSection.examples.map((ex, idx) => (
                                        <tr key={idx}>
                                            <td>{ex[0]}</td>
                                            <td>{ex[1]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {/* Pattern */}
                        {activeSection.pattern && (
                            <p className="pattern-info">
                                <strong>Pattern:</strong> {activeSection.pattern}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReferenceAdverbs;
