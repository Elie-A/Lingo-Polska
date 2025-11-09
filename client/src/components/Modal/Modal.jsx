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
        <div className={`modal-overlay ${visible ? "show" : ""}`}>
            <div className="modal-content">
                <h3>{title}</h3>
                <p>{message}</p>
                <div className="modal-actions">
                    <button className="modal-confirm" onClick={onConfirm}>Confirm</button>
                    <button className="modal-cancel" onClick={handleClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
