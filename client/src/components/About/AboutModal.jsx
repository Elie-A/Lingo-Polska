import React from 'react';
import './AboutModal.css';
import PolandFlag from '../../assets/poland-flag.svg';

export default function AboutModal({ onClose }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {/* Close button */}
                <button className="modal-close-button" onClick={onClose}>×</button>

                {/* Animated Blobs */}
                <div className="blob blob1"></div>
                <div className="blob blob2"></div>
                <div className="blob blob3"></div>

                {/* Content */}
                <h1 className="modal-title">
                    <img src={PolandFlag} alt="Polish Flag" className="modal-flag" /> Lingo Polska
                </h1>

                <p className="modal-description">
                    Welcome to Lingo Polska! We are dedicated to helping learners achieve fluency in Polish
                    through fun, interactive lessons, quizzes, and practical exercises. Our goal is to make
                    language learning engaging, effective, and enjoyable for everyone.
                </p>
            </div>
        </div>
    );
}
