import React, { useState } from 'react';
import './ReferenceAlphabet.css';

const ReferenceAlphabet = () => {
    const [activeModal, setActiveModal] = useState(null);

    const openModal = (id) => setActiveModal(id);
    const closeModal = () => setActiveModal(null);

    return (
        <div className="alphabet-page">
            {/* Alphabet Grid */}
            <h1>🔠 Polish Alphabet</h1>
            <section className="alphabet-grid">
                <div
                    className="alphabet-card letters"
                    onClick={() => openModal('letters')}
                >
                    <h3>Letters A–Ż</h3>
                    <p>Polish letters and pronunciation / Polskie litery i wymowa</p>
                </div>

                <div
                    className="alphabet-card digraphs"
                    onClick={() => openModal('digraphs')}
                >
                    <h3>Digraphs</h3>
                    <p>Letter combinations & pronunciation / Kombinacje liter i wymowa</p>
                </div>

                <div
                    className="alphabet-card trigraphs"
                    onClick={() => openModal('trigraphs')}
                >
                    <h3>Trigraphs</h3>
                    <p>Common 3-letter combinations / Typowe kombinacje trzech liter</p>
                </div>

                <div
                    className="alphabet-card hardsoftconsonants"
                    onClick={() => openModal('hardsoftconsonants')}
                >
                    <h3>Hard & Soft Consonants</h3>
                    <p>
                        Differentiate between hard & soft consonants / Rozróżnij spółgłoski
                        twarde i miękkie
                    </p>
                </div>
            </section>

            {/* Letters Modal */}
            {activeModal === 'letters' && (
                <div className="modal">
                    <div className="modal-content letters">
                        <span className="close" onClick={closeModal}>
                            &times;
                        </span>
                        <h2>Polish Alphabet Letters</h2>
                        <table className="alphabet-table letters">
                            <thead>
                                <tr>
                                    <th>Letter</th>
                                    <th>Name</th>
                                    <th>Pronunciation Hint</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    ['A', 'a', 'like "a" in car'],
                                    ['Ą', 'ą', 'nasal "o", like own'],
                                    ['B', 'be', 'like English b'],
                                    ['C', 'ce', 'like ts in cats'],
                                    ['Ć', 'cie', 'soft "ch", like cheese'],
                                    ['D', 'de', 'like English d'],
                                    ['E', 'e', 'like e in pet'],
                                    ['Ę', 'ę', 'nasal e, like end'],
                                    ['F', 'ef', 'like English f'],
                                    ['G', 'ge', 'hard "g", like go'],
                                    ['H', 'ha', 'like English h'],
                                    ['I', 'i', 'like ee in see'],
                                    ['J', 'jot', 'like y in yes'],
                                    ['K', 'ka', 'like English k'],
                                    ['L', 'el', 'like English l'],
                                    ['Ł', 'eł', 'like w in water'],
                                    ['M', 'em', 'like English m'],
                                    ['N', 'en', 'like English n'],
                                    ['Ń', 'eń', 'like Spanish ñ, soft ny'],
                                    ['O', 'o', 'like o in order'],
                                    ['Ó', 'ó', 'like oo in boot'],
                                    ['P', 'pe', 'like English p'],
                                    ['R', 'er', 'rolled "r"'],
                                    ['S', 'es', 'like s in see'],
                                    ['Ś', 'eś', 'soft sh'],
                                    ['T', 'te', 'like English t'],
                                    ['U', 'u', 'like oo in boot'],
                                    ['W', 'wu', 'like English v'],
                                    ['Y', 'y', 'like i in bit (deeper)'],
                                    ['Z', 'zet', 'like z in zoo'],
                                    ['Ź', 'źe', 'soft zh, like vision'],
                                    ['Ż', 'żet', 'hard zh, like treasure'],
                                ].map(([letter, name, hint]) => (
                                    <tr key={letter}>
                                        <td>{letter}</td>
                                        <td>{name}</td>
                                        <td>{hint}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Digraphs Modal */}
            {activeModal === 'digraphs' && (
                <div className="modal">
                    <div className="modal-content digraphs">
                        <span className="close" onClick={closeModal}>
                            &times;
                        </span>
                        <h2>Polish Digraphs</h2>
                        <table className="alphabet-table digraphs">
                            <thead>
                                <tr>
                                    <th>Combination</th>
                                    <th>Pronunciation Hint</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    ['Ch', 'like English h', 'Phonetically identical to h'],
                                    ['Cz', 'like ch in chocolate', 'Harder than ć'],
                                    ['Dz', 'like ds in kids', 'Only before vowels'],
                                    ['Dź', 'soft j, like jeans', 'Softer than dz'],
                                    ['Dż', 'like j in jungle', 'Hard version of dź'],
                                    ['Rz', 'like ż (hard zh)', 'Different spelling contexts'],
                                    ['Sz', 'like sh in shut', 'Harder than ś'],
                                ].map(([combo, hint, notes]) => (
                                    <tr key={combo}>
                                        <td>{combo}</td>
                                        <td>{hint}</td>
                                        <td>{notes}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p>
                            <strong>Important distinctions:</strong> Ś vs Sz, Ć vs Cz, Ź vs Ż, Dź vs Dż — the first is softer, the
                            second harder.
                        </p>
                    </div>
                </div>
            )}

            {/* Trigraphs Modal */}
            {activeModal === 'trigraphs' && (
                <div className="modal">
                    <div className="modal-content trigraphs">
                        <span className="close" onClick={closeModal}>
                            &times;
                        </span>
                        <h2>Polish Trigraphs</h2>
                        <table className="alphabet-table trigraphs">
                            <thead>
                                <tr>
                                    <th>Trigraph</th>
                                    <th>Pronunciation Hint</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    ['Dzi', 'like dź + i, sounds like jeans', 'Soft, behaves like dź'],
                                    ['Rze', 'like ż or rz', 'Occurs in words like rzeka'],
                                    ['Się', 'like ś + e, sh-eh', 'Common reflexive particle'],
                                    ['Cie', 'like ć + e, cheh', 'Seen in words like ciepło'],
                                    ['Nie', 'like ń + e, nyeh', 'From niebo ("sky"), nie ("not")'],
                                    ['Zie', 'like ź + e, zh-eh', 'In words like ziemia'],
                                ].map(([tri, hint, notes]) => (
                                    <tr key={tri}>
                                        <td>{tri}</td>
                                        <td>{hint}</td>
                                        <td>{notes}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Hard & Soft Consonants Modal */}
            {activeModal === 'hardsoftconsonants' && (
                <div className="modal">
                    <div className="modal-content hardsoftconsonants">
                        <span className="close" onClick={closeModal}>
                            &times;
                        </span>
                        <h2>Polish Hard & Soft Consonants</h2>
                        <table className="alphabet-table hardsoftconsonants">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Consonants</th>
                                    <th>Notes & Examples</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="hard-row">
                                    <td>Hard Consonants</td>
                                    <td>
                                        p, b, f, w, m, t, d, s, z, n, ł, r, k, g, ch, cz, dz, sz, ż
                                    </td>
                                    <td>
                                        Do not change before endings.
                                        <br />
                                        Examples:
                                        <br />• dom → domu
                                        <br />• kot → koty
                                        <br />• most → mosty
                                    </td>
                                </tr>
                                <tr className="soft-row">
                                    <td>Soft Consonants / Palatalized Stems</td>
                                    <td>ć, dź, ś, ź, ń, l, j</td>
                                    <td>
                                        Soft stems often change before endings: -i, -e, -y.
                                        <br />
                                        Examples:
                                        <br />• kaczka → kaczki (ć → ci)
                                        <br />• liść → liście (ś → si)
                                        <br />• dzień → dni (ń → ni)
                                        <br />
                                        Often affects diminutives, adjectives, and verb conjugations.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReferenceAlphabet;
