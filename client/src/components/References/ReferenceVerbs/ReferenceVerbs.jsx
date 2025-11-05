import React, { useState } from 'react';
import './ReferenceVerbs.css';
import verbsData from "../DataRef/verbsData";

const ReferenceVerbs = () => {
    const [activeModal, setActiveModal] = useState(null);

    const openModal = (id) => setActiveModal(id);
    const closeModal = () => setActiveModal(null);

    const mostCommonSections = verbsData.mostCommon.sections;
    const perfImperfSections = verbsData.perfectiveImperfective.sections;

    const getActiveSection = () => {
        return [...mostCommonSections, ...perfImperfSections].find(s => s.id === activeModal);
    };

    const activeSection = getActiveSection();

    return (
        <div className="verbs-page">
            {/* Most Common Verbs Section */}
            <section id="most-common-hero" className="most-common hero">
                <h2>{verbsData.mostCommon.title}</h2>
                <p>{verbsData.mostCommon.description}</p>
            </section>

            <section className="verb-grid">
                {mostCommonSections.map((section) => (
                    <div
                        key={section.id}
                        className={`verb-card ${section.id}`}
                        onClick={() => openModal(section.id)}
                    >
                        <h3>{section.title}</h3>
                        <p>{section.description}</p>
                    </div>
                ))}
            </section>

            {/* Perfective & Imperfective Section */}
            <section id="perf-imperf-hero" className="perf-imperf hero">
                <h2>{verbsData.perfectiveImperfective.title}</h2>
                <p>{verbsData.perfectiveImperfective.description}</p>
            </section>

            <section className="verb-grid">
                {perfImperfSections.map((section) => (
                    <div
                        key={section.id}
                        className={`perf-imperf-card ${section.id}`}
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

                        <table className={`verbs-table ${activeSection.id}`}>
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
                                            <td key={cellIdx}>{cell}</td>
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

export default ReferenceVerbs;