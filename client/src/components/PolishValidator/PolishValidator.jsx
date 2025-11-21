// src/components/PolishValidator/PolishValidator.jsx
import React, { useState, useCallback } from 'react';
import axios from 'axios';
import LevelSelector from './LevelSelector';
import FeedbackAnalysis from './FeedbackAnalysis';
import './PolishValidator.css';

const API_BASE = import.meta.env.VITE_API_URL || '';

const defaultLevels = [
    { value: 'beginner', label: 'Beginner (A1-A2)', icon: '🌱', description: 'Basic grammar and vocabulary' },
    { value: 'intermediate', label: 'Intermediate (B1-B2)', icon: '📚', description: 'More complex structures' },
    { value: 'advanced', label: 'Advanced (C1-C2)', icon: '🎓', description: 'Near-native proficiency' },
];

const PolishValidator = ({ userRole = 'student', levels = defaultLevels }) => {
    const [text, setText] = useState('');
    const [level, setLevel] = useState('intermediate');
    const [feedback, setFeedback] = useState(null); // expects the API inner data object
    const [loading, setLoading] = useState(false);
    const [detecting, setDetecting] = useState(false);
    const [error, setError] = useState(null);
    const [rateLimitInfo, setRateLimitInfo] = useState(null);

    const getLevelInfo = useCallback(() => levels.find(l => l.value === level), [level, levels]);

    const handleValidate = async () => {
        if (!text.trim()) {
            setError('Please enter some text to validate');
            return;
        }

        setLoading(true);
        setError(null);
        setFeedback(null);

        try {
            const resp = await axios.post(`${API_BASE}/api/polish-validation/validate-polish`, {
                text,
                userRole,
                level,
            });

            // IMPORTANT: we set feedback to the inner `data` object
            const inner = resp?.data?.data;
            if (!inner) {
                // fallback safe shape
                setFeedback({
                    feedback: 'No feedback returned by server.',
                    originalText: text,
                    level,
                    timestamp: new Date().toISOString(),
                });
            } else {
                setFeedback(inner);
            }

            // rate limit info fallback from headers
            const rateLimitData = resp?.data?.rateLimitInfo || {
                remaining: resp?.headers?.['ratelimit-remaining'],
                limit: resp?.headers?.['ratelimit-limit'],
                reset: resp?.headers?.['ratelimit-reset'],
            };
            if (rateLimitData?.remaining !== undefined) setRateLimitInfo(rateLimitData);
        } catch (err) {
            if (err.response?.status === 429) {
                const retryAfter = err.response.data?.retryAfter || 'a little while';
                setError(`Rate limit exceeded. Try again after ${retryAfter}.`);
            } else {
                setError(err.response?.data?.message || err.message || 'Validation failed.');
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
            const resp = await axios.post('/api/polish-validation/detect-level', { text });
            const detected = resp?.data?.detectedLevel;
            if (detected) {
                setLevel(detected);
                // small UX: ephemeral browser alert; you may replace with toast
                alert(`Detected level: ${detected.toUpperCase()}`);
            } else {
                setError('Detection returned no level. Keeping current selection.');
            }
        } catch (err) {
            setError('Failed to detect level. Using current selection.');
            console.error('Detection error:', err);
        } finally {
            setDetecting(false);
        }
    };

    const handleContinueAnalysis = async (currentFeedback) => {
        if (!currentFeedback || !currentFeedback.originalText) return null;

        try {
            const resp = await axios.post(`${API_BASE}/api/polish-validation/continue-analysis`, {
                text: currentFeedback.originalText,
                previousFeedback: currentFeedback.feedback,
                userRole,
                level,
            });

            return resp?.data?.data || null;
        } catch (err) {
            console.error('Continue analysis API error:', err);
            return null;
        }
    };


    const handleClear = () => {
        setText('');
        setFeedback(null);
        setError(null);
    };

    return (
        <div className="polish-validator">
            <header className="validator-header">
                <h2>Polish Text Validator</h2>
                <p className="role-badge">{userRole === 'teacher' ? '👨‍🏫 Teacher' : '👨‍🎓 Student'} Mode</p>
            </header>

            <LevelSelector
                levels={levels}
                level={level}
                setLevel={setLevel}
                onAutoDetect={handleAutoDetect}
                detecting={detecting}
                loading={loading}
            />

            <section className="input-section">
                <label htmlFor="polish-text">Enter Polish text:</label>
                <textarea
                    id="polish-text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Wpisz tekst po polsku tutaj... (Enter Polish text here...)"
                    rows={8}
                    disabled={loading}
                />

                <div className="button-group">
                    <button onClick={handleValidate} disabled={loading || !text.trim()} className="validate-btn">
                        {loading ? 'Analyzing...' : '✓ Validate Text'}
                    </button>
                    <button onClick={handleClear} disabled={loading} className="clear-btn">
                        Clear
                    </button>
                </div>
            </section>

            {error && (
                <div className="error-message">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {rateLimitInfo && (
                <div className="rate-limit-info">
                    <small>
                        API Requests Remaining: <strong>{rateLimitInfo.remaining}</strong> / {rateLimitInfo.limit}
                    </small>
                </div>
            )}

            {loading && (
                <div className="loading-indicator">
                    <div className="spinner" />
                    <p>Analyzing your text at {level} level...</p>
                </div>
            )}

            {/* FeedbackAnalysis receives the inner feedback object */}
            {feedback && !loading && (
                <FeedbackAnalysis
                    feedback={feedback}
                    levelInfo={getLevelInfo()}
                    onClose={() => setFeedback(null)}
                    onContinue={handleContinueAnalysis}
                />
            )}
        </div>
    );
};

export default PolishValidator;
