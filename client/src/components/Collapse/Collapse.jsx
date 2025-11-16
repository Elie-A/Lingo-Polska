import React, { useState } from "react";
import "./CollapseHeader.css";
import "./CollapseContent.css";
import "./ExerciseTable.css";

const Collapse = ({ data }) => {
    const [openIndex, setOpenIndex] = useState(null);
    const exercises = Array.isArray(data) ? data : [];

    const toggleCollapse = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const normalize = (str = "") =>
        str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const highlightStemEnding = (polish = "", stem = "", ending = "", polishRest = "") => {
        if (!stem) return polish || "";

        const fullVerb = stem + ending;
        const normalizedPolish = normalize(polish);
        const normalizedFullVerb = normalize(fullVerb);
        const matchIndex = normalizedPolish.indexOf(normalizedFullVerb);

        if (matchIndex === -1)
            return (
                <>
                    {polish}
                    {polishRest && <span className="polish-rest">{polishRest}</span>}
                </>
            );

        return (
            <>
                {polish.slice(0, matchIndex)}
                <span className="stem">{stem}</span>
                {ending && <span className="ending">{ending}</span>}
                {polish.slice(matchIndex + fullVerb.length)}
                {polishRest && <span className="polish-rest">{polishRest}</span>}
            </>
        );
    };

    const getGenderClass = (gender) => {
        if (!gender) return "";
        const normalized = gender.toLowerCase().trim();
        if (normalized.includes("męski") || normalized.includes("masculine") || normalized === "m") {
            return "gender-masculine";
        }
        if (normalized.includes("żeński") || normalized.includes("feminine") || normalized === "f") {
            return "gender-feminine";
        }
        if (normalized.includes("nijaki") || normalized.includes("neuter") || normalized === "n") {
            return "gender-neuter";
        }
        return "";
    };

    const getChangeTypeClass = (changeType) => {
        if (!changeType) return "";
        const normalized = changeType.toLowerCase();

        if (normalized.includes("impersonal")) {
            return "change-type-cell type-impersonal";
        }
        if (normalized.includes("quantifier")) {
            return "change-type-cell type-quantifier";
        }
        if (normalized.includes("/")) {
            return "change-type-cell type-mixed";
        }
        return "change-type-cell type-adverb";
    };

    const highlightComparativeChanges = (text) => {
        if (!text) return text;

        const irregulars = ['lepiej', 'więcej', 'mniej', 'gorzej'];
        const hasIrregular = irregulars.some(irr => text.toLowerCase().includes(irr));

        if (hasIrregular) {
            return (
                <>
                    {text}
                    <span className="irregular-badge">IRREGULAR</span>
                </>
            );
        }

        const parts = text.split(/(\w+iej)/gi);
        return parts.map((part, idx) => {
            if (/\w+iej/i.test(part)) {
                return <span key={idx} className="comparative-highlight">{part}</span>;
            }
            return part;
        });
    };

    const highlightAdverbsInText = (polish, adverb, modifies) => {
        if (!polish || !adverb) return polish;

        const adverbs = adverb.split(',').map(a => a.trim());
        const modifiedWords = modifies ? modifies.split(',').map(m => m.trim()) : [];

        let result = polish;
        adverbs.forEach((adv, idx) => {
            const regex = new RegExp(`\\b${adv}\\b`, 'gi');
            const modified = modifiedWords[idx] || '';
            result = result.replace(regex,
                `<span class="highlighted-adverb" data-modifies="modifies: ${modified}">${adv}</span>`
            );
        });

        return <span dangerouslySetInnerHTML={{ __html: result }} />;
    };

    const renderMultipleAdverbs = (adverbs) => {
        if (!adverbs) return "-";
        const advList = adverbs.split(',').map(a => a.trim());

        if (advList.length === 1) {
            return adverbs;
        }

        return (
            <div className="multiple-adverbs">
                {advList.map((adv, idx) => (
                    <span key={idx} className="adverb-item">{adv}</span>
                ))}
            </div>
        );
    };

    const getSpeakerClass = (speaker) => {
        const speakerMap = {
            'Peter': 'speaker-a',
            'Wojtek': 'speaker-b',
            'Agnieszka': 'speaker-c',
            'Anna': 'speaker-d'
        };
        return speakerMap[speaker] || 'speaker-a';
    };

    const getSpeakerInitials = (speaker) => {
        if (!speaker) return '?';
        return speaker.charAt(0).toUpperCase();
    };

    const parsePrompt = (prompt) => {
        if (!prompt) return prompt;

        let result = prompt;

        result = result.replace(/\(([^)]+)\)/g,
            '<span class="prompt-parenthesis">($1)</span>');

        result = result.replace(/\[([^\]]+)\]/g, (match, content) => {
            if (/^(a little|a lot|very well|fluently|quite well|too well|extremely well|well)$/i.test(content.trim())) {
                return `<span class="english-hint">[${content}]</span>`;
            }
            return `<span class="verb-infinitive">[${content}]</span>`;
        });

        return <span dangerouslySetInnerHTML={{ __html: result }} />;
    };

    const parseGrammarNotes = (notes) => {
        if (!notes) return notes;

        const cases = [
            'Nominative', 'Genitive', 'Dative', 'Accusative',
            'Instrumental', 'Locative', 'Vocative'
        ];

        let result = notes;
        cases.forEach(caseName => {
            const regex = new RegExp(`\\b${caseName}\\b`, 'gi');
            result = result.replace(regex, `<span class="case-highlight">${caseName}</span>`);
        });

        return <span dangerouslySetInnerHTML={{ __html: result }} />;
    };

    const highlightDegrees = (polish, baseForm) => {
        if (!polish) return polish;

        const irregularForms = ['lepiej', 'najlepiej', 'więcej', 'najwięcej', 'mniej', 'najmniej', 'gorzej', 'najgorzej', 'dalej', 'najdalej'];

        let result = polish;

        // Highlight superlatives (naj- prefix)
        result = result.replace(/\b(naj\w+iej)\b/gi, (match) => {
            const isIrregular = irregularForms.includes(match.toLowerCase());
            const className = isIrregular ? 'irregular-inline superlative-inline' : 'superlative-inline';
            return `<span class="${className}">${match}</span>`;
        });

        // Highlight irregular superlatives without -iej
        ['najlepiej', 'najwięcej', 'najmniej', 'najgorzej', 'najdalej'].forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            result = result.replace(regex, (match) => {
                if (result.indexOf(`<span`) !== -1 && result.indexOf(match) > result.lastIndexOf(`<span`)) {
                    return match;
                }
                return `<span class="irregular-inline superlative-inline">${match}</span>`;
            });
        });

        // Highlight comparatives (words ending in -iej but not starting with naj-)
        result = result.replace(/\b(?!naj)(\w+iej)\b/gi, (match) => {
            if (result.indexOf(match) > 0 && result.substring(result.indexOf(match) - 50, result.indexOf(match)).includes('<span')) {
                return match;
            }
            const isIrregular = irregularForms.includes(match.toLowerCase());
            const className = isIrregular ? 'irregular-inline comparative-inline' : 'comparative-inline';
            return `<span class="${className}">${match}</span>`;
        });

        // Highlight irregular comparatives
        ['lepiej', 'więcej', 'mniej', 'gorzej', 'dalej', 'bliżej'].forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            result = result.replace(regex, (match) => {
                if (result.indexOf(`<span`) !== -1 && result.indexOf(match) > result.lastIndexOf(`<span`)) {
                    return match;
                }
                return `<span class="irregular-inline comparative-inline">${match}</span>`;
            });
        });

        // Highlight base forms if provided
        if (baseForm) {
            const baseForms = baseForm.split(',').map(b => b.trim());
            baseForms.forEach(base => {
                const regex = new RegExp(`\\b${base}\\b`, 'gi');
                result = result.replace(regex, (match) => {
                    if (result.indexOf(`<span`) !== -1 && result.indexOf(match) > result.lastIndexOf(`<span`)) {
                        return match;
                    }
                    return `<span class="base-inline">${match}</span>`;
                });
            });
        }

        return <span className="polish-with-degrees" dangerouslySetInnerHTML={{ __html: result }} />;
    };

    return (
        <div className="collapse-container">
            {exercises.map((exerciseData, idx) => {
                const rows = Array.isArray(exerciseData.rows) ? exerciseData.rows : [];

                const allKeys = rows.reduce((acc, row) => {
                    Object.keys(row).forEach((k) => {
                        if (!acc.includes(k)) acc.push(k);
                    });
                    return acc;
                }, []);

                const extraColumns = allKeys.filter(
                    (key) => !["polish", "stem", "ending", "english", "polishRest", "speaker"].includes(key)
                );

                const hasStemData = rows.some((r) => r.stem);
                const isPluralExercise = exerciseData.goal === "plural";

                // Check for different exercise types
                const hasTransformations = rows.some((r) => r["change type"]);
                const hasComparatives = rows.some((r) => r.comparative);
                const hasAdverbIdentification = rows.some((r) => r.adverb && r.modifies);
                const isDialogue = rows.some((r) => r.speaker);
                const hasCompleteForms = rows.some((r) => r.prompt && r.grammar_notes);
                const hasDegrees = rows.some((r) => r["base form"]);

                return (
                    <div className="collapse" key={idx}>
                        <h2
                            className={`collapse-header ${openIndex === idx ? "active" : ""}`}
                            onClick={() => toggleCollapse(idx)}
                        >
                            {exerciseData.exercise || `Exercise ${idx + 1}`}{" "}
                            <span className="toggle-btn">
                                {openIndex === idx ? "−" : "+"}
                            </span>
                        </h2>

                        <div className={`collapse-content ${openIndex === idx ? "open" : ""}`}>
                            {/* Transformation Legend */}
                            {hasTransformations && openIndex === idx && (
                                <div className="transformation-legend">
                                    <div className="legend-item">
                                        <div className="legend-color impersonal"></div>
                                        <span>Impersonal</span>
                                    </div>
                                    <div className="legend-item">
                                        <div className="legend-color adverb"></div>
                                        <span>Adjective → Adverb</span>
                                    </div>
                                    <div className="legend-item">
                                        <div className="legend-color mixed"></div>
                                        <span>Mixed Usage</span>
                                    </div>
                                    <div className="legend-item">
                                        <div className="legend-color quantifier"></div>
                                        <span>Quantifier</span>
                                    </div>
                                </div>
                            )}

                            {/* Comparative Legend */}
                            {hasComparatives && openIndex === idx && (
                                <div className="comparative-legend">
                                    <div className="legend-item">
                                        <div className="legend-color base"></div>
                                        <span>Base Form (Positive)</span>
                                    </div>
                                    <div className="legend-item">
                                        <div className="legend-color comparative"></div>
                                        <span>Comparative Form</span>
                                    </div>
                                    <div className="legend-item">
                                        <span className="irregular-badge">IRREGULAR</span>
                                        <span>Irregular Comparative</span>
                                    </div>
                                </div>
                            )}

                            {/* Adverb Identification Legend */}
                            {hasAdverbIdentification && openIndex === idx && (
                                <div className="adverb-identification-legend">
                                    <div className="legend-item">
                                        <div className="legend-color adverb-id"></div>
                                        <span>Adverb</span>
                                    </div>
                                    <span className="legend-arrow">→</span>
                                    <div className="legend-item">
                                        <div className="legend-color modifies"></div>
                                        <span>Modified Word</span>
                                    </div>
                                    <div className="legend-item" style={{ fontStyle: 'italic', color: '#6b7280' }}>
                                        <span>💡 Hover over highlighted words for connections</span>
                                    </div>
                                </div>
                            )}

                            {/* Complete Forms Legend */}
                            {hasCompleteForms && openIndex === idx && (
                                <>
                                    <div className="exercise-instructions">
                                        <strong>Instructions:</strong> Complete the sentences by conjugating the verbs in brackets
                                        and translating the English words. Use the grammar notes to check your case usage.
                                    </div>

                                    <div className="complete-forms-legend">
                                        <div className="legend-item">
                                            <div className="legend-color prompt"></div>
                                            <span>Prompt (Fill in the blanks)</span>
                                        </div>
                                        <div className="legend-item">
                                            <div className="legend-color answer"></div>
                                            <span>Completed Answer</span>
                                        </div>
                                        <div className="legend-item">
                                            <div className="legend-color grammar"></div>
                                            <span>Grammar Notes</span>
                                        </div>
                                        <div className="legend-item">
                                            <span className="prompt-parenthesis">(Subject)</span>
                                            <span className="verb-infinitive">[Verb]</span>
                                            <span className="english-hint">[English]</span>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Degrees Legend */}
                            {hasDegrees && openIndex === idx && (
                                <>
                                    <div className="degrees-info-box">
                                        <strong>Degrees of Comparison:</strong> This exercise shows adverbs in their positive (base),
                                        comparative, and superlative forms. Hover over highlighted words to see their degree.
                                    </div>

                                    <div className="degrees-legend">
                                        <div className="legend-item">
                                            <span className="legend-sample base">dobrze</span>
                                            <span>Positive (Base)</span>
                                        </div>
                                        <div className="legend-item">
                                            <span className="legend-sample comparative">lepiej</span>
                                            <span>Comparative</span>
                                        </div>
                                        <div className="legend-item">
                                            <span className="legend-sample superlative">najlepiej</span>
                                            <span>Superlative</span>
                                        </div>
                                        <div className="legend-item">
                                            <span className="legend-sample irregular">więcej</span>
                                            <span>Irregular Form</span>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Dialogue Rendering */}
                            {isDialogue && openIndex === idx ? (
                                <>
                                    <div className="dialogue-legend">
                                        <span style={{ fontWeight: 600, marginRight: '0.5rem' }}>Speakers:</span>
                                        {[...new Set(rows.map(r => r.speaker).filter(Boolean))].map((speaker, sIdx) => (
                                            <div key={sIdx} className="dialogue-legend-speaker">
                                                <div className={`dialogue-legend-avatar ${getSpeakerClass(speaker)}`}>
                                                    {getSpeakerInitials(speaker)}
                                                </div>
                                                <span style={{ fontWeight: 600 }}>{speaker}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="dialogue-container">
                                        {rows.map((row, rIdx) => {
                                            const speakerClass = getSpeakerClass(row.speaker);
                                            return (
                                                <div key={rIdx} className={`dialogue-entry ${speakerClass}`}>
                                                    <div className={`speaker-avatar ${speakerClass}`}>
                                                        {getSpeakerInitials(row.speaker)}
                                                        <div className="speaker-name">{row.speaker}</div>
                                                    </div>
                                                    <div className="speech-bubble-container">
                                                        <div className="speech-bubble polish">
                                                            <div className="bubble-text polish-text">
                                                                {row.polish || "-"}
                                                            </div>
                                                        </div>
                                                        <div className="speech-bubble english">
                                                            <div className="bubble-text english-text">
                                                                {row.english || "-"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            ) : (
                                <div className="exercise-card">
                                    <div className="exercise-card-content">
                                        <div className="table-wrapper">
                                            <table className="exercise-table">
                                                <thead>
                                                    <tr>
                                                        <th>Polish</th>
                                                        <th>English</th>
                                                        {extraColumns.map((col) => (
                                                            <th key={col}>
                                                                {col[0].toUpperCase() + col.slice(1)}
                                                            </th>
                                                        ))}
                                                        {isPluralExercise && hasStemData && <th>Plural</th>}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {rows.length > 0 ? (
                                                        rows.map((row, rIdx) => (
                                                            <tr key={rIdx}>
                                                                <td className={`polish ${row.adverb ? "polish-with-adverb-highlight" : ""} ${row.prompt ? "answer-cell" : ""}`}>
                                                                    {row["base form"] ?
                                                                        highlightDegrees(row.polish || "", row["base form"]) :
                                                                        (row.adverb ?
                                                                            highlightAdverbsInText(row.polish || "", row.adverb, row.modifies) :
                                                                            highlightStemEnding(
                                                                                row.polish || "",
                                                                                row.stem || "",
                                                                                row.ending || ""
                                                                            )
                                                                        )
                                                                    }
                                                                </td>
                                                                <td>{row.english || "-"}</td>
                                                                {extraColumns.map((col) => {
                                                                    let cellClass = "";
                                                                    let cellContent = row[col] || "-";

                                                                    if (col === "gender") {
                                                                        cellClass = getGenderClass(row[col]);
                                                                    } else if (col === "change type") {
                                                                        cellClass = getChangeTypeClass(row[col]);
                                                                    } else if (col === "transformed") {
                                                                        cellClass = "transformed-cell adverb-form";
                                                                    } else if (col === "adjective") {
                                                                        cellClass = "adjective-base";
                                                                    } else if (col === "comparative") {
                                                                        cellClass = "comparative-cell";
                                                                        cellContent = highlightComparativeChanges(row[col]);
                                                                    } else if (col === "polish" && row.comparative) {
                                                                        cellClass = "base-form-cell";
                                                                    } else if (col === "adverb") {
                                                                        cellClass = "adverb-cell";
                                                                        cellContent = renderMultipleAdverbs(row[col]);
                                                                    } else if (col === "modifies") {
                                                                        cellClass = "modifies-cell";
                                                                        cellContent = renderMultipleAdverbs(row[col]);
                                                                    } else if (col === "prompt") {
                                                                        cellClass = "prompt-cell";
                                                                        cellContent = parsePrompt(row[col]);
                                                                    } else if (col === "grammar_notes") {
                                                                        cellClass = "grammar-notes-cell";
                                                                        cellContent = parseGrammarNotes(row[col]);
                                                                    } else if (col === "base form") {
                                                                        cellClass = "base-form-reference-cell";
                                                                    }

                                                                    return (
                                                                        <td key={col} className={cellClass}>
                                                                            {cellContent}
                                                                        </td>
                                                                    );
                                                                })}
                                                                {isPluralExercise && hasStemData && (
                                                                    <td className="polish">
                                                                        <span className="stem">{row.stem || ""}</span>
                                                                        <span className="ending">{row.ending || ""}</span>
                                                                    </td>
                                                                )}
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td
                                                                colSpan={
                                                                    2 + extraColumns.length + (isPluralExercise && hasStemData ? 1 : 0)
                                                                }
                                                                style={{ textAlign: "center" }}
                                                            >
                                                                No rows available
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Collapse;