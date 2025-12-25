
import React, { useState } from 'react';
import { AuthMode } from '../App';
import { useAuth } from '../contexts/AuthContext';
import { AuthLogoIcon, GoogleIcon, CloseIcon, LoaderIcon, EnvelopeIcon, LockClosedIcon, UserCircleIcon, EyeIcon, EyeOffIcon } from '../components/icons/Icons';

interface AuthPageProps {
    mode: AuthMode;
    onLoginSuccess: () => void;
    onSwitchMode: (mode: AuthMode) => void;
    onBack: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ mode, onLoginSuccess, onSwitchMode, onBack }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();

    // Form fields
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError(null);
        
        const { error } = await signInWithGoogle();
        
        if (error) {
            setError(error.message);
            setIsLoading(false);
        }
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        if (mode === 'signup') {
            // Validation for signup
            if (!fullName.trim()) {
                setError('Please enter your full name');
                setIsLoading(false);
                return;
            }
            if (fullName.trim().length < 2) {
                setError('Name must be at least 2 characters');
                setIsLoading(false);
                return;
            }
            if (!email.trim()) {
                setError('Please enter your email address');
                setIsLoading(false);
                return;
            }
            if (password.length < 6) {
                setError('Password must be at least 6 characters');
                setIsLoading(false);
                return;
            }
            if (password !== confirmPassword) {
                setError('Passwords do not match');
                setIsLoading(false);
                return;
            }

            const { error } = await signUpWithEmail(email, password, fullName.trim());
            
            if (error) {
                setError(error.message);
                setIsLoading(false);
            } else {
                setSuccessMessage('Account created! Please check your email to confirm your account, then sign in.');
                setIsLoading(false);
                // Clear form
                setFullName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
            }
        } else {
            // Login validation
            if (!email.trim()) {
                setError('Please enter your email address');
                setIsLoading(false);
                return;
            }
            if (!password) {
                setError('Please enter your password');
                setIsLoading(false);
                return;
            }

            const { error } = await signInWithEmail(email, password);
            
            if (error) {
                setError(error.message);
                setIsLoading(false);
            }
        }
    };

    const switchMode = () => {
        setError(null);
        setSuccessMessage(null);
        setPassword('');
        setConfirmPassword('');
        onSwitchMode(mode === 'login' ? 'signup' : 'login');
    };

    return (
        <div className="min-h-screen flex flex-col bg-white overflow-y-auto">
            {/* Close button - fixed position */}
            <button 
                onClick={onBack} 
                disabled={isLoading} 
                className="fixed top-4 right-4 text-gray-500 hover:text-gray-800 z-50 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-gray-100 disabled:opacity-50 shadow-sm"
            >
                <CloseIcon />
            </button>
            
            <div className="flex-1 flex flex-col md:flex-row">
                {/* Left decorative panel - Hidden on mobile */}
                <div className="hidden md:flex md:w-1/2 flex-col justify-center items-center bg-indigo-50 p-8 relative">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-20">
                        <svg className="w-full h-full" width="100%" height="100%">
                            <defs>
                                <pattern id="dot-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                    <circle cx="2" cy="2" r="1" className="text-indigo-900 fill-current" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#dot-pattern)" />
                        </svg>
                    </div>
                    
                    {/* Abstract Spine Illustration */}
                    <svg viewBox="0 0 300 400" className="w-64 h-auto text-indigo-600 drop-shadow-xl z-10" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M150 50 C150 50 200 100 200 150 S150 250 150 250 S100 300 100 350" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"/>
                        <circle cx="150" cy="50" r="8" className="fill-white stroke-indigo-600" strokeWidth="3"/>
                        <circle cx="200" cy="150" r="8" className="fill-white stroke-indigo-600" strokeWidth="3"/>
                        <circle cx="150" cy="250" r="8" className="fill-white stroke-indigo-600" strokeWidth="3"/>
                        <circle cx="100" cy="350" r="8" className="fill-white stroke-indigo-600" strokeWidth="3"/>
                        <rect x="50" y="80" width="40" height="40" rx="8" stroke="#F59E0B" strokeWidth="2" className="opacity-80 animate-bounce" style={{animationDuration: '3s'}}/>
                        <circle cx="250" cy="280" r="20" stroke="#10B981" strokeWidth="2" className="opacity-80 animate-pulse"/>
                        <path d="M50 300 L80 330 L50 360" stroke="#EC4899" strokeWidth="2" fill="none" />
                    </svg>
                </div>

                {/* Right form panel - Full width on mobile */}
                <div className="flex-1 flex flex-col justify-center px-4 py-8 sm:px-6 md:px-12 md:w-1/2">
                    <div className="w-full max-w-md mx-auto">
                        {/* Header */}
                        <div className="text-center mb-6">
                            <div className="inline-block">
                                <AuthLogoIcon />
                            </div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-4">
                                {mode === 'signup' ? 'Create your account' : 'Welcome back'}
                            </h1>
                            <p className="text-gray-500 mt-1 text-sm sm:text-base">
                                {mode === 'signup' ? 'Start your posture journey today' : 'Sign in to continue to Poisé'}
                            </p>
                        </div>

                        {/* Error Message - Visible and not covered */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm text-center">{error}</p>
                            </div>
                        )}

                        {/* Success Message */}
                        {successMessage && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-green-600 text-sm text-center">{successMessage}</p>
                            </div>
                        )}
                        
                        {/* Email/Password Form */}
                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                            {mode === 'signup' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <UserCircleIcon className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-base"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-base"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LockClosedIcon className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-12 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-base"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                    </button>
                                </div>
                                {mode === 'signup' && (
                                    <p className="mt-1.5 text-xs text-gray-500">Must be at least 6 characters</p>
                                )}
                            </div>

                            {mode === 'signup' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <LockClosedIcon className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-10 pr-12 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-base"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        >
                                            {showConfirmPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-2.5 sm:py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center text-base mt-6"
                            >
                                {isLoading ? (
                                    <>
                                        <LoaderIcon className="w-5 h-5 animate-spin" />
                                        <span className="ml-2">{mode === 'signup' ? 'Creating Account...' : 'Signing In...'}</span>
                                    </>
                                ) : (
                                    mode === 'signup' ? 'Create Account' : 'Sign In'
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-3 bg-white text-gray-500">or continue with</span>
                            </div>
                        </div>
                        
                        {/* Google Sign In */}
                        <button 
                            onClick={handleGoogleLogin} 
                            disabled={isLoading} 
                            className="w-full inline-flex items-center justify-center py-2.5 sm:py-3 px-4 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                        >
                            {isLoading ? (
                                <>
                                    <LoaderIcon className="w-5 h-5 animate-spin" />
                                    <span className="ml-3">Connecting...</span>
                                </>
                            ) : (
                                <>
                                    <GoogleIcon /> 
                                    <span className="ml-3">Continue with Google</span>
                                </>
                            )}
                        </button>

                        {/* Switch Mode */}
                        <p className="mt-6 text-center text-sm text-gray-600">
                            {mode === 'signup' ? (
                                <>
                                    Already have an account?{' '}
                                    <button 
                                        onClick={switchMode} 
                                        className="text-indigo-600 hover:text-indigo-800 font-semibold"
                                        disabled={isLoading}
                                    >
                                        Sign in
                                    </button>
                                </>
                            ) : (
                                <>
                                    Don't have an account?{' '}
                                    <button 
                                        onClick={switchMode} 
                                        className="text-indigo-600 hover:text-indigo-800 font-semibold"
                                        disabled={isLoading}
                                    >
                                        Create one
                                    </button>
                                </>
                            )}
                        </p>
                        
                        {/* Terms */}
                        <p className="mt-6 text-center text-xs text-gray-400 pb-4">
                           By continuing, you agree to the Poisé{' '}
                           <a href="#" className="underline hover:text-gray-600">Terms of Service</a> and{' '}
                           <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
