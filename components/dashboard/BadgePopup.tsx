import React, { useEffect, useState } from 'react';
import { TrophyIcon, SparklesIcon } from '../icons/Icons';

interface BadgePopupProps {
  badgeName: string;
  badgeDescription: string;
  badgeIcon: React.ReactNode;
  onClose: () => void;
}

const BadgePopup: React.FC<BadgePopupProps> = ({ badgeName, badgeDescription, badgeIcon, onClose }) => {
  const [visible, setVisible] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setVisible(true);
    // Trigger celebration animation slightly after
    setTimeout(() => setCelebrate(true), 200);
  }, []);

  const handleClose = () => {
      setVisible(false);
      setTimeout(onClose, 400); // Wait for animation
  };

  return (
    <div className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop with blur */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-md" 
          onClick={handleClose}
        ></div>
        
        {/* Main Card */}
        <div className={`relative z-10 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-850 dark:to-gray-800 rounded-3xl p-10 max-w-md w-full text-center shadow-2xl border-2 border-yellow-400/20 dark:border-yellow-400/30 transform transition-all duration-700 ${visible ? 'scale-100 translate-y-0 rotate-0' : 'scale-75 translate-y-12 rotate-3'}`}>
            
            {/* Animated rays background */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-gradient-conic from-yellow-200/20 via-transparent to-yellow-200/20 dark:from-yellow-600/10 dark:via-transparent dark:to-yellow-600/10 transition-transform duration-[3s] ${celebrate ? 'animate-spin-slow' : ''}`}></div>
            </div>
            
            {/* Floating Badge Icon */}
            <div className={`absolute -top-16 left-1/2 -translate-x-1/2 transition-all duration-700 ${visible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}>
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl opacity-60 animate-pulse"></div>
                  
                  {/* Badge container */}
                  <div className={`relative w-28 h-28 bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white dark:border-gray-800 transition-transform duration-700 ${celebrate ? 'animate-bounce-slow' : ''}`}>
                    {/* Inner glow */}
                    <div className="absolute inset-2 bg-gradient-to-br from-yellow-300 to-transparent rounded-full opacity-50"></div>
                    
                    {/* Icon */}
                    <div className="relative z-10">
                      {React.cloneElement(badgeIcon as React.ReactElement, { 
                        className: "w-14 h-14 text-white drop-shadow-lg" 
                      })}
                    </div>
                  </div>
                  
                  {/* Sparkle decorations */}
                  <SparklesIcon className={`absolute -top-2 -right-2 w-6 h-6 text-yellow-400 transition-all duration-500 delay-300 ${celebrate ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} />
                  <SparklesIcon className={`absolute -bottom-2 -left-2 w-5 h-5 text-amber-400 transition-all duration-500 delay-500 ${celebrate ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} />
                </div>
            </div>
            
            {/* Content */}
            <div className="mt-16 relative z-10">
                {/* Badge label */}
                <div className={`inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-100 via-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:via-yellow-800/20 dark:to-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm border border-yellow-200/50 dark:border-yellow-700/30 transition-all duration-500 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    🎉 Achievement Unlocked
                </div>
                
                {/* Badge name */}
                <h2 className={`text-3xl font-black text-gray-900 dark:text-white mb-3 tracking-tight transition-all duration-500 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  {badgeName}
                </h2>
                
                {/* Description */}
                <p className={`text-gray-600 dark:text-gray-400 text-sm mb-8 leading-relaxed transition-all duration-500 delay-400 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  {badgeDescription}
                </p>
                
                {/* Action button */}
                <button 
                    onClick={handleClose}
                    className={`group relative w-full bg-gradient-to-r from-gray-900 via-black to-gray-900 dark:from-white dark:via-gray-100 dark:to-white text-white dark:text-black py-4 rounded-2xl font-bold hover:scale-[1.02] transition-all shadow-xl overflow-hidden ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    style={{ transitionDelay: '500ms' }}
                >
                    {/* Button shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <span>Awesome!</span>
                      <SparklesIcon className="w-5 h-5" />
                    </span>
                </button>
            </div>
            
            {/* Animated confetti particles */}
            <div className={`absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none rounded-3xl transition-opacity duration-500 ${celebrate ? 'opacity-100' : 'opacity-0'}`}>
                {/* Multiple confetti dots with different animations */}
                <div className="absolute top-8 left-[15%] w-3 h-3 bg-red-400 rounded-full animate-float-1"></div>
                <div className="absolute top-12 right-[20%] w-2 h-2 bg-blue-400 rounded-full animate-float-2"></div>
                <div className="absolute top-16 left-[80%] w-2.5 h-2.5 bg-green-400 rounded-full animate-float-3"></div>
                <div className="absolute top-20 left-[25%] w-2 h-2 bg-purple-400 rounded-full animate-float-4"></div>
                <div className="absolute top-10 right-[15%] w-3 h-3 bg-yellow-400 rounded-full animate-float-1 animation-delay-200"></div>
                <div className="absolute top-24 left-[60%] w-2 h-2 bg-pink-400 rounded-full animate-float-2 animation-delay-400"></div>
                <div className="absolute bottom-20 left-[10%] w-2.5 h-2.5 bg-indigo-400 rounded-full animate-float-3 animation-delay-600"></div>
                <div className="absolute bottom-24 right-[25%] w-2 h-2 bg-orange-400 rounded-full animate-float-4 animation-delay-800"></div>
            </div>
        </div>
    </div>
  );
};

export default BadgePopup;