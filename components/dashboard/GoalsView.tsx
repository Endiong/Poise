import React, { useMemo } from 'react';
import { TargetIcon, CalendarIcon, UserCheckIcon, ClockIcon } from '../icons/Icons';
import { CustomSlider } from '../common/CustomSlider';
import { PostureHistoryItem } from '../../types';

interface GoalsViewProps {
  currentGoal: number; // Posture score goal
  onSetGoal: (goal: number) => void;
  sessionGoal: number; // New session/hour goal
  onSetSessionGoal: (goal: number) => void;
  history?: PostureHistoryItem[];
  sensitivity: string;
  onSetSensitivity: (area: string) => void;
}

const GoalsView: React.FC<GoalsViewProps> = ({ 
    currentGoal, 
    onSetGoal, 
    sessionGoal, 
    onSetSessionGoal, 
    history = [],
    sensitivity,
    onSetSensitivity 
}) => {

  const weeklyConsistency = useMemo(() => {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const today = new Date();
      // Calculate start of the current week (Monday)
      // If today is Sunday (0), we go back 6 days. If Monday (1), go back 0.
      const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
      const diffToMon = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - diffToMon);
      startOfWeek.setHours(0, 0, 0, 0);

      const weekData = days.map((dayName, index) => {
          const currentDayDate = new Date(startOfWeek);
          currentDayDate.setDate(startOfWeek.getDate() + index);
          
          const dateStr = currentDayDate.toDateString();
          const isToday = today.toDateString() === dateStr;
          
          // Filter history for this specific day
          const dailySessions = history.filter(h => new Date(h.date).toDateString() === dateStr);
          
          let avgScore = 0;
          if (dailySessions.length > 0) {
              const totalScore = dailySessions.reduce((acc, sess) => acc + (sess.goodDuration / sess.duration), 0);
              avgScore = Math.round((totalScore / dailySessions.length) * 100);
          }

          return {
              day: dayName,
              score: avgScore,
              isToday,
              hasData: dailySessions.length > 0
          };
      });

      return weekData;
  }, [history]);

  return (
    <div className="space-y-6 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Posture Score Goal Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                <TargetIcon className="w-6 h-6" />
                </div>
                <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Posture Quality</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Target score per session</p>
                </div>
            </div>
            
            <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">{currentGoal}%</span>
                <span className="text-base font-medium text-gray-500 dark:text-gray-400">score</span>
            </div>
          </div>

          <div className="space-y-2">
             <CustomSlider 
                min={30} 
                max={100} 
                step={5} 
                value={currentGoal} 
                onChange={onSetGoal}
                colorClass="bg-emerald-500"
            />
             <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider px-1">
                <span>Relaxed</span>
                <span>Strict</span>
             </div>
          </div>
        </div>

        {/* Session Goal Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
                <ClockIcon className="w-6 h-6" />
                </div>
                <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Daily Duration</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total tracking time</p>
                </div>
            </div>
            
            <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">{sessionGoal}</span>
                <span className="text-base font-medium text-gray-500 dark:text-gray-400">hours</span>
            </div>
          </div>

          <div className="space-y-2">
             <CustomSlider 
                min={1} 
                max={12} 
                step={1} 
                value={sessionGoal} 
                onChange={onSetSessionGoal}
                colorClass="bg-purple-600"
            />
             <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider px-1">
                <span>Light</span>
                <span>Intense</span>
             </div>
          </div>
        </div>

        {/* Sensitivity Area */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 md:col-span-2">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                  <UserCheckIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sensitivity</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Detection Strictness</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {['Low', 'Medium', 'High'].map((level) => (
                    <button
                        key={level}
                        onClick={() => onSetSensitivity(level)}
                        className={`p-4 rounded-xl text-sm font-bold border-2 transition-all text-left flex flex-col justify-between h-20 ${
                            sensitivity === level 
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                            : 'border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50'
                        }`}
                    >
                        <span>{level}</span>
                        {sensitivity === level && <div className="w-2 h-2 rounded-full bg-blue-600 self-end"></div>}
                    </button>
                ))}
            </div>
        </div>

        {/* Weekly Consistency (Full Width) */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 md:col-span-2">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-base">
                    <CalendarIcon className="w-5 h-5 text-gray-400" /> Weekly Consistency
                </h3>
                <span className="text-xs text-gray-500">Current Week</span>
            </div>
            
            <div className="flex justify-between items-end h-28 px-2 gap-3 relative">
                {weeklyConsistency.map((item, i) => {
                    const isGoalMet = item.score >= currentGoal;
                    // Determine bar color:
                    let barColor = 'bg-gray-200 dark:bg-gray-700'; 
                    
                    if (item.hasData) {
                        barColor = isGoalMet ? 'bg-green-500' : 'bg-gray-400 dark:bg-gray-600'; 
                    }
                    if (item.isToday) {
                        barColor = 'bg-orange-500'; // Today highlight
                    }

                    return (
                    <div key={i} className="flex flex-col items-center gap-2 w-full h-full justify-end group relative">
                            {/* Bar Container - Adjusted background for contrast */}
                            <div className="w-full bg-gray-50 dark:bg-gray-700/30 rounded-lg h-full relative flex items-end">
                                <div 
                                    className={`w-full rounded-lg transition-all duration-700 ease-out ${barColor}`} 
                                    style={{ height: item.hasData || item.isToday ? `${Math.max(item.score, 5)}%` : '0%' }}
                                >
                                    {/* If no data and not today, show a small placeholder line for visibility */}
                                    {(!item.hasData && !item.isToday) && (
                                        <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 absolute bottom-0"></div>
                                    )}
                                </div>
                                
                                {/* Tooltip - Positioned absolutely to ensure visibility */}
                                {item.hasData && (
                                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 pointer-events-none transition-opacity duration-200">
                                        <div className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap relative">
                                            {item.score}%
                                            {/* Little triangle arrow */}
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <span className={`text-[10px] font-bold uppercase ${item.isToday ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400 dark:text-gray-500'}`}>
                                {item.day}
                            </span>
                    </div>
                )})}
            </div>
        </div>
      </div>
    </div>
  );
};

export default GoalsView;