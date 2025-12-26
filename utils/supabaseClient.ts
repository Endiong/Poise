import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// DATABASE TYPES
// ============================================

export interface DbSession {
  id: string;
  user_id: string;
  created_at: string;
  duration: number;
  good_duration: number;
  slouch_duration: number;
  lean_duration: number;
  score: number;
  session_number?: number;
  notes?: string;
}

export interface UserPreferences {
  user_id: string;
  daily_goal: number;
  session_goal: number;
  sensitivity: string;
  created_at: string;
  updated_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  badge_name: string;
  earned_at: string;
}

export interface DailyGoal {
  id: string;
  user_id: string;
  date: string;
  goal_percentage: number;
  achieved_percentage: number;
  goal_met: boolean;
  total_duration: number;
  session_count: number;
  created_at: string;
  updated_at: string;
}

// ============================================
// SESSION FUNCTIONS
// ============================================

// Insert a new posture session
export const insertSession = async (
  userId: string,
  duration: number,
  goodDuration: number,
  slouchDuration: number,
  leanDuration: number,
  notes?: string
): Promise<DbSession | null> => {
  const score = duration > 0 ? Math.round((goodDuration / duration) * 100) : 0;
  
  const { data, error } = await supabase
    .from('sessions')
    .insert({
      user_id: userId,
      duration,
      good_duration: goodDuration,
      slouch_duration: slouchDuration,
      lean_duration: leanDuration,
      score,
      notes,
    })
    .select()
    .single();

  if (error) {
    console.error('Error inserting session:', error);
    return null;
  }

  return data;
};

// Fetch all sessions for a user
export const fetchUserSessions = async (userId: string): Promise<DbSession[]> => {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }

  return data || [];
};

// ============================================
// USER PREFERENCES FUNCTIONS
// ============================================

// Get user preferences
export const getUserPreferences = async (userId: string): Promise<UserPreferences | null> => {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user preferences:', error);
    return null;
  }

  return data;
};

// Upsert user preferences
// This function properly merges partial updates with existing values
export const upsertUserPreferences = async (
  userId: string,
  dailyGoal?: number,
  sessionGoal?: number,
  sensitivity?: string
): Promise<UserPreferences | null> => {
  // First, try to get existing preferences
  const existing = await getUserPreferences(userId);
  
  // Build updates by merging with existing values (or defaults for new users)
  const updates: Partial<UserPreferences> & { user_id: string } = { 
    user_id: userId,
    daily_goal: dailyGoal ?? existing?.daily_goal ?? 60,
    session_goal: sessionGoal ?? existing?.session_goal ?? 2,
    sensitivity: sensitivity ?? existing?.sensitivity ?? 'Medium'
  };

  const { data, error } = await supabase
    .from('user_preferences')
    .upsert(updates, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) {
    console.error('Error upserting user preferences:', error);
    return null;
  }

  return data;
};

// ============================================
// BADGE FUNCTIONS
// ============================================

// Get all badges for a user
export const getUserBadges = async (userId: string): Promise<UserBadge[]> => {
  const { data, error } = await supabase
    .from('user_badges')
    .select('*')
    .eq('user_id', userId)
    .order('earned_at', { ascending: false });

  if (error) {
    console.error('Error fetching user badges:', error);
    return [];
  }

  return data || [];
};

// Award a badge to a user
export const awardBadge = async (
  userId: string,
  badgeId: string,
  badgeName: string
): Promise<UserBadge | null> => {
  const { data, error } = await supabase
    .from('user_badges')
    .insert({
      user_id: userId,
      badge_id: badgeId,
      badge_name: badgeName,
    })
    .select()
    .single();

  if (error) {
    // Ignore duplicate badge errors
    if (error.code === '23505') {
      console.log(`Badge ${badgeId} already awarded to user`);
      return null;
    }
    console.error('Error awarding badge:', error);
    return null;
  }

  return data;
};

// Award multiple badges at once
export const awardBadges = async (
  userId: string,
  badges: { badgeId: string; badgeName: string }[]
): Promise<UserBadge[]> => {
  const badgeData = badges.map(b => ({
    user_id: userId,
    badge_id: b.badgeId,
    badge_name: b.badgeName,
  }));

  const { data, error } = await supabase
    .from('user_badges')
    .insert(badgeData)
    .select();

  if (error) {
    console.error('Error awarding badges:', error);
    return [];
  }

  return data || [];
};

// ============================================
// DAILY GOALS FUNCTIONS
// ============================================

// Get daily goal for a specific date
export const getDailyGoal = async (
  userId: string,
  date: string
): Promise<DailyGoal | null> => {
  const { data, error } = await supabase
    .from('daily_goals')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No data found
      return null;
    }
    console.error('Error fetching daily goal:', error);
    return null;
  }

  return data;
};

// Upsert daily goal progress
export const upsertDailyGoal = async (
  userId: string,
  date: string,
  goalPercentage: number,
  achievedPercentage: number,
  totalDuration: number,
  sessionCount: number
): Promise<DailyGoal | null> => {
  const goalMet = achievedPercentage >= goalPercentage;

  const { data, error } = await supabase
    .from('daily_goals')
    .upsert({
      user_id: userId,
      date,
      goal_percentage: goalPercentage,
      achieved_percentage: achievedPercentage,
      goal_met: goalMet,
      total_duration: totalDuration,
      session_count: sessionCount,
    }, { onConflict: 'user_id,date' })
    .select()
    .single();

  if (error) {
    console.error('Error upserting daily goal:', error);
    return null;
  }

  return data;
};

// Get daily goals for a date range
export const getDailyGoalsRange = async (
  userId: string,
  startDate: string,
  endDate: string
): Promise<DailyGoal[]> => {
  const { data, error } = await supabase
    .from('daily_goals')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching daily goals range:', error);
    return [];
  }

  return data || [];
};

// ============================================
// STATISTICS FUNCTIONS
// ============================================

// Get user's current streak
export const getUserStreak = async (userId: string): Promise<number> => {
  const { data, error } = await supabase
    .rpc('get_user_streak', { p_user_id: userId });

  if (error) {
    console.error('Error fetching user streak:', error);
    return 0;
  }

  return data || 0;
};
