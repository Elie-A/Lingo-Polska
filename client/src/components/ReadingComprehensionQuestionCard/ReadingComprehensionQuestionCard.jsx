import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./ReadingComprehensionQuestionCard.css";

// Normalize user input for comparison
const normalize = (str) =>
    (str || "")
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ")
        .replace(/[–—-]/g, "-")
        .replace(/[.,;:!?]/g, "")
        .normalize("NFKC");

const ReadingComprehensionQuestionCard = ({ question, onAnswer, passageTitle, passageText }) => {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [userAnswer, setUserAnswer] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    // RESET internal states whenever the question changes
    useEffect(() => {
        setSelectedIndex(null);
        setUserAnswer("");
        setIsSubmitted(false);
        setIsCorrect(false);
        setShowHint(false);
    }, [question]);

    // Handle multiple-choice / true-false answers
    const handleMultipleChoice = (answer, index) => {
        if (isSubmitted) return;

        setSelectedIndex(index);
        setIsCorrect(answer.isCorrect);
        setIsSubmitted(true);

        // Move to next question after a short delay
        setTimeout(() => onAnswer(answer.isCorrect), 1000);
    };

    // Handle short-answer / fill-in-the-blank
    const handleTextSubmit = (e) => {
        e.preventDefault();
        if (isSubmitted || !userAnswer.trim()) return;

        const correct = normalize(userAnswer) === normalize(question.answer);
        setIsCorrect(correct);
        setIsSubmitted(true);

        setTimeout(() => onAnswer(correct), 1000);
    };

    if (!question) return <p>No question available.</p>;

    return (
        <div className="rcq-card">
            {/* Passage */}
            <div className="rcq-passage">
                <h2>{passageTitle}</h2>
                <p>{passageText}</p>
            </div>

            {/* Question */}
            <div className="rcq-question">
                <div className="rcq-question-type-badge">
                    <span className="rcq-badge">{(question.type || "UNKNOWN").replace(/-/g, " ").toUpperCase()}</span>
                </div>
                <h3 className="rcq-question">{question.question || passageTitle}</h3>

                {/* Multiple Choice / True-False */}
                {question.answers && question.answers.length > 0 && (
                    <div className="rcq-answers">
                        {question.answers.map((ans, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleMultipleChoice(ans, idx)}
                                disabled={isSubmitted}
                                className={`rcq-answer-btn
                  ${selectedIndex === idx && ans.isCorrect ? "rcq-answer-correct" : ""}
                  ${selectedIndex === idx && !ans.isCorrect ? "rcq-answer-incorrect" : ""}
                  ${ans.isCorrect && isSubmitted ? "rcq-answer-revealed" : ""}`}
                            >
                                {ans.text}
                            </button>
                        ))}
                    </div>
                )}

                {/* Short Answer / Fill-in-the-blank */}
                {["short-answer", "fill-in-the-blank"].includes(question.type) && (
                    <div className="rcq-text-form">
                        <input
                            type="text"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            onKeyPress={(e) =>
                                e.key === "Enter" && !isSubmitted && userAnswer.trim() && handleTextSubmit(e)
                            }
                            disabled={isSubmitted}
                            placeholder="Type your answer here..."
                            className={`rcq-text-input ${isSubmitted ? (isCorrect ? "rcq-input-correct" : "rcq-input-incorrect") : ""}`}
                        />
                        <button
                            onClick={handleTextSubmit}
                            disabled={isSubmitted || !userAnswer.trim()}
                            className={`rcq-submit-btn ${isSubmitted ? "submit-disabled" : ""}`}
                        >
                            {isSubmitted ? "Submitted" : "Submit Answer"}
                        </button>

                        {isSubmitted && (
                            <div className={`rcq-feedback ${isCorrect ? "rcq-feedback-correct" : "rcq-feedback-incorrect"}`}>
                                {isCorrect ? (
                                    <span className="rcq-feedback-icon">✓ Correct!</span>
                                ) : (
                                    <div>
                                        <span className="rcq-feedback-icon">✗ Incorrect </span>
                                        <div className="rcq-correct-answer-text">
                                            Correct answer: <strong>{question.answer}</strong>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Hints */}
                {question.hints?.length > 0 && !isSubmitted && (
                    <div className="rcq-hints">
                        <button className="rcq-hint-btn" onClick={() => setShowHint(!showHint)}>
                            {showHint ? "Hide Hint" : "Show Hint 💡"}
                        </button>
                        {showHint && (
                            <div className="rcq-hint-content">
                                {question.hints.map((hint, idx) => (
                                    <div key={idx} className="rcq-hint-item">
                                        • {hint}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

ReadingComprehensionQuestionCard.propTypes = {
    question: PropTypes.object.isRequired,
    onAnswer: PropTypes.func.isRequired,
    passageTitle: PropTypes.string.isRequired,
    passageText: PropTypes.string.isRequired,
};

export default ReadingComprehensionQuestionCard;
