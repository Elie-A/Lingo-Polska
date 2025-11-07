import React, { useState, useEffect } from 'react';
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
import ReferencePrefixesMovements from './ReferencePrefixesMovements/ReferencePrefixesMovements';
import ReferencePrepositions from './ReferencePrepositions/ReferencePrepositions';
import ReferenceConjunctions from './ReferenceConjuctions/ReferenceConjunctions';
import ReferenceExternalResources from './ReferenceExternalResources/ReferenceExternalResources';

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
    { id: 'Polish Prefixes Movements', title: '🏃🏻‍♂️ Polish Prefixes Movements', component: <ReferencePrefixesMovements /> },
    { id: 'Polish Prepositions', title: '⛓️ Polish Prepositions', component: <ReferencePrepositions /> },
    { id: 'Polish Conjuctoins', title: '⚡ Polish Conjuctions', component: <ReferenceConjunctions /> },
    { id: 'Polish External Resources', title: '🗂️ Polish External Resources', component: <ReferenceExternalResources /> },
];

const ReferencePage = () => {
    const [activeSection, setActiveSection] = useState('introduction');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [fade, setFade] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSectionChange = (id) => {
        setFade(true);
        setTimeout(() => {
            setActiveSection(id);
            setFade(false);
        }, 200);
    };

    return (
        <div className="reference-container">
            {isMobile ? (
                <div className="reference-dropdown">
                    <select
                        value={activeSection}
                        onChange={(e) => handleSectionChange(e.target.value)}
                    >
                        {sections.map((section) => (
                            <option key={section.id} value={section.id}>
                                {section.title}
                            </option>
                        ))}
                    </select>
                </div>
            ) : (
                <nav className="reference-menu">
                    <ul>
                        {sections.map(section => (
                            <li key={section.id}>
                                <button
                                    className={activeSection === section.id ? 'active' : ''}
                                    onClick={() => handleSectionChange(section.id)}
                                >
                                    {section.title}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}

            <div className={`reference-content ${fade ? 'fade-out' : 'fade-in'}`}>
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
