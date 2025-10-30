import React from "react";
import { useNavigate } from "react-router-dom";
import "./LessonCard.css";

// Optional: import SVG flags if needed
import PolandFlag from "../../assets/poland-flag.svg";

const FLAGS = {
    PL: PolandFlag,
};

export default function LessonCard({ title, description, icon, delay, classes, path }) {
    const navigate = useNavigate();

    // Auto-generate path if not provided
    const lessonPath = path || `/lesson/${title.toLowerCase().replace(/\s+/g, "-")}`;

    let displayIcon;
    if (React.isValidElement(icon)) {
        displayIcon = icon;
    } else if (typeof icon === "string" && icon.length === 2 && FLAGS[icon.toUpperCase()]) {
        const FlagSVG = FLAGS[icon.toUpperCase()];
        displayIcon = (
            <img src={FlagSVG} alt={`${icon.toUpperCase()} flag`} className="lesson-card-flag" />
        );
    } else {
        displayIcon = icon;
    }

    return (
        <div
            className="card-container"
            style={{ animationDelay: `${delay}ms` }}
            onClick={() => navigate(lessonPath, { state: { icon } })}
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
        </div>
    );
}
