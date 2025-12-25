import React, { useState } from 'react';
import { UserCircleIcon, LockClosedIcon, CheckCircleIcon, UploadIcon, EnvelopeIcon, BuildingOfficeIcon, TrashIcon } from '../icons/Icons';
import { LayoutMode } from '../../types';

interface UserProfile {
    name: string;
    avatar: string;
    email?: string;
}

interface SettingsViewProps {
  profile: UserProfile;
  onUpdateProfile: (newProfile: UserProfile) => void;
  layoutMode: LayoutMode;
  onUpdateLayout: (mode: LayoutMode) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ profile, onUpdateProfile, layoutMode, onUpdateLayout }) => {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email || 'margaret@example.com');
  const [avatar, setAvatar] = useState(profile.avatar);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name, avatar, email });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Restrict to 12 chars and only alphanumeric + spaces
      const value = e.target.value;
      if (value.length <= 12) {
          // Allow letters, numbers, and spaces only
          const cleanValue = value.replace(/[^a-zA-Z0-9 ]/g, '');
          setName(cleanValue);
      }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          // Create a fake local URL for preview
          const url = URL.createObjectURL(file);
          setAvatar(url);
      }
  };
  
  const handleRemoveAvatar = () => {
      setAvatar('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 mb-20">
      <form onSubmit={handleSave} className="space-y-6">
         {/* Layout Preference */}
         <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                 <BuildingOfficeIcon /> Interface Layout
             </h3>
             <p className="text-sm text-gray-500 mb-4">Choose how you want to navigate the dashboard. Mobile devices will always use the sidebar menu.</p>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <button
                    type="button"
                    onClick={() => onUpdateLayout('sidebar')}
                    className={`relative p-4 rounded-xl border-2 transition-all text-left flex flex-col gap-3 ${
                        layoutMode === 'sidebar' 
                        ? 'border-black dark:border-white bg-gray-50 dark:bg-gray-700/50' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                 >
                    <div className="flex gap-2">
                        <div className="w-6 h-full bg-gray-300 dark:bg-gray-600 rounded-sm"></div>
                        <div className="flex-1 flex flex-col gap-1">
                            <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-sm"></div>
                            <div className="h-8 w-full bg-gray-100 dark:bg-gray-800 rounded-sm"></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className={`font-semibold ${layoutMode === 'sidebar' ? 'text-black dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>Sidebar Navigation</span>
                        {layoutMode === 'sidebar' && <CheckCircleIcon className="w-5 h-5 text-black dark:text-white" />}
                    </div>
                 </button>

                 <button
                    type="button"
                    onClick={() => onUpdateLayout('top')}
                    className={`relative p-4 rounded-xl border-2 transition-all text-left flex flex-col gap-3 ${
                        layoutMode === 'top' 
                        ? 'border-black dark:border-white bg-gray-50 dark:bg-gray-700/50' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                 >
                    <div className="flex flex-col gap-2">
                        <div className="w-full h-3 bg-gray-300 dark:bg-gray-600 rounded-sm"></div>
                        <div className="flex-1 h-8 bg-gray-100 dark:bg-gray-800 rounded-sm"></div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className={`font-semibold ${layoutMode === 'top' ? 'text-black dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>Top Navigation</span>
                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wide mt-0.5">Desktop Only</span>
                        </div>
                        {layoutMode === 'top' && <CheckCircleIcon className="w-5 h-5 text-black dark:text-white" />}
                    </div>
                 </button>
             </div>
         </div>

         {/* Profile Section */}
         <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                 <UserCircleIcon /> Profile
             </h3>
             
             <div className="flex flex-col sm:flex-row gap-8">
                 {/* Avatar Upload */}
                 <div className="flex flex-col items-center gap-3">
                    <div className="relative group w-24 h-24">
                        {avatar ? (
                             <img src={avatar} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-gray-50 dark:border-gray-700 shadow-sm" />
                        ) : (
                             <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-4 border-gray-50 dark:border-gray-600">
                                <UserCircleIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                             </div>
                        )}
                        <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <UploadIcon className="w-6 h-6 text-white" />
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-xs text-gray-500">Click to change</span>
                        {avatar && (
                            <button 
                                type="button"
                                onClick={handleRemoveAvatar}
                                className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                            >
                                <TrashIcon className="w-3 h-3" /> Remove
                            </button>
                        )}
                    </div>
                 </div>

                 {/* Inputs */}
                 <div className="flex-1 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Display Name</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={handleNameChange}
                            maxLength={12}
                            placeholder="Max 12 chars"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
                        />
                        <p className="text-xs text-gray-400 mt-1">{name.length}/12 characters (Alphanumeric only)</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                        <div className="relative">
                            <input 
                                type="email" 
                                value={email}
                                disabled
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed transition-all"
                            />
                            <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
                    </div>
                 </div>
             </div>
         </div>

         {/* Security */}
         <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                 <LockClosedIcon /> Security
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
                        placeholder="••••••••"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
                    <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
                        placeholder="••••••••"
                    />
                 </div>
             </div>
         </div>

         <div className="flex justify-end gap-4">
             <button 
                type="submit"
                disabled={isSaved}
                className={`px-8 py-2.5 rounded-full font-bold transition-all shadow-lg flex items-center gap-2 ${
                    isSaved 
                    ? 'bg-green-500 text-white hover:bg-green-600 scale-105' 
                    : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-80'
                }`}
             >
                {isSaved ? (
                    <>
                        <CheckCircleIcon className="w-5 h-5" /> Saved!
                    </>
                ) : (
                    "Save Changes"
                )}
             </button>
         </div>
      </form>
    </div>
  );
};

export default SettingsView;