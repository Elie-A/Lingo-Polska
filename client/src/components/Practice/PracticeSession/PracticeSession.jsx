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
        if (quizFinished || !exercises.length) return;
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

    const handleAnswer = (isCorrect) => {
        if (isCorrect) setScore(score + 1);

        const nextIndex = currentIndex + 1;
        if (nextIndex >= exercises.length) {
            setTimeout(() => {
                setQuizFinished(true);
            }, 1000);
        } else {
            setTimeout(() => {
                setCurrentIndex(nextIndex);
            }, 1000);
        }
    };

    if (!exercises.length) {
        return (
            <div>
                <h2>No questions available</h2>
                <p>Please try different filters.</p>
            </div>
        );
    }

    if (quizFinished) {
        return (
            <div className="quiz-finished">
                <h2>Quiz Finished!</h2>
                <p className="quiz-finished-p">
                    Your score: {score} / {exercises.length}
                </p>
                <button onClick={onRestart} className="quiz-finished-btn">Start New Practice</button>
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