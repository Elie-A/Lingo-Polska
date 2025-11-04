import React, { useState } from 'react';
import './ReferenceAlphabet.css';
import alphabetData from "../DataRef/alphabetData";

const ReferenceAlphabet = () => {
    const [activeModal, setActiveModal] = useState(null);

    const openModal = (id) => setActiveModal(id);
    const closeModal = () => setActiveModal(null);

    return (
        <div className="alphabet-page">
            {/* Alphabet Grid */}
            <h1>🔠 Polish Alphabet</h1>
            <section className="alphabet-grid">
                {Object.entries(alphabetData).map(([key, data]) => (
                    <div
                        key={key}
                        className={`alphabet-card ${key}`}
                        onClick={() => openModal(key)}
                    >
                        <h3>{data.title}</h3>
                        <p>{data.description}</p>
                    </div>
                ))}
            </section>

            {activeModal && alphabetData[activeModal] && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={closeModal}>
                            &times;
                        </span>
                        <h2>{alphabetData[activeModal].modalTitle}</h2>
                        <table className="alphabet-table">
                            <thead>
                                <tr>
                                    {alphabetData[activeModal].columns.map((col, i) => (
                                        <th key={i}>{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {alphabetData[activeModal].rows.map((row, index) => (
                                    <tr
                                        key={index}
                                        className={alphabetData[activeModal].customRowClass?.(index) || ''}
                                    >
                                        {row.map((cell, i) => (
                                            <td key={i}>{cell}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {alphabetData[activeModal].footerText && (
                            <p>
                                <strong>
                                    {alphabetData[activeModal].footerText.split(':')[0]}:
                                </strong>
                                {alphabetData[activeModal].footerText.split(':').slice(1).join(':')}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReferenceAlphabet;