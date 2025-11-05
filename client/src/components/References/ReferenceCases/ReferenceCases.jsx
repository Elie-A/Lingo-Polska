import React, { useState } from 'react';
import './ReferenceCases.css';
import casesData from "../DataRef/casesData";

const ReferenceCases = () => {
    const [activeModal, setActiveModal] = useState(null);

    const openModal = (id) => setActiveModal(id);
    const closeModal = () => setActiveModal(null);

    const sections = casesData.cases.sections;
    const activeSection = sections.find(s => s.id === activeModal);

    return (
        <div className="cases-page">
            <h1>📝 Polish Cases</h1>

            {/* Cases Grid */}
            <section className="cases-grid">
                {sections.map((section) => (
                    <div
                        key={section.id}
                        className={`case-card ${section.id}`}
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
                        <p><b>Questions:</b> {activeSection.questions}</p>
                        <p><b>Usage:</b> {activeSection.description}</p>

                        {/* Tables */}
                        {activeSection.tables.map((table, idx) => (
                            <div key={idx} className="table-section">
                                <h3>{table.title}</h3>
                                <table className={`case-table ${activeSection.id}`}>
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

                        {/* Notes */}
                        {activeSection.notes && activeSection.notes.length > 0 && (
                            <div className="case-notes">
                                <h3>📘 Notes</h3>
                                <ul className="grammar-notes">
                                    {activeSection.notes.map((note, idx) => (
                                        <li key={idx}>{note}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReferenceCases;