import React from 'react';
import './ConjugationIntroduction.css';

const ConjugationIntroduction = () => {
    return (<section className="introduction-section"> <h1 className="introduction-title">🔄 Conjugation</h1> <p className="introduction-content">
        This page is designed to help you master Polish verb conjugations across all tenses.
        You will find detailed explanations for the <strong>Present Tense</strong>, <strong> Past Tense</strong>, and <strong>Future Tense</strong>, each presented
        in a dedicated section for clarity. </p> <p className="introduction-content">
            Additionally, we provide a dynamic <strong>Polish Verb Conjugator</strong> that allows
            you to input any regular or irregular verb and instantly see its conjugation in
            different tenses. </p> <p className="introduction-content">
            To navigate the page: </p> <ul className="introduction-list"> <li>Scroll down to explore the <strong>Present Tense</strong>, <strong>Past Tense</strong>, and <strong>Future Tense</strong> sections.</li> <li>Use the navigation menu at the top to quickly jump to any tense section.</li> <li>Experiment with the conjugator to practice verbs dynamically and test your understanding.</li> </ul> <p className="introduction-content">
            Whether you are a beginner or looking to polish your skills, this page provides structured lessons
            and interactive practice to help you confidently conjugate Polish verbs. </p> </section>
    );
};

export default ConjugationIntroduction;
