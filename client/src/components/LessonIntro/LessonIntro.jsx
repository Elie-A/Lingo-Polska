import React from "react";
import "./LessonIntro.css";

const LessonIntro = ({ title, subtitle, content }) => {
    return (
        <div className="lesson-intro">
            <h1 className="intro-title">{title}</h1>
            {subtitle && <p className="intro-subtitle">{subtitle}</p>}
            {content && <div className="intro-content">{content}</div>}
        </div>
    );
};

export default LessonIntro;
