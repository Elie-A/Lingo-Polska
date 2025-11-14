import React, { useState } from "react";
import axios from "axios";
import "./Conjugator.css";

const posOptions = ["VERB", "NOUN", "ADJECTIVE", "ADVERB", "PRONOUN", "NUMERAL"];
const pronounOrder = ["ja", "ty", "on/ona/ono", "my", "wy", "oni/one"];
const nounCases = ["nominative", "genitive", "dative", "accusative", "instrumental", "locative", "vocative"];
const genders = ["m", "f", "n"];
const numbers = ["singular", "plural"];

// --------- Utility Functions ---------

const pronounFrom = (f) => {
    if (f.person === "first" && f.number === "singular") return "ja";
    if (f.person === "second" && f.number === "singular") return "ty";
    if (f.person === "third" && f.number === "singular") return "on/ona/ono";
    if (f.person === "first" && f.number === "plural") return "my";
    if (f.person === "second" && f.number === "plural") return "wy";
    if (f.person === "third" && f.number === "plural") return "oni/one";
    return "-";
};

const detectGenderFromForm = (form) => {
    if (!form) return "-";
    const s = form.toLowerCase();
    if (s.endsWith("łem") || s.endsWith("łeś") || s.endsWith("liśmy")) return "m";
    if (s.endsWith("łam") || s.endsWith("łaś") || s.endsWith("łyśmy")) return "f";
    if (s.endsWith("ło") || s.endsWith("łoś") || s.endsWith("łom")) return "n";
    return "-";
};

const aggregateRows = (rows) => {
    const map = new Map();
    rows.forEach((r) => {
        const key = `${r.pronoun}|${r.gender}`;
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(r.form);
    });
    return Array.from(map.entries())
        .map(([key, forms]) => {
            const [pronoun, gender] = key.split("|");
            return { pronoun, gender, form: forms.join(", ") };
        })
        .sort((a, b) => pronounOrder.indexOf(a.pronoun) - pronounOrder.indexOf(b.pronoun));
};

// --------- Table Component ---------

const Table = ({ rows, columns, rowKeyLabel = "Case" }) => (
    <div className="table-wrapper">
        <table className="inflection-table">
            <thead>
                <tr>
                    <th>{rowKeyLabel}</th>
                    {columns.map((col) => (
                        <th key={col.key}>{col.label}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((r, i) => (
                    <tr key={i}>
                        <td>{r.case || r.label || r.pronoun}</td>
                        {columns.map((col) => (
                            <td key={col.key}>{r.forms?.[col.key] || r.form || "-"}</td>
                        ))}
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
        if (!word.trim()) return;
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

    // --------- Mapping Functions ---------

    const mapVerbForms = (inflections) => {
        const mapped = { present: [], past: [], future: [], unspecified: {} };
        ["present", "past", "future"].forEach((tense) => {
            if (!inflections[tense]) return;
            Object.entries(inflections[tense]).forEach(([mood, items]) => {
                const rows = items
                    .filter((i) => i.form)
                    .map((i) => ({
                        pronoun: pronounFrom(i),
                        gender: i.gender?.[0] || detectGenderFromForm(i.form),
                        form: i.form,
                    }));
                mapped[tense].push({ mood, forms: aggregateRows(rows) });
            });
        });
        if (inflections.unspecified) {
            Object.entries(inflections.unspecified).forEach(([mood, items]) => {
                const rows = items
                    .filter((i) => i.form)
                    .map((i) => ({
                        pronoun: pronounFrom(i),
                        gender: i.gender?.[0] || detectGenderFromForm(i.form),
                        form: i.form,
                    }));
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
                        filtered.length > 0
                            ? filtered.map((f) => f.form).join(", ")
                            : "-";
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

    // --------- Rendering ---------

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
                                { label: "Gender", key: "gender" },
                                { label: "Form", key: "form" },
                            ]}
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
                                                { label: "Gender", key: "gender" },
                                                { label: "Form", key: "form" },
                                            ]}
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
            return <div>{m.length ? <p>{m.join(", ")}</p> : <p className="muted">No forms</p>}</div>;
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
