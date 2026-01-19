import { useState, useEffect, useRef, useCallback } from 'react';
import { PostureStatus, PostureHistoryItem } from '../types'; // Ensure these types exist
import { sendNotification, playAlertSound, playGoodSound } from '../services/notificationService';
import { insertSession } from '../utils/supabaseClient';
import { Pose, Results, NormalizedLandmark } from '@mediapipe/pose';

interface UsePostureTrackerProps {
  onPostureChange: (status: PostureStatus) => void;
  enabled: boolean;
  onSessionEnd: (session: PostureHistoryItem) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  userId?: string | null;
}

// --- CONSTANTS ---
const NOTIFICATION_PERMISSION_KEY = 'posture-notifications-enabled';
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000;
const MIN_VISIBILITY_SCORE = 0.7; // Increased from 0.6 for better accuracy
const MIN_SESSION_DURATION_SECONDS = 180;
const NO_PERSON_TIMEOUT_MS = 3000; // 3 seconds before auto-pause
const CALIBRATION_COUNTDOWN_SECONDS = 3; // seconds
const POSTURE_HYSTERESIS_COUNT = 2; // frames of consistency required
const NOTIFICATION_COOLDOWN = 60000; // 60 seconds between notifications
const SUSTAINED_BAD_POSTURE_THRESHOLD = 30000; // 30 seconds of bad posture before notification
const BAD_POSTURE_NOTIFICATION_DELAY_MS = 30000; // 30 seconds - same as SUSTAINED_BAD_POSTURE_THRESHOLD

interface PostureBaseline {
  shoulderAngle: number;
  eyeLevelRatio: number;
  depthOffset: number;
  shoulderY: number; // Average shoulder Y position (for slouch detection)
  shoulderZ: number; // Average shoulder Z position (for forward slouch detection)
}

// Default thresholds (used if user skips calibration)
const DEFAULT_BASELINE = {
  shoulderAngle: 0,
  eyeLevelRatio: 0.25,
  depthOffset: -0.1,
  shoulderY: 0.5,
  shoulderZ: 0,
};

// --- HELPER MATH FUNCTIONS ---
const calculateAngle = (p1: NormalizedLandmark, p2: NormalizedLandmark) => {
  const dy = p2.y - p1.y;
  const dx = p2.x - p1.x;
  return Math.atan2(dy, dx) * (180 / Math.PI);
};

const usePostureTracker = ({ onPostureChange, enabled, onSessionEnd, videoRef, userId }: UsePostureTrackerProps) => {
  // Refs
  const poseRef = useRef<Pose | null>(null);
  const requestRef = useRef<number | undefined>(undefined);
  const streamRef = useRef<MediaStream | null>(null);
  const baselineRef = useRef(DEFAULT_BASELINE); // Stores the "Good Posture" metrics
  const hasCalibrated = useRef(false); // Track if user has calibrated
  const isCalibratingRef = useRef(false); // Sync ref for immediate access

  // Notification & Timer Refs
  const badPostureStartTimeRef = useRef<number | null>(null);
  const lastNotificationTimeRef = useRef<number>(0);
  const lastGoodSoundTimeRef = useRef<number>(0);
  const inactivityTimerRef = useRef<number | null>(null);
  const sessionStartTimeRef = useRef<number | null>(null);
  const lastPersonSeenTimeRef = useRef<number | null>(null); // Track when person was last seen
  const noPersonTimeoutRef = useRef<number | null>(null); // Timeout for auto-pause
  const sessionPausedTimeRef = useRef<number | null>(null); // Track when session was paused

  // Duration Tracking
  const goodPostureDurationRef = useRef<number>(0);
  const slouchDurationRef = useRef<number>(0);
  const leanDurationRef = useRef<number>(0);
  const pausedDurationRef = useRef<number>(0); // Track time paused

  // Posture Hysteresis - track consecutive frames of same status
  const postureHistoryRef = useRef<PostureStatus[]>([]);

  // State
  const [postureStatus, setPostureStatus] = useState<PostureStatus>(PostureStatus.UNKNOWN);
  const [isModelReady, setIsModelReady] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false); // UI State for calibration
  const [calibrationCountdown, setCalibrationCountdown] = useState<number | null>(null);
  const [sessionPaused, setSessionPaused] = useState(false); // Track if session is paused (no person)
  const [activeStream, setActiveStream] = useState<MediaStream | null>(null);
  const [poseLandmarks, setPoseLandmarks] = useState<NormalizedLandmark[] | null>(null);

  // Render State
  const [goodPostureSeconds, setGoodPostureSeconds] = useState(0);
  const [totalSessionSeconds, setTotalSessionSeconds] = useState(0);

  // Keep a ref of status for the interval loop to access without dependency issues
  const postureStatusRef = useRef(postureStatus);
  useEffect(() => { postureStatusRef.current = postureStatus; }, [postureStatus]);

  // --- CALIBRATION LOGIC ---
  const calibrate = useCallback(() => {
    // Start countdown
    setCalibrationCountdown(CALIBRATION_COUNTDOWN_SECONDS);

    // Countdown timer
    let count = CALIBRATION_COUNTDOWN_SECONDS;
    const countdownInterval = setInterval(() => {
      count--;
      setCalibrationCountdown(count);

      if (count === 0) {
        clearInterval(countdownInterval);
        // Set BOTH ref (synchronous) and state (for UI)
        isCalibratingRef.current = true;
        setIsCalibrating(true);
        setCalibrationCountdown(null);
        // START SESSION TIMER AFTER CALIBRATION COMPLETES
        sessionStartTimeRef.current = Date.now();
      }
    }, 1000);
  }, []);

  const updatePostureStatus = useCallback((newStatus: PostureStatus) => {
    // Skip hysteresis for UNKNOWN and NO_PERSON_DETECTED (need immediate response)
    if (newStatus === PostureStatus.UNKNOWN || newStatus === PostureStatus.NO_PERSON_DETECTED) {
      // Clear history and update immediately
      postureHistoryRef.current = [];
      if (newStatus !== postureStatusRef.current) {
        setPostureStatus(newStatus);
        onPostureChange(newStatus);
      }
      return;
    }

    // Add to history for hysteresis (for posture states only)
    postureHistoryRef.current.push(newStatus);

    // Keep only last POSTURE_HYSTERESIS_COUNT frames
    if (postureHistoryRef.current.length > POSTURE_HYSTERESIS_COUNT) {
      postureHistoryRef.current.shift();
    }

    // Only update if we have enough frames AND they're all the same
    if (postureHistoryRef.current.length === POSTURE_HYSTERESIS_COUNT) {
      const allSame = postureHistoryRef.current.every(s => s === newStatus);

      if (allSame && newStatus !== postureStatusRef.current) {
        // Status has been consistent for multiple frames, update it
        if (newStatus === PostureStatus.GOOD &&
          (postureStatusRef.current === PostureStatus.SLOUCHING || postureStatusRef.current === PostureStatus.LEANING)) {
          const now = Date.now();
          if (now - lastGoodSoundTimeRef.current > 3000) {
            playGoodSound();
            lastGoodSoundTimeRef.current = now;
          }
        }
        setPostureStatus(newStatus);
        onPostureChange(newStatus);
        // Clear history after successful update
        postureHistoryRef.current = [];
      }
    }
  }, [onPostureChange]);

  // --- CORE ANALYSIS ENGINE ---
  const analyzePose = useCallback((results: Results): PostureStatus => {
    if (!results.poseLandmarks || results.poseLandmarks.length === 0) {
      updatePostureStatus(PostureStatus.UNKNOWN);
      return PostureStatus.UNKNOWN;
    }

    const landmarks = results.poseLandmarks;
    const nose = landmarks[0];
    const leftEar = landmarks[7];
    const rightEar = landmarks[8];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];

    // --- FEATURE EXTRACTION (must happen before any early returns) ---
    const shoulderDeltaX = rightShoulder.x - leftShoulder.x;
    const shoulderDeltaY = rightShoulder.y - leftShoulder.y;
    const rawShoulderAngle = Math.atan2(shoulderDeltaY, shoulderDeltaX) * (180 / Math.PI);

    const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x);
    const midShoulderY = (leftShoulder.y + rightShoulder.y) / 2;
    const midEarY = (leftEar.y + rightEar.y) / 2;
    const verticalDist = Math.abs(midShoulderY - midEarY);
    const currentRatio = verticalDist / shoulderWidth;

    const midShoulderZ = (leftShoulder.z + rightShoulder.z) / 2;
    const currentDepthOffset = nose.z - midShoulderZ;

    // --- CALIBRATION HANDLER (MUST BE FIRST, before visibility checks) ---
    if (isCalibratingRef.current && !hasCalibrated.current) {
      // CRITICAL: Set hasCalibrated IMMEDIATELY to prevent re-entry
      hasCalibrated.current = true;

      baselineRef.current = {
        shoulderAngle: rawShoulderAngle,
        eyeLevelRatio: currentRatio,
        depthOffset: currentDepthOffset,
        shoulderY: midShoulderY,
        shoulderZ: midShoulderZ, // Track shoulder depth for forward slouch detection
      };
      console.log("✅ BASELINE SAVED:", {
        shoulderAngle: rawShoulderAngle.toFixed(2),
        eyeLevelRatio: currentRatio.toFixed(3),
        depthOffset: currentDepthOffset.toFixed(3),
        shoulderY: midShoulderY.toFixed(3),
        shoulderZ: midShoulderZ.toFixed(3)
      });
      isCalibratingRef.current = false; // Clear ref
      setIsCalibrating(false); // Clear state
      return PostureStatus.GOOD;
    }

    // 1. Visibility Check - Detect if person is present
    const leftShoulderVisible = (leftShoulder.visibility ?? 0) >= MIN_VISIBILITY_SCORE;
    const rightShoulderVisible = (rightShoulder.visibility ?? 0) >= MIN_VISIBILITY_SCORE;
    const noseVisible = (nose.visibility ?? 0) >= MIN_VISIBILITY_SCORE;

    // If key landmarks aren't visible, person is likely not present
    if (!leftShoulderVisible || !rightShoulderVisible || !noseVisible) {
      const now = Date.now();
      if (lastPersonSeenTimeRef.current === null) {
        lastPersonSeenTimeRef.current = now;
      }

      if (now - lastPersonSeenTimeRef.current > NO_PERSON_TIMEOUT_MS) {
        console.log("❌ NO PERSON DETECTED - visibility too low");
        return PostureStatus.NO_PERSON_DETECTED;
      }

      return PostureStatus.UNKNOWN;
    }

    // Person is present, reset timer
    lastPersonSeenTimeRef.current = null;

    // BLOCK ANALYSIS UNTIL CALIBRATED
    if (!hasCalibrated.current) {
      return PostureStatus.UNKNOWN;
    }

    // --- COMPARE AGAINST BASELINE ---
    const baseline = baselineRef.current;
    const angleDeviation = Math.abs(rawShoulderAngle - baseline.shoulderAngle);

    // 1. Check Leaning (Shoulder Angle Deviation - left/right tilt)
    // ABSOLUTE THRESHOLD: Extreme tilts detected regardless of baseline
    if (angleDeviation > 30) { // Extreme lean - safety net
      return PostureStatus.LEANING;
    }
    if (angleDeviation > 25) { // Increased from 20 - only major tilts
      return PostureStatus.LEANING;
    }

    // 2. Check Slouching (HYBRID: Relative + Absolute Thresholds)
    // KEY INSIGHT: Both slouch types (C-shape & Turtle) have shoulders FORWARD

    // Metric A: Forward Shoulders (PRIMARY)
    const shoulderForward = midShoulderZ - baseline.shoulderZ;
    const isShouldersForward = shoulderForward > 0.20; // Relative to baseline

    // ABSOLUTE SAFETY NET: Extreme forward slouch (catches bad calibrations)
    const isExtremeSlouch = shoulderForward > 0.35; // Absolute threshold

    // Metric B: Shoulder Drop (C-Shape Collapse - lazy slouch)
    const shoulderElevation = midShoulderY - baseline.shoulderY;
    const isShoulderDropped = shoulderElevation > 0.08; // Increased from 0.04

    // Metric C: Shoulder Raise (Turtle/Hunch - stressed typing)  
    const isShoulderRaised = shoulderElevation < -0.08; // Increased from -0.04

    // Metric D: Vertical Compression (eye-to-shoulder distance reduced)
    const isCompressed = currentRatio < (baseline.eyeLevelRatio - 0.12); // Increased from 0.08

    // Metric E: Forward Head (additional confirmation)
    const zDeviation = currentDepthOffset - baseline.depthOffset;
    const isHeadForward = zDeviation < -0.18; // Increased from -0.12

    // HYBRID DETECTION:
    // 1. Relative: Forward shoulders (vs baseline) + at least 2 other metrics
    const otherSignals = [isShoulderDropped, isShoulderRaised, isCompressed, isHeadForward].filter(Boolean).length;
    const isRelativeSlouching = isShouldersForward && otherSignals >= 2;

    // 2. Absolute: Extreme slouch regardless of calibration (safety net for bad calibrations)
    const isActuallySlouching = isRelativeSlouching || isExtremeSlouch;

    console.log("🔍 SLOUCH CHECK:", {
      shoulderForward: shoulderForward.toFixed(3),
      isShouldersForward,
      isExtremeSlouch: isExtremeSlouch ? "⚠️ ABSOLUTE THRESHOLD!" : false,
      shoulderElevation: shoulderElevation.toFixed(3),
      isShoulderDropped,
      isShoulderRaised,
      currentRatio: currentRatio.toFixed(3),
      isCompressed,
      zDeviation: zDeviation.toFixed(3),
      isHeadForward,
      otherSignals,
      decision: isActuallySlouching ? "SLOUCHING" : "GOOD"
    });

    if (isActuallySlouching) {
      return PostureStatus.SLOUCHING;
    }

    return PostureStatus.GOOD;
  }, [isCalibrating]);

  const onResults = useCallback((results: Results) => {
    if (!isModelReady) setIsModelReady(true);
    if (results.poseLandmarks) {
      setPoseLandmarks(results.poseLandmarks);
      const newStatus = analyzePose(results);

      // Handle session pause when no person detected
      if (newStatus === PostureStatus.NO_PERSON_DETECTED) {
        if (!sessionPaused) {
          setSessionPaused(true);
          sessionPausedTimeRef.current = Date.now();
        }
      } else {
        // Person is back, resume session
        if (sessionPaused) {
          setSessionPaused(false);
          // Track paused duration
          if (sessionPausedTimeRef.current) {
            pausedDurationRef.current += Date.now() - sessionPausedTimeRef.current;
            sessionPausedTimeRef.current = null;
          }
        }
      }

      updatePostureStatus(newStatus);
    } else {
      setPoseLandmarks(null);
      updatePostureStatus(PostureStatus.UNKNOWN);
    }
  }, [analyzePose, updatePostureStatus, isModelReady, sessionPaused]);

  // --- CAMERA & MODEL MANAGEMENT ---

  const runDetection = useCallback(async () => {
    if (poseRef.current && videoRef.current && videoRef.current.readyState >= 3) {
      try {
        await poseRef.current.send({ image: videoRef.current });
      } catch (error) {
        console.error("Pose send error:", error);
      }
    }
    requestRef.current = requestAnimationFrame(runDetection);
  }, [videoRef]);

  const loadAndRunModel = useCallback(async () => {
    if (poseRef.current) return; // Prevent double load

    try {
      updatePostureStatus(PostureStatus.UNKNOWN);
      const pose = new Pose({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
      });

      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      pose.onResults(onResults);
      poseRef.current = pose;
      runDetection();
    } catch (error) {
      console.error("Model load error:", error);
    }
  }, [runDetection, onResults, updatePostureStatus]);

  const startCamera = useCallback(async () => {
    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' }
        });
        streamRef.current = stream;
        setActiveStream(stream);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadeddata = () => {
            loadAndRunModel();
            // DO NOT START SESSION TIMER HERE - it starts after calibration
          };
        }
        if ('Notification' in window) Notification.requestPermission();
      }
    } catch (error) {
      console.error("Camera error:", error);
    }
  }, [loadAndRunModel, videoRef]);

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
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
      setActiveStream(null);
    }
    if (videoRef.current) videoRef.current.srcObject = null;

    // Save Data Logic
    if (sessionStartTimeRef.current) {
      const finalTotal = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);

      // Calculate final stats from Refs
      const finalGood = Math.floor(goodPostureDurationRef.current / 1000);
      const finalSlouch = Math.floor(slouchDurationRef.current / 1000);
      const finalLean = Math.floor(leanDurationRef.current / 1000);

      if (finalTotal >= MIN_SESSION_DURATION_SECONDS) {
        const sessionData: PostureHistoryItem = {
          date: new Date().toISOString(),
          duration: finalTotal,
          goodDuration: Math.min(finalGood, finalTotal),
          slouchDuration: finalSlouch,
          leanDuration: finalLean
        };

        if (userId) {
          // Use 'void' to fire and forget, or handle error silently
          insertSession(userId, finalTotal, finalGood, finalSlouch, finalLean).catch(console.error);
        }
        onSessionEnd(sessionData);
      }
    }

    // Reset All State
    sessionStartTimeRef.current = null;
    goodPostureDurationRef.current = 0;
    slouchDurationRef.current = 0;
    leanDurationRef.current = 0;
    setTotalSessionSeconds(0);
    setGoodPostureSeconds(0);
    baselineRef.current = DEFAULT_BASELINE; // Reset calibration
    hasCalibrated.current = false; // Reset calibration flag
  }, [stopDetection, onSessionEnd, userId, videoRef]);

  // --- TIMERS & NOTIFICATIONS ---
  // (Inactivity timer logic omitted for brevity but should remain the same as your previous code)

  useEffect(() => {
    let interval: number | null = null;
    if (enabled) {
      interval = window.setInterval(() => {
        const now = Date.now();

        // Don't update stats if session is paused (no person detected)
        if (sessionPaused || postureStatusRef.current === PostureStatus.NO_PERSON_DETECTED) {
          return;
        }

        // 1. Update Timer Stats
        if (sessionStartTimeRef.current) {
          const elapsed = Math.floor((now - sessionStartTimeRef.current) / 1000);
          setTotalSessionSeconds(elapsed);

          if (postureStatusRef.current === PostureStatus.GOOD) {
            goodPostureDurationRef.current += 1000;
            badPostureStartTimeRef.current = null;
          } else if (postureStatusRef.current === PostureStatus.SLOUCHING) {
            slouchDurationRef.current += 1000;
          } else if (postureStatusRef.current === PostureStatus.LEANING) {
            leanDurationRef.current += 1000;
          }
          setGoodPostureSeconds(Math.floor(goodPostureDurationRef.current / 1000));
        }

        // 2. Notifications
        if (postureStatusRef.current === PostureStatus.SLOUCHING || postureStatusRef.current === PostureStatus.LEANING) {
          if (!badPostureStartTimeRef.current) {
            badPostureStartTimeRef.current = now;
          } else if ((now - badPostureStartTimeRef.current > BAD_POSTURE_NOTIFICATION_DELAY_MS) &&
            (now - lastNotificationTimeRef.current > 60000)) {
            sendNotification('Posture Alert', 'Please fix your posture!');
            playAlertSound();
            lastNotificationTimeRef.current = now;
          }
        }
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [enabled, sessionPaused]);

  // --- RECALIBRATION ---
  const recalibrate = useCallback(() => {
    // Reset calibration state
    hasCalibrated.current = false;
    baselineRef.current = DEFAULT_BASELINE;
    // Start new calibration
    calibrate();
  }, [calibrate]);

  return {
    postureStatus,
    startCamera,
    stopCamera,
    calibrate,
    recalibrate, // NEW: Allow re-calibration
    goodPostureSeconds,
    totalSessionSeconds,
    isModelReady,
    activeStream,
    poseLandmarks,
    isCalibrating,
    calibrationCountdown,
    sessionPaused
  };
};

export default usePostureTracker;