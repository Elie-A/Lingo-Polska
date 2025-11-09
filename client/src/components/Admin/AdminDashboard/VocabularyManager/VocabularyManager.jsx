import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../../../Modal/Modal";
import "./VocabularyManager.css";

export default function VocabularyManager() {
    const [vocabularies, setVocabularies] = useState([]);
    const [newWord, setNewWord] = useState("");
    const [newTranslation, setNewTranslation] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [newLevel, setNewLevel] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage] = useState(50);

    const [searchTerm, setSearchTerm] = useState("");
    const [modal, setModal] = useState({ visible: false, message: "", onConfirm: null });
    const [editingId, setEditingId] = useState(null);
    const [editingValues, setEditingValues] = useState({ polish: "", english: "", category: "", level: "" });

    const token = localStorage.getItem("adminToken");
    const api = axios.create({
        baseURL: import.meta.env.VITE_API_URL + "/api/vocabulary",
        headers: { Authorization: `Bearer ${token}` },
    });

    // Fetch vocabularies
    const fetchVocab = async (page = 1) => {
        try {
            setLoading(true);
            const { data } = await api.get("/", { params: { page, limit: itemsPerPage } });
            setVocabularies(data.data || []);
            setTotalPages(data.pagination ? data.pagination.totalPages : 1);
            setCurrentPage(page);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch vocabularies:", err);
            setLoading(false);
        }
    };

    useEffect(() => { fetchVocab(); }, []);

    // Add new word
    const addVocab = async () => {
        if (!newWord || !newTranslation || !newCategory || !newLevel) {
            setModal({ visible: true, message: "All fields are required.", onConfirm: () => setModal({ ...modal, visible: false }) });
            return;
        }
        try {
            await api.post("/", { polish: newWord, english: newTranslation, category: newCategory, level: newLevel });
            setNewWord(""); setNewTranslation(""); setNewCategory(""); setNewLevel("");
            fetchVocab(currentPage);
        } catch (err) {
            console.error("Failed to add vocabulary:", err);
        }
    };

    // Delete word
    const deleteVocab = (id) => {
        setModal({
            visible: true,
            message: "Are you sure you want to delete this word?",
            onConfirm: async () => {
                await api.delete(`/${id}`);
                fetchVocab(currentPage);
                setModal({ ...modal, visible: false });
            },
        });
    };

    // Start inline edit
    const startEditing = (vocab) => {
        setEditingId(vocab._id);
        setEditingValues({
            polish: vocab.polish || "",
            english: vocab.english || "",
            category: vocab.category || "",
            level: vocab.level || "",
        });
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditingValues({ polish: "", english: "", category: "", level: "" });
    };

    const saveEditing = async (id) => {
        if (!editingValues.polish || !editingValues.english || !editingValues.category || !editingValues.level) {
            setModal({ visible: true, message: "All fields are required.", onConfirm: () => setModal({ ...modal, visible: false }) });
            return;
        }
        try {
            await api.put(`/${id}`, editingValues);
            fetchVocab(currentPage);
            cancelEditing();
        } catch (err) {
            console.error("Failed to update vocabulary:", err);
        }
    };

    // Pagination
    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        fetchVocab(page);
    };

    // Filter vocabularies for search
    const filteredVocabularies = vocabularies
        .map(group => ({
            ...group,
            words: group.words.filter(vocab =>
                (vocab.polish || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (vocab.english || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (vocab.category || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (vocab.level || "").toLowerCase().includes(searchTerm.toLowerCase())
            )
        }))
        .filter(group => group.words.length > 0);

    return (
        <div className="manager-container">
            {modal.visible && (
                <Modal
                    title="Notice"
                    message={modal.message}
                    onConfirm={modal.onConfirm}
                    onCancel={() => setModal({ ...modal, visible: false })}
                />
            )}

            <h3>Manage Vocabulary</h3>

            {/* Search */}
            <input
                type="text"
                placeholder="Search by word, translation, category, or level..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: "0.5rem 1rem", borderRadius: "0.75rem", border: "1px solid #d1d5db", marginBottom: "1rem", width: "100%" }}
            />

            {/* Add Form */}
            <div className="add-form">
                <input type="text" placeholder="Polish Word" value={newWord} onChange={(e) => setNewWord(e.target.value)} />
                <input type="text" placeholder="English Translation" value={newTranslation} onChange={(e) => setNewTranslation(e.target.value)} />
                <input type="text" placeholder="Category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                <div className="select-wrapper">
                    <select value={newLevel} onChange={(e) => setNewLevel(e.target.value)}>
                        <option value="">Select Level</option>
                        <option value="A1">A1</option>
                        <option value="A2">A2</option>
                        <option value="B1">B1</option>
                        <option value="B2">B2</option>
                        <option value="C1">C1</option>
                        <option value="C2">C2</option>
                    </select>
                </div>
                <button onClick={addVocab}>Add</button>
            </div>

            {/* Vocabulary List */}
            {loading ? <p>Loading...</p> : filteredVocabularies.length === 0 ? <p>No vocabulary found.</p> :
                filteredVocabularies.map(group => (
                    <div key={group._id}>
                        <h4>{group._id}</h4>
                        <div className="vocab-list">
                            {group.words.map(vocab => (
                                <div key={vocab._id} className="vocab-item">
                                    {editingId === vocab._id ? (
                                        <div className="edit-form">
                                            <input type="text" value={editingValues.polish} onChange={(e) => setEditingValues({ ...editingValues, polish: e.target.value })} placeholder="Polish" />
                                            <input type="text" value={editingValues.english} onChange={(e) => setEditingValues({ ...editingValues, english: e.target.value })} placeholder="English" />
                                            <input type="text" value={editingValues.category} onChange={(e) => setEditingValues({ ...editingValues, category: e.target.value })} placeholder="Category" />
                                            <div className="select-wrapper">
                                                <select value={editingValues.level} onChange={(e) => setEditingValues({ ...editingValues, level: e.target.value })}>
                                                    <option value="">Select Level</option>
                                                    <option value="A1">A1</option>
                                                    <option value="A2">A2</option>
                                                    <option value="B1">B1</option>
                                                    <option value="B2">B2</option>
                                                    <option value="C1">C1</option>
                                                    <option value="C2">C2</option>
                                                </select>
                                            </div>
                                            <div className="edit-buttons">
                                                <button onClick={() => saveEditing(vocab._id)}>Save</button>
                                                <button onClick={cancelEditing}>Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <span><strong>{vocab.polish}</strong> — {vocab.english} ({vocab.level})</span>
                                            <div className="edit-buttons">
                                                <button onClick={() => startEditing(vocab)}>Edit</button>
                                                <button onClick={() => deleteVocab(vocab._id)}>Delete</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            }

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button key={i + 1} className={currentPage === i + 1 ? "active" : ""} onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                    ))}
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
                </div>
            )}
        </div>
    );
}
