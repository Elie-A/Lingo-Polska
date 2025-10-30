import React, { useEffect, useState, useRef } from "react";
import "./Vocabulary.css";

const VocabularyPage = () => {
    const [vocabularies, setVocabularies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("");
    const [level, setLevel] = useState("");
    const [expandedCategories, setExpandedCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Custom dropdowns state & refs
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false);
    const categoryDropdownRef = useRef(null);
    const levelDropdownRef = useRef(null);

    const pageSize = 100;

    // Fetch data
    useEffect(() => {
        fetchVocabularies();

        const handleClickOutside = (e) => {
            if (
                categoryDropdownRef.current &&
                !categoryDropdownRef.current.contains(e.target)
            ) {
                setIsCategoryDropdownOpen(false);
            }
            if (
                levelDropdownRef.current &&
                !levelDropdownRef.current.contains(e.target)
            ) {
                setIsLevelDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchVocabularies = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vocabulary`);
            if (!res.ok) throw new Error("Failed to load vocabulary");
            const data = await res.json();
            setVocabularies(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Filtering logic
    const filteredVocab = vocabularies.filter((v) => {
        const polish = v.polish || "";
        const english = v.english || "";
        const matchesLevel = level ? v.level === level : true;
        const matchesCategory = category ? v.category === category : true;
        const matchesSearch =
            polish.toLowerCase().includes(searchTerm.toLowerCase()) ||
            english.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesLevel && matchesCategory && matchesSearch;
    });

    const totalPages = Math.ceil(filteredVocab.length / pageSize);
    const startIdx = (currentPage - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    const paginatedVocab = filteredVocab.slice(startIdx, endIdx);

    // Group by category
    const groupedVocab = paginatedVocab.reduce((acc, v) => {
        const category = v.category || "Uncategorized";
        if (!acc[category]) acc[category] = [];
        acc[category].push(v);
        return acc;
    }, {});

    const toggleCategory = (category) => {
        setExpandedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Dropdown change handlers
    const handleCustomCategoryChange = (newCategory) => {
        setCategory(newCategory);
        setCurrentPage(1);
        setIsCategoryDropdownOpen(false);
    };

    const handleCustomLevelChange = (newLevel) => {
        setLevel(newLevel);
        setCurrentPage(1);
        setIsLevelDropdownOpen(false);
    };

    // Unique categories and levels
    const uniqueCategories = [
        "",
        ...new Set(vocabularies.map((v) => v.category || "Uncategorized")),
    ].sort((a, b) => {
        if (a === "") return -1;
        if (b === "") return 1;
        return a.localeCompare(b);
    });

    const uniqueLevels = ["", "A1", "A2", "B1", "B2", "C1", "C2"];

    if (loading)
        return (
            <div className="vocab-page">
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Loading vocabulary...</p>
                </div>
            </div>
        );

    if (error)
        return (
            <div className="vocab-page">
                <div className="error">
                    <p>Error: {error}</p>
                    <button className="retry-btn" onClick={fetchVocabularies}>
                        Retry
                    </button>
                </div>
            </div>
        );

    return (
        <div className="vocab-page">
            <header className="vocab-header">
                <h1 className="vocab-title">📚 Polish Vocabulary</h1>
                <p className="vocab-subtitle">
                    Explore and filter vocabulary by category or CEFR level.
                </p>
            </header>

            <div className="vocab-controls">
                {/* Search */}
                <input
                    type="text"
                    placeholder="🔍 Search Polish or English..."
                    className="vocab-search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Category Dropdown */}
                <div className="custom-select-wrapper" ref={categoryDropdownRef}>
                    <button
                        className={`vocab-filter custom-select-button ${isCategoryDropdownOpen ? "open" : ""
                            }`}
                        onClick={() => setIsCategoryDropdownOpen((prev) => !prev)}
                    >
                        {category || "All Categories"}
                        <span style={{ marginLeft: "8px" }}>
                            {isCategoryDropdownOpen ? "▲" : "▼"}
                        </span>
                    </button>
                    {isCategoryDropdownOpen && (
                        <div className="custom-dropdown-list" role="listbox">
                            {uniqueCategories.map((cat) => (
                                <div
                                    key={cat || "all"}
                                    className={`custom-dropdown-item ${cat === category ? "selected" : ""
                                        }`}
                                    onClick={() => handleCustomCategoryChange(cat)}
                                >
                                    {cat || "All Categories"}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Level Dropdown (same design) */}
                <div className="custom-select-wrapper" ref={levelDropdownRef}>
                    <button
                        className={`vocab-filter custom-select-button ${isLevelDropdownOpen ? "open" : ""
                            }`}
                        onClick={() => setIsLevelDropdownOpen((prev) => !prev)}
                    >
                        {level || "All Levels"}
                        <span style={{ marginLeft: "8px" }}>
                            {isLevelDropdownOpen ? "▲" : "▼"}
                        </span>
                    </button>
                    {isLevelDropdownOpen && (
                        <div className="custom-dropdown-list" role="listbox">
                            {uniqueLevels.map((lvl) => (
                                <div
                                    key={lvl || "all"}
                                    className={`custom-dropdown-item ${lvl === level ? "selected" : ""
                                        }`}
                                    onClick={() => handleCustomLevelChange(lvl)}
                                >
                                    {lvl || "All Levels"}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {Object.keys(groupedVocab).length === 0 ? (
                <div className="no-results">
                    <p>No vocabulary found for this filter.</p>
                </div>
            ) : (
                Object.entries(groupedVocab).map(([category, words]) => (
                    <section key={category} className="vocab-category-section">
                        <button
                            className={`category-toggle ${expandedCategories.includes(category) ? "open" : ""
                                }`}
                            onClick={() => toggleCategory(category)}
                        >
                            <span>
                                {category} ({words.length})
                            </span>
                            <span className="arrow">
                                {expandedCategories.includes(category) ? "▲" : "▼"}
                            </span>
                        </button>

                        <div
                            className={`category-container ${expandedCategories.includes(category) ? "expanded" : ""
                                }`}
                        >
                            <div className="vocab-grid">
                                {words.map((v) => (
                                    <article key={v._id} className="vocab-card">
                                        <div className="vocab-word">{v.polish}</div>
                                        <div className="vocab-translation">{v.english}</div>
                                        <div className="vocab-level">{v.level}</div>
                                    </article>
                                ))}
                            </div>

                            <div className="table-wrapper">
                                <table className="vocab-table">
                                    <thead>
                                        <tr>
                                            <th>Polish</th>
                                            <th>English</th>
                                            <th>Level</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {words.map((v) => (
                                            <tr key={v._id}>
                                                <td>{v.polish}</td>
                                                <td>{v.english}</td>
                                                <td>{v.level}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                ))
            )}

            {totalPages > 1 && (
                <nav className="pagination" aria-label="Pagination">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            className={`page-btn ${currentPage === page ? "active" : ""}`}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </button>
                    ))}
                </nav>
            )}
        </div>
    );
};

export default VocabularyPage;