import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import FiltersPanel from "../FilterPanel/FilterPanel.jsx";
import PracticeSession from "./PracticeSession/PracticeSession.jsx";
import ReadingComprehensionExercisePracticeSession from "./ReadingComprehensionExercisePracticeSession/ReadingComprehensionExercisePracticeSession.jsx";
import "./Practice.css";

const PracticePage = () => {
    const [filters, setFilters] = useState({ topics: [], levels: [] });
    const [selected, setSelected] = useState({
        topic: "",
        level: "",
        type: "",
        count: 10,
        quizTime: 5,
    });
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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
    }, []);

    const shuffleArray = useCallback((array) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }, []);

    const precomputeOptions = useCallback(
        (allExercises, wrongCount = 3) => {
            if (!allExercises?.length) return [];
            const allAnswersPool = [
                ...new Set(allExercises.map((q) => q.answer).filter(Boolean)),
            ];
            const shuffledPool = shuffleArray(allAnswersPool);
            let poolIndex = 0;

            return allExercises.map((exercise) => {
                if (exercise.type !== "multiple-choice") return exercise;

                if (exercise.options?.length > 0) {
                    return {
                        ...exercise,
                        answers: shuffleArray(
                            exercise.options.map((opt) => ({ text: opt, isCorrect: opt === exercise.answer }))
                        ),
                    };
                }

                const wrongAnswers = [];
                let attempts = 0;
                const maxAttempts = shuffledPool.length;

                while (wrongAnswers.length < wrongCount && attempts < maxAttempts) {
                    const candidate = shuffledPool[poolIndex % shuffledPool.length];
                    poolIndex++;
                    attempts++;
                    if (candidate !== exercise.answer && !wrongAnswers.includes(candidate)) {
                        wrongAnswers.push(candidate);
                    }
                }

                const answers = shuffleArray([
                    { text: exercise.answer, isCorrect: true },
                    ...wrongAnswers.map((ans) => ({ text: ans, isCorrect: false })),
                ]);

                return { ...exercise, answers };
            });
        },
        [shuffleArray]
    );

    const startPractice = useCallback(async () => {
        setError("");
        setLoading(true);
        try {
            const { topic, level, type, count } = selected;
            const limit = Number(count) || 10;

            const endpoint =
                type === "reading-comprehension"
                    ? `${import.meta.env.VITE_API_URL}/api/reading/random`
                    : `${import.meta.env.VITE_API_URL}/api/practice/random`;

            const { data } = await axios.get(endpoint, { params: { topic, level, type, limit } });

            if (!data.success || !data.data?.length) {
                throw new Error("No exercises found for the selected filters.");
            }

            let preparedExercises;

            if (type === "reading-comprehension") {
                preparedExercises = data.data.map((exercise) => ({
                    ...exercise,
                    questions: exercise.questions.map((q) => {
                        if (q.type === "multiple-choice") {
                            const options = q.options && q.options.length ? q.options : [q.answer];
                            const answers = options.map((opt) => ({
                                text: opt,
                                isCorrect: opt === q.answer,
                            }));
                            return { ...q, answers };
                        }
                        if (q.type === "true-false") {
                            return {
                                ...q,
                                answers: [
                                    { text: "True", isCorrect: q.answer === true || String(q.answer).toLowerCase() === "true" },
                                    { text: "False", isCorrect: q.answer === false || String(q.answer).toLowerCase() === "false" },
                                ],
                            };
                        }
                        return q; // short-answer / fill-in-the-blank
                    }),
                }));
            } else {
                preparedExercises = precomputeOptions(Array.isArray(data.data) ? data.data : [data.data]);
            }

            setExercises(preparedExercises);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    }, [selected, precomputeOptions]);

    const handleRestart = useCallback(() => {
        setExercises([]);
        setSelected({ topic: "", level: "", type: "", count: 10, quizTime: 5 });
    }, []);

    const dismissError = useCallback(() => setError(""), []);

    return (
        <div className="practice-page">
            <header>
                <h1 className="practice-title">✍🏻 Polish Practice</h1>
                <p className="practice-subtitle">Choose your topic, level, and start practicing!</p>
            </header>

            {error && (
                <div className="error">
                    <p>{error}</p>
                    <button onClick={dismissError}>Try Again</button>
                </div>
            )}

            {loading && (
                <div className="loading">
                    <div className="spinner" />
                    <p>Loading exercises...</p>
                </div>
            )}

            {!loading && exercises.length === 0 ? (
                <FiltersPanel
                    filters={filters}
                    selected={selected}
                    setSelected={setSelected}
                    startPractice={startPractice}
                />
            ) : (
                // Dynamically mount the correct session
                (() => {
                    if (!exercises.length) return null;

                    const isReading =
                        selected.type === "reading-comprehension" ||
                        exercises[0]?.questions; // reading exercises have `questions`

                    return isReading ? (
                        <ReadingComprehensionExercisePracticeSession
                            exercises={exercises}
                            quizTimeMinutes={selected.quizTime}
                            onRestart={handleRestart}
                        />
                    ) : (
                        <PracticeSession
                            exercises={exercises}
                            quizTimeMinutes={selected.quizTime}
                            onRestart={handleRestart}
                        />
                    );
                })()
            )}
        </div>
    );
};

export default PracticePage;
