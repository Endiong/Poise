
import React, { useState } from 'react';
import { CheckCircleIcon, EnvelopeIcon, DocumentTextIcon, ChatBubbleIcon, BoltIcon, BuildingOfficeIcon } from '../components/icons/Icons';

export const PricingPage = ({ onGetStarted }: { onGetStarted: () => void }) => (
  <div className="py-24 bg-white">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">Invest in your long-term health for less than the cost of a coffee.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Free Plan */}
        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Free</h3>
            <p className="text-sm text-gray-500 mb-6">Essential tracking for beginners.</p>
            <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-500">/month</span>
            </div>
            <button onClick={onGetStarted} className="w-full py-2.5 rounded-lg border border-gray-300 font-semibold text-gray-700 hover:bg-white transition-colors mb-8">
                Get Started
            </button>
            <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircleIcon className="w-5 h-5 text-gray-400" /> 120 mins Live Tracking / day
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircleIcon className="w-5 h-5 text-gray-400" /> 7-Day History
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircleIcon className="w-5 h-5 text-gray-400" /> Basic Alerts
                </li>
            </ul>
        </div>

        {/* Pro Plan */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-orange-500 relative transform md:-translate-y-4">
            <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                POPULAR
            </div>
            <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-gray-900">Pro</h3>
                <BoltIcon className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-sm text-gray-500 mb-6">For serious habit builders.</p>
            <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$12</span>
                <span className="text-gray-500">/month</span>
            </div>
            <button onClick={onGetStarted} className="w-full py-2.5 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30 mb-8">
                Start 14-Day Free Trial
            </button>
            <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm font-medium text-gray-900">
                    <CheckCircleIcon className="w-5 h-5 text-orange-500" /> Unlimited Live Tracking
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-gray-900">
                    <CheckCircleIcon className="w-5 h-5 text-orange-500" /> 30-Day History & Trends
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-gray-900">
                    <CheckCircleIcon className="w-5 h-5 text-orange-500" /> Advanced Reports & Badges
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-gray-900">
                    <CheckCircleIcon className="w-5 h-5 text-orange-500" /> Priority Support
                </li>
            </ul>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-gray-900">Enterprise</h3>
                <BuildingOfficeIcon className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 mb-6">For teams and organizations.</p>
            <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">Contact Us</span>
            </div>
            <button onClick={onGetStarted} className="w-full py-2.5 rounded-lg border border-gray-300 font-semibold text-gray-700 hover:bg-white transition-colors mb-8">
                Talk to Sales
            </button>
            <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircleIcon className="w-5 h-5 text-gray-400" /> Team Management Dashboard
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircleIcon className="w-5 h-5 text-gray-400" /> SSO & Security Compliance
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircleIcon className="w-5 h-5 text-gray-400" /> API Access
                </li>
            </ul>
        </div>
      </div>
    </div>
  </div>
);

export const HelpSupportPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8">Help & Support</h1>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          {submitted ? (
            <div className="text-center py-12">
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
              <p className="text-gray-600">We'll get back to you at {email} shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">How can we help?</label>
                <textarea 
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                  placeholder="Describe your issue or question..."
                />
              </div>
              <button type="submit" className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors">
                Send Message
              </button>
            </form>
          )}
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                 <EnvelopeIcon className="w-6 h-6" />
              </div>
              <div>
                 <p className="font-bold">Email Us directly</p>
                 <p className="text-sm text-gray-500">support@poise.ai</p>
              </div>
           </div>
           <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full text-green-600">
                 <ChatBubbleIcon className="w-6 h-6" />
              </div>
              <div>
                 <p className="font-bold">Live Chat</p>
                 <p className="text-sm text-gray-500">Available Mon-Fri, 9am-5pm</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export const PostureGuidesPage = () => (
  <div className="py-20 bg-white min-h-screen">
    <div className="container mx-auto px-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-12 text-center">Posture Guides</h1>
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row gap-8 items-center bg-gray-50 p-8 rounded-3xl border border-gray-100">
           <div className="w-full md:w-1/2 rounded-2xl bg-white border border-gray-200 p-6 flex items-center justify-center">
               <svg viewBox="0 0 200 200" className="w-full max-w-[200px] h-auto text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2">
                   {/* Chair */}
                   <path d="M60 100 L60 160 M60 140 L100 140 M100 140 L100 160" stroke="#94A3B8" />
                   <path d="M50 100 L70 100" stroke="#94A3B8" />
                   
                   {/* Person Sitting */}
                   <path d="M100 160 L130 160" stroke="#475569" strokeWidth="3"/> {/* Feet */}
                   <path d="M100 160 L100 120" stroke="#475569" strokeWidth="3"/> {/* Lower Leg */}
                   <path d="M100 120 L65 120" stroke="#475569" strokeWidth="3"/> {/* Thigh */}
                   <path d="M65 120 L65 70" stroke="#475569" strokeWidth="3"/> {/* Back */}
                   <circle cx="65" cy="55" r="10" stroke="#475569" strokeWidth="3" /> {/* Head */}
                   <path d="M65 80 L90 100" stroke="#475569" strokeWidth="3"/> {/* Arm */}
                   
                   {/* Desk */}
                   <line x1="110" y1="100" x2="160" y2="100" stroke="#94A3B8" />
                   <line x1="160" y1="100" x2="160" y2="160" stroke="#94A3B8" />
                   <rect x="130" y="70" width="5" height="30" fill="#CBD5E1" stroke="none" /> {/* Monitor Stand */}
                   <rect x="120" y="50" width="25" height="20" rx="2" fill="#E2E8F0" stroke="#94A3B8" /> {/* Monitor */}
                   
                   {/* Angle Indicators */}
                   <path d="M100 130 A10 10 0 0 0 90 120" stroke="#10B981" strokeDasharray="2 2" />
                   <text x="110" y="130" fontSize="10" fill="#10B981" stroke="none">90°</text>
               </svg>
           </div>
           <div className="w-full md:w-1/2">
              <h2 className="text-2xl font-bold mb-4">The Ergonomic Sitting Position</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Learn the 90-90-90 rule. Keep your hips, knees, and ankles at 90-degree angles. Your monitor should be at eye level to prevent neck strain.
              </p>
              <a href="#" className="text-orange-600 font-semibold hover:underline">Read full guide &rarr;</a>
           </div>
        </div>
        
        <div className="flex flex-col md:flex-row-reverse gap-8 items-center bg-gray-50 p-8 rounded-3xl border border-gray-100">
           <div className="w-full md:w-1/2 rounded-2xl bg-white border border-gray-200 p-6 flex items-center justify-center">
               <svg viewBox="0 0 200 200" className="w-full max-w-[200px] h-auto text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2">
                   {/* Person Standing */}
                   <path d="M70 160 L70 100" stroke="#475569" strokeWidth="3"/> {/* Legs */}
                   <path d="M70 100 L70 60" stroke="#475569" strokeWidth="3"/> {/* Torso */}
                   <circle cx="70" cy="45" r="10" stroke="#475569" strokeWidth="3" /> {/* Head */}
                   <path d="M70 70 L95 90" stroke="#475569" strokeWidth="3"/> {/* Arm */}
                   
                   {/* Standing Desk */}
                   <line x1="100" y1="90" x2="150" y2="90" stroke="#94A3B8" />
                   <line x1="125" y1="90" x2="125" y2="160" stroke="#94A3B8" />
                   <line x1="110" y1="160" x2="140" y2="160" stroke="#94A3B8" />
                   
                   {/* Monitor */}
                   <rect x="120" y="60" width="5" height="30" fill="#CBD5E1" stroke="none" /> 
                   <rect x="110" y="40" width="25" height="20" rx="2" fill="#E2E8F0" stroke="#94A3B8" />
                   
                   {/* Height Indicator */}
                   <line x1="160" y1="45" x2="160" y2="160" stroke="#F59E0B" strokeDasharray="4 4" />
                   <line x1="155" y1="45" x2="165" y2="45" stroke="#F59E0B" />
                   <line x1="155" y1="160" x2="165" y2="160" stroke="#F59E0B" />
               </svg>
           </div>
           <div className="w-full md:w-1/2">
              <h2 className="text-2xl font-bold mb-4">Standing Desk Best Practices</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Standing is great, but don't overdo it. Alternate between sitting and standing every 30-60 minutes. Wear supportive shoes and use an anti-fatigue mat.
              </p>
              <a href="#" className="text-orange-600 font-semibold hover:underline">Read full guide &rarr;</a>
           </div>
        </div>
      </div>
    </div>
  </div>
);

export const GenericPage = ({ title, description }: { title: string, description: string }) => (
  <div className="py-32 bg-white min-h-screen text-center px-4">
     <h1 className="text-5xl font-bold mb-6">{title}</h1>
     <p className="text-xl text-gray-500 max-w-2xl mx-auto">{description}</p>
     <div className="mt-12 p-8 bg-gray-50 rounded-2xl border border-gray-200 inline-block">
        <p className="text-gray-400">Content coming soon...</p>
     </div>
  </div>
);
