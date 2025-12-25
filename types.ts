
export enum PostureStatus {
  GOOD = 'Good Posture',
  SLOUCHING = 'Slouching Detected',
  LEANING = 'Leaning Detected',
  IDLE = 'Idle',
  UNKNOWN = 'Analyzing...',
}

export interface PostureDataPoint {
  time: string;
  status: 'good' | 'bad';
}

export interface PostureHistoryItem {
  date: string;
  duration: number; // total seconds
  goodDuration: number; // good posture seconds
  slouchDuration: number; // slouching seconds
  leanDuration: number; // leaning seconds
}

export type ViewType = 'home' | 'tracking' | 'history' | 'chat' | 'goals' | 'reports' | 'settings' | 'plans' | 'badges' | 'support';

export type LayoutMode = 'sidebar' | 'top';

export type AppView = 
  | 'landing' 
  | 'auth' 
  | 'dashboard' 
  | 'pricing' 
  | 'guides' 
  | 'support' 
  | 'community' 
  | 'blog' 
  | 'build' 
  | 'docs' 
  | 'security' 
  | 'bug-bounty'
  | 'privacy'
  | 'terms'
  | 'analytics';
