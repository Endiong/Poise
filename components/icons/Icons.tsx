
import React from 'react';

export const PoiséIcon = ({className = "w-8 h-8", style}: {className?: string, style?: React.CSSProperties}) => (
  <svg 
    width="93" 
    height="58" 
    viewBox="0 0 93 58" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`${className} poise-logo transition-all duration-300 hover:scale-110`} 
    style={style}
  >
    <path className="transition-all duration-300" d="M46.4354 0C20.7874 0 -0.00671193 21.1902 1.62519e-06 47.3216H11.8629C11.8629 27.7382 27.219 11.8606 46.4354 11.8606C65.6519 11.8606 81.008 27.7382 81.008 47.3216H92.8708C92.8753 21.1902 72.0812 0 46.4354 0Z" fill="currentColor"/>
    <path className="poise-eye transition-all duration-500 hover:animate-pulse" d="M44.4494 47.2872C44.4494 44.4491 43.322 41.7271 41.3151 39.7203C39.3082 37.7134 36.5863 36.5859 33.7482 36.5859C30.91 36.5859 28.1881 37.7134 26.1812 39.7203C24.1743 41.7271 23.0469 44.4491 23.0469 47.2872L33.7482 47.2872H44.4494Z" fill="currentColor"/>
    <path className="poise-eye transition-all duration-500 hover:animate-pulse" d="M69.7893 47.2872C69.7893 44.4491 68.6618 41.7271 66.6549 39.7203C64.6481 37.7134 61.9262 36.5859 59.088 36.5859C56.2498 36.5859 53.5279 37.7134 51.5211 39.7203C49.5142 41.7271 48.3867 44.4491 48.3867 47.2872L59.088 47.2872H69.7893Z" fill="currentColor"/>
  </svg>
);

// --- UI Icons (Modern Stroke Style) ---

export const SunIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

export const MoonIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

export const AppLogo = () => <PoiséIcon className="w-8 h-8" />;
export const AuthLogoIcon = () => <PoiséIcon className="w-12 h-12 text-gray-900" />;

export const SearchIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const ArrowRightIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export const AppIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="7" height="7" x="3" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="14" rx="1" />
    <rect width="7" height="7" x="3" y="14" rx="1" />
  </svg>
);

export const GhoIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </svg>
);

export const BarChartIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" x2="12" y1="20" y2="10" />
    <line x1="18" x2="18" y1="20" y2="4" />
    <line x1="6" x2="6" y1="20" y2="16" />
  </svg>
);

export const BrandIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

export const FaqIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </svg>
);

export const HelpIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

export const GovernanceIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const BuildIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m16.24 7.76-2.5-2.5a2.5 2.5 0 1 0-3.53 3.53l.96.97" />
    <path d="m8.65 11.78-.96.97a6 6 0 1 0 8.49 8.48l.97-.96" />
    <path d="m2 2 20 20" />
  </svg>
);

export const DocsIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" x2="8" y1="13" y2="13" />
    <line x1="16" x2="8" y1="17" y2="17" />
    <line x1="10" x2="8" y1="9" y2="9" />
  </svg>
);

export const SecurityIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
  </svg>
);

export const BugBountyIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m8 2 1.88 1.88" />
    <path d="M14.12 3.88 16 2" />
    <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
    <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
    <path d="M12 20v-9" />
    <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
    <path d="M6 13H2" />
    <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
    <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
    <path d="M22 13h-4" />
    <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
  </svg>
);

export const XIcon = ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
export const DiscordIcon = ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.369a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.369-.42.839-.579 1.239a18.28 18.28 0 00-3.658 0 18.278 18.278 0 00-.579-1.239.074.074 0 00-.079-.037A19.736 19.736 0 003.683 4.37a.077.077 0 00-.035.079C3.388 6.273 3.218 8.44 3.218 10.615c0 6.088 2.903 7.615 2.903 7.615a.075.075 0 00.086-.046c.21-.39.419-.81.588-1.229a.074.074 0 00-.046-.086c-.419-.17-.828-.37-1.228-.618a.075.075 0 00-.086.037c-.03.046-.046.105-.046.147 0 .58.229 1.13.638 1.628a.075.075 0 00.086.046c.72-.25 1.44-.55 2.16-.9a.075.075 0 00.046-.086 16.29 16.29 0 00-1.23-2.218.075.075 0 00-.01-.116c.03-.01.046-.03.075-.046a13.16 13.16 0 006.268 0 .075.075 0 00.075.046c-.01.03-.03.06-.046.086-.01.03-.01.046-.01.075-.01.03-.01.046 0 .075a16.29 16.29 0 00-1.23 2.228.075.075 0 00.046.086c.72.35 1.44.65 2.16.9a.075.075 0 00.086-.046c.409-.498.638-1.048.638-1.628a.075.075 0 00-.046-.147c-.01-.01-.03-.03-.046-.046a.075.075 0 00-.086-.037c-.4.248-.81.448-1.229.618a.075.075 0 00-.046.086c.17.42.38.84.59 1.23a.075.075 0 00.086.046c0 0 2.903-1.527 2.903-7.615 0-2.175-.17-4.342-.43-6.246a.077.077 0 00-.035-.08z" /></svg>;
export const LensIcon = ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2.5-9h5v2h-5v-2zm-2.5-2.5h10v2h-10v-2z" /></svg>;
export const InstagramIcon = ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 017.8 2zm0 2A3.8 3.8 0 004 7.8v8.4A3.8 3.8 0 007.8 20h8.4A3.8 3.8 0 0020 16.2V7.8A3.8 3.8 0 0016.2 4H7.8zM12 9a3 3 0 100 6 3 3 0 000-6zm0 2a1 1 0 110 2 1 1 0 010-2zm4.5-3.5a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" /></svg>;
export const GithubIcon = ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48v-1.69c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48C19.13 20.17 22 16.42 22 12c0-5.52-4.48-10-10-10z" /></svg>;
export const MediumIcon = ({ className = "w-5 h-5" }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10c2.76 0 5 2.24 5 5v10c0 2.76-2.24 5-5 5H7c-2.76 0-5-2.24-5-5V7c0-2.76 2.24-5 5-5zm4 6.5c0 .28-.22.5-.5.5h-2c-.28 0-.5-.22-.5-.5v-1c0-.28.22-.5.5-.5h2c.28 0 .5.22.5.5v1zm5.5 0c0 .28-.22.5-.5.5h-2c-.28 0-.5-.22-.5-.5v-1c0-.28.22-.5.5-.5h2c.28 0 .5.22.5.5v1zm-3.5 5c0 .28-.22.5-.5.5h-5c-.28 0-.5-.22-.5-.5v-1c0-.28.22-.5.5-.5h5c.28 0 .5.22.5.5v1z" /></svg>;

export const PlusIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

export const MinusIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14" />
  </svg>
);

export const SettingsIcon = ({ className = "h-6 w-6" }: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={`${className} transition-all duration-500 hover:rotate-180 group`}>
    <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2" fill="none"/>
    <circle className="transition-all duration-500 group-hover:fill-current" cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <circle className="transition-all duration-400 group-hover:r-2.5" cx="16" cy="8" r="1.5" fill="currentColor"/>
    <circle className="transition-all duration-600 group-hover:fill-current" cx="8" cy="16" r="1.5" fill="currentColor"/>
    <circle className="transition-all duration-300 group-hover:r-2.5 group-hover:animate-pulse" cx="16" cy="16" r="2" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.3"/>
    <path className="transition-all duration-500 group-hover:translate-x-1" d="M7 12h10M12 7v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const CloseIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

export const GoogleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.986,36.68,44,31.13,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
);

export const EyeIcon = ({ className = "w-5 h-5" }: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const EyeOffIcon = ({ className = "w-5 h-5" }: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c2.34 0 4.51-.84 6.27-2.26" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

export const LoaderIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export const HomeIcon = ({className = "w-5 h-5"}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={`${className} transition-all duration-300 hover:scale-110 hover:-translate-y-1 group`}>
    <path className="transition-all duration-300 group-hover:fill-current" fill="currentColor" fillOpacity="0.2" d="M12 3L4 9v12a1 1 0 001 1h4v-7a1 1 0 011-1h4a1 1 0 011 1v7h4a1 1 0 001-1V9l-8-6z"/>
    <path className="transition-all duration-300" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 10l9-7 9 7M9 22v-8h6v8"/>
    <circle className="transition-all duration-500 group-hover:r-1.5" cx="12" cy="2" r="0" fill="currentColor"/>
  </svg>
);

export const CameraIcon = ({className = "w-5 h-5"}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
);

export const TrophyIcon = ({className = "w-5 h-5"}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={`${className} transition-all duration-500 hover:scale-125 hover:rotate-12 group`}>
    <circle className="transition-all duration-700 group-hover:fill-yellow-400 group-hover:fill-opacity-30" cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2.5" fill="none"/>
    <circle className="transition-all duration-500 group-hover:r-4" cx="12" cy="12" r="5" fill="currentColor" fillOpacity="0.15"/>
    <path className="transition-all duration-300 group-hover:translate-y-1" d="M12 2L13.5 3.5L12 5L10.5 3.5L12 2z" fill="currentColor"/>
    <path className="transition-all duration-300 group-hover:translate-y-1" d="M12 19L13.5 20.5L12 22L10.5 20.5L12 19z" fill="currentColor"/>
    <text x="12" y="14" textAnchor="middle" className="text-xs font-bold transition-all duration-300 group-hover:fill-yellow-600" fill="currentColor">★</text>
  </svg>
);

export const ChartBarSquareIcon = ({className = "w-5 h-5"}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={`${className} transition-all duration-300 hover:scale-110 group`}>
    <path className="transition-all duration-700 group-hover:translate-y-1 group-hover:opacity-30" d="M3 18 Q6 15, 9 16 T15 14 T21 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <path className="transition-all duration-500 group-hover:translate-y-0.5" d="M3 12 Q6 9, 9 10 T15 8 T21 11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <path className="transition-all duration-300" d="M3 6 Q6 3, 9 4 T15 2 T21 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <circle className="transition-all duration-300 group-hover:r-1.5 group-hover:fill-blue-500" cx="21" cy="5" r="1" fill="currentColor"/>
    <circle className="transition-all duration-500 group-hover:r-1.5 group-hover:fill-green-500" cx="21" cy="11" r="1" fill="currentColor"/>
    <circle className="transition-all duration-700 group-hover:r-1.5 group-hover:fill-purple-500" cx="21" cy="17" r="1" fill="currentColor"/>
  </svg>
);

export const LogoutIcon = ({className = "w-5 h-5"}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);

export const InfoCircleIcon = ({className = "w-5 h-5"}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

export const ThumbsUpIcon = ({className = "w-6 h-6"}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={`${className} transition-all duration-300 hover:scale-110 hover:rotate-6 group`}>
    <circle className="transition-all duration-500 group-hover:fill-green-500 group-hover:fill-opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path className="transition-all duration-700 group-hover:stroke-green-500 group-hover:stroke-dashoffset-0" d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="12" strokeDashoffset="12"/>
    <circle className="transition-all duration-500 group-hover:r-11 group-hover:animate-ping" cx="12" cy="12" r="0" stroke="#10B981" strokeWidth="2" fill="none" opacity="0.3"/>
    <path className="transition-all duration-300 group-hover:opacity-100" opacity="0" d="M12 3v2M12 19v2M3 12h2M19 12h2M6 6l1.5 1.5M16.5 16.5l1.5 1.5M6 18l1.5-1.5M16.5 7.5l1.5-1.5" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const ClockIcon = ({className = "w-6 h-6"}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={`${className} transition-all duration-300 hover:scale-110 group`}>
    <circle className="transition-all duration-500 group-hover:stroke-blue-500" cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path className="transition-all duration-700 group-hover:stroke-dashoffset-0" d="M12 12L12 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="8" strokeDashoffset="8"/>
    <circle className="transition-all duration-300 group-hover:r-8 group-hover:opacity-20" cx="12" cy="12" r="0" fill="#3B82F6" opacity="0"/>
    <path className="transition-all duration-500 group-hover:opacity-100 group-hover:rotate-90" style={{transformOrigin: '12px 12px'}} opacity="0.3" d="M12 12h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle className="transition-all duration-700 group-hover:animate-ping" cx="12" cy="12" r="2" fill="currentColor"/>
  </svg>
);

export const CheckBadgeIcon = ({className = "w-6 h-6"}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={`${className} transition-all duration-300 hover:scale-110 hover:-rotate-6 group`}>
    <path className="transition-all duration-500 group-hover:fill-yellow-400 group-hover:fill-opacity-30" d="M12 2l2.5 5.5L20 8.5l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-1z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <circle className="transition-all duration-700 group-hover:r-4 group-hover:animate-pulse" cx="12" cy="9" r="3" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path className="transition-all duration-300 group-hover:translate-y-1" d="M9 18.5l3 2 3-2v-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.3"/>
    <circle className="transition-all duration-500 group-hover:fill-yellow-500" cx="12" cy="9" r="1.5" fill="currentColor"/>
  </svg>
);

export const UserCheckIcon = ({className = "w-6 h-6"}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <polyline points="16 11 18 13 22 9" />
  </svg>
);

export const CalendarIcon = ({className = "w-5 h-5"}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={`${className} transition-all duration-300 hover:scale-110 group`}>
    <line className="transition-all duration-700 group-hover:stroke-blue-500" x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2"/>
    <circle className="transition-all duration-300 group-hover:r-3 group-hover:fill-blue-500" cx="6" cy="12" r="2" fill="currentColor" fillOpacity="0.5"/>
    <circle className="transition-all duration-500 group-hover:r-3 group-hover:fill-purple-500" cx="12" cy="12" r="2.5" fill="currentColor" fillOpacity="0.7"/>
    <circle className="transition-all duration-700 group-hover:r-4 group-hover:animate-pulse group-hover:fill-green-500" cx="18" cy="12" r="3" fill="currentColor"/>
    <path className="transition-all duration-500 group-hover:-translate-y-1" d="M6 8v4M12 7v5M18 6v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
    <path className="transition-all duration-500 group-hover:translate-y-1" d="M6 12v4M12 12v5M18 12v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

export const ChevronDownIcon = ({className = "w-5 h-5"}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const BellIcon = ({className = "w-6 h-6"}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

export const VideoCameraIcon = ({className="w-5 h-5"}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={`${className} transition-all duration-300 hover:scale-110 group`}>
    <rect className="transition-all duration-300 group-hover:fill-red-500 group-hover:fill-opacity-20" x="2" y="5" width="15" height="14" rx="3" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path className="transition-all duration-500 group-hover:translate-x-1" d="M17 9.5l5-2.5v10l-5-2.5z" fill="currentColor"/>
    <circle className="transition-all duration-700 group-hover:animate-pulse" cx="9.5" cy="12" r="2.5" fill="currentColor" fillOpacity="0.3"/>
    <circle className="transition-all duration-500 group-hover:r-1" cx="9.5" cy="12" r="0" fill="#EF4444"/>
  </svg>
);

export const SparklesIcon = ({className="w-5 h-5"}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={`${className} transition-all duration-300 hover:scale-110 hover:-translate-y-1 group`}>
    <path className="transition-all duration-500 group-hover:fill-yellow-400 group-hover:fill-opacity-30" d="M12 2c-2.5 0-4.5 2-4.5 4.5 0 2.2 1.5 4 3.5 4.5v2c0 .55.45 1 1 1s1-.45 1-1v-2c2-.5 3.5-2.3 3.5-4.5C16.5 4 14.5 2 12 2z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <path className="transition-all duration-700 group-hover:translate-y-0.5" d="M9 15h6v1.5c0 .8-.7 1.5-1.5 1.5h-3c-.8 0-1.5-.7-1.5-1.5V15z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <line className="transition-all duration-300 group-hover:stroke-yellow-500" x1="12" y1="19" x2="12" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle className="transition-all duration-500 group-hover:r-1.5 group-hover:animate-pulse group-hover:fill-yellow-500" cx="12" cy="6.5" r="1" fill="currentColor"/>
    <path className="transition-all duration-700 group-hover:opacity-100" opacity="0" d="M6 6l-2-2M18 6l2-2M18 10l2 2M6 10l-2 2" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const SendIcon = ({className="w-5 h-5"}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="22" x2="11" y1="2" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

export const LockClosedIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export const ChatBubbleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={`${className} transition-all duration-300 hover:scale-110 hover:-translate-y-1 group`}>
    <path className="transition-all duration-500 group-hover:fill-current group-hover:fill-opacity-20" d="M12 3C7 3 3 6.6 3 11c0 2.2 1 4.2 2.6 5.6L4 21l4.5-1.6c1 .4 2.2.6 3.5.6 5 0 9-3.6 9-8s-4-9-9-9z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle className="transition-all duration-300 group-hover:r-1 group-hover:animate-pulse" cx="8" cy="11" r="0.5" fill="currentColor"/>
    <circle className="transition-all duration-400 group-hover:r-1 group-hover:animate-pulse" cx="12" cy="11" r="0.5" fill="currentColor"/>
    <circle className="transition-all duration-500 group-hover:r-1 group-hover:animate-pulse" cx="16" cy="11" r="0.5" fill="currentColor"/>
  </svg>
);

export const ChevronLeftIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export const ChevronRightIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const TargetIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={`${className} transition-all duration-500 hover:scale-110 hover:rotate-90 group`}>
    <path className="transition-all duration-700 group-hover:opacity-50" d="M3 3h7v7H3z" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path className="transition-all duration-500" d="M14 3h7v7h-7z" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path className="transition-all duration-500" d="M3 14h7v7H3z" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect className="transition-all duration-300 group-hover:fill-current" x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.3"/>
    <circle className="transition-all duration-700 group-hover:animate-ping" cx="17.5" cy="17.5" r="2" fill="currentColor" fillOpacity="0.5"/>
  </svg>
);

export const ReportsIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={`${className} transition-all duration-300 hover:scale-110 hover:-translate-y-1 group`}>
    <rect className="transition-all duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:opacity-30" x="6" y="6" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
    <rect className="transition-all duration-300 group-hover:translate-x-0.5" x="4" y="4" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="white"/>
    <path className="transition-all duration-700 group-hover:stroke-blue-500" d="M8 10h6M8 13h4M8 16h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle className="transition-all duration-500 group-hover:r-1 group-hover:animate-pulse" cx="15" cy="8" r="0" fill="#3B82F6"/>
  </svg>
);

export const DotsHorizontal = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);

export const CheckCircleIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export const RocketLaunchIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

export const UploadIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </svg>
);

export const BoltIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={`${className} transition-all duration-300 hover:scale-125 hover:rotate-6 group`}>
    <path className="transition-all duration-500 group-hover:fill-yellow-400 group-hover:animate-pulse" d="M13 2l-2 9h6l-8 11 2-9H5l8-11z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle className="transition-all duration-700 group-hover:r-14 group-hover:animate-ping" cx="12" cy="12" r="0" fill="#FBBF24" fillOpacity="0.2"/>
    <path className="transition-all duration-300 group-hover:opacity-100" opacity="0" d="M12 2v3M12 19v3M4 12h3M17 12h3" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const PresentationChartLineIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 3v18h18" />
    <path d="m19 9-5 5-4-4-3 3" />
  </svg>
);

export const BuildingOfficeIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01" />
    <path d="M16 6h.01" />
    <path d="M12 6h.01" />
    <path d="M12 10h.01" />
    <path d="M12 14h.01" />
    <path d="M16 10h.01" />
    <path d="M16 14h.01" />
    <path d="M8 10h.01" />
    <path d="M8 14h.01" />
  </svg>
);

export const HeadphonesIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={`${className} transition-all duration-300 hover:scale-110 hover:rotate-12 group`}>
    <circle className="transition-all duration-500 group-hover:stroke-blue-500" cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none"/>
    <circle className="transition-all duration-700 group-hover:r-10 group-hover:animate-ping" cx="12" cy="12" r="0" stroke="#3B82F6" strokeWidth="2" fill="none" opacity="0.3"/>
    <path className="transition-all duration-300 group-hover:fill-blue-500" d="M12 8c-1.1 0-2 .9-2 2h1c0-.55.45-1 1-1s1 .45 1 1c0 1-1.5 1-1.5 2.5h1c0-1 1.5-1 1.5-2.5 0-1.1-.9-2-2-2z" fill="currentColor"/>
    <circle className="transition-all duration-500 group-hover:r-1.5 group-hover:animate-pulse" cx="12" cy="15" r="1" fill="currentColor"/>
    <path className="transition-all duration-700 group-hover:opacity-100" opacity="0" d="M8 4l-2-2M16 4l2-2M20 12h2M2 12h2M8 20l-2 2M16 20l2 2" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const FireIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={`${className} transition-all duration-300 hover:scale-110 group`}>
    <path className="transition-all duration-700 group-hover:fill-orange-500 group-hover:animate-pulse" d="M12 2C12 2 8 6 8 10c0 2.2 1.8 4 4 4s4-1.8 4-4c0-4-4-8-4-8z" fill="#F97316" fillOpacity="0.3" stroke="#F97316" strokeWidth="2"/>
    <path className="transition-all duration-500 group-hover:fill-red-500" d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="#EF4444" fillOpacity="0.5"/>
    <ellipse className="transition-all duration-500 group-hover:ry-8" cx="12" cy="17" rx="6" ry="5" fill="#F97316" fillOpacity="0.2" stroke="#F97316" strokeWidth="2"/>
    <circle className="transition-all duration-700 group-hover:r-8 group-hover:animate-ping" cx="12" cy="12" r="0" fill="#FBBF24" fillOpacity="0.3"/>
  </svg>
);

export const MedalIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15" />
    <path d="M11 12 5.12 2.2" />
    <path d="m13 12 5.88-9.8" />
    <path d="M8 7h8" />
    <circle cx="12" cy="17" r="5" />
    <path d="M12 18v-2h-.5" />
  </svg>
);

export const TrashIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

export const DownloadIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);

export const DocumentTextIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" x2="8" y1="13" y2="13" />
    <line x1="16" x2="8" y1="17" y2="17" />
    <line x1="10" x2="8" y1="9" y2="9" />
  </svg>
);

export const UserCircleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="10" r="3" />
    <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
  </svg>
);

export const EnvelopeIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export const StarIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={`${className} transition-all duration-300 hover:scale-125 hover:rotate-12 group`}>
    <path className="transition-all duration-500 group-hover:fill-yellow-400 group-hover:fill-opacity-90" d="M12 2l2.5 5.5L20 8.5l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-1z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <circle className="transition-all duration-700 group-hover:r-14 group-hover:animate-ping" cx="12" cy="12" r="0" fill="#FBBF24" fillOpacity="0.2"/>
    <path className="transition-all duration-300 group-hover:opacity-100" opacity="0" d="M12 1v3M12 20v3M3 12h3M18 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const PictureInPictureIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6z" />
    <path d="M12 11h7v6h-7v-6z" />
  </svg>
);
