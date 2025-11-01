import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./QuestionCard.css";

const QuestionCard = ({ question, onAnswer }) => {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [userAnswer, setUserAnswer] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showHint, setShowHint] = useState(false);

    // Reset state when question changes
    useEffect(() => {
        setSelectedIndex(null);
        setUserAnswer("");
        setIsSubmitted(false);
        setShowHint(false);
    }, [question]);

    const handleMultipleChoice = (answer, index) => {
        if (selectedIndex !== null) return;
        setSelectedIndex(index);
        setIsSubmitted(true);

        setTimeout(() => {
            onAnswer(answer.isCorrect);
        }, 1500);
    };

    const handleTextSubmit = (e) => {
        e.preventDefault();
        if (isSubmitted || !userAnswer.trim()) return;

        setIsSubmitted(true);

        const normalizedUserAnswer = userAnswer.trim().toLowerCase();
        const normalizedCorrectAnswer = question.answer.trim().toLowerCase();

        const isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;

        setTimeout(() => {
            onAnswer(isCorrect);
        }, 1500);
    };

    const renderQuestionContent = () => {
        if (question.text) {
            return (
                <div className="reading-text">
                    <p>{question.text}</p>
                </div>
            );
        }
        return null;
    };

    const renderHints = () => {
        if (!question.hints || question.hints.length === 0) return null;

        return (
            <div className="hints-container">
                <button
                    onClick={() => setShowHint(!showHint)}
                    className="hint-toggle-btn"
                >
                    {showHint ? "Hide Hint" : "Show Hint 💡"}
                </button>
                {showHint && (
                    <div className="hints-content">
                        {question.hints.map((hint, idx) => (
                            <div key={idx} className="hint-item">• {hint}</div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const getAnswerClassName = (answer, index) => {
        if (selectedIndex === null) return "answer-btn";

        const isSelected = index === selectedIndex;
        const isCorrect = answer.isCorrect;

        if (isSelected && isCorrect) return "answer-btn answer-correct";
        if (isSelected && !isCorrect) return "answer-btn answer-incorrect";
        if (isCorrect && isSubmitted) return "answer-btn answer-revealed";

        return "answer-btn answer-disabled";
    };

    const getTextInputClassName = () => {
        if (!isSubmitted) return "text-answer-input";

        const isCorrect = userAnswer.trim().toLowerCase() === question.answer.trim().toLowerCase();
        return `text-answer-input ${isCorrect ? "input-correct" : "input-incorrect"}`;
    };

    return (
        <div className="question-card">
            <div className="question-type-badge">
                <span className="badge">
                    {question.type.replace(/-/g, ' ').toUpperCase()}
                </span>
            </div>

            <h2 className="question-title">{question.question}</h2>

            {renderQuestionContent()}

            {/* Multiple Choice */}
            {question.type === 'multiple-choice' && question.answers && (
                <div className="answers-container">
                    {question.answers.map((answer, index) => (
                        <button
                            key={index}
                            onClick={() => handleMultipleChoice(answer, index)}
                            disabled={selectedIndex !== null}
                            className={getAnswerClassName(answer, index)}
                        >
                            {answer.text}
                        </button>
                    ))}
                </div>
            )}

            {/* Short Answer & Fill in the Blank */}
            {(question.type === 'short-answer' || question.type === 'fill-in-the-blank') && (
                <form onSubmit={handleTextSubmit} className="text-answer-form">
                    <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        disabled={isSubmitted}
                        placeholder="Type your answer here..."
                        className={getTextInputClassName()}
                    />
                    <button
                        type="submit"
                        disabled={isSubmitted || !userAnswer.trim()}
                        className={`submit-btn ${isSubmitted ? "submit-disabled" : ""}`}
                    >
                        {isSubmitted ? "Submitted" : "Submit Answer"}
                    </button>

                    {isSubmitted && (
                        <div className={`feedback ${userAnswer.trim().toLowerCase() === question.answer.trim().toLowerCase()
                                ? "feedback-correct"
                                : "feedback-incorrect"
                            }`}>
                            {userAnswer.trim().toLowerCase() === question.answer.trim().toLowerCase() ? (
                                <span className="feedback-icon">✓ Correct!</span>
                            ) : (
                                <div>
                                    <span className="feedback-icon">✗ Incorrect</span>
                                    <div className="correct-answer">
                                        The correct answer is: <strong>{question.answer}</strong>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </form>
            )}

            {!isSubmitted && renderHints()}
        </div>
    );
};

QuestionCard.propTypes = {
    question: PropTypes.shape({
        question: PropTypes.string.isRequired,
        answer: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        answers: PropTypes.arrayOf(
            PropTypes.shape({
                text: PropTypes.string.isRequired,
                isCorrect: PropTypes.bool.isRequired,
            })
        ),
        hints: PropTypes.arrayOf(PropTypes.string),
        text: PropTypes.string,
    }).isRequired,
    onAnswer: PropTypes.func.isRequired,
};

export default QuestionCard;