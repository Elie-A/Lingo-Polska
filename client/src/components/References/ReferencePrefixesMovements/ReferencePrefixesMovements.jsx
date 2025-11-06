import React, { useState } from 'react';
import './ReferencePrefixesMovements.css';
import prefixesMovementsData from "../DataRef/prefixesMovementsData";

const ReferencePrefixesMovements = () => {
    const [activeModal, setActiveModal] = useState(null);

    const openModal = (id) => setActiveModal(id);
    const closeModal = () => setActiveModal(null);

    const sections = prefixesMovementsData.prefixes.sections;
    const activeSection = sections.find(s => s.id === activeModal);

    return (
        <div className="pref-mov-page">
            <h1>📝 Polish Prefixes Movements</h1>

            {/* Prefixes Movements Grid */}
            <section className="pref-mov-grid">
                {sections.map((section) => (
                    <div
                        key={section.id}
                        className={`pref-mov-card ${section.id}`}
                        onClick={() => openModal(section.id)}
                    >
                        <h3>{section.title}</h3>
                        <p dangerouslySetInnerHTML={{ __html: section.description }}></p>
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

                        <table className={`prefixes-movements-table ${activeSection.id}`}>
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
                                        <td>{row[0]}</td>
                                        <td>
                                            <span className="ending-prefix">{row[1]}</span>
                                        </td>
                                        <td>{row[2]}</td>
                                        <td>{row[3]}</td>
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

export default ReferencePrefixesMovements;