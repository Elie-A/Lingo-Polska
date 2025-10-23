import React, { useState } from "react";
import { Link } from "react-router-dom"; // ✅ Import Link from React Router
import "./Footer.css";
import PolandFlag from "../../assets/poland-flag.svg";
import AboutModal from "../About/AboutModal"; // The modal component

export default function Footer() {
    const [isAboutOpen, setIsAboutOpen] = useState(false);

    return (
        <>
            <footer className="footer-base">
                <div className="footer-inner">
                    <div className="footer-brand-container">
                        <h3 className="footer-brand">
                            <img src={PolandFlag} alt="Polish Flag" className="footer-flag" />{" "}
                            Lingo Polska
                        </h3>
                        <p className="footer-description">
                            Your journey to Polish fluency starts here
                        </p>
                    </div>

                    <div className="footer-links">
                        <button
                            className="footer-link-button"
                            onClick={() => setIsAboutOpen(true)}
                        >
                            About
                        </button>

                        {/* ✅ Use React Router Link for Contact */}
                        <Link to="/contact" className="footer-link">
                            Contact
                        </Link>
                    </div>
                </div>

                <div className="footer-divider">
                    &copy; 2025 Lingo Polska. All rights reserved.
                </div>
            </footer>

            {/* Modal renders conditionally */}
            {isAboutOpen && <AboutModal onClose={() => setIsAboutOpen(false)} />}
        </>
    );
}
