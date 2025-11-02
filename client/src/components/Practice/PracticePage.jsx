import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import FiltersPanel from "../FilterPanel/FilterPanel.jsx";
import PracticeSession from "./PracticeSession.jsx";
import "./Practice.css";

const PracticePage = () => {
    const [filters, setFilters] = useState({ topics: [], levels: [] });
    const [selected, setSelected] = useState({
        topic: "",
        level: "",
        type: "",
        count: 10,
        quizTime: 5
    });
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch filters only once on mount
    useEffect(() => {
        const fetchFilters = async () => {
            setLoading(true);
            setError("");
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/practice/filters`
                );
                if (data.success) setFilters(data.data);
            } catch (err) {
                setError(err.response?.data?.message || err.message || "Failed to load filters.");
            } finally {
                setLoading(false);
            }
        };
        fetchFilters();
    }, []); // No dependencies - run once

    // Memoized shuffle function
    const shuffleArray = useCallback((array) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }, []);

    // Optimized precompute function
    const precomputeOptions = useCallback((allExercises, wrongCount = 3) => {
        // Early return if no exercises
        if (!allExercises?.length) return [];

        // Collect unique answers once using Set
        const allAnswersPool = [...new Set(
            allExercises.map(q => q.answer).filter(Boolean)
        )];

        // Pre-shuffle the answer pool once
        const shuffledPool = shuffleArray(allAnswersPool);
        let poolIndex = 0;

        return allExercises.map(exercise => {
            if (exercise.type !== "multiple-choice") return exercise;

            // Use existing options if present
            if (exercise.options?.length > 0) {
                return {
                    ...exercise,
                    answers: shuffleArray(
                        exercise.options.map(opt => ({
                            text: opt,
                            isCorrect: opt === exercise.answer
                        }))
                    )
                };
            }

            // Get wrong answers from pre-shuffled pool
            const wrongAnswers = [];
            let attempts = 0;
            const maxAttempts = shuffledPool.length;

            while (wrongAnswers.length < wrongCount && attempts < maxAttempts) {
                const candidate = shuffledPool[poolIndex % shuffledPool.length];
                poolIndex++;
                attempts++;

                if (candidate !== exercise.answer &&
                    !wrongAnswers.includes(candidate)) {
                    wrongAnswers.push(candidate);
                }
            }

            // Combine and shuffle answers
            const answers = shuffleArray([
                { text: exercise.answer, isCorrect: true },
                ...wrongAnswers.map(ans => ({ text: ans, isCorrect: false }))
            ]);

            return { ...exercise, answers };
        });
    }, [shuffleArray]);

    // Memoized start practice function
    const startPractice = useCallback(async () => {
        setError("");
        setLoading(true);

        try {
            const { topic, level, type, count } = selected;
            const limit = Number(count) || 10;

            // Use the optimized random endpoint
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/practice/random`,
                { params: { topic, level, type, limit } }
            );

            if (!data.success || !data.data?.length) {
                throw new Error("No exercises found for the selected filters.");
            }

            // Precompute options once
            const preparedExercises = precomputeOptions(
                Array.isArray(data.data) ? data.data : [data.data]
            );

            setExercises(preparedExercises);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    }, [selected, precomputeOptions]);

    // Memoized restart handler
    const handleRestart = useCallback(() => {
        setExercises([]);
        setSelected({ topic: "", level: "", type: "", count: 10, quizTime: 5 });
    }, []);

    // Memoized error dismiss
    const dismissError = useCallback(() => setError(""), []);

    return (
        <div className="practice-page">
            <header>
                <h1 className="practice-title">✍🏻 Polish Practice</h1>
                <p className="practice-subtitle">
                    Choose your topic, level, and start practicing!
                </p>
            </header>

            {error && (
                <div className="error">
                    <p>{error}</p>
                    <button onClick={dismissError}>Try Again</button>
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
                    onRestart={handleRestart}
                />
            )}
        </div>
    );
};

export default PracticePage;