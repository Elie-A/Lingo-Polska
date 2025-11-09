import React from "react";
import "./ExerciseManager.css";

export default function ExerciseManager() {
    return (
        <div className="manager-container">
            <div className="manager-card">
                <div className="emoji" role="img" aria-label="Construction Barrier">
                    🚧
                </div>
                <h1 className="title">Exercise Manager</h1>
                <p className="status">Under Construction!</p>
                <p className="description">
                    We're reworking the <strong>exercise management platform</strong> to make it more
                    intuitive and powerful. Stay tuned for updates!
                </p>
                <p className="footer">
                    Thank you for your patience. Check back later!
                </p>
            </div>
        </div>
    );
}
