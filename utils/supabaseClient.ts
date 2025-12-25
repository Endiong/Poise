import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for TypeScript
export interface DbSession {
  id: string;
  user_id: string;
  created_at: string;
  duration: number;
  good_duration: number;
  slouch_duration: number;
  lean_duration: number;
  score: number;
}

// Insert a new posture session
export const insertSession = async (
  userId: string,
  duration: number,
  goodDuration: number,
  slouchDuration: number,
  leanDuration: number
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
