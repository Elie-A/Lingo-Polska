import React from 'react';
import './Hero.css';
import PolandFlag from '../../assets/poland-flag.svg';

export default function Hero() {
    return (
        <div className="hero-base">
            {/* Background blobs */}
            <div className="blob blob1"></div>
            <div className="blob blob2"></div>
            <div className="blob blob3"></div>

            {/* Hero content */}
            <div className="hero-content">
                <img
                    src={PolandFlag}
                    alt="Polish Flag"
                    className="hero-flag"
                />
                <h1 className="hero-title">Lingo Polska / Learn Polish</h1>
                <p className="hero-subtitle">
                    Master the Polish language with <strong>interactive lessons</strong> designed for{' '}
                    <span>grammar</span>, <span>vocabulary</span>, and <span>conversation</span> skills.
                </p>

                <div className="hero-badges">
                    <span className="hero-badge">✓ Interactive Exercises</span>
                    <span className="hero-badge">✓ Grammar Mastery</span>
                    <span className="hero-badge">✓ Real Conversations</span>
                </div>
            </div>

            {/* Wave SVG */}
            <svg
                className="wave-svg"
                viewBox="0 0 1440 120"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" />
            </svg>
        </div>
    );
}
