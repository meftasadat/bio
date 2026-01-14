import { useParams, Link } from 'react-router-dom';
import { getAppBySlug } from '../../lib/apps-data';
import './LegalPage.css';

function PrivacyPolicy() {
    const { appSlug } = useParams();
    const app = getAppBySlug(appSlug);

    if (!app) {
        return (
            <div className="legal-not-found">
                <h1>App Not Found</h1>
                <Link to="/apps" className="btn btn-primary">View All Apps</Link>
            </div>
        );
    }

    // Convert markdown-like content to HTML
    const formatContent = (content) => {
        let html = content
            // Headers
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Lists
            .replace(/^- (.*$)/gim, '<li>$1</li>')
            // Paragraphs
            .split('\n\n').join('</p><p>');

        // Wrap list items in ul
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

        return html;
    };

    return (
        <div className="legal-page" style={{ '--app-color': app.primaryColor }}>
            <div className="legal-header">
                <div className="container">
                    <Link to={`/apps/${app.slug}`} className="legal-back">
                        ← Back to {app.name}
                    </Link>
                    <div className="legal-app-info">
                        <img src={app.icon} alt={app.name} className="legal-app-icon" />
                        <span>Privacy Policy</span>
                    </div>
                </div>
            </div>

            <div className="container">
                <article className="legal-content">
                    <div
                        className="legal-body"
                        dangerouslySetInnerHTML={{ __html: formatContent(app.legal.privacyPolicy.content) }}
                    />
                </article>
            </div>

            <footer className="legal-footer">
                <div className="container">
                    <p>Last Updated: {app.legal.privacyPolicy.lastUpdated}</p>
                    <nav className="legal-footer-links">
                        <Link to={`/apps/${app.slug}`}>{app.name}</Link>
                        <Link to={`/apps/${app.slug}/terms`}>Terms of Service</Link>
                        <Link to={`/apps/${app.slug}/contact`}>Contact</Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
}

export default PrivacyPolicy;
