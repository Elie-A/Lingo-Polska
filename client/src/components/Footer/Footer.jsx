import React from "react";
import { Link } from "react-router-dom"; // ✅ Import Link from React Router
import "./Footer.css";
import PolandFlag from "../../assets/poland-flag.svg";

export default function Footer() {
    return (
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
                    {/* Link to About page instead of opening modal */}
                    <Link to="/about" className="footer-link">
                        About
                    </Link>

                    {/* Link to Contact page */}
                    <Link to="/contact" className="footer-link">
                        Contact
                    </Link>

                    <a
                        href="https://buymeacoffee.com/lingopolska"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-link bmc-footer"
                    >
                        🍕 Buy Me a Pizza Slice
                    </a>
                </div>
            </div>

            <div className="footer-divider">
                &copy; 2025 Lingo Polska. All rights reserved.
            </div>
        </footer>
    );
}
