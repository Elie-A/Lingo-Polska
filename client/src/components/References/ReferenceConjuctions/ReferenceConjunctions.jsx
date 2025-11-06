import React, { useState } from 'react';
import './ReferenceConjunctions.css';
import conjunctionsData from "../DataRef/conjunctionsData";

const ReferenceConjunctions = () => {
    const [activeModal, setActiveModal] = useState(null);

    const openModal = (id) => setActiveModal(id);
    const closeModal = () => setActiveModal(null);

    const sections = conjunctionsData.conjunctions.sections;
    const activeSection = sections.find(s => s.id === activeModal);

    return (
        <div className="conj-page">
            {/* Hero Section */}
            <section id="conj-hero" className="conj hero">
                <h2>{conjunctionsData.conjunctions.title}</h2>
                <p dangerouslySetInnerHTML={{ __html: conjunctionsData.conjunctions.description }}></p>
            </section>

            {/* Conjunctions Grid */}
            <section className="conj-card-grid">
                {sections.map((section) => (
                    <div
                        key={section.id}
                        className={`conj-type-card ${section.id}`}
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
                        <span className="close" onClick={closeModal}>
                            &times;
                        </span>

                        <h2>{activeSection.modalTitle}</h2>
                        <p dangerouslySetInnerHTML={{ __html: activeSection.modalDescription }}></p>

                        {/* Summary Section - Special handling */}
                        {activeSection.summaryPoints ? (
                            <ul className="conj-summary-list">
                                {activeSection.summaryPoints.map((point, idx) => (
                                    <li key={idx} dangerouslySetInnerHTML={{ __html: point }}></li>
                                ))}
                            </ul>
                        ) : (
                            /* Regular Table */
                            <div className='table-wrapper'>
                                <table className={`conj-type-table ${activeSection.id}`}>
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
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReferenceConjunctions;