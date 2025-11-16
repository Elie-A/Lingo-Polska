import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import FilterDropdown from "../FilterDropdown/FilterDropdown";
import "./Vocabulary.css";

const pageSize = 100;

// Debounce hook
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

const VocabularyPage = () => {
    const [vocabularies, setVocabularies] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: pageSize,
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("");
    const [level, setLevel] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expandedCategories, setExpandedCategories] = useState({});
    const [allExpanded, setAllExpanded] = useState(false);

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Fetch vocabularies from backend
    const fetchVocabularies = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const params = {
                page: currentPage,
                limit: pageSize,
            };
            if (debouncedSearchTerm) params.q = debouncedSearchTerm;
            if (level) params.level = level;
            if (category) params.category = category;

            const { data } = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/vocabulary/search`,
                { params }
            );

            setVocabularies(data.data.data || []);
            setPagination(data.data.pagination || {
                currentPage,
                totalPages: 1,
                totalItems: data.data.data.length || 0,
                itemsPerPage: pageSize,
            });
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to load vocabulary");
        } finally {
            setLoading(false);
        }
    }, [debouncedSearchTerm, level, category, currentPage]);

    useEffect(() => {
        fetchVocabularies();
    }, [fetchVocabularies]);

    // Group vocabularies by category
    const groupedWords = useMemo(() => {
        return vocabularies.reduce((acc, w) => {
            const cat = w.category || "Uncategorized";
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(w);
            return acc;
        }, {});
    }, [vocabularies]);

    const uniqueLevels = ["", "A1", "A2", "B1", "B2", "C1", "C2"];

    // Manage category expand/collapse state
    useEffect(() => {
        const categories = Object.keys(groupedWords);
        if (categories.length > 0) {
            setExpandedCategories((prev) => {
                const newState = { ...prev };
                categories.forEach((cat) => {
                    if (!(cat in newState)) newState[cat] = false;
                });
                return newState;
            });
        }
    }, [groupedWords]);

    const toggleCategory = useCallback((cat) => {
        setExpandedCategories((prev) => {
            const newState = { ...prev, [cat]: !prev[cat] };
            const allSame = Object.values(newState).every((val) => val === newState[cat]);
            setAllExpanded(allSame ? newState[cat] : false);
            return newState;
        });
    }, []);

    const toggleAllCategories = useCallback(() => {
        const newState = !allExpanded;
        const categories = Object.keys(groupedWords);
        const updatedState = {};
        categories.forEach((cat) => (updatedState[cat] = newState));
        setExpandedCategories(updatedState);
        setAllExpanded(newState);
    }, [allExpanded, groupedWords]);

    const handleSearchChange = useCallback((e) => setSearchTerm(e.target.value), []);
    const handleCategoryChange = useCallback((value) => setCategory(value), []);
    const handleLevelChange = useCallback((value) => setLevel(value), []);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchTerm, category, level]);

    if (loading) return <div className="loading">Loading vocabulary...</div>;
    if (error) return <div className="error">{error}</div>;

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
                    options={["", ...Object.keys(groupedWords).sort()]}
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
                        {pagination.totalItems} word{pagination.totalItems !== 1 ? "s" : ""} found
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
                                className={`category-toggle ${expandedCategories[cat] ? "open" : ""}`}
                                onClick={() => toggleCategory(cat)}
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter" || e.key === " ") toggleCategory(cat);
                                }}
                                aria-expanded={expandedCategories[cat]}
                                aria-label={`${cat} category with ${words.length} words`}
                            >
                                <span>{cat} ({words.length})</span>
                                <span className="arrow">{expandedCategories[cat] ? "▼" : "▶"}</span>
                            </h2>
                            <ul className={`category-container ${expandedCategories[cat] ? "expanded" : ""}`}>
                                {words.map((w) => (
                                    <li key={w._id || `${w.polish}-${w.english}`}>
                                        <span className="word-pair">
                                            <strong>{w.polish}</strong> — {w.english}
                                        </span>
                                        <span className="word-level">{w.level || "–"}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
                <div className="pagination">
                    <button
                        disabled={pagination.currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                        Previous
                    </button>
                    <span>
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <button
                        disabled={pagination.currentPage === pagination.totalPages}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default VocabularyPage;