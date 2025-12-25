import React, { useState, useRef, useEffect } from 'react';
import { TargetIcon, ArrowRightIcon, ChevronRightIcon, TrophyIcon, ClockIcon, UserCheckIcon, SparklesIcon, VideoCameraIcon } from '../icons/Icons';
import { CustomSlider } from '../common/CustomSlider';

interface OnboardingModalProps {
  userName: string;
  onComplete: () => void;
  onSetGoal: (goal: number) => void;
  onSetSessionGoal: (goal: number) => void;
  onSetSensitivity: (area: string) => void;
  currentGoal: number;
  currentSessionGoal: number;
  currentSensitivity: string;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ 
    userName, onComplete, onSetGoal, onSetSessionGoal, onSetSensitivity, 
    currentGoal, currentSessionGoal, currentSensitivity 
}) => {
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  // Handle Camera Stream for Step 5
  useEffect(() => {
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 640, height: 480, facingMode: 'user' } 
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setCameraError(null);
        } catch (err) {
            console.error("Error starting camera in onboarding:", err);
            setCameraError("Could not access camera. Please allow permissions.");
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };

    // Only activate camera on Step 5 (Camera Setup)
    if (step === 5) {
        startCamera();
    } else {
        stopCamera();
    }

    return () => stopCamera();
  }, [step]);

  const steps = [
    // Step 1: Welcome
    {
      title: `Hi, ${userName}`,
      description: "Let's calibrate your workspace for health.",
      icon: null, 
      content: (
        <div className="flex flex-col gap-3 mt-6 w-full max-w-xs mx-auto">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
             <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Habit Formation</h3>
             <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
               Build muscle memory through consistent, gentle nudges.
             </p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
             <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Privacy First</h3>
             <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
               Analysis happens locally. No video is sent to the cloud.
             </p>
          </div>
        </div>
      )
    },
    // Step 2: Quality Goal
    {
      title: "Posture Goal",
      description: "Target quality score per session.",
      icon: null,
      content: (
        <div className="w-full mt-8 max-w-xs mx-auto">
            <div className="text-center mb-8">
                <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">{currentGoal}%</span>
            </div>
            
            <CustomSlider 
              min={30} 
              max={100} 
              step={5} 
              value={currentGoal} 
              onChange={onSetGoal}
              colorClass="bg-emerald-500"
            />
            
            <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">
                <span>Relaxed</span>
                <span>Strict</span>
            </div>
        </div>
      )
    },
    // Step 3: Session Goal
    {
      title: "Daily Target",
      description: "Hours to track daily.",
      icon: null,
      content: (
        <div className="w-full mt-8 max-w-xs mx-auto">
            <div className="text-center mb-8">
                <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">{currentSessionGoal}</span>
                <span className="text-xl font-medium text-gray-400 ml-1">hrs</span>
            </div>
            
            <CustomSlider 
              min={1} 
              max={12} 
              step={1} 
              value={currentSessionGoal} 
              onChange={onSetSessionGoal}
              colorClass="bg-purple-600"
            />

            <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">
                <span>Light</span>
                <span>Intense</span>
            </div>
        </div>
      )
    },
    // Step 4: Sensitivity
    {
      title: "Sensitivity Level",
      description: "How strict should corrections be?",
      icon: null,
      content: (
        <div className="grid grid-cols-1 gap-2 w-full max-w-xs mt-6 mx-auto">
            {['Low', 'Medium', 'High'].map((level) => (
                <button
                    key={level}
                    onClick={() => onSetSensitivity(level)}
                    className={`p-3 rounded-lg text-xs font-bold border transition-all text-center ${
                        currentSensitivity === level 
                        ? 'border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-black shadow-md' 
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                >
                    {level}
                </button>
            ))}
        </div>
      )
    },
    // Step 5: Camera Setup (Live)
    {
      title: "Camera Setup",
      description: "Ensure you are visible.",
      icon: null,
      content: (
        <div className="mt-4 w-full max-w-xs mx-auto space-y-3">
            <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 relative">
                <video 
                    ref={videoRef} 
                    autoPlay 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover transform -scale-x-100"
                ></video>
                
                {/* Overlay Guide */}
                <div className="absolute inset-0 pointer-events-none opacity-30">
                     <div className="w-full h-full flex flex-col items-center justify-center">
                         <div className="w-32 h-40 border-2 border-dashed border-white rounded-full"></div>
                     </div>
                </div>

                {cameraError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white p-4 text-center">
                        <div className="flex flex-col items-center gap-2">
                             <VideoCameraIcon className="w-6 h-6 text-red-500" />
                             <p className="text-xs font-medium">{cameraError}</p>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="grid grid-cols-1 gap-1.5">
                {[
                    "Position yourself in the center.",
                    "Ensure good lighting.",
                    "Sit arm's length from screen."
                ].map((tip, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-left p-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                        <div className="w-4 h-4 rounded-full bg-black dark:bg-white text-white dark:text-black flex-shrink-0 flex items-center justify-center text-[9px] font-bold">
                            {idx + 1}
                        </div>
                        <span className="text-gray-600 dark:text-gray-300 text-[10px] font-medium">{tip}</span>
                    </div>
                ))}
            </div>
        </div>
      )
    },
    // Step 6: Completion
    {
      title: "All Set!",
      description: "You've unlocked your first badge.",
      icon: null,
      content: (
        <div className="mt-8 flex flex-col items-center">
            <div className="relative group">
                <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xl flex flex-col items-center text-center relative z-10 transform transition-transform hover:scale-105">
                    <div className="p-3 bg-gradient-to-br from-yellow-100 to-yellow-50 dark:from-yellow-900/30 dark:to-transparent rounded-full mb-3 text-yellow-600 dark:text-yellow-400 shadow-inner">
                        <TrophyIcon className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-0.5">Onboarding Explorer</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Badge Unlocked</p>
                </div>
            </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[step - 1];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Container - Reduced width and height, flex-col for layout safety */}
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header - Fixed Height */}
        <div className="flex-shrink-0 pt-6 pb-2 px-6 flex flex-col items-center bg-white dark:bg-gray-900 z-10">
            {/* Progress Dots */}
            <div className="flex gap-1.5 mb-6">
                {steps.map((_, i) => (
                    <div 
                        key={i} 
                        className={`h-1 rounded-full transition-all duration-300 ${i + 1 === step ? 'w-6 bg-black dark:bg-white' : 'w-1.5 bg-gray-200 dark:bg-gray-700'}`}
                    />
                ))}
            </div>
            
            {/* Dynamic Icon */}
            {currentStepData.icon && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-full inline-block">
                    {currentStepData.icon}
                </div>
            )}

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight text-center">
                {currentStepData.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
                {currentStepData.description}
            </p>
        </div>

        {/* Scrollable Content Area - Flexible Height */}
        <div className="flex-1 overflow-y-auto px-6 py-2">
            {currentStepData.content}
        </div>

        {/* Footer - Fixed Height */}
        <div className="flex-shrink-0 p-6 flex items-center justify-between border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
            <button 
                onClick={prevStep} 
                className={`text-xs font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-2 ${step === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
                Back
            </button>

            {step < totalSteps ? (
                <button 
                    onClick={nextStep} 
                    className="group flex items-center gap-2 px-6 py-2.5 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold hover:opacity-90 transition-all shadow-lg text-xs"
                >
                    Continue <ChevronRightIcon className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
            ) : (
                <button 
                    onClick={onComplete} 
                    className="group flex items-center gap-2 px-6 py-2.5 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold hover:opacity-90 transition-all shadow-lg text-xs"
                >
                    Get Started <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;