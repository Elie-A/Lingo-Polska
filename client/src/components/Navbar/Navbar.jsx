import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import "./Navbar.css";

import PolandFlag from "../../assets/poland-flag.svg";

const FLAGS = {
    PL: PolandFlag,
};

export default function Navbar({ lessons }) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [lessonsOpen, setLessonsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Handle scroll for navbar shadow
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setLessonsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter lessons for dropdown
    const dropdownLessons = lessons.filter((lesson) =>
        ["Present Tense", "Past Tense", "Future Tense", "Cases", "Vocabulary"].includes(lesson.title)
    );

    const renderIcon = (icon) => {
        if (!icon) return null;

        if (typeof icon === "string" && icon.length === 2 && FLAGS[icon.toUpperCase()]) {
            const FlagSVG = FLAGS[icon.toUpperCase()];
            return <img src={FlagSVG} alt={`${icon} flag`} className="navbar-lesson-icon" />;
        }

        return <span className="navbar-lesson-icon">{icon}</span>;
    };

    return (
        <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
            <div className="nav-container">
                <Link to="/" className="nav-logo" onClick={() => setIsOpen(false)}>
                    🇵🇱 Lingo<span className="highlight-red">Polska</span>
                </Link>

                <button
                    className="nav-toggle"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                <ul className={`nav-links ${isOpen ? "open" : ""}`}>
                    <li>
                        <Link to="/" onClick={() => setIsOpen(false)}>
                            Home
                        </Link>
                    </li>

                    <li
                        className="nav-item-dropdown"
                        ref={dropdownRef}
                        onMouseEnter={() => window.innerWidth > 768 && setLessonsOpen(true)}
                        onMouseLeave={() => window.innerWidth > 768 && setLessonsOpen(false)}
                    >
                        <span
                            className="dropdown-title"
                            onClick={() => setLessonsOpen((prev) => !prev)}
                        >
                            Lessons <ChevronDown size={14} />
                        </span>

                        <ul className={`dropdown-menu ${lessonsOpen ? "open" : ""}`}>
                            {dropdownLessons.map((lesson, idx) => (
                                <li key={idx}>
                                    <Link
                                        to={lesson.path}
                                        state={{ icon: lesson.icon }} // Pass icon to LessonPage
                                        onClick={() => {
                                            setIsOpen(false);
                                            setLessonsOpen(false);
                                        }}
                                    >
                                        {renderIcon(lesson.icon)} {lesson.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>

                    <li>
                        <Link
                            to="/contact"
                            onClick={() => {
                                setIsOpen(false);
                                setLessonsOpen(false);
                            }}
                        >
                            Contact
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
