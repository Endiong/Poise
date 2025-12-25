import React, { useState, useMemo } from 'react';
import AnalyticsChart from './AnalyticsChart';
import { PostureHistoryItem } from '../../types';
import { DownloadIcon, DocumentTextIcon, CalendarIcon } from '../icons/Icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

interface ReportsViewProps {
  history: PostureHistoryItem[];
  theme: 'light' | 'dark';
}

type TimeRange = 'current-week' | 'last-week' | 'last-30-days' | 'year-to-date';

const ReportsView: React.FC<ReportsViewProps> = ({ history, theme }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('current-week');

  // --- 1. Data Filtering Logic ---
  const filteredData = useMemo(() => {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      let startDate: Date;
      let endDate: Date = now; 

      if (timeRange === 'current-week') {
          const day = startOfToday.getDay();
          startDate = new Date(startOfToday);
          startDate.setDate(startOfToday.getDate() - day);
      } else if (timeRange === 'last-week') {
          const day = startOfToday.getDay();
          const startOfCurrentWeek = new Date(startOfToday);
          startOfCurrentWeek.setDate(startOfToday.getDate() - day);
          startDate = new Date(startOfCurrentWeek);
          startDate.setDate(startOfCurrentWeek.getDate() - 7);
          endDate = new Date(startOfCurrentWeek); 
      } else if (timeRange === 'last-30-days') {
          startDate = new Date(startOfToday);
          startDate.setDate(startOfToday.getDate() - 30);
      } else {
          startDate = new Date(now.getFullYear(), 0, 1);
      }

      return history.filter(h => {
          const d = new Date(h.date);
          return d >= startDate && d < new Date(endDate.getTime() + 86400000); 
      }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [history, timeRange]);

  // --- 2. Chart Data Preparation ---
  const chartData = useMemo(() => {
      if (filteredData.length === 0) return [];
      const grouped: Record<string, { totalScore: number, count: number, dateObj: Date }> = {};
      
      filteredData.forEach(session => {
          const dateKey = new Date(session.date).toLocaleDateString();
          if (!grouped[dateKey]) {
              grouped[dateKey] = { totalScore: 0, count: 0, dateObj: new Date(session.date) };
          }
          const score = (session.goodDuration / session.duration) * 100;
          grouped[dateKey].totalScore += score;
          grouped[dateKey].count += 1;
      });

      return Object.values(grouped).map(item => ({
          date: item.dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          score: Math.round(item.totalScore / item.count)
      })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredData]);


  // --- 3. Key Metrics Calculations ---
  const metrics = useMemo(() => {
      if (filteredData.length === 0) {
          return {
              totalSessions: 0,
              totalHours: 0,
              avgDuration: 0,
              longestSession: 0,
              bestDay: '---',
              overallScore: 0
          };
      }
      const totalSessions = filteredData.length;
      const totalSeconds = filteredData.reduce((acc, curr) => acc + curr.duration, 0);
      const totalHours = parseFloat((totalSeconds / 3600).toFixed(1));
      const avgDuration = Math.round((totalSeconds / totalSessions) / 60);
      const longestSession = Math.round(Math.max(...filteredData.map(s => s.duration)) / 60);
      const totalWeightedScore = filteredData.reduce((acc, curr) => acc + (curr.goodDuration / curr.duration), 0);
      const overallScore = Math.round((totalWeightedScore / totalSessions) * 100);

      const dayScores: Record<string, { total: number, count: number }> = {};
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      filteredData.forEach(h => {
          const dayName = days[new Date(h.date).getDay()];
          if (!dayScores[dayName]) dayScores[dayName] = { total: 0, count: 0 };
          dayScores[dayName].total += (h.goodDuration / h.duration);
          dayScores[dayName].count += 1;
      });

      let bestDay = '---';
      let maxAvg = -1;
      Object.entries(dayScores).forEach(([day, data]) => {
          const avg = data.total / data.count;
          if (avg > maxAvg) {
              maxAvg = avg;
              bestDay = day;
          }
      });

      return { totalSessions, totalHours, avgDuration, longestSession, bestDay, overallScore };
  }, [filteredData]);


  // --- 4. Posture Breakdown (Modern Pie Chart) ---
  const postureBreakdown = useMemo(() => {
      if (metrics.totalSessions === 0) return [];

      const totalDuration = filteredData.reduce((acc, curr) => acc + curr.duration, 0);
      if (totalDuration === 0) return [];

      const totalGood = filteredData.reduce((acc, curr) => acc + curr.goodDuration, 0);
      const totalSlouch = filteredData.reduce((acc, curr) => acc + (curr.slouchDuration || 0), 0);
      const totalLean = filteredData.reduce((acc, curr) => acc + (curr.leanDuration || 0), 0);
      
      const goodPct = Math.round((totalGood / totalDuration) * 100);
      const slouchPct = Math.round((totalSlouch / totalDuration) * 100);
      const leanPct = Math.round((totalLean / totalDuration) * 100);

      return [
          { name: 'Good Posture', value: goodPct, color: '#3B82F6' }, // Blue
          { name: 'Slouching', value: slouchPct, color: '#EF4444' }, // Red
          { name: 'Leaning', value: leanPct, color: '#F59E0B' }, // Amber
      ].filter(item => item.value > 0);
  }, [filteredData, metrics.totalSessions]);


  // --- 5. Dynamic Summary Generator ---
  const getSummaryText = () => {
      if (filteredData.length === 0) {
          if (timeRange === 'year-to-date') return "Start tracking to see your yearly progress report.";
          if (timeRange === 'last-30-days') return "It looks like you haven't been tracking for a full month yet.";
          return "Start your first session this week to generate your customized posture report.";
      }

      const score = metrics.overallScore;
      let sentiment = "";
      if (score >= 80) sentiment = "Excellent work!";
      else if (score >= 60) sentiment = "Good progress.";
      else sentiment = "Room for improvement.";

      const timeLabelMap: Record<TimeRange, string> = {
          'current-week': 'this week',
          'last-week': 'last week',
          'last-30-days': 'this month',
          'year-to-date': 'this year'
      };
      
      const hoursLabel = metrics.totalHours === 1 ? 'hour' : 'hours';
      const sessionsLabel = metrics.totalSessions === 1 ? 'session' : 'sessions';
      const minutesLabel = metrics.longestSession === 1 ? 'minute' : 'minutes';

      return `${sentiment} You've spent **${metrics.totalHours} ${hoursLabel}** over **${metrics.totalSessions} ${sessionsLabel}** ${timeLabelMap[timeRange]}, with an average posture score of **${score}%**. Your longest session was **${metrics.longestSession} ${minutesLabel}**, and your best performance day was **${metrics.bestDay}**.`;
  };

  const getMetricsTitle = (range: TimeRange) => {
      switch (range) {
          case 'current-week': return 'Weekly Metrics';
          case 'last-week': return "Last Week's Metrics";
          case 'last-30-days': return 'Monthly Metrics';
          case 'year-to-date': return 'Yearly Metrics';
          default: return 'Metrics';
      }
  };

  const handleDownloadReport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `poise_report_${timeRange}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // Helper for Bold text in summary
  const SummaryText = ({ text }: { text: string }) => {
      const parts = text.split(/(\*\*.*?\*\*)/g);
      return (
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
              {parts.map((part, i) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={i} className="text-gray-900 dark:text-white font-bold">{part.slice(2, -2)}</strong>;
                  }
                  return part;
              })}
          </p>
      );
  };

  const tabs: {id: TimeRange, label: string}[] = [
      { id: 'current-week', label: 'This Week' },
      { id: 'last-week', label: 'Last Week' },
      { id: 'last-30-days', label: 'Month' },
      { id: 'year-to-date', label: 'Year' },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* Control Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex items-center w-full sm:w-auto overflow-x-auto no-scrollbar border border-gray-200 dark:border-gray-700">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setTimeRange(tab.id)}
                    className={`
                        relative flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 whitespace-nowrap
                        ${timeRange === tab.id 
                            ? 'bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm' 
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }
                    `}
                >
                    {tab.label}
                </button>
            ))}
        </div>

        <button 
            onClick={handleDownloadReport}
            disabled={filteredData.length === 0}
            className="flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-xl font-bold text-xs transition-all hover:opacity-80 active:scale-95 disabled:opacity-50 w-full sm:w-auto shadow-sm"
        >
            <DownloadIcon className="w-3.5 h-3.5" />
            Export Data
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6 min-w-0">
           {/* Weekly Score Chart */}
           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden h-[350px]">
               {chartData.length > 0 ? (
                   <AnalyticsChart theme={theme} data={chartData} />
               ) : (
                   <div className="h-full flex flex-col items-center justify-center text-gray-400">
                       <CalendarIcon className="w-12 h-12 mb-3 opacity-20" />
                       <p>No session data for this period.</p>
                   </div>
               )}
           </div>
           
           {/* Posture Breakdown (Modern Pie Chart) */}
           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-[350px] flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                 Posture Breakdown
              </h3>
              <p className="text-xs text-gray-500 mb-4">Distribution of your posture states.</p>
              
              <div className="flex-1 min-h-0 relative" style={{ height: '200px' }}>
                {postureBreakdown.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={postureBreakdown}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {postureBreakdown.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                ))}
                            </Pie>
                            <RechartsTooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                            />
                            <Legend 
                                verticalAlign="middle" 
                                align="right" 
                                layout="vertical"
                                iconType="circle"
                                wrapperStyle={{ fontSize: '12px', fontWeight: 500 }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-sm text-gray-500">
                        Record sessions to generate breakdown.
                    </div>
                )}
              </div>
           </div>
        </div>

        <div className="space-y-6 min-w-0">
            {/* Key Metrics */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    {getMetricsTitle(timeRange)}
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-sm text-gray-500">Total Hours</span>
                        <span className="font-bold text-gray-900 dark:text-white">
                            {metrics.totalHours} {metrics.totalHours === 1 ? 'hr' : 'hrs'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-sm text-gray-500">Total Sessions</span>
                        <span className="font-bold text-gray-900 dark:text-white">
                            {metrics.totalSessions} {metrics.totalSessions === 1 ? 'session' : 'sessions'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-sm text-gray-500">Longest Session</span>
                        <span className="font-bold text-gray-900 dark:text-white">
                           {metrics.longestSession} {metrics.longestSession === 1 ? 'min' : 'mins'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                         <span className="text-sm text-gray-500">Best Day</span>
                         <span className="font-bold text-green-600 dark:text-green-400">{metrics.bestDay}</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                         <span className="text-sm text-gray-500">Overall Score</span>
                         <span className={`font-bold ${metrics.overallScore >= 70 ? 'text-green-600' : 'text-orange-600'}`}>
                             {metrics.overallScore}%
                         </span>
                    </div>
                </div>
            </div>

            {/* Dynamic Summary */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                 Summary
              </h3>
              <SummaryText text={getSummaryText()} />
           </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;