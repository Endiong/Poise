
import React, { useState } from 'react';
import { AuthMode } from '../App';
import { useAuth } from '../contexts/AuthContext';
import { AuthLogoIcon, GoogleIcon, CloseIcon, LoaderIcon } from '../components/icons/Icons';

interface AuthPageProps {
    mode: AuthMode;
    onLoginSuccess: () => void;
    onSwitchMode: (mode: AuthMode) => void;
    onBack: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ mode, onLoginSuccess, onSwitchMode, onBack }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { signInWithGoogle } = useAuth();

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError(null);
        
        const { error } = await signInWithGoogle();
        
        if (error) {
            setError(error.message);
            setIsLoading(false);
        }
        // If successful, the OAuth redirect will happen automatically
        // and onAuthStateChange in AuthContext will update the user
    };


    return (
        <div className="flex-grow flex items-center justify-center bg-white">
            <button onClick={onBack} disabled={isLoading} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50">
                <CloseIcon />
            </button>
            
            {error && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm">
                    {error}
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 max-w-6xl w-full">
                {/* Left decorative panel - Geometric Illustration */}
                <div className="hidden md:flex flex-col justify-center items-center bg-indigo-50 p-8 rounded-l-2xl overflow-hidden relative">
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
                    
                    {/* Abstract Spine/Connection Illustration */}
                    <svg viewBox="0 0 300 400" className="w-64 h-auto text-indigo-600 drop-shadow-xl z-10" fill="none" stroke="currentColor" strokeWidth="2">
                        {/* Central Spine Line */}
                        <path d="M150 50 C150 50 200 100 200 150 S150 250 150 250 S100 300 100 350" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"/>
                        
                        {/* Nodes */}
                        <circle cx="150" cy="50" r="8" className="fill-white stroke-indigo-600" strokeWidth="3"/>
                        <circle cx="200" cy="150" r="8" className="fill-white stroke-indigo-600" strokeWidth="3"/>
                        <circle cx="150" cy="250" r="8" className="fill-white stroke-indigo-600" strokeWidth="3"/>
                        <circle cx="100" cy="350" r="8" className="fill-white stroke-indigo-600" strokeWidth="3"/>
                        
                        {/* Floating Geometric Decor */}
                        <rect x="50" y="80" width="40" height="40" rx="8" stroke="#F59E0B" strokeWidth="2" className="opacity-80 animate-bounce" style={{animationDuration: '3s'}}/>
                        <circle cx="250" cy="280" r="20" stroke="#10B981" strokeWidth="2" className="opacity-80 animate-pulse"/>
                        <path d="M50 300 L80 330 L50 360" stroke="#EC4899" strokeWidth="2" fill="none" />
                    </svg>
                </div>

                {/* Right form panel */}
                <div className="flex flex-col justify-center p-8 md:p-12">
                    <div className="w-full max-w-sm mx-auto">
                        <div className="text-center mb-8">
                            <div className="inline-block">
                                <AuthLogoIcon />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mt-4">Get started with Poisé</h1>
                            <p className="text-gray-500 mt-1">Create an account or sign in to continue.</p>
                        </div>
                        
                        <div className="mt-6">
                             <button onClick={handleGoogleLogin} disabled={isLoading} className="w-full inline-flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                                {isLoading ? (
                                    <>
                                        <LoaderIcon className="w-5 h-5 animate-spin" />
                                        <span className="ml-3">Connecting...</span>
                                    </>
                                ) : (
                                    <>
                                        <GoogleIcon /> <span className="ml-3">Continue with Google</span>
                                    </>
                                )}
                            </button>
                        </div>
                        
                        <p className="mt-8 text-center text-xs text-gray-400">
                           By continuing, you agree to the Poisé <a href="#" className="underline hover:text-gray-600">Terms of Service</a> and <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>.
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
