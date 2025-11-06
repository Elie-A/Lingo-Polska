import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './AboutModal.css';
import PolandFlag from '../../assets/poland-flag.svg';

export default function AboutModal({ onClose }) {
    const modalRef = useRef();
    const [isClosing, setIsClosing] = useState(false);

    // Focus modal on mount
    useEffect(() => {
        modalRef.current?.focus();
    }, []);

    // Prevent background scroll while modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    // Handle Escape key
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    // Fade-out close handler
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 300); // match fadeOut animation duration
    };

    return (
        <div
            className={`modal-overlay ${isClosing ? 'fade-out' : 'fade-in'}`}
            onClick={handleClose}
        >
            <div
                className={`modal-content ${isClosing ? 'closing' : 'open'}`}
                onClick={(e) => e.stopPropagation()}
                tabIndex="-1"
                ref={modalRef}
            >
                {/* Close Button */}
                <button
                    className="modal-close-button"
                    onClick={handleClose}
                    aria-label="Close about modal"
                >
                    ×
                </button>

                {/* Animated Blobs */}
                <div className="blob blob1"></div>
                <div className="blob blob2"></div>
                <div className="blob blob3"></div>

                {/* Title */}
                <h1 className="modal-title">
                    <img
                        src={PolandFlag}
                        alt="Polish Flag"
                        className="modal-flag"
                    />{' '}
                    Lingo Polska
                </h1>

                {/* Description */}
                <div className="modal-description">
                    <p>
                        Lingo Polska was created from a simple belief - that
                        language learning can do more than teach words; it can
                        bring comfort, focus, and purpose.
                    </p>
                    <p>
                        I began this project during a difficult period in my
                        life, when my Polish lessons became a source of calm and
                        connection. What started as a personal way to stay
                        grounded soon evolved into something bigger - a platform
                        designed to help others experience that same sense of
                        progress and meaning through learning Polish.
                    </p>
                    <p>
                        Lingo Polska isn't about chasing perfection; it's about
                        growth, curiosity, and the small victories that keep us
                        moving forward. My goal is to build practical,
                        high-quality tools that support both learners and
                        teachers, while staying true to what made me start in
                        the first place - gratitude.
                    </p>
                    <p>
                        Every feature and exercise here is built with that
                        spirit. This website is my thank-you to the people who
                        make language learning meaningful.
                    </p>
                </div>

                {/* Footer */}
                <div className="about-footer">
                    Dedicated to my Polish teacher{' '}
                    <span className="heart">❤️</span> - for reminding me that
                    even the hardest days can begin again in a new language.
                </div>
            </div>
        </div>
    );
}

AboutModal.propTypes = {
    onClose: PropTypes.func.isRequired,
};
