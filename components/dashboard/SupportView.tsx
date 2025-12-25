import React, { useState } from 'react';
import { EnvelopeIcon, ChatBubbleIcon, DocumentTextIcon, ChevronDownIcon } from '../icons/Icons';

const SupportView: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  
  const faqs = [
    {
      q: "How accurate is the posture detection?",
      a: "Poisé uses advanced computer vision models to track key landmarks on your shoulders and ears. While highly accurate for general posture correction, ensuring good lighting and a clear camera view improves reliability."
    },
    {
      q: "Is my video recorded?",
      a: "No. All processing happens locally on your device's browser. No video data is ever sent to our servers."
    },
    {
      q: "Can I use Poisé on mobile?",
      a: "Currently, Poisé is optimized for desktop usage where webcam positioning is ideal for posture tracking during work."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-center hover:border-indigo-500 transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                  <DocumentTextIcon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Documentation</h3>
              <p className="text-sm text-gray-500 mt-2">Guides & API Docs</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-center hover:border-indigo-500 transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                  <ChatBubbleIcon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Community</h3>
              <p className="text-sm text-gray-500 mt-2">Join the Forum</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-center hover:border-indigo-500 transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <EnvelopeIcon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Email Us</h3>
              <p className="text-sm text-gray-500 mt-2">support@poise.ai</p>
          </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
             <h3 className="text-lg font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {faqs.map((faq, index) => (
                <div key={index}>
                    <button 
                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                        className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                        <span className="font-medium text-gray-900 dark:text-white">{faq.q}</span>
                        <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                    </button>
                    {openFaq === index && (
                        <div className="px-6 pb-6 text-gray-600 dark:text-gray-300 text-sm leading-relaxed animate-in slide-in-from-top-2">
                            {faq.a}
                        </div>
                    )}
                </div>
            ))}
          </div>
      </div>
    </div>
  );
};

export default SupportView;