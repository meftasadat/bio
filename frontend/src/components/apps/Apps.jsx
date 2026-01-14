import { Link } from 'react-router-dom';
import { apps } from '../../lib/apps-data';
import './Apps.css';

function Apps() {
    return (
        <section className="apps-section">
            <div className="container">
                <h1 className="section-title">My Apps</h1>
                <p className="apps-intro">
                    Beautiful, thoughtfully crafted mobile applications designed to make your life easier.
                </p>

                <div className="apps-grid">
                    {apps.map((app) => (
                        <Link
                            to={`/apps/${app.slug}`}
                            key={app.slug}
                            className="app-card"
                            style={{ '--app-color': app.primaryColor }}
                        >
                            <div className="app-card-icon">
                                <img src={app.icon} alt={`${app.name} icon`} />
                            </div>
                            <div className="app-card-content">
                                <h2 className="app-card-name">{app.name}</h2>
                                <p className="app-card-tagline">{app.tagline}</p>
                                <div className="app-card-platforms">
                                    {app.platforms.android?.available && (
                                        <span className="platform-badge android">Android</span>
                                    )}
                                    {app.platforms.ios?.available && (
                                        <span className="platform-badge ios">iOS</span>
                                    )}
                                </div>
                            </div>
                            <div className="app-card-arrow">→</div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Apps;
