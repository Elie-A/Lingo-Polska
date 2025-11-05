import React, { useState } from 'react';
import ReferenceIntroduction from "./ReferenceIntroduction/ReferenceIntroduction";
import ReferenceAlphabet from "./ReferenceAlphabet/ReferenceAlphabet";
import ReferenceNumber from "./ReferenceNumber/ReferenceNumber";
import ReferenceGender from "./ReferenceGender/ReferenceGender";
import ReferenceColor from "./ReferenceColor/ReferenceColor";
import ReferenceCalendar from "./ReferenceCalendar/ReferenceCalendar";
import ReferenceCases from "./ReferenceCases/ReferenceCases";
import ReferencePossessivePronouns from "./ReferencePossessivePronouns/ReferencePossessivePronouns";
import ReferencePersonalPronouns from "./ReferencePersonalPronouns/ReferencePersonalPronouns";
import ReferenceVerbs from "./ReferenceVerbs/ReferenceVerbs";
import './Reference.css';

const sections = [
    { id: 'introduction', title: '📚 Introduction', component: <ReferenceIntroduction /> },
    { id: 'Polish Alphabet', title: '🔠 Polish Alphabet', component: <ReferenceAlphabet /> },
    { id: 'Polish Numbers', title: '🔢 Polish Numbers', component: <ReferenceNumber /> },
    { id: 'Polish Genders', title: '🧑🏻 Polish Genders', component: <ReferenceGender /> },
    { id: 'Polish Colors', title: '🎨 Polish Colors', component: <ReferenceColor /> },
    { id: 'Polish Calendar', title: '📅 Polish Calendar', component: <ReferenceCalendar /> },
    { id: 'Polish Cases', title: '📝 Polish Cases', component: <ReferenceCases /> },
    { id: 'Polish Possessive Pronouns', title: '🏷️ Polish Possessive Pronouns', component: <ReferencePossessivePronouns /> },
    { id: 'Polish Personal Pronouns', title: '🆔 Polish Personal Pronouns', component: <ReferencePersonalPronouns /> },
    { id: 'Polish Verbs', title: '🎬 Polish Verbs', component: <ReferenceVerbs /> },
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
