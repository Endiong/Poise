import React from 'react';
import { PostureHistoryItem } from '../../types';
import { CheckBadgeIcon, InfoCircleIcon, StarIcon } from '../icons/Icons';

interface SessionHistoryProps {
  history: PostureHistoryItem[];
  isLoading?: boolean;
}

const SessionHistory: React.FC<SessionHistoryProps> = ({ history, isLoading = false }) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 5-Tier Status Logic
  const getStatusConfig = (score: number) => {
      if (score >= 90) return { label: 'Excellent', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', barColor: 'bg-emerald-500', icon: <StarIcon className="w-3.5 h-3.5" /> };
      if (score >= 80) return { label: 'Very Good', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', barColor: 'bg-blue-500', icon: <CheckBadgeIcon className="w-3.5 h-3.5" /> };
      if (score >= 60) return { label: 'Good', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400', barColor: 'bg-indigo-500', icon: <CheckBadgeIcon className="w-3.5 h-3.5" /> };
      if (score >= 40) return { label: 'Fair', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', barColor: 'bg-orange-500', icon: <InfoCircleIcon className="w-3.5 h-3.5" /> };
      return { label: 'Poor', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', barColor: 'bg-red-500', icon: <InfoCircleIcon className="w-3.5 h-3.5" /> };
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
        <p>Loading your session history...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-4">
           <InfoCircleIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No history yet</h3>
        <p className="max-w-xs mx-auto mt-1">Start a tracking session to see your progress recorded here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-500 font-semibold border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Date & Time</th>
                <th className="px-6 py-4 whitespace-nowrap">Duration</th>
                <th className="px-6 py-4 whitespace-nowrap">Posture Score</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {history.map((session, idx) => {
                const score = Math.round((session.goodDuration / session.duration) * 100);
                const config = getStatusConfig(score);
                
                return (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      {formatDate(session.date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {formatDuration(session.duration)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${config.barColor}`} 
                            style={{ width: `${score}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                          {score}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${config.color}`}>
                        {config.icon}
                        {config.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SessionHistory;