import React from "react";

const ScoreBoard = ({ score, total, timer }) => {
    const minutes = Math.floor(timer / 60).toString().padStart(2, "0");
    const seconds = (timer % 60).toString().padStart(2, "0");

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
                fontWeight: 600,
                color: "#b91c1c",
            }}
        >
            <span>Score: {score} / {total}</span>
            <span>Time: {minutes}:{seconds}</span>
        </div>
    );
};

export default ScoreBoard;
