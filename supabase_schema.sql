-- Supabase Schema for Poisé Posture Tracker
-- This script sets up the database tables, RLS (Row Level Security) policies, and RPC functions.
-- You can run this in your new Supabase project's SQL Editor to initialize your database structure.

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    duration INTEGER NOT NULL,
    good_duration INTEGER NOT NULL,
    slouch_duration INTEGER NOT NULL,
    lean_duration INTEGER NOT NULL,
    score INTEGER NOT NULL,
    session_number INTEGER,
    notes TEXT
);

-- Enable RLS for sessions
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sessions
CREATE POLICY "Users can insert their own sessions" 
    ON public.sessions FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own sessions" 
    ON public.sessions FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" 
    ON public.sessions FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions" 
    ON public.sessions FOR DELETE 
    USING (auth.uid() = user_id);


-- ============================================
-- 2. USER PREFERENCES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    daily_goal INTEGER DEFAULT 60 NOT NULL,
    session_goal INTEGER DEFAULT 2 NOT NULL,
    sensitivity TEXT DEFAULT 'Medium'::text NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for user_preferences
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_preferences
CREATE POLICY "Users can insert their own preferences" 
    ON public.user_preferences FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own preferences" 
    ON public.user_preferences FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
    ON public.user_preferences FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preferences" 
    ON public.user_preferences FOR DELETE 
    USING (auth.uid() = user_id);


-- ============================================
-- 3. USER BADGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    badge_id TEXT NOT NULL,
    badge_name TEXT NOT NULL,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT user_badges_user_id_badge_id_key UNIQUE (user_id, badge_id)
);

-- Enable RLS for user_badges
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_badges
CREATE POLICY "Users can insert their own badges" 
    ON public.user_badges FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own badges" 
    ON public.user_badges FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own badges" 
    ON public.user_badges FOR DELETE 
    USING (auth.uid() = user_id);


-- ============================================
-- 4. DAILY GOALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.daily_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    goal_percentage NUMERIC NOT NULL,
    achieved_percentage NUMERIC NOT NULL,
    goal_met BOOLEAN DEFAULT false NOT NULL,
    total_duration NUMERIC NOT NULL,
    session_count INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT daily_goals_user_id_date_key UNIQUE (user_id, date)
);

-- Enable RLS for daily_goals
ALTER TABLE public.daily_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for daily_goals
CREATE POLICY "Users can insert their own daily goals" 
    ON public.daily_goals FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own daily goals" 
    ON public.daily_goals FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily goals" 
    ON public.daily_goals FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily goals" 
    ON public.daily_goals FOR DELETE 
    USING (auth.uid() = user_id);


-- ============================================
-- 5. RPC FUNCTIONS
-- ============================================

-- Function to calculate the consecutive day streak for a user
CREATE OR REPLACE FUNCTION public.get_user_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    v_streak INTEGER := 0;
    v_days DATE[];
    i INTEGER;
BEGIN
    -- Get distinct dates of sessions with duration >= 180 seconds, sorted descending
    SELECT ARRAY_AGG(session_date) INTO v_days
    FROM (
        SELECT DISTINCT (created_at AT TIME ZONE 'UTC')::DATE as session_date
        FROM public.sessions
        WHERE user_id = p_user_id AND duration >= 180
        ORDER BY session_date DESC
    ) AS dates;

    IF v_days IS NULL OR ARRAY_LENGTH(v_days, 1) = 0 THEN
        RETURN 0;
    END IF;

    -- Check if the most recent date is within 2 days (grace period)
    IF CURRENT_DATE - v_days[1] > 2 THEN
        RETURN 0;
    END IF;

    v_streak := 1;
    FOR i IN 2..ARRAY_LENGTH(v_days, 1) LOOP
        -- Allow up to a 2-day gap within the streak (grace period)
        IF v_days[i-1] - v_days[i] <= 2 THEN
            v_streak := v_streak + 1;
        ELSE
            EXIT;
        END IF;
    END LOOP;

    RETURN v_streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
