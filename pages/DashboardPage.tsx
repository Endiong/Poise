import React, { useState, useEffect, useRef, useMemo } from 'react';
import AnalyticsChart from '../components/dashboard/AnalyticsChart';
import StatsCard from '../components/dashboard/StatsCard';
import ActivityFeed from '../components/dashboard/GeminiTip';
import SessionHistory from '../components/dashboard/SessionHistory';
import LiveTrackingView from '../components/dashboard/LiveTrackingView';
import GoalsView from '../components/dashboard/GoalsView';
import ReportsView from '../components/dashboard/ReportsView';
import SettingsView from '../components/dashboard/SettingsView';
import SupportView from '../components/dashboard/SupportView';
import PlansView from '../components/dashboard/PlansView';
import BadgesView from '../components/dashboard/BadgesView';
import ActivityHeatmap from '../components/dashboard/ActivityHeatmap';
import OnboardingModal from '../components/dashboard/OnboardingModal';
import BadgePopup from '../components/dashboard/BadgePopup';
import usePostureTracker from '../hooks/usePostureTracker';
import { ViewType, PostureHistoryItem, LayoutMode, PostureStatus } from '../types';
import Chatbot from '../components/dashboard/Chatbot';
import { getPostureTip } from '../services/geminiService';
import { useAuth } from '../contexts/AuthContext';
import {
  fetchUserSessions,
  DbSession,
  getUserPreferences,
  upsertUserPreferences,
  getUserBadges,
  awardBadge,
  upsertDailyGoal
} from '../utils/supabaseClient';
import {
  HomeIcon, VideoCameraIcon, SettingsIcon, LogoutIcon,
  ClockIcon, CheckBadgeIcon,
  MoonIcon, SunIcon, PoiséIcon, ChevronDownIcon,
  ChatBubbleIcon, HeadphonesIcon,
  BoltIcon, FireIcon, ReportsIcon, ChartBarSquareIcon,
  TargetIcon, CloseIcon, UserCircleIcon, SparklesIcon, InfoCircleIcon,
  CalendarIcon, UserCheckIcon
} from '../components/icons/Icons';
import { loadState, saveState } from '../utils/storage';

const GOAL_STORAGE_KEY = 'poise-daily-goal';
const SESSION_GOAL_STORAGE_KEY = 'poise-session-goal';
const FOCUS_AREA_STORAGE_KEY = 'poise-focus-area'; // Now used for Sensitivity
const HISTORY_STORAGE_KEY = 'poise-session-history';
const USER_PROFILE_KEY = 'poise-user-profile';
const ONBOARDING_COMPLETED_KEY = 'poise-onboarding-completed';
const LAYOUT_PREF_KEY = 'poise-layout-preference';
const LATEST_TIP_KEY = 'poise-latest-tip';
const BADGES_KEY = 'poise-unlocked-badges';

type Theme = 'light' | 'dark';
type UserProfile = {
  name: string;
  avatar: string;
  email?: string;
};

interface DashboardPageProps {
  onLogout: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout }) => {
  const { user, updateUserProfile, updateUserMetadata, updatePassword, refreshUser } = useAuth();
  const [activeView, setActiveView] = useState<ViewType>('home');
  const [theme, setTheme] = useState<Theme>(() => {
    // Load theme from user_metadata or localStorage
    if (user?.user_metadata?.theme) {
      return user.user_metadata.theme as Theme;
    }
    return 'light';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Layout Preference State - Load from user_metadata first
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(() => {
    if (user?.user_metadata?.nav_layout) {
      return user.user_metadata.nav_layout as LayoutMode;
    }
    return 'sidebar';
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    // Use Supabase user data if available, otherwise fall back to localStorage
    if (user) {
      return {
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        avatar: user.user_metadata?.avatar_url || '',
        email: user.email || ''
      };
    }
    return loadState(USER_PROFILE_KEY) || {
      name: 'User',
      avatar: '',
      email: ''
    };
  });

  const [dailyGoal, setDailyGoal] = useState<number>(60); // Will be loaded from database
  const [dailySessionGoal, setDailySessionGoal] = useState<number>(2); // Will be loaded from database
  const [sensitivity, setSensitivity] = useState<string>('Medium'); // Will be loaded from database

  const [history, setHistory] = useState<PostureHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    // Only trust database (user_metadata) for onboarding state
    // New users will have undefined, which means they haven't completed onboarding
    return user?.user_metadata?.onboarding_completed === true;
  });
  const [lastTip, setLastTip] = useState<string>(() => loadState(LATEST_TIP_KEY) || "Align your ears with your shoulders.");

  // Badge State - Load from user_metadata first
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(() => {
    if (user?.user_metadata?.unlocked_badges) {
      return user.user_metadata.unlocked_badges;
    }
    // Only give onboarding_explorer if onboarding is actually completed
    const storedBadges = loadState<string[]>(BADGES_KEY);
    if (storedBadges) return storedBadges;
    return [];
  });
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<{ name: string, desc: string, icon: React.ReactNode } | null>(null);

  const [isTracking, setIsTracking] = useState(false);
  const [liveTip, setLiveTip] = useState<string>(lastTip);
  const [shouldAutoStart, setShouldAutoStart] = useState(false);

  // PERSISTENT VIDEO REF for AI Model
  const hiddenVideoRef = useRef<HTMLVideoElement>(null);

  // Fetch sessions, preferences, and badges from Supabase on mount
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) {
        setIsLoadingHistory(false);
        return;
      }

      try {
        // Load sessions
        const sessions = await fetchUserSessions(user.id);
        const historyItems: PostureHistoryItem[] = sessions.map((s: DbSession) => ({
          date: s.created_at,
          duration: s.duration,
          goodDuration: s.good_duration,
          slouchDuration: s.slouch_duration,
          leanDuration: s.lean_duration,
        }));
        setHistory(historyItems);

        // Load user preferences from database
        const prefs = await getUserPreferences(user.id);
        if (prefs) {
          setDailyGoal(prefs.daily_goal);
          setDailySessionGoal(prefs.session_goal);
          setSensitivity(prefs.sensitivity);
          // Keep localStorage as cache
          saveState(GOAL_STORAGE_KEY, prefs.daily_goal);
          saveState(SESSION_GOAL_STORAGE_KEY, prefs.session_goal);
          saveState(FOCUS_AREA_STORAGE_KEY, prefs.sensitivity);
        } else {
          // Create default preferences in database
          await upsertUserPreferences(user.id, dailyGoal, dailySessionGoal, sensitivity);
        }

        // Load badges from database
        const badges = await getUserBadges(user.id);
        if (badges.length > 0) {
          const badgeIds = badges.map(b => b.badge_id);
          setUnlockedBadges(badgeIds);
          saveState(BADGES_KEY, badgeIds);
        } else if (user.user_metadata?.unlocked_badges) {
          // Migrate from user_metadata to database
          const oldBadges = user.user_metadata.unlocked_badges;
          setUnlockedBadges(oldBadges);
          // Award each badge in the database
          for (const badgeId of oldBadges) {
            const badgeInfo = getBadgeInfo(badgeId);
            if (badgeInfo) {
              await awardBadge(user.id, badgeId, badgeInfo.name);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
        // Fall back to localStorage if Supabase fails
        const localHistory = loadState<PostureHistoryItem[]>(HISTORY_STORAGE_KEY) || [];
        setHistory(localHistory);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadUserData();
  }, [user]);

  // Helper function to get badge information
  const getBadgeInfo = (badgeId: string): { name: string; desc: string } | null => {
    const badgeMap: Record<string, { name: string; desc: string }> = {
      onboarding_explorer: { name: 'Onboarding Explorer', desc: 'Completed onboarding' },
      first_steps: { name: 'First Steps', desc: 'First tracking session' },
      on_fire: { name: 'On Fire', desc: '3-day streak' },
      week_streak: { name: 'Week Streak', desc: '7-day streak' },
      monthly_master: { name: 'Monthly Master', desc: '30-day streak' },
      goal_crusher: { name: 'Goal Crusher', desc: 'Hit goal 5 times' },
      weekend_warrior: { name: 'Weekend Warrior', desc: 'Weekend tracking' },
      marathoner: { name: 'Marathoner', desc: '4+ hour session' },
      perfectionist: { name: 'Perfectionist', desc: '95%+ score for 1hr' },
      early_bird: { name: 'Early Bird', desc: 'Session before 8 AM' },
      night_owl: { name: 'Night Owl', desc: 'Session after 8 PM' },
      posture_pro: { name: 'Posture Pro', desc: '100 hours tracked' },
      zen_master: { name: 'Zen Master', desc: 'Perfect 2hr session' },
    };
    return badgeMap[badgeId] || null;
  };

  // Sync profile, theme, layout, badges, and onboarding with user metadata when user changes
  useEffect(() => {
    if (user) {
      // Update profile
      setProfile({
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        avatar: user.user_metadata?.avatar_url || '',
        email: user.email || ''
      });

      // Update theme if it exists in metadata
      if (user.user_metadata?.theme) {
        setTheme(user.user_metadata.theme as Theme);
      }

      // Update layout if it exists in metadata
      if (user.user_metadata?.nav_layout) {
        setLayoutMode(user.user_metadata.nav_layout as LayoutMode);
      }

      // Sync badges from user_metadata
      if (user.user_metadata?.unlocked_badges) {
        setUnlockedBadges(user.user_metadata.unlocked_badges);
        saveState(BADGES_KEY, user.user_metadata.unlocked_badges);
      }

      // Sync onboarding state from user_metadata (database is source of truth)
      setHasCompletedOnboarding(user.user_metadata?.onboarding_completed === true);
    }
  }, [user]);

  // Helper to check for new badges based on updated history
  const checkBadges = async (currentHistory: PostureHistoryItem[], currentBadges: string[]) => {
    const newBadges: { id: string; info: { name: string; desc: string; icon: React.ReactNode } }[] = [];

    // 1. First Steps - Complete your first tracking session
    if (currentHistory.length === 1 && !currentBadges.includes('first_steps')) {
      newBadges.push({
        id: 'first_steps',
        info: { name: 'First Steps', desc: 'Completed your first session!', icon: <VideoCameraIcon /> }
      });
    }

    const lastSession = currentHistory[0];

    // 2. Marathoner - Track for 4 hours in one day
    if (lastSession && lastSession.duration >= 4 * 3600 && !currentBadges.includes('marathoner')) {
      newBadges.push({
        id: 'marathoner',
        info: { name: 'Marathoner', desc: 'Tracked for over 4 hours!', icon: <ClockIcon /> }
      });
    }

    // 3. Perfectionist - Maintain 95% score for 1 hour
    if (lastSession && lastSession.duration >= 3600) {
      const score = (lastSession.goodDuration / lastSession.duration) * 100;
      if (score >= 95 && !currentBadges.includes('perfectionist')) {
        newBadges.push({
          id: 'perfectionist',
          info: { name: 'Perfectionist', desc: 'Maintained 95% posture for 1 hour!', icon: <SparklesIcon /> }
        });
      }
    }

    // Calculate unique tracking dates for streak-based badges
    const uniqueDates = Array.from(new Set(
      currentHistory.map(h => new Date(h.date).toDateString())
    )).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    // 4. On Fire - Reach a 3-day streak
    if (uniqueDates.length >= 3 && !currentBadges.includes('on_fire')) {
      // Verify it's actually a streak (consecutive days)
      const streak = calculateStreak(uniqueDates);
      if (streak >= 3) {
        newBadges.push({
          id: 'on_fire',
          info: { name: 'On Fire', desc: 'Reached a 3-day streak!', icon: <FireIcon /> }
        });
      }
    }

    // 5. Week Streak - Maintain a 7-day active streak
    if (uniqueDates.length >= 7 && !currentBadges.includes('week_streak')) {
      const streak = calculateStreak(uniqueDates);
      if (streak >= 7) {
        newBadges.push({
          id: 'week_streak',
          info: { name: 'Week Streak', desc: 'Maintained a 7-day streak!', icon: <FireIcon /> }
        });
      }
    }

    // 6. Monthly Master - Reach a 30-day streak
    if (uniqueDates.length >= 30 && !currentBadges.includes('monthly_master')) {
      const streak = calculateStreak(uniqueDates);
      if (streak >= 30) {
        newBadges.push({
          id: 'monthly_master',
          info: { name: 'Monthly Master', desc: 'Reached a 30-day streak!', icon: <FireIcon /> }
        });
      }
    }

    // 7. Goal Crusher - Hit your daily goal 5 times
    if (!currentBadges.includes('goal_crusher')) {
      const goalMetCount = currentHistory.filter(h => {
        const score = (h.goodDuration / h.duration) * 100;
        return score >= dailyGoal;
      }).length;
      if (goalMetCount >= 5) {
        newBadges.push({
          id: 'goal_crusher',
          info: { name: 'Goal Crusher', desc: 'Hit your daily goal 5 times!', icon: <TargetIcon /> }
        });
      }
    }

    // 8. Weekend Warrior - Track on Saturday and Sunday
    if (!currentBadges.includes('weekend_warrior')) {
      const hasSaturday = currentHistory.some(h => new Date(h.date).getDay() === 6);
      const hasSunday = currentHistory.some(h => new Date(h.date).getDay() === 0);
      if (hasSaturday && hasSunday) {
        newBadges.push({
          id: 'weekend_warrior',
          info: { name: 'Weekend Warrior', desc: 'Tracked on Saturday and Sunday!', icon: <CalendarIcon /> }
        });
      }
    }

    // 9. Early Bird - Complete a session before 8 AM
    if (!currentBadges.includes('early_bird')) {
      const hasEarlySession = currentHistory.some(h => new Date(h.date).getHours() < 8);
      if (hasEarlySession) {
        newBadges.push({
          id: 'early_bird',
          info: { name: 'Early Bird', desc: 'Completed a session before 8 AM!', icon: <CheckBadgeIcon /> }
        });
      }
    }

    // 10. Night Owl - Complete a session after 8 PM
    if (!currentBadges.includes('night_owl')) {
      const hasLateSession = currentHistory.some(h => new Date(h.date).getHours() >= 20);
      if (hasLateSession) {
        newBadges.push({
          id: 'night_owl',
          info: { name: 'Night Owl', desc: 'Completed a session after 8 PM!', icon: <CheckBadgeIcon /> }
        });
      }
    }

    // 11. Posture Pro - Log 100 total hours of tracking
    if (!currentBadges.includes('posture_pro')) {
      const totalHours = currentHistory.reduce((sum, h) => sum + h.duration, 0) / 3600;
      if (totalHours >= 100) {
        newBadges.push({
          id: 'posture_pro',
          info: { name: 'Posture Pro', desc: 'Logged 100 total hours!', icon: <UserCheckIcon /> }
        });
      }
    }

    // 12. Zen Master - 0 Slouch events in a 2hr session
    if (lastSession && lastSession.duration >= 7200 && !currentBadges.includes('zen_master')) {
      if (lastSession.slouchDuration === 0 && lastSession.leanDuration === 0) {
        newBadges.push({
          id: 'zen_master',
          info: { name: 'Zen Master', desc: 'Perfect posture for 2 hours!', icon: <BoltIcon /> }
        });
      }
    }

    // If any new badges were earned, update state and sync to database
    if (newBadges.length > 0 && user) {
      const badgeIds = newBadges.map(b => b.id);
      const updatedBadges = [...currentBadges, ...badgeIds];

      setUnlockedBadges(updatedBadges);
      saveState(BADGES_KEY, updatedBadges);

      // Award badges in database (not user_metadata anymore)
      for (const badge of newBadges) {
        await awardBadge(user.id, badge.id, badge.info.name);
      }

      // Show popup for the most recent badge (last one in array)
      const latestBadge = newBadges[newBadges.length - 1];
      setNewlyUnlockedBadge(latestBadge.info);
    }
  };

  // Helper function to calculate actual consecutive streak
  const calculateStreak = (sortedDates: string[]): number => {
    if (sortedDates.length === 0) return 0;

    let streak = 1;
    for (let i = 0; i < sortedDates.length - 1; i++) {
      const current = new Date(sortedDates[i]);
      const next = new Date(sortedDates[i + 1]);
      const diffDays = Math.floor((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const handleSessionEnd = async (session: PostureHistoryItem) => {
    const newHistory = [session, ...history];
    setHistory(newHistory);
    // Keep localStorage as backup
    saveState(HISTORY_STORAGE_KEY, newHistory);
    checkBadges(newHistory, unlockedBadges);

    // Update daily goal progress in database
    if (user) {
      const today = new Date().toISOString().split('T')[0];
      const todaysSessions = newHistory.filter(h =>
        new Date(h.date).toISOString().split('T')[0] === today
      );

      const totalDuration = todaysSessions.reduce((sum, s) => sum + s.duration, 0);
      const totalGood = todaysSessions.reduce((sum, s) => sum + s.goodDuration, 0);
      const achievedPercentage = totalDuration > 0 ? Math.round((totalGood / totalDuration) * 100) : 0;

      await upsertDailyGoal(
        user.id,
        today,
        dailyGoal,
        achievedPercentage,
        totalDuration,
        todaysSessions.length
      );
    }
  };

  // HOOK NOW USES HIDDEN VIDEO REF with userId for Supabase
  const { postureStatus, startCamera, stopCamera, goodPostureSeconds, totalSessionSeconds, isModelReady, activeStream, poseLandmarks } = usePostureTracker({
    onPostureChange: (status) => { },
    enabled: isTracking,
    onSessionEnd: handleSessionEnd,
    videoRef: hiddenVideoRef,
    userId: user?.id
  });

  // Handle immediate session start when navigating via "Start First Session"
  useEffect(() => {
    if (activeView === 'tracking' && shouldAutoStart) {
      const timer = setTimeout(() => {
        if (!isTracking) {
          startCamera();
          setIsTracking(true);
        }
        setShouldAutoStart(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeView, shouldAutoStart, isTracking, startCamera]);

  const handleStartLiveSession = () => {
    setActiveView('tracking');
    setShouldAutoStart(true);
  };

  // Dynamic Tip Rotation
  useEffect(() => {
    let timeoutId: number;

    const fetchTip = async () => {
      if (!isTracking) return;

      const tip = await getPostureTip(postureStatus);
      setLiveTip(tip);
      setLastTip(tip);
      saveState(LATEST_TIP_KEY, tip);

      let nextFetchDelay = 30000;
      if (postureStatus === PostureStatus.GOOD) {
        nextFetchDelay = 60000;
      } else if (postureStatus === PostureStatus.UNKNOWN || postureStatus === PostureStatus.IDLE) {
        nextFetchDelay = 10000;
      } else {
        nextFetchDelay = 15000;
      }

      timeoutId = window.setTimeout(fetchTip, nextFetchDelay);
    };

    const initialDelay = postureStatus === PostureStatus.GOOD ? 2000 : 500;

    if (isTracking && isModelReady) {
      timeoutId = window.setTimeout(fetchTip, initialDelay);
    }

    return () => clearTimeout(timeoutId);
  }, [isTracking, isModelReady, postureStatus]);

  const toggleTracking = () => {
    if (isTracking) {
      stopCamera();
      setIsTracking(false);
    } else {
      startCamera();
      setIsTracking(true);
    }
  };

  const handleUpdateProfile = async (
    newProfile: UserProfile,
    password?: string,
    confirmPassword?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Prepare metadata updates
      const metadataUpdates: Record<string, any> = {};

      // Update name in auth user metadata (persists across logins)
      if (newProfile.name !== profile.name) {
        metadataUpdates.full_name = newProfile.name;
      }

      // Update avatar in auth user metadata if changed
      if (newProfile.avatar !== profile.avatar) {
        metadataUpdates.avatar_url = newProfile.avatar;
      }

      // Update metadata if there are changes
      if (Object.keys(metadataUpdates).length > 0 && updateUserMetadata) {
        const { error: authError } = await updateUserMetadata(metadataUpdates);
        if (authError) {
          return { success: false, error: authError.message };
        }
      }

      // Update password if provided
      if (password && confirmPassword && password === confirmPassword) {
        const { error: passwordError } = await updatePassword(password);
        if (passwordError) {
          return { success: false, error: passwordError.message };
        }
      }

      // Update local state
      setProfile(newProfile);
      saveState(USER_PROFILE_KEY, newProfile);

      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const handleSetGoal = async (newGoal: number) => {
    setDailyGoal(newGoal);
    saveState(GOAL_STORAGE_KEY, newGoal);
    // Sync to database
    if (user) {
      await upsertUserPreferences(user.id, newGoal, undefined, undefined);
    }
  };

  const handleSetSessionGoal = async (newGoal: number) => {
    setDailySessionGoal(newGoal);
    saveState(SESSION_GOAL_STORAGE_KEY, newGoal);
    // Sync to database
    if (user) {
      await upsertUserPreferences(user.id, undefined, newGoal, undefined);
    }
  };

  const handleSetSensitivity = async (level: string) => {
    setSensitivity(level);
    saveState(FOCUS_AREA_STORAGE_KEY, level);
    // Sync to database
    if (user) {
      await upsertUserPreferences(user.id, undefined, undefined, level);
    }
  }

  const handleUpdateLayout = async (mode: LayoutMode) => {
    setLayoutMode(mode);
    saveState(LAYOUT_PREF_KEY, mode);
    // Save to user_metadata
    if (user && updateUserMetadata) {
      await updateUserMetadata({ nav_layout: mode });
    }
  };

  const handleCompleteOnboarding = async () => {
    setHasCompletedOnboarding(true);

    // Award onboarding badge if not already unlocked
    if (!unlockedBadges.includes('onboarding_explorer') && user) {
      const updatedBadges = [...unlockedBadges, 'onboarding_explorer'];
      setUnlockedBadges(updatedBadges);
      saveState(BADGES_KEY, updatedBadges);

      // Award badge in database
      await awardBadge(user.id, 'onboarding_explorer', 'Onboarding Explorer');

      // Sync onboarding status to user_metadata (database is source of truth)
      if (updateUserMetadata) {
        await updateUserMetadata({ onboarding_completed: true });
      }
    } else if (user && updateUserMetadata) {
      // Just sync onboarding state to database
      await updateUserMetadata({ onboarding_completed: true });
    }

    setActiveView('home');
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // Save theme to user_metadata
    if (user && updateUserMetadata) {
      await updateUserMetadata({ theme: newTheme });
    }
  };

  // NEW: Calculate Weekly Time Tracked
  const timeTrackedThisWeek = useMemo(() => {
    const now = new Date();
    // Calculate Monday of current week
    const day = now.getDay(); // 0 (Sun) to 6 (Sat)
    // If Sunday (0), we go back 6 days to prev Monday. If Monday (1), go back 0.
    const diffToMon = day === 0 ? 6 : day - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diffToMon);
    monday.setHours(0, 0, 0, 0);

    const historySeconds = history
      .filter(h => new Date(h.date) >= monday)
      .reduce((sum, h) => sum + h.duration, 0);

    const totalSeconds = historySeconds + totalSessionSeconds;

    if (totalSeconds < 3600) {
      const mins = Math.floor(totalSeconds / 60);
      return { value: mins, unit: 'mins', rawHours: totalSeconds / 3600 };
    }

    return { value: (totalSeconds / 3600).toFixed(1), unit: 'hrs', rawHours: totalSeconds / 3600 };
  }, [history, totalSessionSeconds]);

  // NEW: Calculate Today's Stats for Goal Progress
  const todayStats = useMemo(() => {
    const today = new Date().toDateString();
    const todayHistory = history.filter(h => new Date(h.date).toDateString() === today);

    let totalGood = 0;
    let totalDuration = 0;

    todayHistory.forEach(h => {
      totalGood += h.goodDuration;
      totalDuration += h.duration;
    });

    if (isTracking && totalSessionSeconds > 0) {
      totalGood += goodPostureSeconds;
      totalDuration += totalSessionSeconds;
    }

    if (totalDuration === 0) return { score: 0, hasData: false };

    return {
      score: Math.round((totalGood / totalDuration) * 100),
      hasData: true
    };
  }, [history, isTracking, goodPostureSeconds, totalSessionSeconds]);

  // NEW: Prepare Sorted Chart Data
  const sortedChartData = useMemo(() => {
    // 1. Group by date string (to aggregate multiple sessions per day)
    const groupedData = history.reduce((acc, curr) => {
      const dateKey = new Date(curr.date).toLocaleDateString();
      if (!acc[dateKey]) {
        acc[dateKey] = { totalScore: 0, count: 0, dateObj: new Date(curr.date) };
      }
      acc[dateKey].totalScore += (curr.goodDuration / curr.duration) * 100;
      acc[dateKey].count += 1;
      return acc;
    }, {} as Record<string, { totalScore: number; count: number; dateObj: Date }>);

    // 2. Convert to array and Sort by Timestamp (Oldest -> Newest)
    // This fixes the "Thursday before Tuesday" issue
    const values = Object.values(groupedData) as { totalScore: number; count: number; dateObj: Date }[];

    return values
      .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())
      .map(item => ({
        date: item.dateObj.toLocaleDateString(undefined, { weekday: 'short' }),
        score: Math.round(item.totalScore / item.count)
      }))
      .slice(-7); // Keep last 7 days
  }, [history]);

  const currentStreak = useMemo(() => {
    if (history.length === 0) return 0;

    // Only count sessions > 3 minutes (180 seconds) for streak
    const MIN_STREAK_DURATION = 180;

    const validHistory = history.filter(h => h.duration >= MIN_STREAK_DURATION);
    if (validHistory.length === 0) return 0;

    const uniqueDates = (Array.from(new Set(
      validHistory.map(h => {
        const d = new Date(h.date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      })
    )) as string[]).sort().reverse();

    if (uniqueDates.length === 0) return 0;

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    const latestDate = uniqueDates[0];

    // If we haven't tracked today or yesterday, streak is broken (unless currently tracking)
    if (latestDate !== todayStr && latestDate !== yesterdayStr && !isTracking) {
      return 0;
    }

    let streak = 0;
    let expectedDate = new Date(latestDate);

    for (const dateStr of uniqueDates) {
      const currentCheck = new Date(dateStr);
      const diffTime = Math.abs(expectedDate.getTime() - currentCheck.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) {
        streak++;
        expectedDate = new Date(currentCheck);
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }, [history, isTracking]);

  const weeklyImprovement = useMemo(() => {
    if (history.length === 0) return null;

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const thisWeekSessions = history.filter(h => new Date(h.date) >= oneWeekAgo);
    const lastWeekSessions = history.filter(h => new Date(h.date) >= twoWeeksAgo && new Date(h.date) < oneWeekAgo);

    if (thisWeekSessions.length === 0 || lastWeekSessions.length === 0) {
      return null;
    }

    const getAvgScore = (sessions: PostureHistoryItem[]) => {
      if (sessions.length === 0) return 0;
      const totalScore = sessions.reduce((acc, sess) => acc + (sess.goodDuration / sess.duration), 0);
      return (totalScore / sessions.length) * 100;
    };

    const thisWeekAvg = getAvgScore(thisWeekSessions);
    const lastWeekAvg = getAvgScore(lastWeekSessions);

    const diff = Math.round(thisWeekAvg - lastWeekAvg);
    return diff;
  }, [history]);

  const getWelcomeMessage = () => {
    const firstName = profile.name.split(' ')[0];
    if (history.length === 0) {
      return {
        title: `Welcome, ${firstName}!`,
        subtitle: "Let's calibrate your environment."
      };
    }
    let subtitle = "Keep tracking to unlock weekly trends.";
    if (weeklyImprovement !== null) {
      if (weeklyImprovement > 0) {
        subtitle = `Your posture improved by ${weeklyImprovement}% this week.`;
      } else if (weeklyImprovement < 0) {
        subtitle = `Score dropped by ${Math.abs(weeklyImprovement)}% this week.`;
      } else {
        subtitle = "Your score has remained stable.";
      }
    }
    return {
      title: `Hi, ${firstName} 👋`,
      subtitle: subtitle
    };
  };

  const welcomeText = getWelcomeMessage();

  const mainNavItems = [
    { id: 'home', label: 'Dashboard', icon: <HomeIcon /> },
    { id: 'tracking', label: 'Tracking', icon: <VideoCameraIcon /> }, // Renamed from Live
    { id: 'history', label: 'History', icon: <ChartBarSquareIcon /> },
    { id: 'chat', label: 'Atlas', icon: <ChatBubbleIcon /> },
    { id: 'goals', label: 'Goals', icon: <TargetIcon /> },
    { id: 'reports', label: 'Reports', icon: <ReportsIcon /> },
    { id: 'badges', label: 'Badges', icon: <CheckBadgeIcon /> },
  ];

  const getPageTitle = (view: ViewType) => {
    switch (view) {
      case 'home': return 'Dashboard';
      case 'tracking': return 'Tracking Session';
      case 'history': return 'Session History';
      case 'chat': return 'Atlas AI Coach';
      case 'goals': return 'Goals & Targets';
      case 'reports': return 'Analytics Reports';
      case 'badges': return 'Achievements';
      case 'settings': return 'Settings';
      case 'plans': return 'Upgrade Plan';
      case 'support': return 'Help & Support';
      default: return 'Dashboard';
    }
  };

  const showSidebarDesktop = layoutMode === 'sidebar';

  const AvatarPlaceholder = ({ className }: { className: string }) => (
    <div className={`${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 overflow-hidden`}>
      <UserCircleIcon className="w-full h-full p-1" />
    </div>
  );

  // Truncate name logic
  const getDisplayName = (name: string) => {
    if (name.length > 12) {
      return name.substring(0, 12) + '...';
    }
    return name;
  }

  // Streak Tooltip Content
  const StreakDisplay = ({ streak }: { streak: number }) => (
    <div className="group relative flex items-center gap-1.5 px-3 py-1 bg-orange-100 dark:bg-orange-100 rounded-full cursor-help">
      <FireIcon className="w-4 h-4 text-orange-600 dark:text-orange-600" />
      <span className="text-sm font-bold text-orange-700 dark:text-orange-700">{streak}</span>

      {/* Tooltip */}
      <div className="absolute top-full right-0 mt-2 w-48 p-2 bg-black text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        <p>Track for at least 3 minutes to increase your streak.</p>
      </div>
    </div>
  );

  return (
    <div className={`h-[100dvh] bg-gray-50 dark:bg-gray-950 transition-colors duration-300 font-sans ${theme} ${showSidebarDesktop ? 'flex overflow-hidden' : 'block overflow-auto'}`}>

      {/* ============ HIDDEN PERSISTENT VIDEO ELEMENT ============ */}
      {/* This video element is always rendered, ensuring TensorFlow MoveNet maintains session state */}
      <video
        ref={hiddenVideoRef}
        autoPlay
        muted
        playsInline
        width="640"
        height="480"
        className="fixed top-0 left-0 opacity-0 pointer-events-none -z-50"
      />

      {/* Badge Popup */}
      {newlyUnlockedBadge && (
        <BadgePopup
          badgeName={newlyUnlockedBadge.name}
          badgeDescription={newlyUnlockedBadge.desc}
          badgeIcon={newlyUnlockedBadge.icon}
          onClose={() => setNewlyUnlockedBadge(null)}
        />
      )}

      {/* ==================== MOBILE HEADER ==================== */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 h-14 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 text-gray-900 dark:text-white">
          <PoiséIcon className="w-8 h-8" />
          <span className="text-xl font-logo font-bold">poisé</span>
        </div>

        <div className="flex items-center gap-3">
          <StreakDisplay streak={currentStreak} />

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200">
            {isMobileMenuOpen ? <CloseIcon /> : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ==================== SIDEBAR ==================== */}
      {/* Backdrop for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`
            fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out flex flex-col
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            ${showSidebarDesktop ? 'md:translate-x-0 md:static md:h-screen' : 'md:hidden'}
            mt-14 md:mt-0 shadow-2xl md:shadow-none
       `}>
        {/* ... sidebar content ... */}
        <div className="h-14 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800 hidden md:flex text-gray-900 dark:text-white">
          <div className="flex items-center">
            <PoiséIcon className="w-7 h-7 mr-3" />
            <span className="text-xl font-logo tracking-tight">poisé</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1 custom-scrollbar">
          {mainNavItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveView(item.id as ViewType); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                          ${activeView === item.id
                  ? 'bg-black text-white shadow-lg shadow-gray-200/50 dark:shadow-none dark:bg-white dark:text-black'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'
                }
                      `}
            >
              <span className={`w-5 h-5 flex-shrink-0 ${activeView === item.id ? '' : 'opacity-70'}`}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          <div className="my-2 border-t border-gray-100 dark:border-gray-800"></div>

          <button
            onClick={() => { setActiveView('support'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${activeView === 'support'
                ? 'bg-black text-white shadow-lg shadow-gray-200/50 dark:shadow-none dark:bg-white dark:text-black'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'
              }
                  `}
          >
            <span className={`w-5 h-5 flex-shrink-0 ${activeView === 'support' ? '' : 'opacity-70'}`}><HeadphonesIcon /></span>
            <span>Support</span>
          </button>

          <div className="mt-auto pt-4">
            <div
              onClick={() => { setActiveView('plans'); setIsMobileMenuOpen(false); }}
              className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white relative overflow-hidden group cursor-pointer shadow-lg hover:shadow-indigo-500/30 transition-all hover:scale-[1.02]"
            >
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <BoltIcon className="w-24 h-24 transform translate-x-4 -translate-y-4" />
              </div>
              <div className="relative z-10">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-3 backdrop-blur-sm">
                  <BoltIcon className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-sm mb-1">Upgrade to Pro</h4>
                <p className="text-indigo-100 text-[10px] mb-3">Unlock unlimited tracking & advanced insights.</p>
                <button className="text-[10px] font-bold bg-white text-indigo-600 px-3 py-1.5 rounded-lg w-full hover:bg-indigo-50 transition-colors">
                  View Plans
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="relative">
              {profile.avatar ? (
                <img src={profile.avatar} alt="Profile" className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 object-cover" />
              ) : (
                <AvatarPlaceholder className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate" title={profile.name}>
                {getDisplayName(profile.name)}
              </p>
              <p className="text-xs text-gray-500 truncate">{profile.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setActiveView('settings'); setIsMobileMenuOpen(false); }}
              className="flex items-center justify-center p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              title="Settings"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>
            <button
              onClick={onLogout}
              className="flex items-center justify-center p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
              title="Logout"
            >
              <LogoutIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ==================== TOP NAV (Desktop - Icon + Labels) ==================== */}
      {!showSidebarDesktop && (
        <header className="hidden md:block sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 h-14">
          <div className="w-full max-w-6xl mx-auto px-6">
            <div className="relative flex items-center justify-between h-14">
              {/* Logo Section */}
              <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer text-gray-900 dark:text-white" onClick={() => setActiveView('home')}>
                <PoiséIcon className="w-8 h-8" />
                <span className="text-2xl font-logo tracking-tight">poisé</span>
              </div>

              {/* Navigation - Absolutely Centered */}
              <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center space-x-1">
                {mainNavItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id as ViewType)}
                    className={`
                                      flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200
                                      ${activeView === item.id
                        ? 'text-gray-900 bg-gray-100 dark:text-black dark:bg-white'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800/50'
                      }
                                  `}
                    title={item.label}
                  >
                    <span className="flex items-center justify-center w-4 h-4">{item.icon}</span>
                    <span className="text-xs font-bold leading-none mt-0.5 hidden xl:inline">{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* Right Action Section */}
              <div className="flex-shrink-0 flex items-center gap-3">
                {/* Top Navigation Streak */}
                <div className="mr-2">
                  <StreakDisplay streak={currentStreak} />
                </div>

                <button onClick={toggleTheme} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                  {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                </button>

                <div className="relative" ref={profileMenuRef}>
                  {/* ... profile dropdown ... */}
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 pl-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors p-1"
                  >
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="Profile" className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 object-cover" />
                    ) : (
                      <AvatarPlaceholder className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700" />
                    )}
                    <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white" title={profile.name}>{getDisplayName(profile.name)}</p>
                        <p className="text-xs text-gray-500 truncate">{profile.email}</p>
                      </div>
                      <div className="py-1">
                        <button onClick={() => { setActiveView('settings'); setIsProfileMenuOpen(false); }} className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <SettingsIcon className="w-4 h-4 mr-2" /> Settings
                        </button>
                        <button onClick={() => { setActiveView('support'); setIsProfileMenuOpen(false); }} className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <HeadphonesIcon className="w-4 h-4 mr-2" /> Support
                        </button>
                        <button onClick={() => { setActiveView('plans'); setIsProfileMenuOpen(false); }} className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <BoltIcon className="w-4 h-4 mr-2" /> Upgrade Plan
                        </button>
                      </div>
                      <div className="py-1 border-t border-gray-100 dark:border-gray-700">
                        <button onClick={onLogout} className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">
                          <LogoutIcon className="w-4 h-4 mr-2" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col min-w-0 overflow-hidden h-full ${!showSidebarDesktop ? '' : 'md:pt-0'} pt-14`}>

        {/* Sticky Header - COMPACT - ONLY FOR MOBILE OR SIDEBAR MODE ICONS */}
        {(showSidebarDesktop || isMobileMenuOpen === false) && (
          <header className={`flex justify-between items-center px-6 h-14 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100 dark:border-gray-800 ${!showSidebarDesktop ? 'md:hidden' : ''}`}>
            <div className="flex items-center gap-2">
              <div className="animate-in fade-in slide-in-from-left-2">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">{getPageTitle(activeView)}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Desktop Sidebar Streak Indicator */}
              {showSidebarDesktop && (
                <div className="hidden md:block mr-2">
                  <StreakDisplay streak={currentStreak} />
                </div>
              )}

              <button onClick={toggleTheme} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
              </button>
            </div>
          </header>
        )}

        <div className="flex-1 overflow-y-auto p-4 lg:p-6 scroll-smooth pb-20">
          {/* Standardized max-width wrapper for consistent alignment */}
          <div className={`mx-auto space-y-6 animate-in fade-in duration-500 ${!showSidebarDesktop ? 'max-w-6xl' : 'max-w-6xl'}`}>
            {activeView === 'home' && (
              <div className="space-y-6">
                {/* Reduced Header Area - Welcome Message Only */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{welcomeText.title}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{welcomeText.subtitle}</p>
                  </div>
                </div>

                {/* CONDITIONAL DASHBOARD CONTENT */}
                {history.length === 0 ? (
                  /* NEW USER DASHBOARD VIEW */
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    {/* Significantly Compacted Getting Started Banner */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-10">
                        <PoiséIcon className="w-32 h-32 transform translate-x-4 -translate-y-4" />
                      </div>
                      <div className="relative z-10 max-w-xl">
                        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium mb-4">
                          <SparklesIcon className="w-3 h-3" />
                          <span>Getting Started</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-3 leading-tight">Your journey to better posture starts now.</h2>
                        <p className="text-indigo-100 text-sm mb-6 leading-relaxed max-w-lg">
                          Poisé learns your habits over time. Complete a short calibration to get your baseline.
                        </p>
                        <button
                          onClick={handleStartLiveSession}
                          className="bg-white text-indigo-600 px-6 py-2.5 rounded-full font-bold hover:bg-indigo-50 transition-all shadow-lg flex items-center gap-2 text-sm transform hover:scale-105"
                        >
                          <VideoCameraIcon className="w-4 h-4" /> Start First Session
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-3">
                          <TargetIcon className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1">1. Set Your Goal</h3>
                        <p className="text-gray-500 text-xs">You've set a daily goal of {dailyGoal}% quality. Adjust in Goals tab.</p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-3">
                          <VideoCameraIcon className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1">2. Live Feedback</h3>
                        <p className="text-gray-500 text-xs">Use the camera to get real-time corrections. We'll nudge you gently.</p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-3">
                          <ChartBarSquareIcon className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1">3. View Insights</h3>
                        <p className="text-gray-500 text-xs">Dashboard will transform to show analytics after your first session.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* RETURNING USER DASHBOARD VIEW */
                  <div className="space-y-6 animate-in fade-in">
                    {/* Top Row: Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <StatsCard
                        title="Time Tracked (Weekly)"
                        value={timeTrackedThisWeek.value}
                        unit={timeTrackedThisWeek.unit}
                        trend={`${timeTrackedThisWeek.rawHours >= dailySessionGoal * 7 ? 'Goal Met' : `${Math.round((timeTrackedThisWeek.rawHours / (dailySessionGoal * 7)) * 100)}%`}`}
                        icon={<ClockIcon className="w-6 h-6 text-blue-600 dark:text-blue-600" />}
                        iconBg="bg-blue-100 dark:bg-blue-100"
                      />
                      <StatsCard
                        title="Current Posture"
                        value={isTracking ? postureStatus : 'Off'}
                        unit=""
                        trend={isTracking && postureStatus === 'Good Posture' ? 'Great' : '---'}
                        icon={<CheckBadgeIcon className="w-6 h-6 text-green-600 dark:text-green-600" />}
                        iconBg="bg-green-100 dark:bg-green-100"
                      />
                      <StatsCard
                        title="Goal Progress"
                        value={todayStats.hasData ? `${todayStats.score}%` : "0%"}
                        unit={`/ ${dailyGoal}%`}
                        trend={
                          !todayStats.hasData ? "Start" :
                            todayStats.score >= dailyGoal ? "Goal Met" :
                              `${todayStats.score - dailyGoal}%`
                        }
                        icon={<TargetIcon className="w-6 h-6 text-purple-600 dark:text-purple-600" />}
                        iconBg="bg-purple-100 dark:bg-purple-100"
                      />
                    </div>

                    {/* Analytics Chart - Full Width Row */}
                    <div className="w-full h-[300px]">
                      <AnalyticsChart
                        theme={theme}
                        data={sortedChartData}
                        goal={dailyGoal}
                      />
                    </div>

                    {/* Heatmap & Activity Feed Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                      {/* Heatmap takes 2/3 width */}
                      <div className="lg:col-span-2 h-full">
                        <ActivityHeatmap historyData={history} theme={theme} />
                      </div>

                      {/* Activity Feed */}
                      <div className="lg:col-span-1 h-full bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">Latest Activity</h3>
                        <ActivityFeed
                          onNavigate={setActiveView}
                          history={history}
                          lastTip={lastTip}
                          currentGoal={dailyGoal}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeView === 'tracking' && (
              <LiveTrackingView
                stream={activeStream}
                postureStatus={postureStatus}
                isTracking={isTracking}
                onToggleTracking={toggleTracking}
                goodPostureSeconds={goodPostureSeconds}
                totalSessionSeconds={totalSessionSeconds}
                currentTip={liveTip}
                isModelReady={isModelReady}
                poseLandmarks={poseLandmarks}
              />
            )}

            {activeView === 'history' && <SessionHistory history={history} isLoading={isLoadingHistory} />}

            {activeView === 'goals' && (
              <GoalsView
                currentGoal={dailyGoal}
                onSetGoal={handleSetGoal}
                sessionGoal={dailySessionGoal}
                onSetSessionGoal={handleSetSessionGoal}
                history={history}
                sensitivity={sensitivity}
                onSetSensitivity={handleSetSensitivity}
              />
            )}

            {activeView === 'reports' && <ReportsView history={history} theme={theme} />}

            {activeView === 'settings' && (
              <SettingsView
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
                layoutMode={layoutMode}
                onUpdateLayout={handleUpdateLayout}
              />
            )}

            {activeView === 'chat' && <Chatbot />}

            {activeView === 'support' && <SupportView />}

            {activeView === 'plans' && <PlansView />}

            {activeView === 'badges' && <BadgesView unlockedBadges={unlockedBadges} />}
          </div>
        </div>
      </main>

      {!hasCompletedOnboarding && (
        <OnboardingModal
          userName={profile.name}
          onComplete={handleCompleteOnboarding}
          onSetGoal={handleSetGoal}
          onSetSessionGoal={handleSetSessionGoal}
          onSetSensitivity={handleSetSensitivity}
          currentGoal={dailyGoal}
          currentSessionGoal={dailySessionGoal}
          currentSensitivity={sensitivity}
        />
      )}
    </div>
  );
};

export default DashboardPage;