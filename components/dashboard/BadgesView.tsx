
import React from 'react';
import { MedalIcon, StarIcon, FireIcon, ClockIcon, CheckBadgeIcon, TargetIcon, VideoCameraIcon, TrophyIcon, UserCheckIcon, BoltIcon, SparklesIcon, CalendarIcon, PresentationChartLineIcon, DocumentTextIcon } from '../icons/Icons';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface BadgesViewProps {
    unlockedBadges: string[];
}

const BadgesView: React.FC<BadgesViewProps> = ({ unlockedBadges }) => {
  const badges: Badge[] = [
    // Unlocked / Starter Badges
    { id: 'onboarding_explorer', name: 'Onboarding Explorer', description: 'Complete the welcome onboarding.', icon: <TrophyIcon className="w-8 h-8"/>, color: 'bg-yellow-500' },
    
    // Initially Locked for new user
    { id: 'first_steps', name: 'First Steps', description: 'Complete your first tracking session.', icon: <VideoCameraIcon className="w-8 h-8"/>, color: 'bg-blue-500' },
    { id: 'on_fire', name: 'On Fire', description: 'Reach a 3-day streak.', icon: <FireIcon className="w-8 h-8"/>, color: 'bg-orange-500' },
    
    // Intermediate / Locked Badges
    { id: 'goal_crusher', name: 'Goal Crusher', description: 'Hit your daily goal 5 times.', icon: <TargetIcon className="w-8 h-8"/>, color: 'bg-green-500' },
    { id: 'weekend_warrior', name: 'Weekend Warrior', description: 'Track sessions on Saturday and Sunday.', icon: <CalendarIcon className="w-8 h-8"/>, color: 'bg-pink-500' },
    { id: 'week_streak', name: 'Week Streak', description: 'Maintain a 7-day active streak.', icon: <FireIcon className="w-8 h-8"/>, color: 'bg-red-500' },
    { id: 'marathoner', name: 'Marathoner', description: 'Track for 4 hours in one day.', icon: <ClockIcon className="w-8 h-8"/>, color: 'bg-purple-500' },
    { id: 'perfectionist', name: 'Perfectionist', description: 'Maintain 95% score for 1 hour.', icon: <StarIcon className="w-8 h-8"/>, color: 'bg-amber-500' },
    
    // Advanced Badges
    { id: 'elite_status', name: 'Elite Status', description: 'Subscribe to Pro Plan.', icon: <MedalIcon className="w-8 h-8"/>, color: 'bg-indigo-500' },
    { id: 'early_bird', name: 'Early Bird', description: 'Complete a session before 8 AM.', icon: <CheckBadgeIcon className="w-8 h-8"/>, color: 'bg-teal-500' },
    { id: 'night_owl', name: 'Night Owl', description: 'Complete a session after 8 PM.', icon: <CheckBadgeIcon className="w-8 h-8"/>, color: 'bg-slate-500' },
    { id: 'posture_pro', name: 'Posture Pro', description: 'Log 100 total hours of tracking.', icon: <UserCheckIcon className="w-8 h-8"/>, color: 'bg-cyan-600' },
    
    // Expert Badges
    { id: 'zen_master', name: 'Zen Master', description: '0 Slouch events in a 2hr session.', icon: <BoltIcon className="w-8 h-8"/>, color: 'bg-emerald-600' },
    { id: 'monthly_master', name: 'Monthly Master', description: 'Reach a 30-day streak.', icon: <FireIcon className="w-8 h-8"/>, color: 'bg-rose-600' },
    { id: 'data_scientist', name: 'Data Scientist', description: 'Export your first data report.', icon: <DocumentTextIcon className="w-8 h-8"/>, color: 'bg-gray-600' },
    { id: 'comeback_kid', name: 'Comeback Kid', description: 'Return after 1 week absence.', icon: <SparklesIcon className="w-8 h-8"/>, color: 'bg-violet-500' },
    { id: 'ergonomic_king', name: 'Ergonomic King', description: 'Achieve perfect ergonomic angles.', icon: <CheckBadgeIcon className="w-8 h-8"/>, color: 'bg-lime-500' },
    { id: 'growth_mindset', name: 'Growth Mindset', description: 'Analyze your weekly progress trends.', icon: <PresentationChartLineIcon className="w-8 h-8"/>, color: 'bg-sky-500' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Revised Grid: Higher density (more columns) to keep items smaller */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
        {badges.map((badge) => {
          const isUnlocked = unlockedBadges.includes(badge.id);
          
          return (
          <div key={badge.id} className={`p-4 rounded-xl border transition-all duration-300 flex flex-col items-center text-center justify-between group h-full ${!isUnlocked ? 'bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 opacity-60' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-1'}`}>
             <div className="flex-1 flex items-center justify-center w-full mb-3">
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110 ${!isUnlocked ? 'bg-gray-300 dark:bg-gray-700 grayscale' : badge.color}`}>
                    {React.cloneElement(badge.icon as React.ReactElement, { className: "w-6 h-6" })}
                 </div>
             </div>
             <div className="w-full">
                 <h3 className={`font-bold text-xs mb-1 truncate ${!isUnlocked ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>{badge.name}</h3>
                 <p className="text-[9px] text-gray-500 dark:text-gray-500 line-clamp-2 leading-tight min-h-[2.5em]">{badge.description}</p>
                 <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700/50 w-full flex justify-center">
                    {!isUnlocked ? (
                        <div className="text-[8px] font-bold text-gray-400 uppercase tracking-wide border border-gray-200 dark:border-gray-700 px-1.5 py-0.5 rounded-full">
                            Locked
                        </div>
                    ) : (
                        <div className="text-[8px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wide bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded-full">
                            Earned
                        </div>
                    )}
                 </div>
             </div>
          </div>
        )})}
      </div>
    </div>
  );
};

export default BadgesView;
