import React, { useState, useMemo } from 'react';
import { FireIcon, TrophyIcon, CalendarIcon, ClockIcon } from '../icons/Icons';
import { PostureHistoryItem } from '../../types';

interface ActivityHeatmapProps {
  historyData: PostureHistoryItem[];
  theme?: 'light' | 'dark';
}

const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ historyData, theme = 'light' }) => {
  const [hoveredDay, setHoveredDay] = useState<any>(null);
  const [hoveredLegend, setHoveredLegend] = useState<number | null>(null);

  // Get available years from history data
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    const currentYear = new Date().getFullYear();
    years.add(currentYear); // Always include current year

    historyData.forEach(h => {
      const year = new Date(h.date).getFullYear();
      years.add(year);
    });

    return Array.from(years).sort((a, b) => b - a); // Most recent first
  }, [historyData]);

  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // Helper to format duration for display
  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  // Legend descriptions for each level
  const legendDescriptions: Record<number, string> = {
    0: 'No sessions',
    1: 'Under 30 minutes',
    2: '30 min - 1.5 hours',
    3: '1.5 - 3 hours',
    4: 'Over 3 hours'
  };

  // Filter history data for selected year
  const yearHistoryData = useMemo(() => {
    return historyData.filter(h => new Date(h.date).getFullYear() === selectedYear);
  }, [historyData, selectedYear]);

  // Generate calendar data for the selected year (Jan 1 to Dec 31)
  const calendarData = useMemo(() => {
    const startDate = new Date(selectedYear, 0, 1); // Jan 1 Local Time
    const endDate = new Date(selectedYear, 11, 31); // Dec 31 Local Time

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
      const dayData = yearHistoryData.filter(h => {
        const hDate = new Date(h.date);
        return getLocalDateStr(hDate) === dayStr;
      });

      const totalSeconds = dayData.reduce((sum, session) => sum + session.duration, 0);
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
  }, [selectedYear, yearHistoryData]);

  // Stats calculations for selected year
  const daysTracked = useMemo(() => {
    const trackedDays = calendarData.filter(d => !d.placeholder && d.tracked && d.totalSeconds >= 180);
    return trackedDays.length;
  }, [calendarData]);

  const longestStreak = useMemo(() => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const validDays = calendarData.filter(d => !d.placeholder && d.dateStr <= todayStr);
    const sortedDays = [...validDays].sort((a, b) => a.dateStr.localeCompare(b.dateStr));

    let maxStreak = 0;
    let currentStreak = 0;
    let prevDate: Date | null = null;

    for (const day of sortedDays) {
      if (day.tracked && day.totalSeconds >= 180) {
        if (prevDate === null) {
          currentStreak = 1;
        } else {
          const dayDate = new Date(day.dateStr);
          const diffTime = dayDate.getTime() - prevDate.getTime();
          const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

          // Allow 1-2 day gaps for grace period
          if (diffDays <= 2) {
            currentStreak++;
          } else {
            currentStreak = 1;
          }
        }
        prevDate = new Date(day.dateStr);
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        // Don't reset streak for missed days within grace period
        if (prevDate !== null) {
          const dayDate = new Date(day.dateStr);
          const diffTime = dayDate.getTime() - prevDate.getTime();
          const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays > 2) {
            currentStreak = 0;
            prevDate = null;
          }
        }
      }
    }
    return maxStreak;
  }, [calendarData]);

  const totalSessionsCount = useMemo(() => {
    return yearHistoryData.length;
  }, [yearHistoryData]);

  // Find the day with the MAX total duration
  const longestDay = useMemo(() => {
    if (calendarData.length === 0) return 0;
    const trackedDays = calendarData.filter(d => !d.placeholder && d.tracked);
    if (trackedDays.length === 0) return 0;

    const maxSeconds = Math.max(...trackedDays.map(d => d.totalSeconds));
    return maxSeconds;
  }, [calendarData]);

  // Group by weeks
  const weeks = useMemo(() => {
    const w = [];
    let currentWeek: any[] = [];
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
      switch (level) {
        case 0: return 'bg-[#161b22] border border-[#30363d]';
        case 1: return 'bg-purple-900/60 border border-purple-800/50';
        case 2: return 'bg-purple-800/80 border border-purple-700/50';
        case 3: return 'bg-purple-600 border border-purple-500';
        case 4: return 'bg-purple-400 border border-purple-300';
        default: return 'bg-[#161b22] border border-[#30363d]';
      }
    } else {
      switch (level) {
        case 0: return 'bg-gray-100 border border-gray-200';
        case 1: return 'bg-purple-200 border border-purple-300';
        case 2: return 'bg-purple-300 border border-purple-400';
        case 3: return 'bg-purple-400 border border-purple-500';
        case 4: return 'bg-purple-600 border border-purple-700';
        default: return 'bg-gray-100';
      }
    }
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex flex-col h-full`}>
      {/* Header with Year Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {/* Year Tabs */}
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-700/50 p-1 rounded-lg">
            {availableYears.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${selectedYear === year
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
        {/* Legend with hover tooltips */}
        <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider relative">
          <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>Less</span>
          {[0, 1, 2, 3, 4].map(level => (
            <div
              key={level}
              className="relative"
              onMouseEnter={() => setHoveredLegend(level)}
              onMouseLeave={() => setHoveredLegend(null)}
            >
              <div
                className={`w-3 h-3 rounded-sm cursor-help ${getColorClass(level).split(' ')[0]}`}
              />
              {/* Tooltip */}
              {hoveredLegend === level && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-[10px] rounded whitespace-nowrap z-50 shadow-lg">
                  {legendDescriptions[level]}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
                </div>
              )}
            </div>
          ))}
          <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>More</span>
        </div>
      </div>

      {/* Stats Mini-Cards - 4 Cards */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-3 text-center border border-gray-100 dark:border-gray-700">
          <div className="flex justify-center mb-1 text-orange-500">
            <FireIcon className="w-5 h-5" />
          </div>
          <div className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{longestStreak}</div>
          <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Best Streak</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-3 text-center border border-gray-100 dark:border-gray-700">
          <div className="flex justify-center mb-1 text-green-500">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{daysTracked}</div>
          <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Days Tracked</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-3 text-center border border-gray-100 dark:border-gray-700">
          <div className="flex justify-center mb-1 text-blue-500">
            <ClockIcon className="w-5 h-5" />
          </div>
          <div className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{totalSessionsCount}</div>
          <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Total Sess.</div>
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
      </div>

      {/* Responsive Heatmap Grid - Scrollable */}
      <div className="flex-1 w-full overflow-x-auto pb-4 custom-scrollbar">
        <div className="min-w-max pr-4">

          {/* Header Row (Months) */}
          <div className="flex mb-2">
            <div className="w-8 flex-shrink-0 mr-1"></div>

            <div className="flex gap-1 h-4">
              {weeks.map((week, idx) => {
                const firstOfMonth = week.find((d: any) => !d.placeholder && d.date.getDate() === 1);
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
              {dayNames.map((day, idx) => (
                <div key={idx} className={`h-5 text-[9px] font-medium ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'} flex items-center justify-end`}>
                  {idx % 2 !== 0 ? day : ''}
                </div>
              ))}
            </div>

            {/* Grid Container */}
            <div className="flex gap-1">
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-1 w-5 flex-shrink-0">
                  {week.map((day: any, dayIdx: number) => (
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