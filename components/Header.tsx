
import React, { useState, useRef, useEffect } from 'react';
import { NAV_LINKS, NavAction } from '../constants';
import { AuthMode } from '../App';
import { PoiséIcon } from './icons/Icons';
import { AppView } from '../types';

interface HeaderProps {
  isLoggedIn: boolean;
  onNavigateToAuth: (mode: AuthMode) => void;
  onLogout: () => void;
  onLogoClick?: () => void;
  onNavigate?: (view: AppView) => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onNavigateToAuth, onLogout, onLogoClick, onNavigate }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [menuStyle, setMenuStyle] = useState({});
  const navRef = useRef<HTMLElement>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileSection, setExpandedMobileSection] = useState<string | null>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (menu: string, e: React.MouseEvent<HTMLButtonElement>) => {
    setActiveMenu(menu);
    const target = e.currentTarget;
    if (navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      setMenuStyle({
        '--popover-width': `${menu === 'products' ? 600 : menu === 'resources' ? 600 : 500}px`,
        '--popover-height': `${menu === 'products' ? 200 : menu === 'resources' ? 410 : 340}px`,
        '--arrow-x': `${targetRect.left - navRect.left + targetRect.width / 2}px`,
        '--arrow-y': `${targetRect.bottom - navRect.top}px`,
      });
    }
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  const toggleMobileSection = (key: string) => {
    setExpandedMobileSection(expandedMobileSection === key ? null : key);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent, action: NavAction, target: string) => {
      e.preventDefault();
      setActiveMenu(null); // Close mega menu
      setIsMobileMenuOpen(false);

      if (action === 'navigate' && onNavigate) {
          onNavigate(target as AppView);
          window.scrollTo(0, 0);
      } else if (action === 'scroll') {
          if (window.location.pathname !== '/' && onLogoClick) {
              // If not on landing page, go there first (handled by parent usually, but here we assume single page app)
              onLogoClick();
              setTimeout(() => {
                  const element = document.getElementById(target);
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
              }, 100);
          } else {
              const element = document.getElementById(target);
              if (element) element.scrollIntoView({ behavior: 'smooth' });
          }
      }
  };

  return (
    <header ref={navRef} onMouseLeave={handleMouseLeave} className="relative bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          
          {/* Logo Section - Always visible together */}
          <div className="flex-shrink-0 flex items-center">
            <button onClick={onLogoClick} className="flex items-center gap-2 text-gray-900 hover:opacity-80 transition-opacity focus:outline-none">
              <PoiséIcon className="w-8 h-8" />
              <span className="text-2xl font-logo tracking-tight">poisé</span>
            </button>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center space-x-2">
            {Object.keys(NAV_LINKS).map((key) => (
              <button
                key={key}
                onMouseEnter={(e) => handleMouseEnter(key, e)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 capitalize
                  ${activeMenu === key 
                    ? 'bg-gray-100 text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}
                `}
              >
                {NAV_LINKS[key as keyof typeof NAV_LINKS].title}
              </button>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(prev => !prev)}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                  aria-expanded={isProfileMenuOpen}
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-10 w-10 rounded-full"
                    src="https://i.pravatar.cc/150?u=margaret"
                    alt="User avatar"
                  />
                </button>
                {isProfileMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
                    <button onClick={() => { if(onNavigate) onNavigate('settings' as any); setIsProfileMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</button>
                    <button
                      onClick={() => {
                        onLogout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => onNavigateToAuth('login')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => onNavigateToAuth('signup')}
                  className="px-4 py-2 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-800 transition-colors"
                >
                  Create Account
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button - Two Lines Icon */}
          <div className="flex md:hidden items-center">
             <button
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
               className="p-2 rounded-md text-gray-800 hover:bg-gray-100 focus:outline-none transition-colors"
             >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 8.5H20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M4 15.5H20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xl overflow-hidden animate-in slide-in-from-top-5 duration-200 z-40">
           <div className="px-6 py-6 space-y-2 max-h-[85vh] overflow-y-auto">
              {/* Navigation Links */}
              {Object.keys(NAV_LINKS).map((key) => {
                 const section = NAV_LINKS[key as keyof typeof NAV_LINKS];
                 const isExpanded = expandedMobileSection === key;
                 return (
                   <div key={key} className="border-b border-gray-100 last:border-0">
                      <button 
                        onClick={() => toggleMobileSection(key)}
                        className="flex items-center justify-between w-full py-4 text-lg font-medium text-gray-900"
                      >
                        {section.title}
                        <svg 
                          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                          fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
                        <div className="space-y-3 pl-2">
                           {section.items.map((item, idx) => (
                             <a 
                                key={idx} 
                                href="#" 
                                onClick={(e) => handleNavClick(e, item.action, item.target)}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                             >
                                <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${item.graphicClass ? item.graphicClass.replace('bg-', 'bg-opacity-20 bg-') : 'bg-gray-100'} text-gray-700`}>
                                    {React.cloneElement(item.icon as React.ReactElement, { className: "w-4 h-4" })}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{item.title}</span>
                                    <span className="text-xs text-gray-500 line-clamp-1">{item.description}</span>
                                </div>
                             </a>
                           ))}
                        </div>
                      </div>
                   </div>
                 );
              })}
              
              {/* Mobile Auth Buttons */}
              <div className="pt-6 mt-4 flex flex-col gap-3">
                 {isLoggedIn ? (
                    <div className="bg-gray-50 rounded-xl p-4">
                       <div className="flex items-center gap-3 mb-4">
                           <img
                            className="h-10 w-10 rounded-full"
                            src="https://i.pravatar.cc/150?u=margaret"
                            alt="User avatar"
                           />
                           <div>
                              <p className="font-bold text-gray-900">Margaret</p>
                              <a href="#" className="text-xs text-blue-600 font-medium">View Profile</a>
                           </div>
                       </div>
                       <div className="grid grid-cols-2 gap-2">
                           <button onClick={() => { if(onNavigate) onNavigate('settings' as any); setIsMobileMenuOpen(false); }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg">Settings</button>
                           <button onClick={() => {onLogout(); setIsMobileMenuOpen(false);}} className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-gray-200 rounded-lg">
                              Logout
                           </button>
                       </div>
                    </div>
                 ) : (
                    <div className="grid grid-cols-1 gap-3">
                        <button
                            onClick={() => {onNavigateToAuth('login'); setIsMobileMenuOpen(false);}}
                            className="w-full py-3.5 text-center font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => {onNavigateToAuth('signup'); setIsMobileMenuOpen(false);}}
                            className="w-full py-3.5 text-center font-bold text-white bg-black hover:bg-gray-800 rounded-full transition-colors"
                        >
                            Create Account
                        </button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Desktop Mega Menu Dropdown */}
      <div
        style={menuStyle}
        className={`
          hidden md:block
          absolute top-[calc(var(--arrow-y)+10px)] left-[calc(var(--arrow-x)-var(--popover-width)/2)]
          w-[var(--popover-width)] h-[var(--popover-height)]
          bg-white rounded-xl shadow-2xl border border-gray-200
          transition-all duration-300 ease-in-out
          origin-top z-40
          ${activeMenu ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
        `}
      >
        <MegaMenuContent menuKey={activeMenu} onNavClick={handleNavClick} />
      </div>
    </header>
  );
};

const MegaMenuContent: React.FC<{ menuKey: string | null, onNavClick: (e: React.MouseEvent, action: NavAction, target: string) => void }> = ({ menuKey, onNavClick }) => {
  const [hoveredItemClass, setHoveredItemClass] = useState('');

  if (!menuKey) return null;

  const menuData = NAV_LINKS[menuKey as keyof typeof NAV_LINKS];

  if (!menuData) return null;

  const gridColsClass = menuKey === 'products' ? 'grid-cols-2' : 'grid-cols-2';

  return (
    <div className={`p-4 grid ${gridColsClass} gap-4 h-full overflow-hidden`}>
        <div className="col-span-1 flex flex-col gap-2 overflow-y-auto no-scrollbar">
            {menuData.items.map((item, index) => (
                <a
                    href="#"
                    key={index}
                    className="flex items-start p-3 rounded-lg hover:bg-gray-100 transition-all duration-200 group relative overflow-hidden"
                    onMouseEnter={() => setHoveredItemClass(item.graphicClass || '')}
                    onClick={(e) => onNavClick(e, item.action, item.target)}
                >
                    <div className="p-2 bg-white rounded-md shadow-sm border border-gray-200 mr-4 z-10 group-hover:scale-110 transition-transform duration-200">
                        {item.icon}
                    </div>
                    <div className="z-10">
                        <p className="font-semibold text-gray-900 group-hover:underline decoration-gray-300 underline-offset-2">{item.title}</p>
                        <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">{item.description}</p>
                    </div>
                </a>
            ))}
        </div>
        <div className="col-span-1 rounded-lg overflow-hidden relative hidden sm:block">
            <div className={`w-full h-full transition-colors duration-500 ease-in-out ${hoveredItemClass || 'bg-gray-100'}`}>
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white to-transparent"></div>
                {/* Visual graphic placeholder - subtle pattern */}
                <svg className="absolute bottom-0 right-0 w-32 h-32 text-white/20" viewBox="0 0 100 100" fill="currentColor">
                   <circle cx="80" cy="80" r="40" />
                </svg>
            </div>
        </div>
    </div>
  );
};


export default Header;
