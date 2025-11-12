import React, { useEffect, useState } from "react";
import "./Modal.css";

export default function Modal({ title, message, onConfirm, onCancel }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true); // fade-in
    }, []);

    const handleClose = () => {
        setVisible(false); // fade-out
        setTimeout(() => onCancel(), 300);
    };

    return (
        <div className={`modals-overlay ${visible ? "show" : ""}`}>
            <div className="modals-content">
                <h3>{title}</h3>
                <p>{message}</p>
                <div className="modals-actions">
                    <button className="modals-confirm" onClick={onConfirm}>Confirm</button>
                    <button className="modals-cancel" onClick={handleClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
