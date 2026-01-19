
import React, { useRef, useEffect } from 'react';
import CameraView from './CameraView';
import StatsCard from './StatsCard';
import { BoltIcon, ClockIcon, CheckBadgeIcon, PoiséIcon } from '../icons/Icons';
import { PostureStatus } from '../../types';
import { NormalizedLandmark } from '@mediapipe/pose';

interface LiveTrackingViewProps {
  stream: MediaStream | null;
  postureStatus: PostureStatus;
  isTracking: boolean;
  onToggleTracking: () => void;
  goodPostureSeconds: number;
  totalSessionSeconds: number;
  currentTip: string;
  isModelReady: boolean;
  poseLandmarks: NormalizedLandmark[] | null;
  showCalibrationUI: boolean;
  onCalibrate: () => void;
  onRecalibrate: () => void; // NEW: Allow re-calibration
  calibrationCountdown: number | null;
  sessionPaused: boolean;
}

const LiveTrackingView: React.FC<LiveTrackingViewProps> = ({
  stream,
  postureStatus,
  isTracking,
  onToggleTracking,
  goodPostureSeconds,
  totalSessionSeconds,
  currentTip,
  isModelReady,
  poseLandmarks,
  showCalibrationUI,
  onCalibrate,
  onRecalibrate, // NEW
  calibrationCountdown,
  sessionPaused
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
    <div className="space-y-2">
      {/* Ultra-compact AI Coach Box */}
      <div className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-lg p-2 text-white shadow-lg relative overflow-hidden flex items-center gap-2">
        <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
          <PoiséIcon className="w-8 h-8 transform translate-x-2 -translate-y-2" />
        </div>
        <div className="p-1 bg-white/20 backdrop-blur-sm rounded-md flex-shrink-0">
          <PoiséIcon className="w-3 h-3 text-white" />
        </div>
        <div className="flex-1 relative z-10">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-gray-400 text-[8px] uppercase tracking-wider">AI Coach</span>
            <p className="text-[11px] font-medium leading-tight">
              {isTracking
                ? (isModelReady ? cleanTip(currentTip) : "Analyzing your posture patterns...")
                : "Start the camera to receive real-time, personalized posture correction tips."}
            </p>
          </div>
        </div>
      </div>

      {/* Compact 3-Minute Requirement Notice */}
      {isTracking && totalSessionSeconds < 180 && (
        <div className="w-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2 flex items-center gap-2">
          <ClockIcon className="w-3 h-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div className="text-[10px] text-blue-900 dark:text-blue-100">
            <span className="font-semibold">Track 3+ min</span> to save ·
            <span className="font-medium ml-1">
              {Math.floor((180 - totalSessionSeconds) / 60)}:{((180 - totalSessionSeconds) % 60).toString().padStart(2, '0')} left
            </span>
          </div>
        </div>
      )}

      {/* Compact Grid - Everything visible at once */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 items-start">
        {/* Camera - optimized height */}
        <div className="xl:col-span-2 w-full">
          <div className="relative w-full h-[calc(100vh-280px)] max-h-[600px] min-h-[400px]">
            <CameraView
              videoRef={uiVideoRef}
              postureStatus={isModelReady ? postureStatus : PostureStatus.UNKNOWN}
              onToggleCamera={onToggleTracking}
              isCameraEnabled={isTracking}
              poseLandmarks={poseLandmarks}
            />
            {/* Calibration Countdown Overlay */}
            {calibrationCountdown !== null && (
              <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center text-white z-30 rounded-xl animate-in fade-in">
                <div className="text-8xl font-black mb-6 animate-pulse">
                  {calibrationCountdown}
                </div>
                <p className="text-lg text-gray-300 mb-4">Hold your best posture...</p>
                <div className="text-sm text-gray-400 space-y-1 text-center">
                  <p>📏 Measuring shoulder alignment</p>
                  <p>📐 Capturing head position</p>
                  <p>📊 Recording forward lean baseline</p>
                </div>
              </div>
            )}
            {/* Calibration Setup Overlay */}
            {showCalibrationUI && calibrationCountdown === null && isModelReady && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-white z-20 rounded-xl animate-in fade-in">
                <div className="bg-white/10 p-4 rounded-full mb-4">
                  <BoltIcon className="w-8 h-8 text-white" />
                </div>

                {/* CRITICAL INSTRUCTION */}
                <div className="bg-yellow-500/20 border-2 border-yellow-400 rounded-lg p-6 mb-4 animate-pulse">
                  <h2 className="text-3xl font-black mb-2 text-yellow-300">⚠️ SIT UP STRAIGHT! ⚠️</h2>
                  <p className="text-lg text-yellow-100 font-semibold">Calibration will save your CURRENT posture as "good"</p>
                </div>

                <p className="mb-4 text-gray-300 text-center max-w-md px-4">Ensure you're in PERFECT posture:</p>
                <ul className="text-sm text-gray-300 mb-6 space-y-1 text-left">
                  <li>• <strong>Shoulders back</strong> and relaxed</li>
                  <li>• <strong>Head aligned</strong> with spine</li>
                  <li>• <strong>Look directly</strong> at the screen</li>
                  <li>• <strong>Back straight</strong>, not slouching</li>
                </ul>
                <button
                  onClick={onCalibrate}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg shadow-indigo-600/30"
                >
                  I'm Ready (Calibrate)
                </button>
              </div>
            )}
            {/* Session Paused Banner */}
            {sessionPaused && postureStatus === PostureStatus.NO_PERSON_DETECTED && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-white z-25 rounded-xl animate-in fade-in">
                <div className="bg-gray-600/30 p-6 rounded-full mb-4">
                  <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Session Paused</h3>
                <p className="text-gray-300 text-center max-w-md px-4">No person detected. The session will resume automatically when you return.</p>
              </div>
            )}
          </div>
        </div>
        {/* Stats column - compact */}
        <div className="space-y-2 w-full">
          <StatsCard
            title="Session Score"
            value={totalSessionSeconds > 0 ? `${currentScore}%` : "--"}
            unit=""
            trend={totalSessionSeconds > 0 ? (currentScore >= 80 ? "Great" : "Improve") : "Ready"}
            icon={<BoltIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-600" />}
            iconBg="bg-yellow-100 dark:bg-yellow-100"
          />
          <StatsCard
            title="Session Duration"
            value={formatTime(totalSessionSeconds)}
            unit="min"
            trend={isTracking ? "Active" : "Paused"}
            icon={<ClockIcon className="w-6 h-6 text-blue-600 dark:text-blue-600" />}
            iconBg="bg-blue-100 dark:bg-blue-100"
          />
          <StatsCard
            title="Good Posture"
            value={formatTime(goodPostureSeconds)}
            unit="min"
            trend={`${totalSessionSeconds > 0 ? Math.round((goodPostureSeconds / totalSessionSeconds) * 100) : 0}%`}
            icon={<CheckBadgeIcon className="w-6 h-6 text-green-600 dark:text-green-600" />}
            iconBg="bg-green-100 dark:bg-green-100"
          />
          {/* Re-Calibrate Button */}
          {isTracking && !showCalibrationUI && (
            <button
              onClick={onRecalibrate}
              className="text-xs text-gray-400 hover:text-indigo-400 underline transition-colors mt-2 w-full text-center"
              title="Start a new calibration if your seating position changed"
            >
              🔄 Re-calibrate Posture
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveTrackingView;
