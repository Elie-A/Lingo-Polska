import React, { useState, useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import axios from 'axios';
import './FeedbackAnalysis.css';

const API_BASE = import.meta.env.VITE_API_URL || '';

const FeedbackAnalysis = ({
    feedback = {},
    levelInfo = {},
    onClose = () => { },
    onContinue = async () => { },
}) => {
    const [expanded, setExpanded] = useState(false);
    const [copied, setCopied] = useState(false);
    const [loadingContinue, setLoadingContinue] = useState(false);
    const [fullFeedback, setFullFeedback] = useState(feedback.feedback || '');
    const [feedbackChunks, setFeedbackChunks] = useState([feedback.feedback]);

    const maxPreviewLength = 1800;

    // Clean content for rendering
    const content = fullFeedback
        .replace(/---\s*Analysis Complete\s*---/gi, '')
        .replace(/\n{2,}(\|.*\|.*\|)/g, '\n$1'); // fix blank lines before tables

    const isLong = content.length > maxPreviewLength;
    const preview = !expanded && isLong
        ? content.slice(0, maxPreviewLength) + "\n\n..."
        : content;

    marked.setOptions({
        breaks: true,
        gfm: true,
        tables: true,
        headerIds: false,
        mangle: false,
    });

    const html = useMemo(() => {
        try {
            return marked.parse(preview);
        } catch (error) {
            console.error('Markdown parsing error:', error);
            return `<p>${preview}</p>`;
        }
    }, [preview]);

    const isTruncated = detectTruncation(fullFeedback);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(fullFeedback);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleContinueClick = async () => {
        const text = feedback.originalText;
        const level = feedback.level;
        const userRole = feedback.userRole;

        if (!text) return;

        setLoadingContinue(true);
        try {
            const response = await axios.post(`${API_BASE}/api/polish-validation/continue-analysis`, {
                text,
                previousFeedback: fullFeedback,
                userRole,
                level,
            });

            const data = response.data;

            if (!data.success) {
                console.error('API error:', data.message);
                return;
            }

            // Only append the truly new chunk
            const prevFull = fullFeedback;
            const newChunk = data.data.feedback.startsWith(prevFull)
                ? data.data.feedback.slice(prevFull.length).trim()
                : data.data.feedback;

            setFullFeedback(prevFull + '\n\n' + newChunk);
        } catch (error) {
            console.error('Request failed:', error);
        } finally {
            setLoadingContinue(false);
        }
    };
    return (
        <section className="feedback-section">
            <header className="feedback-header">
                <h3>Analysis Results</h3>
                {levelInfo?.label && (
                    <span className="feedback-level-badge">
                        {levelInfo.icon} {levelInfo.label.toUpperCase()}
                    </span>
                )}
            </header>

            {/* Truncation Warning */}
            {isTruncated && (
                <div className="truncation-warning">
                    ⚠️ <strong>Warning:</strong> The response appears incomplete.
                    <button
                        onClick={handleContinueClick}
                        className="toggle-feedback-btn"
                        style={{ marginLeft: '1rem', width: 'auto' }}
                        disabled={loadingContinue}
                    >
                        {loadingContinue ? 'Continuing...' : 'Continue Analysis'}
                    </button>
                </div>
            )}

            {/* Original Text */}
            {feedback.originalText && (
                <div className="original-text">
                    <strong>Original Text:</strong>
                    <p>{feedback.originalText}</p>
                </div>
            )}

            {/* AI Feedback */}
            {fullFeedback && (
                <div className="ai-feedback">
                    <strong>AI Feedback:</strong>
                    <div
                        className="feedback-content"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
                    />
                    {isLong && (
                        <button
                            className="toggle-feedback-btn"
                            onClick={() => setExpanded(!expanded)}
                        >
                            {expanded ? "Show Less" : "Show More"}
                        </button>
                    )}
                </div>
            )}

            {/* Footer */}
            <footer className="feedback-footer">
                <div className="timestamp">
                    {feedback.timestamp && (
                        <small>
                            Analyzed at: {new Date(feedback.timestamp).toLocaleString('pl-PL', {
                                dateStyle: 'medium',
                                timeStyle: 'short'
                            })}
                        </small>
                    )}
                    {content && (
                        <small style={{ marginLeft: '1rem', color: '#9ca3af' }}>
                            ({content.length} characters)
                        </small>
                    )}
                </div>

                <div className="footer-actions">
                    <button className="copy-feedback-btn" onClick={handleCopy} title="Copy feedback">
                        {copied ? '✓ Copied!' : '📋 Copy'}
                    </button>
                    <button className="close-feedback-btn" onClick={onClose}>
                        Close Feedback
                    </button>
                </div>
            </footer>
        </section>
    );
};

/**
 * Detect actual truncation in feedback
 */
function detectTruncation(text, maxPreviewLength = 1800) {
    if (!text) return false;

    // Check for unclosed code blocks
    const codeBlockCount = (text.match(/```/g) || []).length;
    const hasUnclosedCodeBlock = codeBlockCount % 2 !== 0;

    // Check for incomplete markdown tables
    const tableRows = text.split('\n').filter(line => line.includes('|'));
    const hasIncompleteTable =
        tableRows.length > 0 &&
        tableRows[tableRows.length - 1]?.split('|').length < 3;

    // Check for completion marker
    const hasInternalMarker = /---\s*Analysis Complete\s*---/i.test(text);

    // Check if content is near max preview length
    const nearMaxLength = text.length >= maxPreviewLength;

    // Only mark as truncated if any "truly incomplete" condition exists
    return !hasInternalMarker || hasUnclosedCodeBlock || hasIncompleteTable || nearMaxLength;
}

export default FeedbackAnalysis;
