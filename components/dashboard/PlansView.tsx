import React from 'react';
import { CheckCircleIcon, StarIcon, BuildingOfficeIcon, BoltIcon } from '../icons/Icons';

interface PlansViewProps {}

const PlansView: React.FC<PlansViewProps> = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Free Plan */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col relative">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Free</h3>
          <p className="text-sm text-gray-500 mb-6">Essential tracking for beginners.</p>
          <div className="mb-6">
             <span className="text-4xl font-bold text-gray-900 dark:text-white">$0</span>
             <span className="text-gray-500">/month</span>
          </div>
          <button className="w-full py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mb-8">
             Current Plan
          </button>
          <ul className="space-y-4 flex-1">
             <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <CheckCircleIcon className="w-5 h-5 text-gray-400" />
                <span>120 mins Live Tracking / day</span>
             </li>
             <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <CheckCircleIcon className="w-5 h-5 text-gray-400" />
                <span>7-Day History</span>
             </li>
             <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <CheckCircleIcon className="w-5 h-5 text-gray-400" />
                <span>Basic Posture Alerts</span>
             </li>
          </ul>
        </div>

        {/* Pro Plan */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border-2 border-indigo-600 relative flex flex-col transform scale-105 z-10">
          <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
             POPULAR
          </div>
          <div className="flex items-center gap-2 mb-1">
             <h3 className="text-xl font-bold text-gray-900 dark:text-white">Pro</h3>
             <BoltIcon className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-sm text-gray-500 mb-6">For serious habit builders.</p>
          <div className="mb-6">
             <span className="text-4xl font-bold text-gray-900 dark:text-white">$12</span>
             <span className="text-gray-500">/month</span>
          </div>
          <button className="w-full py-2.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30 mb-8">
             Upgrade to Pro
          </button>
          <ul className="space-y-4 flex-1">
             <li className="flex items-center gap-3 text-sm font-medium text-gray-900 dark:text-white">
                <CheckCircleIcon className="w-5 h-5 text-indigo-600" />
                <span>Unlimited Live Tracking</span>
             </li>
             <li className="flex items-center gap-3 text-sm font-medium text-gray-900 dark:text-white">
                <CheckCircleIcon className="w-5 h-5 text-indigo-600" />
                <span>30-Day History & Trends</span>
             </li>
             <li className="flex items-center gap-3 text-sm font-medium text-gray-900 dark:text-white">
                <CheckCircleIcon className="w-5 h-5 text-indigo-600" />
                <span>Advanced Reports & PDF Export</span>
             </li>
             <li className="flex items-center gap-3 text-sm font-medium text-gray-900 dark:text-white">
                <CheckCircleIcon className="w-5 h-5 text-indigo-600" />
                <span>Earn Badges & Rewards</span>
             </li>
             <li className="flex items-center gap-3 text-sm font-medium text-gray-900 dark:text-white">
                <CheckCircleIcon className="w-5 h-5 text-indigo-600" />
                <span>Priority Support</span>
             </li>
          </ul>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col relative">
          <div className="flex items-center gap-2 mb-1">
             <h3 className="text-xl font-bold text-gray-900 dark:text-white">Enterprise</h3>
             <BuildingOfficeIcon className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 mb-6">For teams and organizations.</p>
          <div className="mb-6">
             <span className="text-3xl font-bold text-gray-900 dark:text-white">Contact Us</span>
          </div>
          <button className="w-full py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mb-8">
             Talk to Sales
          </button>
          <ul className="space-y-4 flex-1">
             <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <CheckCircleIcon className="w-5 h-5 text-gray-400" />
                <span>Everything in Pro</span>
             </li>
             <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <CheckCircleIcon className="w-5 h-5 text-gray-400" />
                <span>Team Management Dashboard</span>
             </li>
             <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <CheckCircleIcon className="w-5 h-5 text-gray-400" />
                <span>SSO & Security Compliance</span>
             </li>
             <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <CheckCircleIcon className="w-5 h-5 text-gray-400" />
                <span>API Access</span>
             </li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default PlansView;