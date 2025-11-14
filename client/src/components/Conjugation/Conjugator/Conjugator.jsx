import React, { useState } from "react";
import axios from "axios";
import "./Conjugator.css";

const posOptions = ["VERB", "NOUN", "ADJECTIVE", "ADVERB", "PRONOUN", "NUMERAL"];
const pronounOrder = ["ja", "ty", "on", "ona", "ono", "my", "wy", "oni", "one", "oni, one"];
const nounCases = ["nominative", "genitive", "dative", "accusative", "instrumental", "locative", "vocative"];
const genders = ["m", "f", "n"];
const numbers = ["singular", "plural"];

// --------- Utility Functions ---------

const detectGenderFromForm = (form) => {
    if (!form) return "-";
    const s = form.toLowerCase();
    if (s.endsWith("łem") || s.endsWith("łeś") || s.endsWith("liśmy")) return "m";
    if (s.endsWith("łam") || s.endsWith("łaś") || s.endsWith("łyśmy")) return "f";
    if (s.endsWith("ło") || s.endsWith("łoś") || s.endsWith("łom")) return "n";
    return "-";
};

const pronounFrom = (f, pluralGender) => {
    if (f.person === "first" && f.number === "singular") return "ja";
    if (f.person === "second" && f.number === "singular") return "ty";
    if (f.person === "third" && f.number === "singular") {
        if (f.gender === "m") return "on";
        if (f.gender === "f") return "ona";
        if (f.gender === "n") return "ono";
        return "on/ona/ono";
    }
    if (f.person === "first" && f.number === "plural") return "my";
    if (f.person === "second" && f.number === "plural") return "wy";
    if (f.person === "third" && f.number === "plural") {
        if (pluralGender === "m") return "oni";
        if (pluralGender === "f") return "one";
        if (pluralGender === "mixed") return "oni, one";
        return "oni/one";
    }
    return "-";
};

// --------- Aggregation ---------

const mapVerbFormToPronoun = (formObj) => {
    const person = formObj.person || "third";
    const number = formObj.number || "singular";
    const gender = formObj.gender?.[0] || detectGenderFromForm(formObj.form);

    return {
        pronoun: pronounFrom({ person, number, gender }),
        form: formObj.form,
        person,
        number,
        gender,
    };
};

const aggregateRows = (rows) => {
    // Detect plural third-person gender
    const pluralThird = rows.filter(r => r.person === "third" && r.number === "plural");
    let pluralGender = null;
    if (pluralThird.length) {
        const gendersSet = new Set(pluralThird.map(r => r.gender).filter(g => g !== "-"));
        pluralGender = gendersSet.size === 1 ? [...gendersSet][0] : "mixed";
    }

    const map = new Map();
    rows.forEach(r => {
        let pronoun = r.pronoun;
        if (pronoun === "oni/one") pronoun = pronounFrom({ ...r, number: "plural", person: "third" }, pluralGender);
        if (!pronoun || pronoun === "-") pronoun = "__no_pronoun__";
        if (!map.has(pronoun)) map.set(pronoun, []);
        map.get(pronoun).push(r.form);
    });

    return Array.from(map.entries())
        .map(([pronoun, forms]) => ({
            pronoun: pronoun === "__no_pronoun__" ? "-" : pronoun,
            form: forms.join(", "),
        }))
        .sort((a, b) => {
            const indexA = pronounOrder.indexOf(a.pronoun);
            const indexB = pronounOrder.indexOf(b.pronoun);
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
        });
};

// --------- Table Component ---------

const Table = ({ rows, columns, rowKeyLabel = "Case", showPronounColumn = false }) => (
    <div className="table-wrapper">
        <table className="inflection-table">
            <thead>
                <tr>
                    {rowKeyLabel && <th>{rowKeyLabel}</th>}
                    {columns.map((col) => {
                        if (!showPronounColumn && col.key === "pronoun") return null;
                        return <th key={col.key}>{col.label}</th>;
                    })}
                </tr>
            </thead>
            <tbody>
                {rows.map((r, i) => (
                    <tr key={i}>
                        {rowKeyLabel && <td>{r.case || r.label || r.pronoun}</td>}
                        {columns.map((col) => {
                            if (!showPronounColumn && col.key === "pronoun") return null;
                            return <td key={col.key}>{r[col.key] ?? r.forms?.[col.key] ?? "-"}</td>;
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

// --------- Columns for Nouns/Adjectives/Pronouns/Numerals ---------

const genderColumns = numbers.flatMap((n) =>
    genders.map((g) => ({
        label: `${n.charAt(0).toUpperCase() + n.slice(1)} ${g.toUpperCase()}`,
        key: `${n}_${g}`,
    }))
);

// --------- Main Component ---------

const Conjugator = () => {
    const [word, setWord] = useState("");
    const [pos, setPos] = useState("VERB");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState("");
    const [open, setOpen] = useState({});

    const toggle = (key) => setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

    const handleFetch = async () => {
        if (!word.trim()) {
            setError("Please enter a word before fetching.");
            return;
        }
        setLoading(true);
        setError("");
        setResults(null);
        try {
            const encoded = encodeURIComponent(word.trim());
            const url = `${import.meta.env.VITE_API_URL}/api/words/inflections/${encoded}`;
            const res = await axios.get(url);
            setResults(res.data.data);
        } catch (err) {
            setError(err.response?.data?.message || "Error fetching data");
        } finally {
            setLoading(false);
        }
    };

    const mapVerbForms = (inflections) => {
        const mapped = { present: [], past: [], future: [], unspecified: {} };
        ["present", "past", "future"].forEach((tense) => {
            if (!inflections[tense]) return;
            Object.entries(inflections[tense]).forEach(([mood, items]) => {
                const rows = items.filter(i => i.form).map(mapVerbFormToPronoun);
                mapped[tense].push({ mood, forms: aggregateRows(rows) });
            });
        });

        if (inflections.unspecified) {
            Object.entries(inflections.unspecified).forEach(([mood, items]) => {
                const rows = items.filter(i => i.form).map(mapVerbFormToPronoun);
                mapped.unspecified[mood] = aggregateRows(rows);
            });
        }

        return mapped;
    };

    const mapGenderCaseForms = (inflections) => {
        const rows = [];
        nounCases.forEach((c) => {
            const forms = {};
            numbers.forEach((n) => {
                const caseForms = inflections?.[n]?.[c] || [];
                genders.forEach((g) => {
                    const filtered = caseForms.filter(
                        (f) =>
                            (f.gender?.toLowerCase().startsWith(g)) ||
                            (g === "n" && (!f.gender || f.gender === "unspecified"))
                    );
                    forms[`${n}_${g}`] =
                        filtered.length > 0 ? filtered.map((f) => f.form).join(", ") : "-";
                });
            });
            rows.push({ case: c, forms });
        });
        return rows;
    };

    const mapForms = (inflections) => {
        if (!inflections) return {};
        if (pos === "VERB") return mapVerbForms(inflections);
        if (["ADJECTIVE", "NOUN", "PRONOUN", "NUMERAL"].includes(pos))
            return mapGenderCaseForms(inflections);
        if (pos === "ADVERB") return inflections.list || inflections || [];
        return {};
    };

    const renderVerbTense = (label, groups, key) => (
        <div className="tense-section">
            <button className="tense-toggle" onClick={() => toggle(key)}>
                {label} <span className={`chevron ${open[key] ? "open" : ""}`}>⌄</span>
            </button>
            <div className={`collapse ${open[key] ? "open" : ""}`}>
                {groups.length === 0 && <p className="muted">No forms</p>}
                {groups.map((g, i) => (
                    <div key={i} className="mood-block">
                        {g.mood !== "unspecified" && <div className="mood-title">{g.mood}</div>}
                        <Table
                            rows={g.forms}
                            columns={[
                                { label: "Pronoun", key: "pronoun" },
                                { label: "Form", key: "form" },
                            ]}
                            rowKeyLabel=""
                            showPronounColumn={true}
                        />
                    </div>
                ))}
            </div>
        </div>
    );

    const renderInflections = (inflections) => {
        const m = mapForms(inflections);
        if (pos === "VERB") {
            return (
                <>
                    {renderVerbTense("Present", m.present, "present")}
                    {renderVerbTense("Past", m.past, "past")}
                    {renderVerbTense("Future", m.future, "future")}
                    <div className="tense-section">
                        <button className="tense-toggle" onClick={() => toggle("other")}>
                            Other Forms <span className={`chevron ${open["other"] ? "open" : ""}`}>⌄</span>
                        </button>
                        <div className={`collapse ${open["other"] ? "open" : ""}`}>
                            {Object.entries(m.unspecified).map(([mood, rows]) =>
                                rows.length ? (
                                    <div key={mood} className="mood-block">
                                        <div className="mood-title">{mood}</div>
                                        <Table
                                            rows={rows}
                                            columns={[
                                                { label: "Pronoun", key: "pronoun" },
                                                { label: "Form", key: "form" },
                                            ]}
                                            rowKeyLabel=""
                                            showPronounColumn={true}
                                        />
                                    </div>
                                ) : null
                            )}
                        </div>
                    </div>
                </>
            );
        }
        if (["ADJECTIVE", "NOUN", "PRONOUN", "NUMERAL"].includes(pos)) {
            return <Table rows={m} columns={genderColumns} rowKeyLabel="Case" />;
        }
        if (pos === "ADVERB") {
            return <div>{m.length ? <p>{m.map(f => f?.form || "-").join(", ")}</p> : <p className="muted">No forms</p>}</div>;
        }
        return null;
    };

    return (
        <div className="conjugator-container">
            <h1 className="title">🛠️ Conjugator Workbench</h1>
            <div className="controls">
                <input
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    placeholder="Enter word..."
                />
                <select value={pos} onChange={(e) => setPos(e.target.value)}>
                    {posOptions.map((p) => (
                        <option key={p}>{p}</option>
                    ))}
                </select>
                <button onClick={handleFetch} disabled={loading}>
                    {loading ? "Fetching..." : "Get Forms"}
                </button>
            </div>
            {error && <p className="error">{error}</p>}
            {results && (
                <div className="results">
                    <h2>
                        {results.lemma} ({results.partOfSpeech}) — Total Forms: {results.totalForms}
                    </h2>
                    <div className="full-width-sections">{renderInflections(results.inflections)}</div>
                </div>
            )}
        </div>
    );
};

export default Conjugator;
