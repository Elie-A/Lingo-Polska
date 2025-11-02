import React from "react";
import "../ConjugationTense.css";

const presentTenseClasses = [
    {
        name: "Class I (-ę, -esz)",
        endings: [
            { pronoun: "ja", ending: "-ę" },
            { pronoun: "ty", ending: "-esz" },
            { pronoun: "on/ona/ono", ending: "-e" },
            { pronoun: "my", ending: "-emy" },
            { pronoun: "wy", ending: "-ecie" },
            { pronoun: "oni/one", ending: "-ą" },
        ],
        examples: [
            {
                verb: "pisać",
                forms: ["piszę", "piszesz", "pisze", "piszemy", "piszecie", "piszą"],
            },
        ],
    },
    {
        name: "Class II (-ę, -isz / -ysz)",
        endings: [
            { pronoun: "ja", ending: "-ę" },
            { pronoun: "ty", ending: "-isz" },
            { pronoun: "on/ona/ono", ending: "-i" },
            { pronoun: "my", ending: "-imy" },
            { pronoun: "wy", ending: "-icie" },
            { pronoun: "oni/one", ending: "-ą" },
        ],
        examples: [
            {
                verb: "mówić",
                forms: ["mówię", "mówisz", "mówi", "mówimy", "mówicie", "mówią"],
            },
            {
                verb: "widzieć",
                forms: ["widzę", "widzisz", "widzi", "widzimy", "widzicie", "widzą"],
            },
        ],
    },
    {
        name: "Class III (-am, -asz)",
        endings: [
            { pronoun: "ja", ending: "-am" },
            { pronoun: "ty", ending: "-asz" },
            { pronoun: "on/ona/ono", ending: "-a" },
            { pronoun: "my", ending: "-amy" },
            { pronoun: "wy", ending: "-acie" },
            { pronoun: "oni/one", ending: "-ają" },
        ],
        examples: [
            {
                verb: "czytać",
                forms: ["czytam", "czytasz", "czyta", "czytamy", "czytacie", "czytają"],
            },
        ],
    },
    {
        name: "Class IV (-uję, -ujesz) - The -ować verbs",
        endings: [
            { pronoun: "ja", ending: "-uję" },
            { pronoun: "ty", ending: "-ujesz" },
            { pronoun: "on/ona/ono", ending: "-uje" },
            { pronoun: "my", ending: "-ujemy" },
            { pronoun: "wy", ending: "-ujecie" },
            { pronoun: "oni/one", ending: "-ują" },
        ],
        examples: [
            {
                verb: "studiować",
                forms: ["studiuję", "studiujesz", "studiuje", "studiujemy", "studiujecie", "studiują"],
            },
            {
                verb: "pracować",
                forms: ["pracuję", "pracujesz", "pracuje", "pracujemy", "pracujecie", "pracują"],
            },
        ],
    },
];

const motionVerbs = [
    {
        verb: "iść",
        forms: ["idę", "idziesz", "idzie", "idziemy", "idziecie", "idą"],
        endings: [
            { pronoun: "ja", ending: "-ę" },
            { pronoun: "ty", ending: "-esz" },
            { pronoun: "on/ona/ono", ending: "-e" },
            { pronoun: "my", ending: "-emy" },
            { pronoun: "wy", ending: "-ecie" },
            { pronoun: "oni/one", ending: "-ą" },
        ],
    },
    {
        verb: "jechać",
        forms: ["jadę", "jedziesz", "jedzie", "jedziemy", "jedziecie", "jadą"],
        endings: [
            { pronoun: "ja", ending: "-ę" },
            { pronoun: "ty", ending: "-esz" },
            { pronoun: "on/ona/ono", ending: "-e" },
            { pronoun: "my", ending: "-emy" },
            { pronoun: "wy", ending: "-ecie" },
            { pronoun: "oni/one", ending: "-ą" },
        ],
    },

    {
        verb: "chodzić",
        forms: ["chodzę", "chodzisz", "chodzi", "chodzimy", "chodzicie", "chodzą"],
        endings: [
            { pronoun: "ja", ending: "-ę" },
            { pronoun: "ty", ending: "-isz" },
            { pronoun: "on/ona/ono", ending: "-i" },
            { pronoun: "my", ending: "-imy" },
            { pronoun: "wy", ending: "-icie" },
            { pronoun: "oni/one", ending: "-ą" },
        ],
    },
    {
        verb: "jeździć",
        forms: ["jeżdżę", "jeździsz", "jeździ", "jeździmy", "jeździcie", "jeżdżą"],
        endings: [
            { pronoun: "ja", ending: "-ę" },
            { pronoun: "ty", ending: "-isz" },
            { pronoun: "on/ona/ono", ending: "-i" },
            { pronoun: "my", ending: "-imy" },
            { pronoun: "wy", ending: "-icie" },
            { pronoun: "oni/one", ending: "-ą" },
        ],
    },
    {
        verb: "biec",
        forms: ["biegnę", "biegniesz", "biegnie", "biegniemy", "biegniecie", "biegną"],
        endings: [
            { pronoun: "ja", ending: "-ę" },
            { pronoun: "ty", ending: "-esz" },
            { pronoun: "on/ona/ono", ending: "-e" },
            { pronoun: "my", ending: "-emy" },
            { pronoun: "wy", ending: "-ecie" },
            { pronoun: "oni/one", ending: "-ą" },
        ],
    },
];

const PresentTense = () => {
    const pronouns = presentTenseClasses[0].endings.map(e => e.pronoun);

    const renderHighlightedForm = (fullForm, ending) => {
        const cleanEnding = ending.replace("-", "").split("/")[0].trim();
        let index = -1;

        if (fullForm.endsWith(cleanEnding)) {
            index = fullForm.length - cleanEnding.length;
        } else {
            index = fullForm.lastIndexOf(cleanEnding);
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
                    <tr key={k}><td className="pronoun-col">{endings[k].pronoun}</td><td className="form-col">{renderHighlightedForm(form, endings[k].ending)}</td></tr>
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
                    <tr key={k}><td className="pronoun-col">{endings[k].pronoun}</td><td className="form-col">{renderHighlightedForm(form, endings[k].ending)}</td></tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <section className="tense-container">
            <h2>Present Tense Conjugation Rules</h2>

            {presentTenseClasses.map((cls, i) => (
                <div key={i} className="tense-conjugation-section">
                    <h3>{cls.name}</h3>

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
                                    {cls.endings.map((row, j) => (
                                        <tr key={j}>
                                            <td>{row.pronoun}</td>
                                            <td className="ending">{row.ending}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="examples-container">
                            <h4>Examples ({cls.examples[0].verb})</h4>
                            <div className="example-cards-grid">
                                {cls.examples.map((ex, idx) => (
                                    <div key={idx} className="example-card">
                                        {renderExampleTable(ex.verb, ex.forms, cls.endings)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <div className="motion-verbs-section">
                <h3>Verbs of Motion (Irregular)</h3>
                <div className="motion-verbs-grid">
                    {motionVerbs.map((verbObj, i) => (
                        <div key={i} className="example-card">
                            {/* Pass the verbObj.endings to the function */}
                            {renderMotionVerbTable(verbObj.verb, verbObj.forms, verbObj.endings)}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PresentTense;