import React, { useState } from "react";
import "./HintBox.css";

const HintBox = ({ hints = [] }) => {
    const [visible, setVisible] = useState(false);

    if (!hints.length) return null;

    return (
        <div className="hint-box">
            <button
                className="hint-toggle"
                onClick={() => setVisible((prev) => !prev)}
            >
                {visible ? "Hide Hints" : "Show Hints"}
            </button>

            {visible && (
                <div className="hint-list">
                    <h4 className="hint-title">Helpful Hints:</h4>
                    <ul>
                        {hints.map((hint, index) => (
                            <li key={index} className="hint-item">
                                💡 {hint}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default HintBox;
