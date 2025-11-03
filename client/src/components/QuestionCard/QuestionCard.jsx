import React, { useState, useEffect, useMemo } from "react";
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

    // Normalize strings for comparison
    const normalize = (str) =>
        str
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ")
            .replace(/[–—-]/g, "-")
            .replace(/[.,;:!?]/g, "")  // remove punctuation
            .normalize("NFKC");

    const answers = useMemo(() => {
        if (!question.answers && question.options) {
            return question.options.map((text) => ({
                text,
                isCorrect: normalize(question.answer).includes(normalize(text)) || normalize(text).includes(normalize(question.answer)),
            }));
        }
        return question.answers || [];
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

        const isCorrect = normalize(userAnswer) === normalize(question.answer);

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

        const isCorrect = normalize(userAnswer) === normalize(question.answer);
        return `text - answer - input ${isCorrect ? "input-correct" : "input-incorrect"} `;
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

            {/* Multiple Choice, Matching, True or False */}
            {['matching', 'multiple-choice', 'true-false'].includes(question.type) && answers.length > 0 && (
                <div className="answers-container">
                    {answers.map((answer, index) => (
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
                        className={`submit-btn ${isSubmitted ? "submit-disabled" : ""} `}
                    >
                        {isSubmitted ? "Submitted" : "Submit Answer"}
                    </button>

                    {isSubmitted && (
                        <div className={`feedback ${normalize(userAnswer) === normalize(question.answer)
                            ? "feedback-correct"
                            : "feedback-incorrect"
                            } `}>
                            {normalize(userAnswer) === normalize(question.answer) ? (
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
        options: PropTypes.arrayOf(PropTypes.string),
        hints: PropTypes.arrayOf(PropTypes.string),
        text: PropTypes.string,
    }).isRequired,
    onAnswer: PropTypes.func.isRequired,
};

export default QuestionCard;
