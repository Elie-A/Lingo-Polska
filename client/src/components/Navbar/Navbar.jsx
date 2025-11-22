import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import "./Navbar.css";
import PolandFlag from "../../assets/poland-flag.svg";

const FLAGS = { PL: PolandFlag };

export default function Navbar({ lessons }) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [lessonsOpen, setLessonsOpen] = useState(false);
    const [tensesOpen, setTensesOpen] = useState(false);

    const dropdownRef = useRef(null);
    const tensesRef = useRef(null);
    const closeTimeout = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setLessonsOpen(false);
                setTensesOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const renderIcon = (icon) => {
        if (!icon) return null;
        if (typeof icon === "string" && icon.length === 2 && FLAGS[icon.toUpperCase()]) {
            const FlagSVG = FLAGS[icon.toUpperCase()];
            return <img src={FlagSVG} alt={`${icon} flag`} className="navbar-lesson-icon" />;
        }
        return <span className="navbar-lesson-icon">{icon}</span>;
    };

    const tenseLessons = lessons.filter((l) =>
        ["Present Tense", "Past Tense", "Future Tense", "Conditional Mood", "Modal Verbs"].includes(l.title)
    );
    const otherLessons = lessons.filter(
        (l) => !["Present Tense", "Past Tense", "Future Tense", "Conditional Mood", "Modal Verbs"].includes(l.title)
    );

    const handleMouseEnterTenses = () => {
        if (closeTimeout.current) clearTimeout(closeTimeout.current);
        setTensesOpen(true);
    };

    const handleMouseLeaveTenses = () => {
        closeTimeout.current = setTimeout(() => setTensesOpen(false), 200);
    };

    return (
        <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
            <div className="nav-container">
                <Link to="/" className="nav-logo" onClick={() => setIsOpen(false)}>
                    🇵🇱 Lingo<span className="highlight-red">Polska</span>
                </Link>

                <button className="nav-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                <ul className={`nav-links ${isOpen ? "open" : ""}`}>
                    <li>
                        <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
                    </li>

                    <li
                        className="nav-item-dropdown"
                        ref={dropdownRef}
                        onMouseEnter={() => window.innerWidth > 768 && setLessonsOpen(true) && handleMouseEnterTenses()}
                        onMouseLeave={() => {
                            if (window.innerWidth > 768) {
                                handleMouseLeaveTenses();
                                setLessonsOpen(false);
                                setTensesOpen(false);
                            }
                        }}
                    >
                        <span className="dropdown-title" onClick={() => setLessonsOpen((p) => !p)}>
                            Lessons <ChevronDown size={14} />
                        </span>

                        <ul className={`dropdown-menu ${lessonsOpen ? "open" : ""}`}>
                            <li
                                className="nav-subitem-dropdown"
                                ref={tensesRef}
                                onMouseEnter={() => window.innerWidth > 768 && setTensesOpen(true)}
                                onMouseLeave={() => window.innerWidth > 768 && setTensesOpen(false)}
                            >
                                <span
                                    className="dropdown-subtitle"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setTensesOpen((prev) => !prev);
                                    }}
                                >
                                    📅 Verbs <ChevronRight size={12} className="chevron-right" />
                                </span>
                                <ul className={`dropdown-submenu ${tensesOpen ? "open" : ""}`}>
                                    {tenseLessons.map((lesson, idx) => (
                                        <li key={idx}>
                                            <Link
                                                to={lesson.path}
                                                state={{ icon: lesson.icon }}
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    setLessonsOpen(false);
                                                    setTensesOpen(false);
                                                }}
                                            >
                                                {renderIcon(lesson.icon)} {lesson.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>

                            {otherLessons.map((lesson, idx) => (
                                <li key={idx}>
                                    <Link
                                        to={lesson.path}
                                        state={{ icon: lesson.icon }}
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
                        <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
                    </li>

                    <li>
                        <Link to="/contact" onClick={() => { setIsOpen(false); setLessonsOpen(false); }}>
                            Contact
                        </Link>
                    </li>

                    <li>
                        <a
                            href="https://buymeacoffee.com/lingopolska"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bmc-button"
                            onClick={() => setIsOpen(false)}
                        >
                            🍕 Buy Me a Pizza Slice
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}