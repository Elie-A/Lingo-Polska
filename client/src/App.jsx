import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react"

import Hero from './components/Hero/Hero';
import LessonCard from './components/LessonCard/LessonCard';
import Footer from './components/Footer/Footer';
import './App.css';

export default function App() {
  const lessons = [
    { title: 'Present Tense', description: 'Practice forming and using present tense verbs.', icon: '📝', link: '#present' },
    { title: 'Past Tense', description: 'Learn to describe past events accurately.', icon: '⏰', link: '#past' },
    { title: 'Future Tense', description: 'Master expressing future actions and intentions.', icon: '🚀', link: '#future' },
    { title: 'Conjugation', description: 'Rules for Polish verb conjugation.', icon: '🔄', link: '#conjugation' },
    { title: 'Cases', description: 'Learn the 7 Polish grammatical cases.', icon: '📚', link: '#cases' },
    { title: 'Vocabulary', description: 'Expand your vocabulary.', icon: '💬', link: '#vocabulary' },
    { title: 'Grammar & Gender', description: 'Study gender rules and grammar.', icon: '⚖️', link: '#grammar' },
    { title: 'Practice', description: 'Apply what you’ve learned with interactive exercises and real-life examples to strengthen your Polish skills.', icon: '✍🏻', link: '#practice' },
    { title: 'References', description: 'Explore useful resources.', icon: '🔗', link: '#references' },
  ];

  return (
    <Router>
      <div className="app-container">
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

        <Footer />
        <Analytics />
      </div>
    </Router>
  );
}
