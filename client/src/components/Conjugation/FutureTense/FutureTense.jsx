import React from "react";
import "../ConjugationTense.css";

const futureTenseData = {
    simpleFuture: {
        name: "Perfective Verbs (Simple Future)",
        description:
            "The **Simple Future** is used for perfective verbs. It is formed by conjugating the perfective verb (e.g., *zrobić* — 'to do/make' once) using a set of present tense-like endings.",
        endings: [
            { pronoun: "ja", ending: "-ę" },
            { pronoun: "ty", ending: "-isz" },
            { pronoun: "on/ona/ono", ending: "-i" },
            { pronoun: "my", ending: "-imy" },
            { pronoun: "wy", ending: "-icie" },
            { pronoun: "oni/one", ending: "-ią" },
        ],
        examples: [
            {
                verb: "zrobić",
                forms: ["zrobię", "zrobisz", "zrobi", "zrobimy", "zrobicie", "zrobią"],
            },
        ],
    },
    compoundFuture: {
        name: "Imperfective Verbs (Compound Future)",
        description:
            "The **Compound Future** is used for imperfective verbs. It is formed using a conjugated form of **będę** ('I will be') plus the infinitive of the main verb.",
        endings: [
            { pronoun: "ja", ending: "będę" },
            { pronoun: "ty", ending: "będziesz" },
            { pronoun: "on/ona/ono", ending: "będzie" },
            { pronoun: "my", ending: "będziemy" },
            { pronoun: "wy", ending: "będziecie" },
            { pronoun: "oni/one", ending: "będą" },
        ],
        examples: [
            {
                verb: "czytać",
                forms: ["będę czytać", "będziesz czytać", "będzie czytać", "będziemy czytać", "będziecie czytać", "będą czytać"],
            },
            {
                verb: "pracować",
                forms: ["będę pracować", "będziesz pracować", "będzie pracować", "będziemy pracować", "będziecie pracować", "będą pracować"],
            },
        ],
    },
};

const motionVerbs = [
    {
        verb: "pójść (perfective)",
        forms: ["pójdę", "pójdziesz", "pójdzie", "pójdziemy", "pójdziecie", "pójdą"],
        endings: [
            { pronoun: "ja", ending: "-ę" },
            { pronoun: "ty", ending: "-iesz" },
            { pronoun: "on/ona/ono", ending: "-ie" },
            { pronoun: "my", ending: "-iemy" },
            { pronoun: "wy", ending: "-iecie" },
            { pronoun: "oni/one", ending: "-ą" },
        ],
    },
    {
        verb: "pojechać (perfective)",
        forms: ["pojadę", "pojedziesz", "pojedzie", "pojedziemy", "pojedziecie", "pojadą"],
        endings: [
            { pronoun: "ja", ending: "-ę" },
            { pronoun: "ty", ending: "-iesz" },
            { pronoun: "on/ona/ono", ending: "-ie" },
            { pronoun: "my", ending: "-iemy" },
            { pronoun: "wy", ending: "-iecie" },
            { pronoun: "oni/one", ending: "-ą" },
        ],
    },
    {
        verb: "chodzić (imperfective)",
        forms: ["będę chodzić", "będziesz chodzić", "będzie chodzić", "będziemy chodzić", "będziecie chodzić", "będą chodzić"],
        endings: [
            { pronoun: "ja", ending: "będę" },
            { pronoun: "ty", ending: "będziesz" },
            { pronoun: "on/ona/ono", ending: "będzie" },
            { pronoun: "my", ending: "będziemy" },
            { pronoun: "wy", ending: "będziecie" },
            { pronoun: "oni/one", ending: "będą" },
        ],
    },
    {
        verb: "jeździć (imperfective)",
        forms: ["będę jeździć", "będziesz jeździć", "będzie jeździć", "będziemy jeździć", "będziecie jeździć", "będą jeździć"],
        endings: [
            { pronoun: "ja", ending: "będę" },
            { pronoun: "ty", ending: "będziesz" },
            { pronoun: "on/ona/ono", ending: "będzie" },
            { pronoun: "my", ending: "będziemy" },
            { pronoun: "wy", ending: "będziecie" },
            { pronoun: "oni/one", ending: "będą" },
        ],
    },
];

const notes = [
    "**iść** and **jechać** describe one-time or single actions (imperfective).",
    "**pójść** and **pojechać** are the perfective forms, used for future single actions.",
    "**chodzić** and **jeździć** describe habitual or repeated actions (imperfective).",
    "Perfective verbs do not have a true present tense — their present forms are actually future tense.",
    "Imperfective verbs can form both the present tense and the compound future tense.",
];

const FutureTense = () => {
    const renderHighlightedForm = (fullForm, ending) => {
        const cleanEnding = ending.replace("-", "").split("/")[0].trim();
        let index = -1;

        if (fullForm.endsWith(cleanEnding)) {
            index = fullForm.length - cleanEnding.length;
        } else {
            index = fullForm.lastIndexOf(cleanEnding);
        }

        // Special case for "zrobi" with ending "-i"
        if (fullForm === "zrobi" && cleanEnding === "i") {
            index = fullForm.length - 1;
        }

        // For compound future, highlight the auxiliary verb
        if (fullForm.includes("będę") || fullForm.includes("będziesz") ||
            fullForm.includes("będzie") || fullForm.includes("będziemy") ||
            fullForm.includes("będziecie") || fullForm.includes("będą")) {
            const parts = fullForm.split(" ");
            return (
                <>
                    <span className="ending">{parts[0]}</span> {parts[1]}
                </>
            );
        }

        if (index === -1) return fullForm;
        return (
            <>
                {fullForm.substring(0, index)} <span className="ending">{fullForm.substring(index)}</span>
            </>
        );
    };

    const renderExampleTable = (verbName, forms, endings) => (
        <table className="example-table">
            <thead>
                <tr>
                    <th colSpan="2">{verbName}</th>
                </tr>
            </thead>
            <tbody>
                {forms.map((form, k) => (
                    <tr key={k}>
                        <td className="pronoun-col">{endings[k].pronoun}</td>
                        <td className="form-col">{renderHighlightedForm(form, endings[k].ending)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderMotionVerbTable = (verbName, forms, endings) => (
        <table className="example-table">
            <thead>
                <tr>
                    <th colSpan="2">{verbName}</th>
                </tr>
            </thead>
            <tbody>
                {forms.map((form, k) => (
                    <tr key={k}>
                        <td className="pronoun-col">{endings[k].pronoun}</td>
                        <td className="form-col">{renderHighlightedForm(form, endings[k].ending)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <section className="tense-container">
            <h2>Future Tense Conjugation Rules</h2>
            <p style={{ marginBottom: '25px' }}>
                The <strong>future tense</strong> can be formed in two ways: for{" "}
                <span style={{ color: '#059669', fontWeight: 600 }}>perfective</span> verbs (simple future) and for{" "}
                <span style={{ color: '#d97706', fontWeight: 600 }}>imperfective</span> verbs (compound future).
            </p>

            {/* Simple Future Section */}
            <div className="tense-conjugation-section">
                <h3>{futureTenseData.simpleFuture.name}</h3>
                <p style={{ marginBottom: '15px' }}>{futureTenseData.simpleFuture.description}</p>

                <div className="conjugation-and-examples-grid">
                    <div className="conjugation-table-wrapper">
                        <h4>Endings</h4>
                        <table className="verb-table">
                            <thead>
                                <tr>
                                    <th>Pronoun</th>
                                    <th>Ending</th>
                                </tr>
                            </thead>
                            <tbody>
                                {futureTenseData.simpleFuture.endings.map((row, j) => (
                                    <tr key={j}>
                                        <td>{row.pronoun}</td>
                                        <td className="ending">{row.ending}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="examples-container">
                        <h4>Examples ({futureTenseData.simpleFuture.examples[0].verb})</h4>
                        <div className="example-cards-grid">
                            {futureTenseData.simpleFuture.examples.map((ex, idx) => (
                                <div key={idx} className="example-card">
                                    {renderExampleTable(ex.verb, ex.forms, futureTenseData.simpleFuture.endings)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Compound Future Section */}
            <div className="tense-conjugation-section">
                <h3>{futureTenseData.compoundFuture.name}</h3>
                <p style={{ marginBottom: '15px' }}>{futureTenseData.compoundFuture.description}</p>

                <div className="conjugation-and-examples-grid">
                    <div className="conjugation-table-wrapper">
                        <h4>Form of "być"</h4>
                        <table className="verb-table">
                            <thead>
                                <tr>
                                    <th>Pronoun</th>
                                    <th>Auxiliary</th>
                                </tr>
                            </thead>
                            <tbody>
                                {futureTenseData.compoundFuture.endings.map((row, j) => (
                                    <tr key={j}>
                                        <td>{row.pronoun}</td>
                                        <td className="ending">{row.ending}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="examples-container">
                        <h4>Examples</h4>
                        <div className="example-cards-grid">
                            {futureTenseData.compoundFuture.examples.map((ex, idx) => (
                                <div key={idx} className="example-card">
                                    {renderExampleTable(ex.verb, ex.forms, futureTenseData.compoundFuture.endings)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Motion Verbs Section */}
            <div className="motion-verbs-section">
                <h3>Verbs of Motion (Future Tense)</h3>
                <div className="motion-verbs-grid">
                    {motionVerbs.map((verbObj, i) => (
                        <div key={i} className="example-card">
                            {renderMotionVerbTable(verbObj.verb, verbObj.forms, verbObj.endings)}
                        </div>
                    ))}
                </div>
            </div>

            {/* Notes Section */}
            <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '1.4rem', color: '#dc2626', marginBottom: '12px' }}>Notes</h3>
                <ul style={{ listStylePosition: 'inside', paddingLeft: '10px' }}>
                    {notes.map((note, i) => (
                        <li key={i} style={{ marginBottom: '8px', lineHeight: '1.6' }}>
                            {note.split('**').map((part, idx) =>
                                idx % 2 === 1 ? <strong key={idx}>{part}</strong> : part
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default FutureTense;