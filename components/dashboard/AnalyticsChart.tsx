import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ChartBarSquareIcon } from '../icons/Icons';

interface ChartData {
    date: string;
    score: number;
}

interface AnalyticsChartProps {
    theme: 'light' | 'dark';
    data: ChartData[];
    goal?: number;
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ theme, data, goal = 80 }) => {
  // Vibrant Colors
  const mainColor = '#8B5CF6'; // Violet-500
  const gradientStart = '#8B5CF6';
  const gradientEnd = '#C4B5FD'; // Violet-300
  
  const gridColor = theme === 'dark' ? '#333' : '#f0f0f0';
  const textColor = theme === 'dark' ? '#9CA3AF' : '#6B7280';
  
  // Calculate stats
  const avgScore = data.length > 0 
    ? Math.round(data.reduce((sum, item) => sum + item.score, 0) / data.length)
    : 0;

  const lastScore = data.length > 0 ? data[data.length - 1].score : 0;
  const isImproving = lastScore >= avgScore;

  return (
    <div className="bg-white dark:bg-gray-800 p-0 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 h-full overflow-hidden flex flex-col min-w-0">
      <div className="p-6 pb-2 flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
               Weekly Score Trend
            </h3>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{avgScore}</span>
                <span className="text-sm font-medium text-gray-500">avg</span>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${isImproving ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
              {isImproving ? '+ Improving' : 'Needs Focus'}
          </div>
      </div>

      <div className="flex-1 w-full min-h-[250px] relative" style={{ minHeight: '250px' }}>
         <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <defs>
              <linearGradient id="colorScoreVibrant" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientStart} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={gradientEnd} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{fill: textColor, fontSize: 11, fontWeight: 500}}
                dy={10}
            />
            {/* Enabled YAxis with Labels */}
            <YAxis 
                domain={[0, 100]} 
                axisLine={false}
                tickLine={false}
                tick={{fill: textColor, fontSize: 11, fontWeight: 500}}
                tickFormatter={(value) => `${value}`}
                width={40}
            />
            
            <Tooltip
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                padding: '12px',
                color: theme === 'dark' ? '#F3F4F6' : '#111827'
              }}
              cursor={{ stroke: mainColor, strokeWidth: 2, strokeDasharray: '5 5' }}
              labelStyle={{ color: textColor, fontSize: '12px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
              itemStyle={{ color: mainColor, fontWeight: 'bold', fontSize: '16px' }}
              formatter={(value: number) => [`${value}%`, 'Score']}
            />
            
            <ReferenceLine y={goal} stroke="#10B981" strokeDasharray="3 3" strokeOpacity={0.8} label={{ value: 'Goal', position: 'insideRight', fill: '#10B981', fontSize: 10, dy: -10 }} />

            <Area 
                type="monotone" 
                dataKey="score" 
                stroke={mainColor} 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorScoreVibrant)" 
                animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsChart;