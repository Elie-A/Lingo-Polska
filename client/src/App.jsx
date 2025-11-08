import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import LessonCard from "./components/LessonCard/LessonCard";
import LessonPage from "./components/LessonPage/LessonPage";
import Footer from "./components/Footer/Footer";
import Contact from "./components/Contact/Contact";
import lessons from "./utils/lessons";

import LoginPage from "./components/Admin/LoginPage/LoginPage";
import AdminDashboard from "./components/Admin/AdminDashboard/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar lessons={lessons} />
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

          {/* Lesson pages */}
          {lessons.map((lesson, idx) => (
            <Route
              key={idx}
              path={lesson.path}
              element={
                <LessonPage
                  lessonTitle={lesson.title}
                  lessonIntro={lesson.intro}
                  classes={lesson.classes}
                  lessonFolder={lesson.folder}
                />
              }
            />
          ))}

          <Route path="/contact" element={<Contact />} />

          {/* Admin routes */}
          <Route path="/panel" element={<LoginPage />} />

          {/* Protected admin dashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
        <Analytics />
      </div>
    </Router>
  );
}
