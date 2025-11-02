import React from "react";
import "../ConjugationTense.css";

const futureTenseData = {
    simpleFuture: {
        description:
            "The **Simple Future** is used for <span class='pf'>perfective</span> verbs. It is formed by conjugating the perfective verb (e.g., *zrobić* — 'to do/make' once) using a set of present tense-like endings.",
        exampleVerb: {
            infinitive: "zrobić",
            meaning: "to do/make (perfective)",
            forms: ["zrobię", "zrobisz", "zrobi", "zrobimy", "zrobicie", "zrobią"],
            endings: [
                { pronoun: "ja", ending: "-ę" },
                { pronoun: "ty", ending: "-isz" },
                { pronoun: "on/ona/ono", ending: "-i" },
                { pronoun: "my", ending: "-imy" },
                { pronoun: "wy", ending: "-icie" },
                { pronoun: "oni/one", ending: "-ią" },
            ],
        },
    },
    compoundFuture: {
        description:
            "The **Compound Future** is used for <span class='impf'>imperfective</span> verbs. It is formed using a conjugated form of **będę** ('I will be') plus the infinitive of the main verb or its past participle.",
        będęForms: [
            { pronoun: "ja", form: "będę", example: "będę czytać" },
            { pronoun: "ty", form: "będziesz", example: "będziesz pracować" },
            { pronoun: "on/ona/ono", form: "będzie", example: "będzie pisać" },
            { pronoun: "my", form: "będziemy", example: "będziemy gotować" },
            { pronoun: "wy", form: "będziecie", example: "będziecie rozmawiać" },
            { pronoun: "oni/one", form: "będą", example: "będą chodzić" },
        ],
    },
    motionVerbs: {
        simpleFuture: {
            title: "Perfective Motion Verbs (Simple Future)",
            note: "These forms are used for one-time, directed future actions of going. They use present tense-like endings of the perfective verb.",
            verbs: [
                {
                    infinitive: "pójść",
                    meaning: "(will go on foot)",
                    forms: ["pójdę", "pójdziesz", "pójdzie", "pójdzemy", "pójdzicie", "pójdą"],
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
                    infinitive: "pojechać",
                    meaning: "(will go by vehicle)",
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
            ],
        },
        compoundFuture: {
            title: "Imperfective Motion Verbs (Compound Future)",
            note: "These forms are used for habitual or repeated future actions of going. They are formed with **będę** + infinitive.",
            examples: [
                { pronoun: "ja", example: "będę chodzić / jeździć" },
                { pronoun: "ty", example: "będziesz chodzić / jeździć" },
                { pronoun: "on/ona/ono", example: "będzie chodzić / jeździć" },
                { pronoun: "my", example: "będziemy chodzić / jeździć" },
                { pronoun: "wy", example: "będziecie chodzić / jeździć" },
                { pronoun: "oni/one", example: "będą chodzić / jeździć" },
            ],
            będęForms: [
                { pronoun: "ja", form: "będę" },
                { pronoun: "ty", form: "będziesz" },
                { pronoun: "on/ona/ono", form: "będzie" },
                { pronoun: "my", form: "będziemy" },
                { pronoun: "wy", form: "będziecie" },
                { pronoun: "oni/one", form: "będą" },
            ]
        }
    },
    notes: [
        { text: "<strong>iść</strong> and <strong>jechać</strong> describe **one-time** or single actions (imperfective)." },
        { text: "<strong>pójść</strong> and <strong>pojechać</strong> are the **perfective** forms, used for future single actions." },
        { text: "<strong>chodzić</strong> and <strong>jeździć</strong> describe **habitual** or repeated actions (imperfective)." },
        { text: "Perfective verbs do not have a true present tense — their “present” forms are actually **future tense**." },
        { text: "Imperfective verbs can form both the present tense and the compound future tense." },
    ]
};

const FutureTense = () => {

    const renderHighlightedForm = (fullForm, ending) => {
        const cleanEnding = ending.replace("-", "").split("/")[0].trim();
        let index = -1;

        if (fullForm.endsWith(cleanEnding)) {
            index = fullForm.length - cleanEnding.length;
        } else {
            index = fullForm.lastIndexOf(cleanEnding);
        }

        if (fullForm === "zrobi" && cleanEnding === "i") {
            index = fullForm.length - 1;
        }


        if (index === -1) return fullForm;
        return (
            <>
                {fullForm.substring(0, index)} <span className="ending">{fullForm.substring(index)}</span>
            </>
        );
    };

    const renderSimpleFutureTable = (verbData) => (
        <table className="verb-table">
            <thead>
                <tr>
                    <th>Pronoun</th>
                    <th>Ending</th>
                    <th>Example</th>
                </tr>
            </thead>
            <tbody>
                {verbData.endings.map((row, j) => {
                    const form = verbData.forms[j];
                    return (
                        <tr key={j}>
                            <td>{row.pronoun}</td>
                            <td className="ending">{row.ending}</td>
                            <td>
                                {renderHighlightedForm(form, row.ending)}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );

    const renderCompoundFutureTable = (data) => (
        <table className="verb-table">
            <thead>
                <tr>
                    <th>Pronoun</th>
                    <th>Form of "być"</th>
                    <th>Example</th>
                </tr>
            </thead>
            <tbody>
                {data.będęForms.map((row, j) => {
                    const exampleParts = row.example.split(" ");
                    const highlightedExample = exampleParts.map((part, index) => {
                        if (index === 0) {
                            return <span className="ending" key={index}>{part}</span>;
                        }
                        return part;
                    }).reduce((prev, curr) => [prev, " ", curr]);

                    return (
                        <tr key={j}>
                            <td>{row.pronoun}</td>
                            <td className="ending">{row.form}</td>
                            <td>{highlightedExample}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );

    const renderPerfectiveMotionTable = (verbs) => (
        <table className="verb-table motion-table-wide">
            <thead>
                <tr>
                    <th>Verb</th>
                    <th>ja</th>
                    <th>ty</th>
                    <th>on/ona/ono</th>
                    <th>my</th>
                    <th>wy</th>
                    <th>oni/one</th>
                </tr>
            </thead>
            <tbody>
                {verbs.map((verbObj, i) => (
                    <tr key={i}>
                        <td>
                            <strong>{verbObj.infinitive}</strong> ({verbObj.meaning})
                        </td>
                        {verbObj.forms.map((form, k) => (
                            <td key={k}>
                                {renderHighlightedForm(form, verbObj.endings[k].ending)}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderImperfectiveMotionTable = (data) => (
        <table className="verb-table">
            <thead>
                <tr>
                    <th>Pronoun</th>
                    <th>Example</th>
                </tr>
            </thead>
            <tbody>
                {data.examples.map((row, j) => {
                    const exampleParts = row.example.split(" ");
                    const highlightedExample = exampleParts.map((part, index) => {
                        if (index === 0) {
                            return <span className="ending" key={index}>{part}</span>;
                        }
                        return part;
                    }).reduce((prev, curr) => [prev, " ", curr]);

                    return (
                        <tr key={j}>
                            <td>{row.pronoun}</td>
                            <td>{highlightedExample}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );

    return (
        <section className="tense-container">
            <h2>Future Tense Conjugation Rules</h2>
            <p>
                The <strong>future tense</strong> can be formed in two ways: for{" "}
                <span className="pf">perfective</span> verbs (simple future) and for{" "}
                <span className="impf">imperfective</span> verbs (compound future).
            </p>

            {/* Simple Future Section */}
            <div className="tense-conjugation-section">
                <div className="table-group">
                    <h3>1. Perfective Verbs (Simple Future)</h3>
                    <p dangerouslySetInnerHTML={{ __html: futureTenseData.simpleFuture.description }} />
                    <div className="table-wrapper">
                        {renderSimpleFutureTable(futureTenseData.simpleFuture.exampleVerb)}
                    </div>
                </div>
            </div>

            <hr />

            {/* Compound Future Section */}
            <div className="tense-conjugation-section">
                <div className="table-group">
                    <h3>2. Imperfective Verbs (Compound Future)</h3>
                    <p>Formed with <b>będę</b> + <b>infinitive or past participle</b>. The table below shows the conjugation of the auxiliary verb.</p>
                    <div className="table-wrapper">
                        {renderCompoundFutureTable(futureTenseData.compoundFuture)}
                    </div>
                </div>
            </div >

            <hr />

            {/* Motion Verbs Section */}
            <div className="tense-conjugation-section">
                <div className="table-group">
                    <h3>{futureTenseData.motionVerbs.simpleFuture.title}</h3>
                    <p>{futureTenseData.motionVerbs.simpleFuture.note}</p>
                    <div className="table-wrapper">
                        {renderPerfectiveMotionTable(futureTenseData.motionVerbs.simpleFuture.verbs)}
                    </div>
                </div>

                <div className="table-group">
                    <h3>{futureTenseData.motionVerbs.compoundFuture.title}</h3>
                    <p>{futureTenseData.motionVerbs.compoundFuture.note}</p>
                    <div className="table-wrapper">
                        {renderImperfectiveMotionTable(futureTenseData.motionVerbs.compoundFuture)}
                    </div>
                </div>
            </div>

            <hr />

            {/* Notes Section */}
            <div className="tense-notes-section">
                <h3>Notes</h3>
                <ul>
                    {futureTenseData.notes.map((note, i) => (
                        <li key={i} dangerouslySetInnerHTML={{ __html: note.text }} />
                    ))}
                </ul>
            </div>
        </section >
    );
};

export default FutureTense;