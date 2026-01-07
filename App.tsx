
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthPage from './pages/AuthPage';
import { PricingPage, HelpSupportPage, PostureGuidesPage, GenericPage } from './pages/ExtraPages';
import { AuthProvider, useAuth } from './contexts/AuthContext';

export type AuthMode = 'login' | 'signup';

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Layout wrapper for public pages (with Header and Footer)
const PublicLayout: React.FC<{ children: React.ReactNode; hideFooter?: boolean }> = ({ children, hideFooter }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleNavigateToAuth = (mode: AuthMode) => {
    navigate('/auth', { state: { mode } });
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(`/${path}`);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 dark:bg-gray-900">
      <Header
        isLoggedIn={!!user}
        onNavigateToAuth={handleNavigateToAuth}
        onLogout={handleLogout}
        onLogoClick={handleLogoClick}
        onNavigate={handleNavigation}
      />
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      {!hideFooter && <Footer onNavigate={handleNavigation} />}
    </div>
  );
};

// Auth page wrapper to handle mode from state
const AuthPageWrapper: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [mode, setMode] = React.useState<AuthMode>('login');

  // Get mode from location state if available
  useEffect(() => {
    if (location.state?.mode) {
      setMode(location.state.mode);
    }
  }, [location.state]);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleLoginSuccess = () => {
    const from = (location.state as any)?.from?.pathname || '/dashboard';
    navigate(from, { replace: true });
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <PublicLayout hideFooter>
      <AuthPage
        mode={mode}
        onLoginSuccess={handleLoginSuccess}
        onSwitchMode={setMode}
        onBack={handleBack}
      />
    </PublicLayout>
  );
};

// Landing page wrapper
const LandingPageWrapper: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleGetStarted = () => {
    navigate('/auth', { state: { mode: 'signup' } });
  };

  return (
    <PublicLayout>
      <LandingPage onGetStarted={handleGetStarted} />
    </PublicLayout>
  );
};

// Dashboard wrapper
const DashboardWrapper: React.FC = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return <DashboardPage onLogout={handleLogout} />;
};

// Inner App component that uses the auth context
const AppContent: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth', { state: { mode: 'signup' } });
  };

  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPageWrapper />} />

      {/* Auth Page */}
      <Route path="/auth" element={<AuthPageWrapper />} />

      {/* Protected Dashboard Routes */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardWrapper />
          </ProtectedRoute>
        }
      />

      {/* Public Pages */}
      <Route path="/pricing" element={
        <PublicLayout>
          <PricingPage onGetStarted={handleGetStarted} />
        </PublicLayout>
      } />

      <Route path="/support" element={
        <PublicLayout>
          <HelpSupportPage />
        </PublicLayout>
      } />

      <Route path="/guides" element={
        <PublicLayout>
          <PostureGuidesPage />
        </PublicLayout>
      } />

      <Route path="/community" element={
        <PublicLayout>
          <GenericPage title="Community" description="Join the conversation with thousands of other posture enthusiasts." />
        </PublicLayout>
      } />

      <Route path="/blog" element={
        <PublicLayout>
          <GenericPage title="Poisé Blog" description="Latest news, health tips, and product updates." />
        </PublicLayout>
      } />

      <Route path="/build" element={
        <PublicLayout>
          <GenericPage title="Build with Poisé" description="Developer tools and SDKs coming soon." />
        </PublicLayout>
      } />

      <Route path="/docs" element={
        <PublicLayout>
          <GenericPage title="Documentation" description="Technical guides and API references." />
        </PublicLayout>
      } />

      <Route path="/security" element={
        <PublicLayout>
          <GenericPage title="Security" description="Learn how we protect your data and privacy." />
        </PublicLayout>
      } />

      <Route path="/bug-bounty" element={
        <PublicLayout>
          <GenericPage title="Bug Bounty" description="Help us make Poisé safer and get rewarded." />
        </PublicLayout>
      } />

      <Route path="/privacy" element={
        <PublicLayout>
          <GenericPage title="Privacy Policy" description="Your data is yours. We just help you improve it." />
        </PublicLayout>
      } />

      <Route path="/terms" element={
        <PublicLayout>
          <GenericPage title="Terms of Use" description="The rules of the game." />
        </PublicLayout>
      } />

      <Route path="/analytics" element={
        <PublicLayout>
          <GenericPage title="Manage Analytics" description="Control your data preferences." />
        </PublicLayout>
      } />

      {/* Catch all - redirect to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
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
