
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppLogo, DiscordIcon, XIcon, LensIcon, InstagramIcon, GithubIcon, MediumIcon, PoiséIcon } from './icons/Icons';
import { AppView } from '../types';

interface FooterProps {
    onNavigate?: (view: AppView) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    const navigate = useNavigate();

    // Map of text to AppView
    const resources: { name: string, view: AppView | string }[] = [
        { name: 'Blog', view: 'blog' },
        { name: 'Pricing', view: 'pricing' },
        { name: 'FAQ', view: '#faq' },
        { name: 'Posture Guides', view: 'guides' },
        { name: 'Help & Support', view: 'support' },
        { name: 'Community', view: 'community' }
    ];
    const developers: { name: string, view: AppView }[] = [
        { name: 'Build', view: 'build' },
        { name: 'Documentation', view: 'docs' },
        { name: 'Security', view: 'security' },
        { name: 'Bug Bounty', view: 'bug-bounty' }
    ];
    const company: { name: string, view: AppView }[] = [
        { name: 'Privacy Policy', view: 'privacy' },
        { name: 'Terms of Use', view: 'terms' },
        { name: 'Contact', view: 'support' },
        { name: 'Manage Analytics', view: 'analytics' }
    ];
    // Removed other socials, kept only X and Github as requested
    const socials = [
        { icon: <XIcon />, href: 'https://twitter.com' },
        { icon: <GithubIcon />, href: 'https://github.com/Endiong/Poise' }
    ];

    const gradientStyle = {
        background: 'linear-gradient(to right, #22d3ee, #facc15, #fb923c, #f472b6, #c084fc)'
    };

    const handleLinkClick = (e: React.MouseEvent, view: AppView | string) => {
        if (view.startsWith('#')) {
            e.preventDefault();
            // Should navigate to landing then scroll
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(view.substring(1));
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            // Let the Link component handle it for semantic html, but we can also use this for logic if needed
        }
    };

    return (
        <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="col-span-1 lg:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <PoiséIcon className="w-8 h-8" />
                            <span className="text-2xl font-logo tracking-tight">poisé</span>
                        </div>
                        <p className="text-gray-500 text-sm max-w-xs">
                            Your personal AI wellness coach for building healthier posture habits.
                        </p>
                    </div>
                    <div className="col-span-1">
                        <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
                        <ul className="space-y-2">
                            {resources.map(link => (
                                <li key={link.name}>
                                    <Link
                                        to={link.view.startsWith('#') ? '/' : `/${link.view}`}
                                        onClick={(e) => link.view.startsWith('#') && handleLinkClick(e, link.view)}
                                        className="text-gray-500 hover:text-gray-900"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="col-span-1">
                        <h3 className="font-semibold text-gray-900 mb-4">Developers</h3>
                        <ul className="space-y-2">
                            {developers.map(link => (
                                <li key={link.name}>
                                    <Link to={`/${link.view}`} className="text-gray-500 hover:text-gray-900">{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="col-span-1">
                        <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
                        <ul className="space-y-2">
                            {company.map(link => (
                                <li key={link.name}>
                                    <Link to={`/${link.view}`} className="text-gray-500 hover:text-gray-900">{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
                    <div className="flex space-x-4">
                        {socials.map((item, index) => (
                            <a key={index} href={item.href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900">
                                {item.icon}
                            </a>
                        ))}
                    </div>
                    <p className="text-gray-400 text-sm mt-4 sm:mt-0">&copy; {new Date().getFullYear()} Poisé. All rights reserved.</p>
                </div>
                <div className="mt-8 space-y-2 flex flex-col items-center">
                    <div className="h-1 w-full rounded animated-gradient shadow-sm" style={gradientStyle}></div>
                    <div className="h-1 w-11/12 rounded animated-gradient shadow-sm opacity-75" style={gradientStyle}></div>
                    <div className="h-1 w-10/12 rounded animated-gradient shadow-sm opacity-50" style={gradientStyle}></div>
                    <div className="h-1 w-9/12 rounded animated-gradient shadow-sm opacity-25" style={gradientStyle}></div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
