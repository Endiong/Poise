import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Dot } from 'recharts';

interface ChartData {
  date: string;
  score: number;
}

interface AnalyticsChartProps {
  theme: 'light' | 'dark';
  data: ChartData[];
  goal?: number;
}

// Custom Dot Component with neon glow
const CustomDot = (props: any) => {
  const { cx, cy, payload, theme } = props;

  return (
    <g>
      {/* Outer glow - slimmer */}
      <circle
        cx={cx}
        cy={cy}
        r="6"
        fill="url(#neonGradient)"
        opacity="0.2"
        className="animate-pulse"
      />
      {/* Middle glow - slimmer */}
      <circle
        cx={cx}
        cy={cy}
        r="3"
        fill="url(#neonGradient)"
        opacity="0.5"
      />
      {/* Core dot - slimmer */}
      <circle
        cx={cx}
        cy={cy}
        r="1.5"
        fill="#fff"
        stroke="url(#neonGradient)"
        strokeWidth="1.5"
      />
    </g>
  );
};

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ theme, data, goal = 95 }) => {
  const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';
  const textColor = theme === 'dark' ? '#9CA3AF' : '#6B7280';
  const goalColor = theme === 'dark' ? '#10B981' : '#059669';

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
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${isImproving ? 'bg-green-100 text-green-700 dark:bg-green-100 dark:text-green-700' : 'bg-orange-100 text-orange-700 dark:bg-orange-100 dark:text-orange-700'}`}>
          {isImproving ? '+ Improving' : 'Needs Focus'}
        </div>
      </div>

      <div className="flex-1 w-full min-h-[250px] relative" style={{ minHeight: '250px' }}>
        <style>{`
          @keyframes neon-pulse {
            0%, 100% { filter: drop-shadow(0 0 1px currentColor) drop-shadow(0 0 4px currentColor); }
            50% { filter: drop-shadow(0 0 2px currentColor) drop-shadow(0 0 6px currentColor); }
          }
          .neon-line {
            filter: drop-shadow(0 0 1px currentColor) drop-shadow(0 0 4px currentColor);
            animation: neon-pulse 3s ease-in-out infinite;
          }
        `}</style>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
            <defs>
              {/* Neon gradient: Pink -> Purple -> Blue */}
              <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#EC4899" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>

              {/* Tighter Glow filter */}
              <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Goal line gradient */}
              <linearGradient id="goalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={goalColor} stopOpacity="0.3" />
                <stop offset="50%" stopColor={goalColor} stopOpacity="1" />
                <stop offset="100%" stopColor={goalColor} stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {/* Subtle grid */}
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={gridColor}
              strokeOpacity={0.3}
            />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: textColor, fontSize: 10, fontWeight: 500, fontFamily: 'monospace' }}
              dy={15}
              interval="preserveStartEnd"
            />

            <YAxis
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: textColor, fontSize: 10, fontWeight: 500, fontFamily: 'monospace' }}
              width={30}
            />

            {/* Enhanced Tooltip - Slimmer */}
            <Tooltip
              contentStyle={{
                backgroundColor: theme === 'dark' ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                border: '1px solid',
                borderColor: theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)',
                borderRadius: '8px',
                boxShadow: theme === 'dark'
                  ? '0 0 15px rgba(139, 92, 246, 0.3)'
                  : '0 0 15px rgba(139, 92, 246, 0.2)',
                padding: '8px 12px',
                backdropFilter: 'blur(10px)',
              }}
              labelStyle={{
                color: textColor,
                fontSize: '10px',
                fontWeight: 600,
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}
              itemStyle={{
                color: '#8B5CF6',
                fontWeight: 'bold',
                fontSize: '14px',
                padding: 0
              }}
              formatter={(value: number) => [`${value}%`, 'Score']}
              cursor={{
                stroke: 'url(#neonGradient)',
                strokeWidth: 1,
                strokeDasharray: '4 4'
              }}
            />

            {/* Goal reference line - Slimmer */}
            <ReferenceLine
              y={goal}
              stroke="url(#goalGradient)"
              strokeWidth={1}
              strokeDasharray="6 6"
              strokeOpacity={0.8}
              label={{
                value: `Goal: ${goal}%`,
                position: 'insideTopRight',
                fill: goalColor,
                fontSize: 10,
                fontWeight: 700,
                dy: -8,
                dx: -5,
                style: {
                  textShadow: theme === 'dark'
                    ? `0 0 8px ${goalColor}`
                    : 'none'
                }
              }}
            />

            {/* Main neon line - Slimmer */}
            <Line
              type="monotone"
              dataKey="score"
              stroke="url(#neonGradient)"
              strokeWidth={1.5}
              dot={<CustomDot theme={theme} />}
              activeDot={{
                r: 5,
                fill: '#fff',
                stroke: 'url(#neonGradient)',
                strokeWidth: 2,
                filter: 'url(#neonGlow)'
              }}
              animationDuration={2000}
              animationEasing="ease-in-out"
              className="neon-line"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsChart;