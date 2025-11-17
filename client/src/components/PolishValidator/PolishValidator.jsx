import React, { useState } from 'react';
import axios from 'axios';
import './PolishValidator.css';

const PolishValidator = ({ userRole = 'student' }) => {
    const [text, setText] = useState('');
    const [level, setLevel] = useState('intermediate');
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);
    const [detecting, setDetecting] = useState(false);
    const [error, setError] = useState(null);
    const [rateLimitInfo, setRateLimitInfo] = useState(null);

    const levels = [
        {
            value: 'beginner',
            label: 'Beginner (A1-A2)',
            icon: '🌱',
            description: 'Basic grammar and vocabulary'
        },
        {
            value: 'intermediate',
            label: 'Intermediate (B1-B2)',
            icon: '📚',
            description: 'More complex structures'
        },
        {
            value: 'advanced',
            label: 'Advanced (C1-C2)',
            icon: '🎓',
            description: 'Near-native proficiency'
        }
    ];

    const handleValidate = async () => {
        if (!text.trim()) {
            setError('Please enter some text to validate');
            return;
        }

        setLoading(true);
        setError(null);
        setFeedback(null);

        try {
            const response = await axios.post('/api/validate-polish', {
                text: text,
                userRole: userRole,
                level: level
            });

            setFeedback(response.data);

            // Capture rate limit info from response data or headers
            const rateLimitData = response.data.rateLimitInfo || {
                remaining: response.headers['ratelimit-remaining'],
                limit: response.headers['ratelimit-limit'],
                reset: response.headers['ratelimit-reset'],
            };

            if (rateLimitData.remaining !== undefined) {
                setRateLimitInfo(rateLimitData);
            }
        } catch (err) {
            // Handle rate limit error
            if (err.response?.status === 429) {
                const retryAfter = err.response.data?.retryAfter || 'some time';
                setError(`Rate limit exceeded. Please try again after ${retryAfter}.`);
            } else {
                setError(err.response?.data?.message || 'Failed to validate text. Please try again.');
            }
            console.error('Validation error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAutoDetect = async () => {
        if (!text.trim()) {
            setError('Please enter some text first');
            return;
        }

        setDetecting(true);
        setError(null);

        try {
            const response = await axios.post('/api/detect-level', {
                text: text
            });

            setLevel(response.data.detectedLevel);
            alert(`Detected level: ${response.data.detectedLevel.toUpperCase()}`);
        } catch (err) {
            setError('Failed to detect level. Using current selection.');
            console.error('Detection error:', err);
        } finally {
            setDetecting(false);
        }
    };

    const handleClear = () => {
        setText('');
        setFeedback(null);
        setError(null);
    };

    const getLevelInfo = () => {
        return levels.find(l => l.value === level);
    };

    return (
        <div className="polish-validator">
            <div className="validator-header">
                <h2>Polish Text Validator</h2>
                <p className="role-badge">
                    {userRole === 'teacher' ? '👨‍🏫 Teacher' : '👨‍🎓 Student'} Mode
                </p>
            </div>

            {/* Level Selection */}
            <div className="level-selection">
                <div className="level-header">
                    <h3>Select Your Level</h3>
                    <button
                        onClick={handleAutoDetect}
                        disabled={detecting || loading || !text.trim()}
                        className="auto-detect-btn"
                    >
                        {detecting ? 'Detecting...' : '🔍 Auto-Detect'}
                    </button>
                </div>

                <div className="level-options">
                    {levels.map((lvl) => (
                        <div
                            key={lvl.value}
                            className={`level-card ${level === lvl.value ? 'active' : ''}`}
                            onClick={() => setLevel(lvl.value)}
                        >
                            <div className="level-icon">{lvl.icon}</div>
                            <div className="level-info">
                                <h4>{lvl.label}</h4>
                                <p>{lvl.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="current-level-info">
                    <strong>Current Level:</strong> {getLevelInfo()?.icon} {getLevelInfo()?.label}
                </div>
            </div>

            {/* Text Input */}
            <div className="input-section">
                <label htmlFor="polish-text">Enter Polish text:</label>
                <textarea
                    id="polish-text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Wpisz tekst po polsku tutaj... (Enter Polish text here...)"
                    rows="8"
                    disabled={loading}
                />

                <div className="button-group">
                    <button
                        onClick={handleValidate}
                        disabled={loading || !text.trim()}
                        className="validate-btn"
                    >
                        {loading ? 'Analyzing...' : '✓ Validate Text'}
                    </button>
                    <button
                        onClick={handleClear}
                        disabled={loading}
                        className="clear-btn"
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="error-message">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* Rate Limit Info */}
            {rateLimitInfo && (
                <div className="rate-limit-info">
                    <small>
                        API Requests Remaining: <strong>{rateLimitInfo.remaining}</strong> / {rateLimitInfo.limit}
                    </small>
                </div>
            )}

            {/* Loading Indicator */}
            {loading && (
                <div className="loading-indicator">
                    <div className="spinner"></div>
                    <p>Analyzing your text at {level} level...</p>
                </div>
            )}

            {/* Feedback Display */}
            {feedback && !loading && (
                <div className="feedback-section">
                    <div className="feedback-header">
                        <h3>Analysis Results</h3>
                        <span className="feedback-level-badge">
                            {getLevelInfo()?.icon} {level.toUpperCase()} Level
                        </span>
                    </div>

                    <div className="original-text">
                        <strong>Original Text:</strong>
                        <p>{feedback.originalText}</p>
                    </div>

                    <div className="ai-feedback">
                        <strong>AI Feedback:</strong>
                        <div className="feedback-content">
                            {feedback.feedback.split('\n').map((line, index) => {
                                // Check if line is a heading (starts with **text**)
                                if (line.match(/^\*\*.*\*\*:?/)) {
                                    return <h4 key={index} className="feedback-heading">{line.replace(/\*\*/g, '')}</h4>;
                                }
                                // Regular paragraph
                                return line.trim() ? <p key={index}>{line}</p> : null;
                            })}
                        </div>
                    </div>

                    <div className="feedback-footer">
                        <div className="timestamp">
                            <small>Analyzed at: {new Date(feedback.timestamp).toLocaleString()}</small>
                        </div>
                        <button onClick={() => setFeedback(null)} className="close-feedback-btn">
                            Close Feedback
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PolishValidator;