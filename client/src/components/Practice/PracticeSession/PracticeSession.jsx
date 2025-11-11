import React, { useState, useEffect } from "react";
import QuestionCard from "../../QuestionCard/QuestionCard";
import ScoreBoard from "../../Scoreboard/ScoreBoard";
import "./PracticeSession.css";

const PracticeSession = ({ exercises, onRestart, quizTimeMinutes }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const [timer, setTimer] = useState(Number(quizTimeMinutes) * 60 || 300);

    useEffect(() => {
        if (quizFinished || !exercises?.length) return;

        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    setQuizFinished(true);
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [exercises, quizFinished]);

    const handleRestart = () => {
        setCurrentIndex(0);
        setScore(0);
        setQuizFinished(false);
        setTimer(Number(quizTimeMinutes) * 60 || 300);
    };

    const handleAnswer = (isCorrect) => {
        if (isCorrect) setScore((prev) => prev + 1);

        const nextIndex = currentIndex + 1;
        if (nextIndex >= exercises.length) {
            setTimeout(() => setQuizFinished(true), 1000);
        } else {
            setTimeout(() => setCurrentIndex(nextIndex), 1000);
        }
    };

    // Handle loading or empty exercises
    if (!exercises || exercises.length === 0) {
        return (
            <div className="loading-state">
                <h2>Loading exercises...</h2>
                <p>Please wait or adjust your filters.</p>
            </div>
        );
    }

    // Handle quiz finished state
    if (quizFinished) {
        return (
            <div className="quiz-finished">
                <h2>Quiz Finished!</h2>
                <p className="quiz-finished-p">
                    Your score: {score} / {exercises.length}
                </p>
                <button
                    onClick={onRestart || handleRestart}
                    className="quiz-finished-btn"
                >
                    Start New Practice
                </button>
            </div>
        );
    }

    const currentQuestion = exercises[currentIndex];

    return (
        <div className="practice-session">
            <ScoreBoard score={score} total={exercises.length} timer={timer} />
            <QuestionCard question={currentQuestion} onAnswer={handleAnswer} />
            <p>
                Question {currentIndex + 1} of {exercises.length}
            </p>
        </div>
    );
};

export default PracticeSession;
