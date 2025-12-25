import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  unit: string;
  trend: string;
  icon: React.ReactNode;
  iconBg: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, unit, trend, icon, iconBg }) => {
  let trendColor = '';
  
  // Logic for Trend Colors
  if (trend.startsWith('+') || ['Goal Met', 'Great', 'On Track', 'Active', 'Met', 'Excellent'].includes(trend)) {
      // Positive / Success
      trendColor = 'text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-500/20';
  } else if (['Start', 'Ready', '---', 'Idle', 'Paused'].includes(trend)) {
      // Neutral / Inactive
      trendColor = 'text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-500/20';
  } else if (trend.endsWith('%')) {
      // Percentages
      if (trend.startsWith('-')) {
          // Negative Gap
          trendColor = 'text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-500/20';
      } else {
          // Neutral Progress (e.g. 50% of goal)
          trendColor = 'text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-500/20';
      }
  } else {
      // Default / Warning
      trendColor = 'text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-500/20';
  }
  
  // Reduced padding (p-4 -> p-3), icon size (w-10 -> w-8), and text sizes for better density
  return (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${iconBg}`}>
        {/* Clone element to force smaller icon size inside */}
        {React.cloneElement(icon as React.ReactElement, { className: "w-4 h-4" })}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex justify-between items-start">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">{title}</p>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${trendColor}`}>{trend}</span>
        </div>
        <div className="flex items-baseline mt-0.5">
          <p className="text-xl font-bold text-gray-900 dark:text-white leading-none">{value}</p>
          {unit && <p className="text-xs text-gray-500 dark:text-gray-400 ml-1">{unit}</p>}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;