// Central data file for all apps
// Add new apps by adding entries to this array

export const apps = [
    {
        slug: 'kick',
        name: 'Kick',
        tagline: 'Track every precious moment of your pregnancy journey',
        description: 'Kick is a beautiful, comprehensive pregnancy tracking app designed to help expecting parents monitor their pregnancy journey with ease. From counting those first precious kicks to preparing your hospital bag, Kick provides all the tools you need in one elegant app.',
        icon: '/apps/kick/icon.png',
        primaryColor: '#F08080',
        secondaryColor: '#FF6B6B',
        features: [
            {
                icon: '👶',
                title: 'Kick Counter',
                description: 'Track your baby\'s movements with an easy-to-use counter and get insights on activity patterns.'
            },
            {
                icon: '⏱️',
                title: 'Contraction Timer',
                description: 'Time your contractions with precision when labor begins, tracking duration and intervals.'
            },
            {
                icon: '📅',
                title: 'Weekly Pregnancy Guide',
                description: 'Follow your pregnancy week by week with detailed information about your baby\'s development.'
            },
            {
                icon: '⚖️',
                title: 'Weight Tracker',
                description: 'Monitor your weight gain throughout pregnancy and stay within healthy ranges.'
            },
            {
                icon: '🏥',
                title: 'Doctor Visit Tracker',
                description: 'Keep track of all your prenatal appointments, notes, and upcoming visits.'
            },
            {
                icon: '👼',
                title: 'Baby Names',
                description: 'Browse thousands of baby names with meanings, filter by origin and religion, and save your favorites.'
            },
            {
                icon: '🧳',
                title: 'Hospital Bag Checklist',
                description: 'Never forget essential items with our comprehensive hospital bag packing list.'
            },
            {
                icon: '🎯',
                title: 'Milestone Tracker',
                description: 'Celebrate and track important pregnancy milestones throughout your journey.'
            }
        ],
        screenshots: [],
        platforms: {
            android: {
                available: true,
                url: 'https://play.google.com/store/apps/details?id=xyz.meftasadat.kick',
                packageName: 'xyz.meftasadat.kick'
            },
            ios: {
                available: false,
                url: null
            }
        },
        contact: {
            email: 'kick@meftasadat.xyz',
            supportUrl: null
        },
        legal: {
            privacyPolicy: {
                lastUpdated: '2026-01-13',
                content: `
# Privacy Policy for Kick

**Last Updated: January 13, 2026**

## Introduction

Welcome to Kick ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience using our pregnancy tracking application ("App"). This Privacy Policy explains how we collect, use, and safeguard your information.

## Information We Collect

### Information You Provide
- **Pregnancy Information**: Due date, last menstrual period, pregnancy preferences
- **Health Data**: Kick counts, contraction times, weight entries
- **Preferences**: Theme selection, notification settings, saved baby names
- **Doctor Visit Notes**: Appointment dates, notes you choose to save

### Information Collected Automatically
- **Device Information**: Device type, operating system version
- **Usage Data**: App features used, session duration (anonymized)

## How We Use Your Information

We use your information to:
- Provide pregnancy tracking features and personalized insights
- Send optional reminders and notifications you've enabled
- Improve our app's functionality and user experience
- Provide customer support when requested

## Data Storage and Security

- **Local Storage**: All your personal pregnancy data is stored locally on your device
- **No Cloud Sync**: We do not upload your personal health data to external servers
- **Security**: We implement industry-standard security measures to protect your data

## Data Sharing

We **do not** sell, trade, or share your personal information with third parties. Your pregnancy journey is yours alone.

## Your Rights

You have the right to:
- Access all data stored in the app
- Delete all your data at any time through the app's Settings
- Opt out of any optional analytics

## Children's Privacy

Our app is intended for adults. We do not knowingly collect information from children under 13.

## Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of any changes by updating the "Last Updated" date.

## Contact Us

If you have questions about this Privacy Policy, please contact us at:
- Email: kick@meftasadat.xyz
- Website: https://meftasadat.xyz/apps/kick/contact
        `.trim()
            },
            termsOfService: {
                lastUpdated: '2026-01-13',
                content: `
# Terms of Service for Kick

**Last Updated: January 13, 2026**

## Agreement to Terms

By downloading, installing, or using Kick ("App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the App.

## Description of Service

Kick is a pregnancy tracking application that provides tools including kick counting, contraction timing, weight tracking, and informational content about pregnancy.

## Medical Disclaimer

**IMPORTANT**: Kick is intended for informational and tracking purposes only. It is **NOT** a substitute for professional medical advice, diagnosis, or treatment.

- Always consult with qualified healthcare providers regarding your pregnancy
- Never disregard professional medical advice because of information in this App
- If you experience concerning symptoms, contact your healthcare provider immediately
- In case of emergency, call your local emergency services

## User Responsibilities

By using the App, you agree to:
- Provide accurate information for tracking features
- Use the App for personal, non-commercial purposes
- Not attempt to reverse engineer or modify the App
- Not use the App for any unlawful purpose

## Intellectual Property

All content, features, and functionality of the App are owned by us and are protected by copyright, trademark, and other intellectual property laws.

## Limitation of Liability

To the maximum extent permitted by law:
- The App is provided "as is" without warranties of any kind
- We are not liable for any damages arising from your use of the App
- We do not guarantee the accuracy of informational content

## Changes to Terms

We reserve the right to modify these Terms at any time. Continued use of the App after changes constitutes acceptance of the new Terms.

## Termination

We may terminate or suspend your access to the App at any time, without prior notice, for conduct that we believe violates these Terms.

## Governing Law

These Terms are governed by the laws of Canada, without regard to conflict of law principles.

## Contact Us

For questions about these Terms, please contact us at:
- Email: kick@meftasadat.xyz
- Website: https://meftasadat.xyz/apps/kick/contact
        `.trim()
            }
        }
    }
];

// Helper function to get an app by slug
export const getAppBySlug = (slug) => {
    return apps.find(app => app.slug === slug);
};
