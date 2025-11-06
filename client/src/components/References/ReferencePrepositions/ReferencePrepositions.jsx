import React, { useState } from 'react';
import './ReferencePrepositions.css';
import prepositionsData from "../DataRef/prepositionsData";

const ReferencePrepositions = () => {
    const [activeModal, setActiveModal] = useState(null);

    const openModal = (id) => setActiveModal(id);
    const closeModal = () => setActiveModal(null);

    const sections = prepositionsData.prepositions.sections;
    const activeSection = sections.find(s => s.id === activeModal);

    return (
        <div className="prep-page">
            {/* Hero Section */}
            <section id="prep-hero" className="prep hero">
                <h2>{prepositionsData.prepositions.title}</h2>
                <p>{prepositionsData.prepositions.description}</p>
            </section>

            {/* Prepositions Grid */}
            <section className="prep-cases-grid">
                {sections.map((section) => (
                    <div
                        key={section.id}
                        className={`prep-case-card ${section.id}`}
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
                        <p dangerouslySetInnerHTML={{ __html: activeSection.description }}></p>

                        <table className={`prep-case-table ${activeSection.id}`}>
                            <thead>
                                <tr>
                                    {activeSection.columns.map((col, i) => (
                                        <th key={i}>{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {activeSection.rows.map((row, rowIdx) => (
                                    <tr key={rowIdx}>
                                        {row.map((cell, cellIdx) => (
                                            <td key={cellIdx}>
                                                {cellIdx === 0 ? <b>{cell}</b> : cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReferencePrepositions;