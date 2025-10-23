import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import LessonCard from "./components/LessonCard/LessonCard";
import Footer from "./components/Footer/Footer";
import Contact from "./components/Contact/Contact";
import "./App.css";

export default function App() {
  const lessons = [
    { title: "Present Tense", description: "Instantly talk about daily life and current activities. Form and use verbs for what’s happening right now!", icon: "📝", link: "#present" },
    { title: "Past Tense", description: "Unlock the ability to share stories, recall memories, and describe events that have already happened.", icon: "⏰", link: "#past" },
    { title: "Future Tense", description: "Master the methods for discussing upcoming plans, goals, and intentions with confidence.", icon: "🚀", link: "#future" },
    { title: "Conjugation", description: "Decode the crucial rules and patterns to correctly inflect any Polish verb and speak fluently.", icon: "🔄", link: "#conjugation" },
    { title: "Cases", description: "Demystify the 7 Polish grammatical cases and learn how they change nouns, adjectives, and pronouns in sentences.", icon: "📚", link: "#cases" },
    { title: "Vocabulary", description: "Dramatically expand your practical Polish words and phrases for everyday conversations and situations.", icon: "💬", link: "#vocabulary" },
    { title: "Grammar & Gender", description: "Build a strong foundation by understanding sentence structure, noun genders, and core grammatical rules.", icon: "⚖️", link: "#grammar" },
    { title: "Practice", description: "Apply what you’ve learned with interactive exercises and real-life examples to strengthen your Polish skills.", icon: "✍🏻", link: "#practice" },
    { title: "References", description: "Access a curated list of external resources, dictionaries, and tools to continue your Polish learning journey.", icon: "🔗", link: "#references" },
  ];

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <section className="lesson-section">
                  <div className="lesson-header">
                    <h2 className="section-title">
                      <span className="highlight-red">Odkryj</span> Twoją Ścieżkę (Discover Your Path)
                    </h2>
                    <p className="section-subtitle">
                      Select a lesson category and start your Polish learning adventure with our structured, interactive courses.
                    </p>
                  </div>

                  <div className="grid-container">
                    {lessons.map((lesson, idx) => (
                      <LessonCard key={idx} {...lesson} delay={idx * 150} />
                    ))}
                  </div>
                </section>
              </>
            }
          />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
        <Analytics />
      </div>
    </Router>
  );
}
