import React, { useState, useEffect } from "react";
import axios from "axios";
import FiltersPanel from "../FilterPanel/FilterPanel.jsx";
import PracticeSession from "./PracticeSession.jsx";
import "./Practice.css";

const PracticePage = () => {
    const [filters, setFilters] = useState({ topics: [], levels: [] });
    const [selected, setSelected] = useState({ topic: "", level: "", type: "", count: 10, quizTime: 5 });
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchFilters = async () => {
            setLoading(true);
            setError("");
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/practice/filters`);
                if (data.success) setFilters(data.data);
            } catch (err) {
                setError(err.response?.data?.message || err.message || "Failed to load filters.");
            } finally {
                setLoading(false);
            }
        };
        fetchFilters();
    }, []);

    // Fisher-Yates shuffle
    const shuffleArray = (array) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    // Precompute options for all multiple-choice exercises
    const precomputeOptions = (allExercises, wrongCount = 3) => {
        // Collect all unique answers
        const allAnswersPool = Array.from(new Set(allExercises.map(q => q.answer).filter(Boolean)));
        const usedWrongAnswers = new Set();

        return allExercises.map(exercise => {
            if (exercise.type !== "multiple-choice") return exercise;

            // Use existing options if present
            if (exercise.options && exercise.options.length > 0) {
                return {
                    ...exercise,
                    answers: shuffleArray(
                        exercise.options.map(opt => ({ text: opt, isCorrect: opt === exercise.answer }))
                    )
                };
            }

            // Build wrong answers ensuring no repetition across questions
            const possibleWrongs = allAnswersPool.filter(
                ans => ans !== exercise.answer && !usedWrongAnswers.has(ans)
            );
            const wrongAnswers = shuffleArray(possibleWrongs).slice(0, wrongCount);
            wrongAnswers.forEach(ans => usedWrongAnswers.add(ans));

            const answers = shuffleArray([
                { text: exercise.answer, isCorrect: true },
                ...wrongAnswers.map(ans => ({ text: ans, isCorrect: false }))
            ]);

            return { ...exercise, answers };
        });
    };

    const startPractice = async () => {
        setError("");
        setLoading(true);
        try {
            const { topic, level, type, count } = selected;
            const limit = Number(count) || 10;

            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/practice`, {
                params: { topic, level, type, limit }
            });

            if (!data.success || !data.data?.length) {
                throw new Error("No exercises found for the selected filters.");
            }

            // Precompute all options once
            const preparedExercises = precomputeOptions(data.data);

            setExercises(shuffleArray(preparedExercises));
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="practice-page">
            <header>
                <h1 className="practice-title">✍🏻 Polish Practice</h1>
                <p className="practice-subtitle">Choose your topic, level, and start practicing!</p>
            </header>

            {error && (
                <div className="error">
                    <p>{error}</p>
                    <button onClick={() => setError("")}>Try Again</button>
                </div>
            )}

            {!exercises.length ? (
                <>
                    <FiltersPanel
                        filters={filters}
                        selected={selected}
                        setSelected={setSelected}
                        startPractice={startPractice}
                    />
                    {loading && (
                        <div className="loading">
                            <div className="spinner" />
                            <p>Loading exercises...</p>
                        </div>
                    )}
                </>
            ) : (
                <PracticeSession
                    exercises={exercises}
                    quizTimeMinutes={selected.quizTime}
                    onRestart={() => {
                        setExercises([]);
                        setSelected({ topic: "", level: "", type: "", count: 10, quizTime: 5 });
                    }}
                />
            )}
        </div>
    );
};

export default PracticePage;
