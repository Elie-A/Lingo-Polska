import React from 'react';
import './ReferenceExternalResources.css';
import externalResourcesData from "../DataRef/externalResourcesData";

const ReferenceExternalResources = () => {
    const categories = externalResourcesData.resources.categories;

    return (
        <div className="external-resources-page">
            <h1>🗂️ {externalResourcesData.resources.title}</h1>
            {/* Hero Section */}
            <section className="resources-hero">
                <p>{externalResourcesData.resources.description}</p>
            </section>

            {/* Resources Categories */}
            <div className="resources-container">
                {categories.map((category) => (
                    <section key={category.id} className="resource-category">
                        <div className="category-header">
                            <h2>{category.title}</h2>
                            <p className="category-description">{category.description}</p>
                        </div>

                        <div className="resource-links-grid">
                            {category.links.map((link, idx) => (
                                <a
                                    key={idx}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="resource-link-card"
                                >
                                    <div className="resource-card-content">
                                        <h3>{link.title}</h3>
                                        <p className="resource-description">{link.description}</p>
                                        <span className="external-link-icon">↗</span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            {/* Footer Note */}
            <section className="resources-footer">
                <p>
                    <strong>Note:</strong> These are external resources and are not affiliated with this application.
                    Links open in a new tab. Please verify the current availability and content of each resource.
                </p>
            </section>
        </div>
    );
};

export default ReferenceExternalResources;