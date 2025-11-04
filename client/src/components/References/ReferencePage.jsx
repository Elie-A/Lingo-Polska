import React, { useState } from 'react';
import ReferenceIntroduction from "./ReferenceIntroduction/ReferenceIntroduction";
import ReferenceAlphabet from "./ReferenceAlphabet/ReferenceAlphabet";
import ReferenceNumber from "./ReferenceNumber/ReferenceNumber";
import './Reference.css';

const sections = [
    { id: 'introduction', title: 'Introduction', component: <ReferenceIntroduction /> },
    { id: 'Polish Alphabet', title: 'Polish Alphabet', component: <ReferenceAlphabet /> },
    { id: 'Polish Numbers', title: 'Polish Numbers', component: <ReferenceNumber /> },
];

const ReferencePage = () => {
    const [activeSection, setActiveSection] = useState('introduction');

    return (
        <div className="reference-container">
            <nav className="reference-menu">
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

            <div className="reference-content">
                {sections.map(section =>
                    activeSection === section.id && (
                        <section key={section.id} className="reference-section">
                            {section.component}
                        </section>
                    )
                )}
            </div>
        </div>
    );
};

export default ReferencePage;
