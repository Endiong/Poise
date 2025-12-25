import React, { useEffect, useState } from 'react';
import { TrophyIcon } from '../icons/Icons';

interface BadgePopupProps {
  badgeName: string;
  badgeDescription: string;
  badgeIcon: React.ReactNode;
  onClose: () => void;
}

const BadgePopup: React.FC<BadgePopupProps> = ({ badgeName, badgeDescription, badgeIcon, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const handleClose = () => {
      setVisible(false);
      setTimeout(onClose, 300); // Wait for animation
  };

  return (
    <div className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose}></div>
        
        <div className={`bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl relative z-10 transform transition-all duration-500 ${visible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-8'}`}>
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-800 animate-bounce">
                {React.cloneElement(badgeIcon as React.ReactElement, { className: "w-12 h-12 text-white" })}
            </div>
            
            <div className="mt-10">
                <div className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold uppercase tracking-wide mb-3">
                    Achievement Unlocked
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{badgeName}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{badgeDescription}</p>
                
                <button 
                    onClick={handleClose}
                    className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg"
                >
                    Awesome!
                </button>
            </div>
            
            {/* Confetti-like decoration (CSS only) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none rounded-2xl">
                <div className="absolute top-4 left-4 w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
                <div className="absolute top-10 right-8 w-2 h-2 bg-blue-400 rounded-full animate-ping delay-100"></div>
                <div className="absolute bottom-8 left-10 w-2 h-2 bg-green-400 rounded-full animate-ping delay-200"></div>
            </div>
        </div>
    </div>
  );
};

export default BadgePopup;