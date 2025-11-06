import React, { useState } from 'react';
import './ReferenceGender.css';
import genderData from "../DataRef/genderData";

const ReferenceGender = () => {
    const [activeModal, setActiveModal] = useState(null);


    const openModal = (id) => setActiveModal(id);
    const closeModal = () => setActiveModal(null);

    return (
        <div className="gender-page">
            <h1>🧑🏻 Polish Genders</h1>

            <section className="gender-grid">
                {Object.entries(genderData).map(([key, data]) => (
                    <div
                        key={key}
                        className={`gender-card ${key} `}
                        onClick={() => openModal(key)}
                    >
                        <h3>{data.title}</h3>
                        <p>{data.description}</p>
                    </div>
                ))}
            </section>

            {activeModal && genderData[activeModal] && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={closeModal}>&times;</span>

                        <h2>{genderData[activeModal].modalTitle}</h2>

                        <table className="gender-table">
                            <thead>
                                <tr>
                                    {genderData[activeModal].columns.map((col, i) => (
                                        <th key={i}>{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {genderData[activeModal].rows.map((row, index) => (
                                    <tr
                                        key={index}
                                        className={genderData[activeModal].customRowClass?.(index) || ''}
                                    >
                                        {row.map((cell, i) => (
                                            <td key={i}>{cell}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {genderData[activeModal].footerText && (
                            <p className="footer-text">
                                {(() => {
                                    const parts = genderData[activeModal].footerText.split(':');
                                    return (
                                        <>
                                            <strong>{parts[0]}:</strong> {parts.slice(1).join(':')}
                                        </>
                                    );
                                })()}
                            </p>
                        )}

                        {genderData[activeModal].exceptions?.length > 0 && (<div className="exceptions"> <h3>Exceptions:</h3> <div className="exceptions-list">
                            {genderData[activeModal].exceptions.map((ex, idx) => (<span key={idx} className="exception-item">{ex}</span>
                            ))} </div> </div>
                        )}


                        {genderData[activeModal].tips && (
                            <div className="tips">
                                <h3>Tips:</h3>
                                <p>{genderData[activeModal].tips}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

};

export default ReferenceGender;
