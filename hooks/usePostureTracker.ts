import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PostureStatus, PostureHistoryItem } from '../types';
import { sendNotification, playAlertSound, playGoodSound } from '../services/notificationService';
import { insertSession } from '../utils/supabaseClient';
import { Pose, Results, NormalizedLandmark } from '@mediapipe/pose';
import { calculateNeckCompression, calculateVerticalOffset } from '../utils/geometry';

interface UsePostureTrackerProps {
  onPostureChange: (status: PostureStatus) => void;
  enabled: boolean;
  onSessionEnd: (session: PostureHistoryItem) => void;
  videoRef: React.RefObject<HTMLVideoElement>; // Now accepts a persistent video ref
  userId?: string | null; // Add userId for Supabase integration
}

const BAD_POSTURE_NOTIFICATION_DELAY_MS = 10000; // 10 Seconds
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const MIN_VISIBILITY_SCORE = 0.5;
const MIN_SESSION_DURATION_SECONDS = 10;

const usePostureTracker = ({ onPostureChange, enabled, onSessionEnd, videoRef, userId }: UsePostureTrackerProps) => {
  const poseRef = useRef<Pose | null>(null);
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
  const [poseLandmarks, setPoseLandmarks] = useState<NormalizedLandmark[] | null>(null);

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

  const analyzePose = (results: Results): PostureStatus => {
    if (!results.poseLandmarks) {
      return PostureStatus.UNKNOWN;
    }

    const landmarks = results.poseLandmarks;

    // Indices for MediaPipe Pose
    // 11: left_shoulder, 12: right_shoulder, 7: left_ear, 8: right_ear
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftEar = landmarks[7];
    const rightEar = landmarks[8];
    const nose = landmarks[0];

    // Check visibility
    if (leftShoulder.visibility! < MIN_VISIBILITY_SCORE ||
      rightShoulder.visibility! < MIN_VISIBILITY_SCORE ||
      leftEar.visibility! < MIN_VISIBILITY_SCORE ||
      rightEar.visibility! < MIN_VISIBILITY_SCORE) {
      return PostureStatus.UNKNOWN;
    }

    // Geometry Calculations
    // 1. Leaning check
    const shoulderYDiff = calculateVerticalOffset(leftShoulder, rightShoulder);
    const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x);

    if (shoulderYDiff > shoulderWidth * 0.20) {
      return PostureStatus.LEANING;
    }

    // 2. Slouching (Neck Compression) Check
    const neckScore = calculateNeckCompression(leftShoulder, rightShoulder, leftEar, rightEar);

    // If neck length is too short relative to shoulder width, it's a slouch.
    // Adjust threshold based on MP output.
    if (neckScore < 0.35) {
      return PostureStatus.SLOUCHING;
    }

    // Alternative Slouch check: Nose too close to shoulder line
    const avgShoulderY = (leftShoulder.y + rightShoulder.y) / 2;
    if (nose && nose.visibility! > MIN_VISIBILITY_SCORE) {
      const noseY = nose.y;
      if ((avgShoulderY - noseY) < shoulderWidth * 0.25) {
        return PostureStatus.SLOUCHING;
      }
    }

    return PostureStatus.GOOD;
  };

  const onResults = useCallback((results: Results) => {
    // Mark model as ready on first result
    if (!isModelReady) setIsModelReady(true);

    if (results.poseLandmarks) {
      setPoseLandmarks(results.poseLandmarks);
      const newStatus = analyzePose(results);
      updatePostureStatus(newStatus);
    } else {
      setPoseLandmarks(null);
    }
  }, [updatePostureStatus, isModelReady]);

  const runDetection = useCallback(async () => {
    if (
      poseRef.current &&
      videoRef.current &&
      videoRef.current.readyState >= 3
    ) {
      try {
        await poseRef.current.send({ image: videoRef.current });
      } catch (error) {
        console.error("Error during pose estimation:", error);
      }
    }
    requestRef.current = requestAnimationFrame(runDetection);
  }, [videoRef]);

  const loadAndRunModel = useCallback(async () => {
    try {
      updatePostureStatus(PostureStatus.UNKNOWN);

      const pose = new Pose({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        }
      });

      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      pose.onResults(onResults);
      poseRef.current = pose;

      // Start loop
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      runDetection();
    } catch (error) {
      console.error("Failed to load the pose detection model.", error);
    }
  }, [runDetection, updatePostureStatus, onResults]);

  const stopDetection = useCallback(() => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = undefined;
    }
    if (poseRef.current) {
      poseRef.current.close();
      poseRef.current = null;
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
      if (enabled) updatePostureStatus(PostureStatus.IDLE);
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
      if (poseRef.current) poseRef.current.close();
    };
  }, []);

  return {
    postureStatus,
    startCamera,
    stopCamera,
    goodPostureSeconds,
    totalSessionSeconds,
    isModelReady,
    activeStream,
    poseLandmarks
  };
};

export default usePostureTracker;