import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PostureStatus, PostureHistoryItem } from '../types';
import { sendNotification, playAlertSound, playGoodSound } from '../services/notificationService';
import { insertSession } from '../utils/supabaseClient';

// TypeScript declarations for global variables from script tags in index.html
declare var poseDetection: any;

interface UsePostureTrackerProps {
  onPostureChange: (status: PostureStatus) => void;
  enabled: boolean;
  onSessionEnd: (session: PostureHistoryItem) => void;
  videoRef: React.RefObject<HTMLVideoElement>; // Now accepts a persistent video ref
  userId?: string | null; // Add userId for Supabase integration
}

const BAD_POSTURE_NOTIFICATION_DELAY_MS = 10000; // 10 Seconds
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const MIN_KEYPOINT_SCORE = 0.3;
const MIN_SESSION_DURATION_SECONDS = 10;

const usePostureTracker = ({ onPostureChange, enabled, onSessionEnd, videoRef, userId }: UsePostureTrackerProps) => {
  const detectorRef = useRef<any>(null); 
  const requestRef = useRef<number | undefined>(undefined); 
  const streamRef = useRef<MediaStream | null>(null);
  
  // Notification Logic Refs
  const badPostureStartTimeRef = useRef<number | null>(null);
  const lastNotificationTimeRef = useRef<number>(0);
  const lastGoodSoundTimeRef = useRef<number>(0); // Throttle positive feedback
  
  const inactivityTimerRef = useRef<number | null>(null);

  const [postureStatus, setPostureStatus] = useState<PostureStatus>(PostureStatus.UNKNOWN);
  const [isModelReady, setIsModelReady] = useState(false);
  const [activeStream, setActiveStream] = useState<MediaStream | null>(null);
  
  // Timing State using Refs for accuracy
  const sessionStartTimeRef = useRef<number | null>(null);
  const goodPostureDurationRef = useRef<number>(0);
  const slouchDurationRef = useRef<number>(0);
  const leanDurationRef = useRef<number>(0);
  
  // State for rendering
  const [goodPostureSeconds, setGoodPostureSeconds] = useState(0);
  const [totalSessionSeconds, setTotalSessionSeconds] = useState(0);
  
  const postureStatusRef = useRef(postureStatus);

  useEffect(() => {
    postureStatusRef.current = postureStatus;
  }, [postureStatus]);

  const updatePostureStatus = useCallback((newStatus: PostureStatus) => {
    // Audio Cue: Transition to GOOD from BAD
    if (newStatus === PostureStatus.GOOD && 
       (postureStatusRef.current === PostureStatus.SLOUCHING || postureStatusRef.current === PostureStatus.LEANING)) {
        
        const now = Date.now();
        // Debounce: prevent spamming sound if detecting toggles quickly (3s debounce)
        if (now - lastGoodSoundTimeRef.current > 3000) {
            playGoodSound();
            lastGoodSoundTimeRef.current = now;
        }
    }

    setPostureStatus(newStatus);
    onPostureChange(newStatus);
  }, [onPostureChange]);

  const analyzePose = (pose: any): PostureStatus => {
    if (!pose || !pose.keypoints) {
      return PostureStatus.UNKNOWN;
    }
    const keypoints = pose.keypoints.reduce((acc: any, keypoint: any) => {
        if (keypoint.score > MIN_KEYPOINT_SCORE) {
            acc[keypoint.name] = keypoint;
        }
        return acc;
    }, {});

    const requiredKeypoints = ['left_shoulder', 'right_shoulder', 'left_ear', 'right_ear'];
    for (const kp of requiredKeypoints) {
        if (!keypoints[kp]) {
            return PostureStatus.UNKNOWN; 
        }
    }
    
    const { left_shoulder, right_shoulder, left_ear, right_ear } = keypoints;
    
    // Normalize coordinates just in case (MoveNet usually returns pixels or 0-1)
    // We rely on relative distances.

    const shoulderYDiff = Math.abs(left_shoulder.y - right_shoulder.y);
    const shoulderWidth = Math.abs(left_shoulder.x - right_shoulder.x);
    
    // 1. Leaning check
    // If one shoulder is significantly higher than the other
    if (shoulderYDiff > shoulderWidth * 0.20) { 
        return PostureStatus.LEANING;
    }

    // 2. Slouching (Neck Compression) Check
    // In a front facing camera, slouching usually manifests as the head dropping forward/down
    // or shoulders shrugging up. This reduces the vertical distance between ears and shoulders.
    // We compare vertical distance (Y-axis) to shoulder width (X-axis) to be scale-independent.
    
    const avgShoulderY = (left_shoulder.y + right_shoulder.y) / 2;
    const avgEarY = (left_ear.y + right_ear.y) / 2;
    
    // Calculate vertical neck length (Shoulders should be below ears, so Y is higher)
    const neckLength = avgShoulderY - avgEarY; 
    
    // Threshold: If neck length is too short relative to shoulder width, it's a slouch.
    // A healthy posture usually has a neck visible. Hunching hides the neck.
    // Adjust 0.25 based on testing. < 0.2 means neck is very short/compressed.
    if (neckLength < shoulderWidth * 0.20) { 
        return PostureStatus.SLOUCHING;
    }

    // Alternative Slouch check: Nose too close to shoulder line (if nose exists)
    if (keypoints['nose']) {
        const noseY = keypoints['nose'].y;
        if ((avgShoulderY - noseY) < shoulderWidth * 0.15) {
             return PostureStatus.SLOUCHING;
        }
    }

    return PostureStatus.GOOD;
  };

  const runDetection = useCallback(async () => {
    if (
      detectorRef.current &&
      videoRef.current &&
      videoRef.current.readyState >= 3 
    ) {
      try {
        const poses = await detectorRef.current.estimatePoses(videoRef.current);
        // Mark model as ready once we successfully estimate a pose (even empty)
        if (!isModelReady) setIsModelReady(true);

        if (poses && poses.length > 0) {
            const newStatus = analyzePose(poses[0]);
            updatePostureStatus(newStatus);
        } else {
            updatePostureStatus(PostureStatus.UNKNOWN);
        }
      } catch (error) {
        console.error("Error during pose estimation:", error);
      }
    }
    requestRef.current = requestAnimationFrame(runDetection);
  }, [updatePostureStatus, isModelReady, videoRef]);

  const loadAndRunModel = useCallback(async () => {
    try {
        updatePostureStatus(PostureStatus.UNKNOWN);
        if (!detectorRef.current) {
            const detectorConfig = { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING };
            const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
            detectorRef.current = detector;
        }
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
        runDetection();
    } catch(error) {
        console.error("Failed to load the pose detection model.", error);
    }
  }, [runDetection, updatePostureStatus]);

  const stopDetection = useCallback(() => {
    if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = undefined;
    }
    setIsModelReady(false);
  }, []);

  const stopCamera = useCallback(async () => {
    stopDetection();
    
    // Stop Media Stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setActiveStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    // Calculate Final Session Data
    if (sessionStartTimeRef.current) {
        const finalTotalSeconds = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);
        
        let finalGoodSeconds = Math.floor(goodPostureDurationRef.current / 1000);
        const finalSlouchSeconds = Math.floor(slouchDurationRef.current / 1000);
        const finalLeanSeconds = Math.floor(leanDurationRef.current / 1000);

        if (finalGoodSeconds > finalTotalSeconds) finalGoodSeconds = finalTotalSeconds;
        
        if (finalTotalSeconds > MIN_SESSION_DURATION_SECONDS) {
            const sessionData: PostureHistoryItem = {
                date: new Date().toISOString(),
                duration: finalTotalSeconds,
                goodDuration: finalGoodSeconds,
                slouchDuration: finalSlouchSeconds,
                leanDuration: finalLeanSeconds
            };
            
            // Save to Supabase if user is logged in
            if (userId) {
                try {
                    await insertSession(
                        userId,
                        finalTotalSeconds,
                        finalGoodSeconds,
                        finalSlouchSeconds,
                        finalLeanSeconds
                    );
                    console.log('Session saved to Supabase');
                } catch (error) {
                    console.error('Failed to save session to Supabase:', error);
                }
            }
            
            // Still call onSessionEnd for UI updates (local state, badges, etc.)
            onSessionEnd(sessionData);
        }
    }

    // Reset Refs and State
    sessionStartTimeRef.current = null;
    goodPostureDurationRef.current = 0;
    slouchDurationRef.current = 0;
    leanDurationRef.current = 0;
    setTotalSessionSeconds(0);
    setGoodPostureSeconds(0);
    badPostureStartTimeRef.current = null;
    updatePostureStatus(PostureStatus.UNKNOWN);
  }, [updatePostureStatus, stopDetection, onSessionEnd, videoRef, userId]);

  const startCamera = useCallback(async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: {
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: 'user'
            }
        });
        streamRef.current = stream;
        setActiveStream(stream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Wait for metadata to load before running model
          videoRef.current.onloadeddata = () => {
              loadAndRunModel();
              // Initialize Timer
              sessionStartTimeRef.current = Date.now();
              goodPostureDurationRef.current = 0;
              slouchDurationRef.current = 0;
              leanDurationRef.current = 0;
          };
        }
        
        // Request notification permission immediately
        if ('Notification' in window) {
            Notification.requestPermission();
        }
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      updatePostureStatus(PostureStatus.UNKNOWN);
    }
  }, [updatePostureStatus, loadAndRunModel, videoRef]);
  
  // -- Inactivity Timer --
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = window.setTimeout(() => {
        if(enabled) updatePostureStatus(PostureStatus.IDLE);
    }, INACTIVITY_TIMEOUT_MS);
  }, [updatePostureStatus, enabled]);
  
  useEffect(() => {
    if (enabled) {
      const activityEvents: (keyof WindowEventMap)[] = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
      activityEvents.forEach(event => window.addEventListener(event, resetInactivityTimer));
      resetInactivityTimer();
      return () => {
        activityEvents.forEach(event => window.removeEventListener(event, resetInactivityTimer));
        if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      };
    }
  }, [enabled, resetInactivityTimer]);

  // -- Session Timer Loop & Notification Check --
  useEffect(() => {
    let interval: number | null = null;

    if (enabled) {
      interval = window.setInterval(() => {
        const now = Date.now();

        // 1. Session Timing
        if (sessionStartTimeRef.current) {
            const elapsed = Math.floor((now - sessionStartTimeRef.current) / 1000);
            setTotalSessionSeconds(elapsed);

            if (postureStatusRef.current === PostureStatus.GOOD) {
                goodPostureDurationRef.current += 1000; 
                badPostureStartTimeRef.current = null; // Reset bad posture timer
            } else if (postureStatusRef.current === PostureStatus.SLOUCHING) {
                slouchDurationRef.current += 1000;
            } else if (postureStatusRef.current === PostureStatus.LEANING) {
                leanDurationRef.current += 1000;
            }
            
            const currentGood = Math.floor(goodPostureDurationRef.current / 1000);
            setGoodPostureSeconds(Math.min(currentGood, elapsed));
        }

        // 2. Bad Posture Notification Logic
        if (postureStatusRef.current === PostureStatus.SLOUCHING || postureStatusRef.current === PostureStatus.LEANING) {
            if (badPostureStartTimeRef.current === null) {
                badPostureStartTimeRef.current = now;
            } else {
                const badDuration = now - badPostureStartTimeRef.current;
                
                // If bad posture persists for > 10 seconds AND we haven't notified recently
                if (badDuration > BAD_POSTURE_NOTIFICATION_DELAY_MS) {
                    if (now - lastNotificationTimeRef.current > 60000) { // Don't spam: wait 1 min between notifications
                        sendNotification('Posture Alert', `You've been ${postureStatusRef.current.toLowerCase()} for a while. Please sit up straight!`);
                        playAlertSound(); // Use soft alert
                        lastNotificationTimeRef.current = now;
                    }
                }
            }
        } else {
            badPostureStartTimeRef.current = null;
        }

      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, []);

  return { 
      postureStatus, 
      startCamera, 
      stopCamera, 
      goodPostureSeconds, 
      totalSessionSeconds, 
      isModelReady,
      activeStream // Expose stream for UI components
  };
};

export default usePostureTracker;