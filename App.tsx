
import React, { useState, useCallback, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthPage from './pages/AuthPage';
import { PricingPage, HelpSupportPage, PostureGuidesPage, GenericPage } from './pages/ExtraPages';
import { AppView } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';

export type AuthMode = 'login' | 'signup';

// Inner App component that uses the auth context
const AppContent: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const { user, loading, signOut } = useAuth();

  // Redirect to dashboard when user logs in
  useEffect(() => {
    if (!loading && user) {
      setView('dashboard');
    }
  }, [user, loading]);

  const handleNavigateToAuth = useCallback((mode: AuthMode) => {
    setAuthMode(mode);
    setView('auth');
  }, []);

  const handleLoginSuccess = useCallback(() => {
    // This is now handled by the useEffect above when user state changes
    setView('dashboard');
  }, []);
  
  const handleLogout = useCallback(async () => {
    await signOut();
    setView('landing');
  }, [signOut]);

  const handleGetStarted = useCallback(() => {
    setAuthMode('signup');
    setView('auth');
  }, []);

  const handleBackToLanding = useCallback(() => {
    setView('landing');
  }, []);

  const handleNavigation = useCallback((newView: AppView) => {
      // Protect dashboard route
      if (newView === 'dashboard' && !user) {
        setView('auth');
        return;
      }
      setView(newView);
  }, [user]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 dark:bg-gray-900">
      {view !== 'dashboard' && <Header isLoggedIn={!!user} onNavigateToAuth={handleNavigateToAuth} onLogout={handleLogout} onLogoClick={handleBackToLanding} onNavigate={handleNavigation} />}
      <main className="flex-grow flex flex-col">
        {view === 'landing' && <LandingPage onGetStarted={handleGetStarted} />}
        {view === 'auth' && <AuthPage mode={authMode} onLoginSuccess={handleLoginSuccess} onSwitchMode={setAuthMode} onBack={handleBackToLanding} />}
        {view === 'dashboard' && user && <DashboardPage onLogout={handleLogout} />}
        
        {/* Extra Pages */}
        {view === 'pricing' && <PricingPage onGetStarted={handleGetStarted} />}
        {view === 'support' && <HelpSupportPage />}
        {view === 'guides' && <PostureGuidesPage />}
        {view === 'community' && <GenericPage title="Community" description="Join the conversation with thousands of other posture enthusiasts." />}
        {view === 'blog' && <GenericPage title="Poisé Blog" description="Latest news, health tips, and product updates." />}
        {view === 'build' && <GenericPage title="Build with Poisé" description="Developer tools and SDKs coming soon." />}
        {view === 'docs' && <GenericPage title="Documentation" description="Technical guides and API references." />}
        {view === 'security' && <GenericPage title="Security" description="Learn how we protect your data and privacy." />}
        {view === 'bug-bounty' && <GenericPage title="Bug Bounty" description="Help us make Poisé safer and get rewarded." />}
        {view === 'privacy' && <GenericPage title="Privacy Policy" description="Your data is yours. We just help you improve it." />}
        {view === 'terms' && <GenericPage title="Terms of Use" description="The rules of the game." />}
        {view === 'analytics' && <GenericPage title="Manage Analytics" description="Control your data preferences." />}
      </main>
      {view !== 'dashboard' && view !== 'auth' && <Footer onNavigate={handleNavigation} />}
    </div>
  );
};

// Main App component wraps everything with AuthProvider
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
