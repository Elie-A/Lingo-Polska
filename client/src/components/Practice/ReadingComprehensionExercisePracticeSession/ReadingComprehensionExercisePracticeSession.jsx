import React, { useState, useEffect, useMemo } from "react";
import ReadingComprehensionQuestionCard from "../../ReadingComprehensionQuestionCard/ReadingComprehensionQuestionCard";
import ScoreBoard from "../../Scoreboard/ScoreBoard";

// Normalize exercises once
const normalizeReadingExercises = (exercises) => {
    return exercises.map((exercise) => ({
        ...exercise,
        questions: exercise.questions.map((q) => {
            if (q.type === "multiple-choice") {
                const options = q.options && q.options.length ? q.options : [q.answer];
                const answers = options.map((opt) => ({ text: opt, isCorrect: opt === q.answer }));
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
};

const ReadingComprehensionExerciseSession = ({ exercises, quizTimeMinutes, onRestart }) => {
    const [currentPassageIndex, setCurrentPassageIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    // Memoize normalized exercises to prevent unnecessary re-renders
    const normalizedExercises = useMemo(() => normalizeReadingExercises(exercises), [exercises]);

    const currentPassage = normalizedExercises[currentPassageIndex] || {};
    const questions = currentPassage.questions || [];
    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = normalizedExercises.reduce(
        (sum, passage) => sum + (passage.questions?.length || 0),
        0
    );

    const handleAnswer = (isCorrect) => {
        // Update score regardless of correctness
        if (isCorrect) setScore((prev) => prev + 1);

        // Move to next question
        if (currentQuestionIndex + 1 < questions.length) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else if (currentPassageIndex + 1 < normalizedExercises.length) {
            setCurrentPassageIndex((prev) => prev + 1);
            setCurrentQuestionIndex(0);
        } else {
            setFinished(true);
        }
    };

    const handleRestart = () => {
        setCurrentPassageIndex(0);
        setCurrentQuestionIndex(0);
        setScore(0);
        setFinished(false);
    };

    if (!exercises || exercises.length === 0) return <p>Loading exercises...</p>;
    if (finished) {
        return (
            <div className="quiz-finished">
                <h2>Reading Session Finished!</h2>
                <p className="quiz-finished-p">
                    Final Score: {score} / {totalQuestions}
                </p>
                <button onClick={onRestart || handleRestart} className="quiz-finished-btn">
                    Start New Practice
                </button>
            </div>
        );
    }
    if (!currentQuestion) return <p>Loading question...</p>;

    return (
        <div className="reading-session">
            <ScoreBoard score={score} total={totalQuestions} timer={quizTimeMinutes * 60} />
            <ReadingComprehensionQuestionCard
                question={currentQuestion}
                passageTitle={currentPassage.title || "Untitled Passage"}
                passageText={currentPassage.text || "No passage text available."}
                onAnswer={handleAnswer}
            />
            <p className="progress-text">
                Question {currentQuestionIndex + 1} of {questions.length} in this passage
            </p>
            <p className="passage-progress">
                Passage {currentPassageIndex + 1} of {normalizedExercises.length}
            </p>
        </div>
    );
};

export default ReadingComprehensionExerciseSession;
