import React, { useState } from 'react';
import './ReferenceNumber.css';
import numbersData from "../DataRef/numbersData";

const ReferenceNumber = () => {
    const [activeModal, setActiveModal] = useState(null);

    const openModal = (id) => setActiveModal(id);
    const closeModal = () => setActiveModal(null);

    // Separate data
    const cardinalData = Object.entries(numbersData).filter(([key]) =>
        key.startsWith('cardinal_')
    );
    const ordinalData = Object.entries(numbersData).filter(([key]) =>
        key.startsWith('ordinal_')
    );

    const renderCards = (dataArray) =>
        dataArray.map(([key, data]) => (
            <div
                key={key}
                className={`numbers-card ${key}`}
                onClick={() => openModal(key)}
            >
                <h3>{data.title}</h3>
                <p>{data.description}</p>
            </div>
        ));

    return (
        <div className="numbers-page">
            <h1>🔢 Polish Numbers</h1>

            {/* Cardinal Numbers Section */}
            <section className="numbers-section">
                <h2>Cardinal Numbers</h2>
                <div className="numbers-grid">
                    {renderCards(cardinalData)}
                </div>
            </section>

            {/* Ordinal Numbers Section */}
            <section className="numbers-section">
                <h2>Ordinal Numbers</h2>
                <div className="numbers-grid">
                    {renderCards(ordinalData)}
                </div>
            </section>

            {/* Modal */}
            {activeModal && numbersData[activeModal] && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={closeModal}>
                            &times;
                        </span>
                        <h2>{numbersData[activeModal].modalTitle}</h2>
                        <table className="numbers-table">
                            <thead>
                                <tr>
                                    {numbersData[activeModal].columns.map((col, i) => (
                                        <th key={i}>{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {numbersData[activeModal].rows.map((row, index) => (
                                    <tr
                                        key={index}
                                        className={numbersData[activeModal].customRowClass?.(index) || ''}
                                    >
                                        {row.map((cell, i) => (
                                            <td key={i}>{cell}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {numbersData[activeModal].footerText && (
                            <p>
                                <strong>
                                    {numbersData[activeModal].footerText.split(':')[0]}:
                                </strong>
                                {numbersData[activeModal].footerText.split(':').slice(1).join(':')}
                            </p>
                        )}
                    </div>
                </div>
            )}

            <section className="numbers-section grammar-note">
                <h2>Grammar Note: Polish Numbers & Cases</h2>
                <div className="grammar-content">
                    <p>🔹 <strong>Why 1 → nominative singular</strong></p>
                    <p>
                        In Polish (and other Slavic languages), the number 1 behaves like an adjective:
                        <br />
                        <em>jeden kot</em> = "one cat" → "kot" stays in nominative singular, just like it would without a number.
                        It agrees directly with the noun, like <em>ten kot</em> ("this cat").
                    </p>

                    <p>🔹 <strong>Why 2, 3, 4 → nominative plural</strong></p>
                    <p>
                        Originally in Old Slavic, small numbers like 2, 3, 4 had a dual form (between singular & plural).
                        Polish lost the dual, but the pattern stayed: Numbers 2, 3, 4 behave as "close to singular", so the noun looks like nominative plural.
                        <br />
                        Example: <em>trzy psy</em> ("three dogs") → normal plural.
                    </p>

                    <p>🔺 <strong>Why 5 and above → genitive plural</strong></p>
                    <p>
                        Numbers ≥5 were treated as a collective quantifier ("a group of X"), not a direct count.
                        So instead of agreeing like an adjective, they govern the genitive case, like "many":
                        <br />
                        <em>wiele psów</em> = "many dogs"
                        <br />
                        <em>pięć psów</em> = "five dogs"
                        <br />
                        Literally: "a group of 5 (of) cats" → genitive plural.
                    </p>

                    <p>🔺 <strong>Why 0 → genitive plural</strong></p>
                    <p>
                        Zero is treated like "none of", which also uses the genitive.
                        <br />
                        Example: <em>zero problemów</em> = "zero problems".
                    </p>

                    <p>🔺 <strong>Why 12, 13, 14 are exceptions</strong></p>
                    <p>
                        Although ending in 2, 3, 4, these are teen numbers (from dwa-naście, trzy-naście).
                        "Naście" numbers behave like ≥5 → force genitive plural:
                        <br />
                        12 psów, 13 psów, 14 psów.
                    </p>

                    <p>📌 <strong>Summary</strong></p>
                    <ul>
                        <li>1 → nominative singular</li>
                        <li>2, 3, 4 → nominative plural</li>
                        <li>5+ and 0 → genitive plural</li>
                        <li>12–14 → genitive plural (exception)</li>
                    </ul>
                </div>
            </section>
        </div>
    );
};

export default ReferenceNumber;
