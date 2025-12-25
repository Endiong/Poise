import React, { useState, useMemo } from 'react';
import { FireIcon, TrophyIcon, CalendarIcon } from '../icons/Icons';
import { PostureHistoryItem } from '../../types';

interface ActivityHeatmapProps {
  historyData: PostureHistoryItem[];
  theme?: 'light' | 'dark';
}

const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ historyData, theme = 'light' }) => {
  const [hoveredDay, setHoveredDay] = useState<any>(null);
  
  // Helper to format duration for display
  const formatDuration = (seconds: number) => {
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      if (hrs > 0) return `${hrs}h ${mins}m`;
      return `${mins}m`;
  };

  // Generate calendar data for the current year (Jan 1 to Dec 31)
  const calendarData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1); // Jan 1 Local Time
    const endDate = new Date(currentYear, 11, 31); // Dec 31 Local Time
    
    const days = [];
    
    const startDayOfWeek = startDate.getDay(); 
    
    // Add placeholders for days before Jan 1 to align to Sunday start
    for (let i = 0; i < startDayOfWeek; i++) {
        days.push({ 
            date: new Date(startDate.getTime() - (startDayOfWeek - i) * 86400000), 
            placeholder: true,
            level: 0
        });
    }

    // Helper to format date as YYYY-MM-DD in Local Time
    const getLocalDateStr = (d: Date) => {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    // Generate days for the year
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        const dayStr = getLocalDateStr(currentDate);
        
        // Real data processing - Match local date strings
        const dayData = historyData.filter(h => {
             const hDate = new Date(h.date);
             return getLocalDateStr(hDate) === dayStr;
        });

        const totalSeconds = dayData.reduce((sum, session) => sum + session.duration, 0);
        // 1 Session = 1 Hour (3600 seconds)
        const hours = totalSeconds / 3600;
        const sessionCount = dayData.length;
        
        const hasRealData = dayData.length > 0;
        let level = 0;
        
        if (hasRealData) {
             // Level logic based on duration: 0 = No session, 1-4
             if (totalSeconds === 0) level = 0;
             else if (hours < 0.5) level = 1; // 30 mins
             else if (hours < 1.5) level = 2; // 1.5 hours
             else if (hours < 3.0) level = 3; // 3 hours
             else level = 4;
        }

        days.push({
            date: new Date(currentDate),
            dateStr: dayStr,
            tracked: hasRealData,
            sessionCount: sessionCount,
            totalSeconds,
            level,
            placeholder: false
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  }, [historyData]); 
  
  // Stats calculations
  const currentStreak = useMemo(() => {
    let streak = 0;
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const validDays = calendarData.filter(d => !d.placeholder);
    const sortedDays = [...validDays].reverse();
    
    for (const day of sortedDays) {
      if (day.dateStr > todayStr) continue;
      // Streak logic: Must be tracked AND have >= 3 mins (180s) total duration
      // This matches the dashboard logic requested by the user
      if (day.tracked && day.totalSeconds >= 180) streak++; 
      else if (streak > 0 && day.dateStr < todayStr) break; // Break if we miss a day before today
    }
    return streak;
  }, [calendarData]);

  const totalSessionsCount = useMemo(() => {
      return historyData.length;
  }, [historyData]);

  // Find the day with the MAX total duration
  const longestDay = useMemo(() => {
      if (calendarData.length === 0) return 0;
      // Filter only real days with data
      const trackedDays = calendarData.filter(d => !d.placeholder && d.tracked);
      if (trackedDays.length === 0) return 0;
      
      const maxSeconds = Math.max(...trackedDays.map(d => d.totalSeconds));
      return maxSeconds;
  }, [calendarData]);

  // Group by weeks
  const weeks = useMemo(() => {
      const w = [];
      let currentWeek = [];
      calendarData.forEach((day) => {
          currentWeek.push(day);
          if (currentWeek.length === 7) {
              w.push(currentWeek);
              currentWeek = [];
          }
      });
      if (currentWeek.length > 0) w.push(currentWeek);
      return w;
  }, [calendarData]);

  const getColorClass = (level: number) => {
    if (theme === 'dark') {
      switch(level) {
        // High visibility GitHub-style dark mode
        case 0: return 'bg-[#161b22] border border-[#30363d]'; // Distinct empty cell
        case 1: return 'bg-purple-900/60 border border-purple-800/50';
        case 2: return 'bg-purple-800/80 border border-purple-700/50';
        case 3: return 'bg-purple-600 border border-purple-500';
        case 4: return 'bg-purple-400 border border-purple-300';
        default: return 'bg-[#161b22] border border-[#30363d]';
      }
    } else {
      switch(level) {
        case 0: return 'bg-gray-100 border border-gray-200';
        case 1: return 'bg-purple-200 border border-purple-300';
        case 2: return 'bg-purple-300 border border-purple-400';
        case 3: return 'bg-purple-400 border border-purple-500';
        case 4: return 'bg-purple-600 border border-purple-700';
        default: return 'bg-gray-100';
      }
    }
  };
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentYear = new Date().getFullYear();

  return (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex flex-col h-full`}>
      <div className="flex items-center justify-between mb-6">
          <div className="flex items-baseline gap-2">
            <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {currentYear} Sessions
            </h3>
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider">
            <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>Less</span>
            {[0, 1, 2, 3, 4].map(level => (
              <div
                key={level}
                className={`w-3 h-3 rounded-sm ${getColorClass(level).split(' ')[0]}`}
              />
            ))}
            <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>More</span>
          </div>
      </div>

      {/* Stats Mini-Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-3 text-center border border-gray-100 dark:border-gray-700">
            <div className="flex justify-center mb-1 text-orange-500">
               <FireIcon className="w-5 h-5" />
            </div>
            <div className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{currentStreak}</div>
            <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">2025 Streak</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-3 text-center border border-gray-100 dark:border-gray-700">
            <div className="flex justify-center mb-1 text-purple-500">
               <TrophyIcon className="w-5 h-5" />
            </div>
            <div className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {formatDuration(longestDay)}
            </div>
            <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Longest Day</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-3 text-center border border-gray-100 dark:border-gray-700">
            <div className="flex justify-center mb-1 text-blue-500">
               <CalendarIcon className="w-5 h-5" />
            </div>
            <div className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{totalSessionsCount}</div>
            <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Total Sess.</div>
        </div>
      </div>
      
      {/* Responsive Heatmap Grid - Scrollable */}
      <div className="flex-1 w-full overflow-x-auto pb-4 custom-scrollbar">
         <div className="min-w-max pr-4"> {/* Ensure width fits content to trigger scroll */}
             
             {/* Header Row (Months) - Integrated inside scroll container for alignment */}
             <div className="flex mb-2">
                 {/* Spacer for Day Labels Column */}
                 <div className="w-8 flex-shrink-0 mr-1"></div>
                 
                 {/* Weeks Container for Month Labels */}
                 <div className="flex gap-1 h-4">
                     {weeks.map((week, idx) => {
                         // Determine if this week contains the 1st of a month
                         const firstOfMonth = week.find(d => !d.placeholder && d.date.getDate() === 1);
                         return (
                             <div key={idx} className="w-5 flex-shrink-0 relative">
                                 {firstOfMonth && (
                                     <span className={`absolute bottom-0 left-0 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                         {firstOfMonth.date.toLocaleDateString('en-US', { month: 'short' })}
                                     </span>
                                 )}
                             </div>
                         );
                     })}
                 </div>
             </div>

             {/* Body Row (Days + Grid) */}
             <div className="flex">
                {/* Day Labels Column */}
                <div className="flex flex-col gap-1 justify-between py-[1px] w-8 flex-shrink-0 mr-1">
                  {days.map((day, idx) => (
                    <div key={idx} className={`h-5 text-[9px] font-medium ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'} flex items-center justify-end`}>
                      {/* Show Mon, Wed, Fri */}
                      {idx % 2 !== 0 ? day : ''}
                    </div>
                  ))}
                </div>
                
                {/* Grid Container */}
                <div className="flex gap-1">
                  {weeks.map((week, weekIdx) => (
                    <div key={weekIdx} className="flex flex-col gap-1 w-5 flex-shrink-0">
                      {week.map((day, dayIdx) => (
                        day.placeholder ? (
                            <div key={`placeholder-${weekIdx}-${dayIdx}`} className="w-5 h-5" />
                        ) : (
                            <div
                            key={day.dateStr}
                            className={`w-5 h-5 rounded-sm ${getColorClass(day.level)} cursor-pointer transition-all hover:scale-110`}
                            onMouseEnter={() => setHoveredDay(day)}
                            onMouseLeave={() => setHoveredDay(null)}
                            />
                        )
                      ))}
                    </div>
                  ))}
                </div>
              </div>
          </div>
      </div>
      
      {/* Tooltip Area */}
      <div className="h-6 mt-2 pl-9">
          {hoveredDay ? (
             <div className="flex items-center gap-2 text-xs animate-in fade-in duration-200">
                <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {hoveredDay.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}:
                </span>
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                    {hoveredDay.tracked 
                        ? `${hoveredDay.sessionCount} Sessions (${formatDuration(hoveredDay.totalSeconds)})` 
                        : 'No sessions'}
                </span>
             </div>
          ) : (
             <p className={`text-xs ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'} italic`}>
                Hover over a square to view details.
             </p>
          )}
      </div>
    </div>
  );
};

export default ActivityHeatmap;