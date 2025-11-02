import React, { useState } from 'react';
import ConjugationIntroduction from "./ConjugationIntroduction/ConjugationIntroduction";
import PresentTense from "./PresentTense/PresentTense";
import PastTense from './PastTense/PastTense';
import FutureTense from './FutureTense/FutureTense';
import Conjugator from "./Conjugator/Conjugator";
import './Conjugation.css';

const sections = [
    { id: 'introduction', title: 'Introduction', component: <ConjugationIntroduction /> },
    { id: 'present', title: 'Present Tense', component: <PresentTense /> },
    { id: 'past', title: 'Past Tense', component: <PastTense /> },
    { id: 'future', title: 'Future Tense', component: <FutureTense /> },
    { id: 'conjugator', title: 'Conjugator', component: <Conjugator /> },
];

const ConjugationPage = () => {
    const [activeSection, setActiveSection] = useState('introduction');

    return (
        <div className="conjugation-container">
            <nav className="conjugation-menu">
                <ul>
                    {sections.map(section => (
                        <li key={section.id}>
                            <button
                                className={activeSection === section.id ? 'active' : ''}
                                onClick={() => setActiveSection(section.id)}
                            >
                                {section.title}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="conjugation-content">
                {sections.map(section =>
                    activeSection === section.id && (
                        <section key={section.id} className="conjugation-section">
                            {section.component}
                        </section>
                    )
                )}
            </div>
        </div>
    );
};

export default ConjugationPage;
