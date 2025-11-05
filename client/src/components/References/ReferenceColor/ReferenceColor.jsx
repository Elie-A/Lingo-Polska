import React, { useState } from 'react';
import './ReferenceColor.css';
import colorsData from "../DataRef/colorsData";

const ReferenceColor = () => {
    const [activeModal, setActiveModal] = useState(null);

    const openModal = (id) => setActiveModal(id);
    const closeModal = () => setActiveModal(null);

    return (
        <div className="colors-page">
            {/* Colors Grid */}
            <h1>🎨 Polish Colors</h1>
            <section className="colors-grid">
                {Object.entries(colorsData).map(([key, data]) => (
                    <div
                        key={key}
                        className={`colors-card ${key}`}
                        onClick={() => openModal(key)}
                    >
                        <h3>{data.title}</h3>
                        <p>{data.description}</p>
                    </div>
                ))}
            </section>

            {activeModal && colorsData[activeModal] && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={closeModal}>
                            &times;
                        </span>
                        <h2>{colorsData[activeModal].modalTitle}</h2>
                        <table className="colors-table">
                            <thead>
                                <tr>
                                    {colorsData[activeModal].columns.map((col, i) => (
                                        <th key={i}>{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {colorsData[activeModal].rows.map((row, index) => (
                                    <tr
                                        key={index}
                                        className={colorsData[activeModal].customRowClass?.(index) || ''}
                                    >
                                        {row.map((cell, i) => (
                                            <td key={i}>{cell}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {colorsData[activeModal].footerText && (
                            <p>
                                <strong>
                                    {colorsData[activeModal].footerText.split(':')[0]}:
                                </strong>
                                {colorsData[activeModal].footerText.split(':').slice(1).join(':')}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReferenceColor;