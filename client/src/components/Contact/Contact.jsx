import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../Footer/Footer";
import "./Contact.css";

export default function Contact() {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState("");

    // Use environment variable for API URL
    const API_URL = import.meta.env.VITE_API_URL;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("Sending...");

        try {
            const response = await fetch(`${API_URL}/api/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            setStatus("✅ Message sent successfully!");
            setFormData({ name: "", email: "", message: "" });
        } catch (error) {
            console.error("Error sending message:", error);
            setStatus("❌ Failed to send message. Please try again.");
        }

        setTimeout(() => setStatus(""), 5000);
    };

    return (
        <>
            <section className="contact-section">
                <div className="contact-container">
                    <h2 className="contact-title">
                        <span className="highlight-red">Skontaktuj się</span> z nami (Contact Us)
                    </h2>
                    <p className="contact-subtitle">
                        Have questions about learning Polish, partnerships, or suggestions? Fill the form and we’ll reply soon.
                    </p>

                    <form className="contact-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <textarea
                            name="message"
                            placeholder="Your Message"
                            rows="5"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        ></textarea>
                        <button type="submit" className="contact-btn">
                            Send Message
                        </button>
                        {status && <p className="contact-status">{status}</p>}
                    </form>

                    <div className="contact-back">
                        <Link to="/" className="back-home-btn">
                            ⬅ Back to Home
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
