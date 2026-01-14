import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAppBySlug } from '../../lib/apps-data';
import './AppLanding.css';

function AppLanding() {
    const { appSlug } = useParams();
    const app = getAppBySlug(appSlug);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [openFaqIndex, setOpenFaqIndex] = useState(null);
    const [email, setEmail] = useState('');
    const [emailSubmitted, setEmailSubmitted] = useState(false);
    const carouselRef = useRef(null);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const featuresCount = app?.features?.length || 0;

    const nextSlide = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % featuresCount);
    }, [featuresCount]);

    const prevSlide = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + featuresCount) % featuresCount);
    }, [featuresCount]);

    const goToSlide = (index) => {
        setActiveIndex(index);
        setIsAutoPlaying(false);
    };

    // Auto-play carousel
    useEffect(() => {
        if (!isAutoPlaying || featuresCount === 0) return;
        const interval = setInterval(nextSlide, 4000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide, featuresCount]);

    // Back to top visibility
    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Touch handlers for swipe
    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            setIsAutoPlaying(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollToFeatures = () => {
        document.querySelector('.app-features')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (email) {
            setEmailSubmitted(true);
            setEmail('');
        }
    };

    // FAQ data
    const faqItems = [
        {
            question: "Is Kick free to use?",
            answer: "Yes! Kick is completely free with all features included. No subscriptions, no hidden costs."
        },
        {
            question: "Is my data private and secure?",
            answer: "Absolutely. All your pregnancy data is stored locally on your device. We never upload your personal health information to external servers."
        },
        {
            question: "Will Kick be available on iOS?",
            answer: "We're working on it! Sign up for our newsletter to be notified when the iOS version launches."
        },
        {
            question: "How accurate is the kick counting feature?",
            answer: "Kick provides a simple, accurate counter for tracking your baby's movements. However, always consult with your healthcare provider for medical advice."
        },
        {
            question: "Can I export my data?",
            answer: "Currently, data is stored locally on your device. We're considering export features for future updates."
        }
    ];

    if (!app) {
        return (
            <div className="app-not-found">
                <h1>App Not Found</h1>
                <p>Sorry, we couldn't find the app you're looking for.</p>
                <Link to="/apps" className="btn btn-primary">View All Apps</Link>
            </div>
        );
    }

    return (
        <div className="app-landing" style={{ '--app-color': app.primaryColor, '--app-secondary': app.secondaryColor }}>
            {/* Hero Section */}
            <section className="app-hero">
                {/* Animated Background */}
                <div className="app-hero-bg">
                    <div className="gradient-orb orb-1"></div>
                    <div className="gradient-orb orb-2"></div>
                    <div className="gradient-orb orb-3"></div>
                    <div className="noise-overlay"></div>
                </div>

                <div className="container">
                    <div className="app-hero-layout">
                        <div className="app-hero-content">
                            <div className="app-hero-icon">
                                <img src={app.icon} alt={`${app.name} icon`} />
                            </div>
                            <h1 className="app-hero-title">{app.name}</h1>
                            <p className="app-hero-tagline">{app.tagline}</p>
                            <p className="app-hero-description">{app.description}</p>
                            <div className="app-hero-buttons">
                                {app.platforms.android?.available && (
                                    <a
                                        href={app.platforms.android.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="store-button google-play"
                                    >
                                        <svg viewBox="0 0 24 24" className="store-icon">
                                            <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                                        </svg>
                                        <div className="store-text">
                                            <span className="store-small">Get it on</span>
                                            <span className="store-name">Google Play</span>
                                        </div>
                                    </a>
                                )}
                                {app.platforms.ios?.available && (
                                    <a
                                        href={app.platforms.ios.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="store-button app-store"
                                    >
                                        <svg viewBox="0 0 24 24" className="store-icon">
                                            <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
                                        </svg>
                                        <div className="store-text">
                                            <span className="store-small">Download on the</span>
                                            <span className="store-name">App Store</span>
                                        </div>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Phone Mockup */}
                        <div className="phone-mockup">
                            <div className="phone-frame">
                                <div className="phone-notch"></div>
                                <div className="phone-screen">
                                    <img src={app.icon} alt={`${app.name} preview`} className="phone-app-icon" />
                                    <span className="phone-app-name">{app.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <button className="scroll-indicator" onClick={scrollToFeatures} aria-label="Scroll to features">
                    <span className="scroll-text">Explore Features</span>
                    <svg viewBox="0 0 24 24" className="scroll-chevron">
                        <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" fill="currentColor" />
                    </svg>
                </button>
            </section>

            {/* Features Carousel Section */}
            <section className="app-features">
                <div className="container">
                    <h2 className="section-title">Features</h2>

                    {/* Feature Counter */}
                    <div className="feature-counter">
                        <span className="feature-current">{activeIndex + 1}</span>
                        <span className="feature-separator">/</span>
                        <span className="feature-total">{featuresCount}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="carousel-progress">
                        <div
                            className="carousel-progress-fill"
                            style={{ width: `${((activeIndex + 1) / featuresCount) * 100}%` }}
                        ></div>
                    </div>

                    <div
                        className="features-carousel"
                        ref={carouselRef}
                        onMouseEnter={() => setIsAutoPlaying(false)}
                        onMouseLeave={() => setIsAutoPlaying(true)}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {/* Navigation Arrow - Previous */}
                        <button
                            className="carousel-nav carousel-prev"
                            onClick={prevSlide}
                            aria-label="Previous feature"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="15,18 9,12 15,6" />
                            </svg>
                        </button>

                        {/* Carousel Track */}
                        <div className="carousel-track-container">
                            <div
                                className="carousel-track"
                                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                            >
                                {app.features.map((feature, index) => (
                                    <div
                                        className={`carousel-slide ${index === activeIndex ? 'active' : ''}`}
                                        key={index}
                                    >
                                        <div className="carousel-card">
                                            <div className="carousel-card-icon">{feature.icon}</div>
                                            <h3 className="carousel-card-title">{feature.title}</h3>
                                            <p className="carousel-card-description">{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Arrow - Next */}
                        <button
                            className="carousel-nav carousel-next"
                            onClick={nextSlide}
                            aria-label="Next feature"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="9,6 15,12 9,18" />
                            </svg>
                        </button>
                    </div>

                    {/* Dot Indicators */}
                    <div className="carousel-dots">
                        {app.features.map((_, index) => (
                            <button
                                key={index}
                                className={`carousel-dot ${index === activeIndex ? 'active' : ''}`}
                                onClick={() => goToSlide(index)}
                                aria-label={`Go to feature ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Screenshots Gallery Section */}
            <section className="app-screenshots">
                <div className="container">
                    <h2 className="section-title">See It In Action</h2>
                    <div className="screenshots-gallery">
                        {app.features.slice(0, 4).map((feature, index) => (
                            <div className="screenshot-item" key={index}>
                                <div className="screenshot-phone">
                                    <div className="screenshot-notch"></div>
                                    <div className="screenshot-content">
                                        <span className="screenshot-icon">{feature.icon}</span>
                                        <span className="screenshot-label">{feature.title}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="app-faq">
                <div className="container">
                    <h2 className="section-title">Frequently Asked Questions</h2>
                    <div className="faq-list">
                        {faqItems.map((item, index) => (
                            <div
                                className={`faq-item ${openFaqIndex === index ? 'open' : ''}`}
                                key={index}
                            >
                                <button
                                    className="faq-question"
                                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                                >
                                    <span>{item.question}</span>
                                    <svg viewBox="0 0 24 24" className="faq-icon">
                                        <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" fill="currentColor" />
                                    </svg>
                                </button>
                                <div className="faq-answer">
                                    <p>{item.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="app-newsletter">
                <div className="container">
                    <div className="newsletter-content">
                        <div className="newsletter-icon">📱</div>
                        <h2>Coming Soon to iOS</h2>
                        <p>Be the first to know when {app.name} launches on the App Store.</p>
                        {emailSubmitted ? (
                            <div className="newsletter-success">
                                <svg viewBox="0 0 24 24" className="success-icon">
                                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z" fill="currentColor" />
                                </svg>
                                <span>You're on the list! We'll notify you when iOS is ready.</span>
                            </div>
                        ) : (
                            <form className="newsletter-form" onSubmit={handleEmailSubmit}>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <button type="submit" className="newsletter-btn">Notify Me</button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* About Developer Section */}
            <section className="app-about-dev">
                <div className="container">
                    <div className="about-dev-content">
                        <h2>Built with ❤️</h2>
                        <p>
                            {app.name} is developed and maintained by Mefta Sadat, a software engineer passionate about
                            creating beautiful, useful applications that make a difference in people's lives.
                        </p>
                        <Link to="/" className="btn btn-secondary">Learn More About Me</Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="app-footer">
                <div className="container">
                    <div className="app-footer-content">
                        <div className="app-footer-brand">
                            <img src={app.icon} alt={app.name} className="footer-icon" />
                            <span>{app.name}</span>
                        </div>
                        <div className="app-footer-social">
                            <a href="https://github.com/meftasadat" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                                <svg viewBox="0 0 24 24">
                                    <path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" fill="currentColor" />
                                </svg>
                            </a>
                            <a href="https://twitter.com/meftasadat" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                                <svg viewBox="0 0 24 24">
                                    <path d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z" fill="currentColor" />
                                </svg>
                            </a>
                        </div>
                        <nav className="app-footer-links">
                            <Link to={`/apps/${app.slug}/privacy`}>Privacy Policy</Link>
                            <Link to={`/apps/${app.slug}/terms`}>Terms of Service</Link>
                            <Link to={`/apps/${app.slug}/contact`}>Contact</Link>
                        </nav>
                        <p className="app-footer-copyright">
                            © {new Date().getFullYear()} Mefta Sadat. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>

            {/* Back to Top Button */}
            <button
                className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
                onClick={scrollToTop}
                aria-label="Back to top"
            >
                <svg viewBox="0 0 24 24">
                    <path d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z" fill="currentColor" />
                </svg>
            </button>
        </div>
    );
}

export default AppLanding;
