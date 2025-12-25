
import React, { useRef, useEffect } from 'react';
import CameraView from './CameraView';
import StatsCard from './StatsCard';
import { BoltIcon, ClockIcon, CheckBadgeIcon, PoiséIcon } from '../icons/Icons';
import { PostureStatus } from '../../types';

interface LiveTrackingViewProps {
  stream: MediaStream | null;
  postureStatus: PostureStatus;
  isTracking: boolean;
  onToggleTracking: () => void;
  goodPostureSeconds: number;
  totalSessionSeconds: number;
  currentTip: string;
  isModelReady: boolean;
}

const LiveTrackingView: React.FC<LiveTrackingViewProps> = ({
  stream,
  postureStatus,
  isTracking,
  onToggleTracking,
  goodPostureSeconds,
  totalSessionSeconds,
  currentTip,
  isModelReady
}) => {
  // Local ref for the UI video element (visible to user)
  const uiVideoRef = useRef<HTMLVideoElement>(null);

  // Sync the passed stream to the UI video element
  useEffect(() => {
    if (uiVideoRef.current) {
        if (stream) {
            uiVideoRef.current.srcObject = stream;
        } else {
            uiVideoRef.current.srcObject = null;
        }
    }
  }, [stream]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentScore = totalSessionSeconds > 0 
    ? Math.min(100, Math.round((goodPostureSeconds / totalSessionSeconds) * 100)) 
    : 0;

  const cleanTip = (text: string) => text.replace(/\*\*/g, '').replace(/\*/g, '');

  return (
    <div className="space-y-4">
      <div className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-xl p-4 text-white shadow-lg shadow-gray-900/20 relative overflow-hidden transition-all duration-500 flex items-center gap-4">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <PoiséIcon className="w-16 h-16 transform translate-x-4 -translate-y-4" />
          </div>
          <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg flex-shrink-0">
              <PoiséIcon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 relative z-10">
              <div className="flex items-baseline gap-2">
                  <span className="font-bold text-gray-400 text-[10px] uppercase tracking-wider">AI Coach</span>
                  <p className="text-sm font-medium leading-tight">
                    {isTracking 
                        ? (isModelReady ? cleanTip(currentTip) : "Analyzing your posture patterns...") 
                        : "Start the camera to receive real-time, personalized posture correction tips."}
                  </p>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <div className="lg:col-span-2 w-full">
          <CameraView
            videoRef={uiVideoRef}
            postureStatus={isModelReady ? postureStatus : PostureStatus.UNKNOWN}
            onToggleCamera={onToggleTracking}
            isCameraEnabled={isTracking}
          />
        </div>
        <div className="space-y-3 w-full">
          <StatsCard
            title="Session Score"
            value={totalSessionSeconds > 0 ? `${currentScore}%` : "--"}
            unit=""
            trend={totalSessionSeconds > 0 ? (currentScore >= 80 ? "Great" : "Improve") : "Ready"}
            icon={<BoltIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />}
            iconBg="bg-yellow-100 dark:bg-yellow-900/30"
          />
          <StatsCard
            title="Session Duration"
            value={formatTime(totalSessionSeconds)}
            unit="min"
            trend={isTracking ? "Active" : "Paused"}
            icon={<ClockIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
            iconBg="bg-blue-100 dark:bg-blue-900/30"
          />
          <StatsCard
            title="Good Posture"
            value={formatTime(goodPostureSeconds)}
            unit="min"
            trend={`${totalSessionSeconds > 0 ? Math.round((goodPostureSeconds/totalSessionSeconds)*100) : 0}%`}
            icon={<CheckBadgeIcon className="w-6 h-6 text-green-600 dark:text-green-400" />}
            iconBg="bg-green-100 dark:bg-green-900/30"
          />
        </div>
      </div>
    </div>
  );
};

export default LiveTrackingView;
