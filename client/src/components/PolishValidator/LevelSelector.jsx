// src/components/PolishValidator/LevelSelector.jsx
import React from 'react';
import './LevelSelector.css';

const LevelSelector = ({ levels, level, setLevel, onAutoDetect, detecting, loading }) => {
    return (
        <section className="level-selection">
            <div className="level-header">
                <h3>Select Your Level</h3>
                <button
                    onClick={onAutoDetect}
                    disabled={detecting || loading}
                    className="auto-detect-btn"
                >
                    {detecting ? 'Detecting...' : '🔍 Auto-Detect'}
                </button>
            </div>

            <div className="level-options">
                {levels.map(lvl => (
                    <div
                        key={lvl.value}
                        className={`level-card ${level === lvl.value ? 'active' : ''}`}
                        onClick={() => setLevel(lvl.value)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter') setLevel(lvl.value); }}
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
                <strong>Current Level:</strong> {levels.find(l => l.value === level)?.icon} {levels.find(l => l.value === level)?.label}
            </div>
        </section>
    );
};

export default LevelSelector;
