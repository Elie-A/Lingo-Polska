import React from 'react';
import './LessonCard.css';

// Import your SVG flags here
import PolandFlag from '../../assets/poland-flag.svg';
// Add other flags as needed, e.g., import UKFlag from '../../assets/uk-flag.svg';

const FLAGS = {
    PL: PolandFlag,
    // Add more country codes mapping to SVGs here
    // GB: UKFlag,
};

export default function LessonCard({ title, description, icon, delay, link }) {
    let displayIcon;

    if (React.isValidElement(icon)) {
        // Already JSX or SVG element
        displayIcon = icon;
    } else if (typeof icon === 'string' && icon.length === 2 && FLAGS[icon.toUpperCase()]) {
        // 2-letter country code mapped to SVG
        const FlagSVG = FLAGS[icon.toUpperCase()];
        displayIcon = <img src={FlagSVG} alt={`${icon.toUpperCase()} flag`} className="lesson-card-flag" />;
    } else {
        // Fallback: emoji or text
        displayIcon = icon;
    }

    return (
        <a
            href={link}
            className="card-container"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="card-glow-hover"></div>
            <div className="card-base">
                <div className="card-decorative-bg"></div>

                <div className="card-content">
                    <div className="card-icon-container">{displayIcon}</div>
                    <h3 className="card-title">{title}</h3>
                    <p className="card-description">{description}</p>
                </div>

                <button className="card-button">
                    Start Lesson
                    <span className="card-button-arrow">→</span>
                </button>
            </div>
        </a>
    );
}
