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

                {/* Title */}
                <h1 className="modal-title">
                    <img src={PolandFlag} alt="Polish Flag" className="modal-flag" /> Lingo Polska
                </h1>

                {/* About text */}
                <div className="modal-description">
                    <p>
                        Lingo Polska was created from a simple belief - that language learning can do more than teach words;
                        it can bring comfort, focus, and purpose.
                    </p>
                    <p>
                        I began this project during a difficult period in my life, when my Polish lessons became a source of calm
                        and connection. What started as a personal way to stay grounded soon evolved into something bigger - a
                        platform designed to help others experience that same sense of progress and meaning through learning Polish.
                    </p>
                    <p>
                        Lingo Polska isn't about chasing perfection; it's about growth, curiosity, and the small victories that keep
                        us moving forward. My goal is to build practical, high-quality tools that support both learners and teachers,
                        while staying true to what made me start in the first place - gratitude.
                    </p>
                    <p>
                        Every feature and exercise here is built with that spirit. This website is my thank-you to the people who make
                        language learning meaningful.
                    </p>
                </div>

                {/* Footer dedication */}
                <div className="about-footer">
                    Dedicated to my Polish teacher <span className="heart">❤️</span> - for reminding me that even the hardest days can begin again in a new language.
                </div>
            </div>
        </div>
    );
}
