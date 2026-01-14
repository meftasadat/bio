import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { getAppBySlug } from '../../lib/apps-data';
import './AppContact.css';

function AppContact() {
    const { appSlug } = useParams();
    const app = getAppBySlug(appSlug);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
    });

    if (!app) {
        return (
            <div className="contact-not-found">
                <h1>App Not Found</h1>
                <Link to="/apps" className="btn btn-primary">View All Apps</Link>
            </div>
        );
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Create mailto link with form data
        const subject = encodeURIComponent(`[${app.name}] ${formData.subject}`);
        const body = encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
        );
        window.location.href = `mailto:${app.contact.email}?subject=${subject}&body=${body}`;
    };

    return (
        <div className="contact-page" style={{ '--app-color': app.primaryColor }}>
            <div className="contact-header">
                <div className="container">
                    <Link to={`/apps/${app.slug}`} className="contact-back">
                        ← Back to {app.name}
                    </Link>
                    <div className="contact-app-info">
                        <img src={app.icon} alt={app.name} className="contact-app-icon" />
                        <div>
                            <h1>Contact Us</h1>
                            <p>Get help with {app.name}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="contact-content">
                    <div className="contact-info">
                        <h2>We're here to help</h2>
                        <p>
                            Have a question, found a bug, or want to request a feature?
                            We'd love to hear from you!
                        </p>

                        <div className="contact-methods">
                            <div className="contact-method">
                                <span className="contact-method-icon">📧</span>
                                <div>
                                    <h3>Email</h3>
                                    <a href={`mailto:${app.contact.email}`}>{app.contact.email}</a>
                                </div>
                            </div>

                            <div className="contact-method">
                                <span className="contact-method-icon">⏱️</span>
                                <div>
                                    <h3>Response Time</h3>
                                    <p>Usually within 24-48 hours</p>
                                </div>
                            </div>
                        </div>

                        <div className="contact-faq">
                            <h3>Common Questions</h3>
                            <details>
                                <summary>How do I delete my data?</summary>
                                <p>Go to Settings in the app and tap "Reset All Data". This will permanently delete all your data stored locally on your device.</p>
                            </details>
                            <details>
                                <summary>Is my data backed up?</summary>
                                <p>Currently, all data is stored locally on your device. We recommend taking regular backups of your device to preserve your data.</p>
                            </details>
                            <details>
                                <summary>How do I change my due date?</summary>
                                <p>Go to Settings and tap on "Pregnancy Details" to update your due date or other pregnancy information.</p>
                            </details>
                        </div>
                    </div>

                    <form className="contact-form" onSubmit={handleSubmit}>
                        <h2>Send a Message</h2>

                        <div className="form-group">
                            <label htmlFor="name">Your Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter your name"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="subject">Subject</label>
                            <select
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                            >
                                <option value="General Inquiry">General Inquiry</option>
                                <option value="Bug Report">Bug Report</option>
                                <option value="Feature Request">Feature Request</option>
                                <option value="Account Issue">Account Issue</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows="5"
                                placeholder="Describe your question or issue..."
                            />
                        </div>

                        <button type="submit" className="btn btn-primary submit-btn">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>

            <footer className="contact-footer">
                <div className="container">
                    <nav className="contact-footer-links">
                        <Link to={`/apps/${app.slug}`}>{app.name}</Link>
                        <Link to={`/apps/${app.slug}/privacy`}>Privacy Policy</Link>
                        <Link to={`/apps/${app.slug}/terms`}>Terms of Service</Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
}

export default AppContact;
