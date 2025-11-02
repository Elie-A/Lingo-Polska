import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import FilterDropdown from "../FilterDropdown/FilterDropdown";
import "./Vocabulary.css";

const pageSize = 50;

// Debounce hook
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const VocabularyPage = () => {
    const [vocabularies, setVocabularies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("");
    const [level, setLevel] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expandedCategories, setExpandedCategories] = useState({});
    const [allExpanded, setAllExpanded] = useState(false);

    // Debounce search term for better performance
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

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

    const uniqueCategories = useMemo(() => {
        const cats = new Set(allWords.map(w => w.category?.trim() || "Uncategorized"));
        return ["", ...Array.from(cats).sort()];
    }, [allWords]);

    const uniqueLevels = ["", "A1", "A2", "B1", "B2", "C1", "C2"];

    const filteredWords = useMemo(() => {
        if (!debouncedSearchTerm && !category && !level) {
            return allWords;
        }

        const searchLower = debouncedSearchTerm.toLowerCase();
        return allWords.filter(w => {
            if (debouncedSearchTerm &&
                !w.polish.toLowerCase().includes(searchLower) &&
                !w.english.toLowerCase().includes(searchLower)) {
                return false;
            }
            if (category && w.category !== category) {
                return false;
            }
            if (level && w.level !== level) {
                return false;
            }
            return true;
        });
    }, [allWords, debouncedSearchTerm, category, level]);

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

    // Initialize categories as collapsed by default for better performance
    useEffect(() => {
        const categories = Object.keys(groupedWords);
        if (categories.length > 0) {
            setExpandedCategories(prev => {
                const newState = { ...prev };
                categories.forEach(cat => {
                    if (!(cat in newState)) {
                        newState[cat] = false;
                    }
                });
                return newState;
            });
        }
    }, [groupedWords]);

    const toggleCategory = useCallback((cat) => {
        setExpandedCategories(prev => {
            const newState = { ...prev, [cat]: !prev[cat] };
            const allSame = Object.values(newState).every(val => val === newState[cat]);
            setAllExpanded(allSame ? newState[cat] : false);
            return newState;
        });
    }, []);

    const toggleAllCategories = useCallback(() => {
        const newState = !allExpanded;
        const categories = Object.keys(groupedWords);
        const updatedState = {};
        categories.forEach(cat => {
            updatedState[cat] = newState;
        });
        setExpandedCategories(updatedState);
        setAllExpanded(newState);
    }, [allExpanded, groupedWords]);

    const handleSearchChange = useCallback((e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    }, []);

    const handleCategoryChange = useCallback((value) => {
        setCategory(value);
        setCurrentPage(1);
    }, []);

    const handleLevelChange = useCallback((value) => {
        setLevel(value);
        setCurrentPage(1);
    }, []);

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
                    onChange={handleSearchChange}
                />
                <FilterDropdown
                    options={uniqueCategories}
                    selected={category}
                    onChange={handleCategoryChange}
                    placeholder="All Categories"
                />
                <FilterDropdown
                    options={uniqueLevels}
                    selected={level}
                    onChange={handleLevelChange}
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