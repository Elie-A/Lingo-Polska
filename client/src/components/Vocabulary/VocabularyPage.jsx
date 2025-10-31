import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import FilterDropdown from "../FilterDropdown/FilterDropdown";
import "./Vocabulary.css";

const pageSize = 50;

const VocabularyPage = () => {
    const [vocabularies, setVocabularies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("");
    const [level, setLevel] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expandedCategories, setExpandedCategories] = useState({});
    const [allExpanded, setAllExpanded] = useState(true);

    useEffect(() => {
        const fetchVocabularies = async () => {
            setLoading(true);
            setError("");
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/vocabulary`);
                setVocabularies(data);
            } catch (err) {
                setError(err.response?.data?.message || err.message || "Failed to load vocabulary");
            } finally {
                setLoading(false);
            }
        };
        fetchVocabularies();
    }, []);

    const allWords = useMemo(() =>
        vocabularies.flatMap(v => (v.words || []).map(w => ({ ...w, category: v._id }))),
        [vocabularies]
    );

    const uniqueCategories = useMemo(() =>
        ["", ...new Set(allWords.map(w => w.category?.trim() || "Uncategorized"))].sort(),
        [allWords]
    );

    const uniqueLevels = ["", "A1", "A2", "B1", "B2", "C1", "C2"];

    const filteredWords = useMemo(() =>
        allWords.filter(w => {
            const matchesSearch = w.polish.toLowerCase().includes(searchTerm.toLowerCase()) ||
                w.english.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = category ? w.category === category : true;
            const matchesLevel = level ? w.level === level : true;
            return matchesSearch && matchesCategory && matchesLevel;
        }),
        [allWords, searchTerm, category, level]
    );

    const totalPages = Math.ceil(filteredWords.length / pageSize);

    const paginatedWords = useMemo(() =>
        filteredWords.slice((currentPage - 1) * pageSize, currentPage * pageSize),
        [filteredWords, currentPage]
    );

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);

    const groupedWords = useMemo(() =>
        paginatedWords.reduce((acc, w) => {
            const cat = w.category || "Uncategorized";
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(w);
            return acc;
        }, {}),
        [paginatedWords]
    );

    // Initialize all categories as expanded/collapsed based on screen size
    useEffect(() => {
        const categories = Object.keys(groupedWords);
        if (categories.length > 0) {
            const initialState = {};
            const isDesktop = window.innerWidth > 768;
            categories.forEach(cat => {
                initialState[cat] = isDesktop;
            });
            setExpandedCategories(initialState);
            setAllExpanded(isDesktop);
        }
    }, [groupedWords]);

    const toggleCategory = (cat) => {
        setExpandedCategories(prev => {
            const newState = {
                ...prev,
                [cat]: !prev[cat]
            };
            // Check if all categories have the same state
            const allSame = Object.values(newState).every(val => val === newState[cat]);
            if (allSame) {
                setAllExpanded(newState[cat]);
            }
            return newState;
        });
    };

    const toggleAllCategories = () => {
        const newState = !allExpanded;
        const categories = Object.keys(groupedWords);
        const updatedState = {};
        categories.forEach(cat => {
            updatedState[cat] = newState;
        });
        setExpandedCategories(updatedState);
        setAllExpanded(newState);
    };

    if (loading) {
        return <div className="loading">Loading vocabulary...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="vocab-page">
            <header>
                <h1>📚 Polish Vocabulary</h1>
                <p>Explore and filter vocabulary by category or CEFR level.</p>
            </header>

            <div className="filters">
                <input
                    type="text"
                    placeholder="🔍 Search Polish or English..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />
                <FilterDropdown
                    options={uniqueCategories}
                    selected={category}
                    onChange={(value) => {
                        setCategory(value);
                        setCurrentPage(1);
                    }}
                    placeholder="All Categories"
                />
                <FilterDropdown
                    options={uniqueLevels}
                    selected={level}
                    onChange={(value) => {
                        setLevel(value);
                        setCurrentPage(1);
                    }}
                    placeholder="All Levels"
                />
            </div>

            {Object.keys(groupedWords).length > 1 && (
                <div className="expand-collapse-controls">
                    <button
                        className="expand-collapse-btn"
                        onClick={toggleAllCategories}
                        aria-label={allExpanded ? "Collapse all categories" : "Expand all categories"}
                    >
                        {allExpanded ? "▼ Collapse All" : "▶ Expand All"}
                    </button>
                    <span className="vocab-count">
                        {filteredWords.length} word{filteredWords.length !== 1 ? 's' : ''} found
                    </span>
                </div>
            )}

            <div className="vocab-list">
                {Object.keys(groupedWords).length === 0 ? (
                    <div className="no-results">
                        <p>No vocabulary found matching your filters.</p>
                    </div>
                ) : (
                    Object.entries(groupedWords).map(([cat, words]) => (
                        <div key={cat} className="vocab-group">
                            <h2
                                className={`category-toggle ${expandedCategories[cat] ? 'open' : ''}`}
                                onClick={() => toggleCategory(cat)}
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        toggleCategory(cat);
                                    }
                                }}
                                aria-expanded={expandedCategories[cat]}
                                aria-label={`${cat} category with ${words.length} words`}
                            >
                                <span>{cat} ({words.length})</span>
                                <span className="arrow">
                                    {expandedCategories[cat] ? '▼' : '▶'}
                                </span>
                            </h2>
                            <ul className={`category-container ${expandedCategories[cat] ? 'expanded' : ''}`}>
                                {words.map((w) => (
                                    <li key={w._id || `${w.polish}-${w.english}`}>
                                        <span className="word-pair">
                                            <strong>{w.polish}</strong> — {w.english}
                                        </span>
                                        <span className="word-level">
                                            {w.level || "–"}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                )}
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            className={currentPage === i + 1 ? "active" : ""}
                            onClick={() => setCurrentPage(i + 1)}
                            aria-label={`Go to page ${i + 1}`}
                            aria-current={currentPage === i + 1 ? "page" : undefined}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VocabularyPage;