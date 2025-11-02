import React from "react";
import "../ConjugationTense.css";

const pastTenseEndings = [
    { pronoun: "ja", mascEnding: "-łem", femEnding: "-łam", neuterEnding: "-" },
    { pronoun: "ty", mascEnding: "-łeś", femEnding: "-łaś", neuterEnding: "-" },
    { pronoun: "on", mascEnding: "-ł", femEnding: "-", neuterEnding: "-" },
    { pronoun: "ona", mascEnding: "-", femEnding: "-ła", neuterEnding: "-" },
    { pronoun: "ono", mascEnding: "-", femEnding: "-", neuterEnding: "-ło" },
    { pronoun: "my", mascEnding: "-liśmy", femEnding: "-łyśmy", neuterEnding: "-" },
    { pronoun: "wy", mascEnding: "-liście", femEnding: "-łyście", neuterEnding: "-" },
    { pronoun: "oni", mascEnding: "-li", femEnding: "-", neuterEnding: "-" },
    { pronoun: "one", mascEnding: "-", femEnding: "-ły", neuterEnding: "-" },
];

// Data structure for the motion verbs
const motionVerbs = [
    { verb: "iść (to go - one-way)", mascJa: "szedłem", femJa: "szłam", plural: "szliśmy / szłyśmy", stem: "sz" },
    { verb: "chodzić (to go - habitual)", mascJa: "chodziłem", femJa: "chodziłam", plural: "chodziliśmy / chodziłyśmy", stem: "chodzi" },
    { verb: "jechać (to travel - one-way)", mascJa: "jechałem", femJa: "jechałam", plural: "jechaliśmy / jechałyśmy", stem: "jecha" },
    { verb: "jeździć (to travel - habitual)", mascJa: "jeździłem", femJa: "jeździłam", plural: "jeździliśmy / jeździłyśmy", stem: "jeździ" },
];

// CORRECTED Simple, regular verbs for examples (Singular forms only for the small tables)
const regularExamples = [
    {
        verb: "robić (to do)",
        // Forms needed for ja(m), ja(f), ty(m), ty(f), on, ona, ono
        forms: [
            { form: "robiłem", ending: "-łem" },
            { form: "robiłaś", ending: "-łaś" },
            { form: "robił", ending: "-ł" },
            { form: "robiła", ending: "-ła" },
            { form: "robiło", ending: "-ło" },
        ]
    },
    {
        verb: "czytać (to read)",
        // Forms needed for ja(m), ja(f), ty(m), ty(f), on, ona, ono
        forms: [
            { form: "czytałem", ending: "-łem" },
            { form: "czytałaś", ending: "-łaś" },
            { form: "czytał", ending: "-ł" },
            { form: "czytała", ending: "-ła" },
            { form: "czytało", ending: "-ło" },
        ]
    },
];

const PastTense = () => {

    // Helper function to render a part of a word with the ending bolded/highlighted
    const renderHighlightedForm = (fullForm, ending) => {
        // Remove the leading hyphen for matching
        const cleanEnding = ending.replace('-', '').trim();
        // The last part of the word will be the ending
        const index = fullForm.lastIndexOf(cleanEnding);

        if (index === -1 || cleanEnding === "-") return fullForm;

        const base = fullForm.substring(0, index);
        const end = fullForm.substring(index);

        return (
            <React.Fragment>
                {base}
                <span className="ending">{end}</span>
            </React.Fragment>
        );
    };

    const renderExampleTable = (verbName, forms) => {
        // Pronouns corresponding to the singular forms: ja(m/f), ty(m/f), on, ona, ono
        const pronouns = [
            "ja (m.)", "ja (f.)", "ty (m.)", "ty (f.)", "on", "ona", "ono"
        ];

        // Match the pronouns to the forms array
        const tableRows = [
            { pronoun: "ja (m.)", form: forms[0].form, ending: forms[0].ending },
            { pronoun: "ja (f.)", form: forms[0].form.replace('em', 'am'), ending: forms[0].ending.replace('em', 'am') }, // ja(f) for robić is robiłam
            { pronoun: "ty (m.)", form: forms[1].form.replace('łaś', 'łeś'), ending: forms[1].ending.replace('łaś', 'łeś') }, // ty(m) for czytać is czytałeś
            { pronoun: "ty (f.)", form: forms[1].form, ending: forms[1].ending },
            { pronoun: "on", form: forms[2].form, ending: forms[2].ending },
            { pronoun: "ona", form: forms[3].form, ending: forms[3].ending },
            { pronoun: "ono", form: forms[4].form, ending: forms[4].ending },
        ];


        // Create a simplified table for the example cards (Ja, Ty, On/Ona/Ono)
        const simplifiedRows = [
            { pronoun: "ja (m/f)", form: `${tableRows[0].form} / ${tableRows[1].form}`, endingM: tableRows[0].ending, endingF: tableRows[1].ending },
            { pronoun: "ty (m/f)", form: `${tableRows[2].form} / ${tableRows[3].form}`, endingM: tableRows[2].ending, endingF: tableRows[3].ending },
            { pronoun: "on/ona/ono", form: `${tableRows[4].form} / ${tableRows[5].form} / ${tableRows[6].form}`, endingM: tableRows[4].ending, endingF: tableRows[5].ending, endingN: tableRows[6].ending },
        ];


        return (
            <table className="example-table">
                <thead>
                    <tr>
                        <th colSpan="2">{verbName}</th>
                    </tr>
                </thead>
                <tbody>
                    {simplifiedRows.map((row, k) => (
                        <tr key={k}>
                            <td className="pronoun-col">{row.pronoun}</td>
                            <td className="form-col">
                                {row.form.split(' / ').map((formPart, idx) => {
                                    let ending;
                                    if (idx === 0) ending = row.endingM;
                                    else if (idx === 1) ending = row.endingF;
                                    else ending = row.endingN;

                                    return (
                                        <React.Fragment key={idx}>
                                            {idx > 0 && " / "}
                                            {renderHighlightedForm(formPart.trim(), ending)}
                                        </React.Fragment>
                                    );
                                })}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    // Helper function for the irregular motion verb table
    const renderMotionVerbTable = (verb, i) => (
        <table className="example-table motion-verb-table-item">
            <thead>
                <tr>
                    <th colSpan="2">{verb.verb}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="pronoun-col">ja (m.)</td>
                    <td className="form-col">{renderHighlightedForm(verb.mascJa, "łem")}</td>
                </tr>
                <tr>
                    <td className="pronoun-col">ja (f.)</td>
                    <td className="form-col">{renderHighlightedForm(verb.femJa, "łam")}</td>
                </tr>
                <tr>
                    <td className="pronoun-col">my / wy</td>
                    <td className="form-col">
                        {/* Handling the plural split */}
                        {verb.plural.split(' / ').map((form, k) => (
                            <React.Fragment key={k}>
                                {k > 0 && " / "}
                                {form.includes('liśmy') || form.includes('liście') ? renderHighlightedForm(form, "liśmy") : renderHighlightedForm(form, "łyśmy")}
                            </React.Fragment>
                        ))}
                    </td>
                </tr>
            </tbody>
        </table>
    );


    return (
        <section className="tense-container">

            <h2>Past Tense Conjugation Rules</h2>

            <p>
                The <b>past tense</b> in Polish is formed from the <b>verb stem</b> + past endings.
                Endings depend on <b>gender</b> (masculine, feminine, neuter) and <b>number</b> (singular, plural).
            </p>


            <div className="tense-conjugation-section">
                <h3>General Past Tense Endings & Examples</h3>
                <div className="conjugation-and-examples-grid">

                    {/* Endings Table (Large) */}
                    <div className="conjugation-table-wrapper">
                        <h4>Endings by Person and Gender</h4>
                        <table className="verb-table">
                            <thead>
                                <tr>
                                    <th>Pronoun</th>
                                    <th>Masculine</th>
                                    <th>Feminine</th>
                                    <th>Neuter</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pastTenseEndings.map((row, i) => (
                                    <tr key={i}>
                                        <td className="pronoun-col-endings">{row.pronoun}</td>
                                        <td className={row.mascEnding !== "-" ? "ending" : ""}>{row.mascEnding}</td>
                                        <td className={row.femEnding !== "-" ? "ending" : ""}>{row.femEnding}</td>
                                        <td className={row.neuterEnding !== "-" ? "ending" : ""}>{row.neuterEnding}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Examples Grid (Smaller) */}
                    <div className="examples-container">
                        <h4>Example Conjugations (Singular Focus)</h4>
                        <p>Base stem is typically the Infinitive minus '-ć' or '-c'.</p>
                        <div className="example-cards-grid">
                            {regularExamples.map((ex, idx) => (
                                <div key={idx} className="example-card">
                                    {renderExampleTable(ex.verb, ex.forms)}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            ---

            {/* Motion Verbs Section (Irregular/Stem-Changing) */}
            <div className="motion-verbs-section">
                <h3>Irregular Stems: Motion Verbs (Change in stem)</h3>
                <p>These verbs use irregular stems before applying the standard past tense endings. Pay attention to the stem change in <b>iść</b>.</p>
                <div className="motion-verbs-grid">
                    {motionVerbs.map((verb, i) => (
                        <div key={i} className="example-card">
                            {renderMotionVerbTable(verb, i)}
                        </div>
                    ))}
                </div>
            </div>

        </section>
    );
};

export default PastTense;