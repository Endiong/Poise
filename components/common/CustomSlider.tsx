import React from 'react';

interface CustomSliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
  colorClass: string;
}

export const CustomSlider: React.FC<CustomSliderProps> = ({ 
  value, 
  min, 
  max, 
  step, 
  onChange, 
  colorClass 
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="relative w-full h-12 flex items-center group">
      {/* Track Background */}
      <div className="absolute w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        {/* Fill Track */}
        <div 
          className={`h-full ${colorClass} transition-all duration-300 ease-out`} 
          style={{ width: `${percentage}%` }} 
        />
      </div>
      
      {/* Native Range Input (Hidden but functional) */}
      <input 
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="absolute w-full h-full opacity-0 cursor-pointer z-10"
      />
      
      {/* Custom Thumb Handle */}
      <div 
        className="absolute h-8 w-8 bg-white dark:bg-gray-200 rounded-full shadow-lg border border-gray-100 dark:border-gray-600 flex items-center justify-center pointer-events-none transition-all duration-300 ease-out group-hover:scale-110"
        style={{ left: `calc(${percentage}% - 16px)` }}
      >
        <div className={`w-3 h-3 rounded-full ${colorClass}`} />
      </div>
    </div>
  );
};