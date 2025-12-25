
import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRightIcon, PlusIcon, VideoCameraIcon, BoltIcon, PresentationChartLineIcon, CheckBadgeIcon, PoiséIcon, CheckCircleIcon, BuildingOfficeIcon } from '../components/icons/Icons';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const testimonials = [
    {
      quote: "Poisé has played a pivotal role in improving my workday comfort. By providing stability and real-time feedback, it bridges the gap between sedentary work and physical wellbeing.",
      author: "Jane Doe, CEO",
      company: "Health Corp",
      // logo removed, using geometric initials
    },
    {
      quote: "A pioneer in digital wellness, setting high standards for accuracy, reliability, and user experience. Their achievements with Poisé have made the entire industry more attractive to users and institutions.",
      author: "John Smith, Co-Founder",
      company: "Wellness Inc",
    },
    {
      quote: "We chose Poisé for its strong foundation in health science and its commitment to user privacy. The integration with our employee wellness program was seamless.",
      author: "Emily White, CTO",
      company: "Tech Solutions",
    },
     {
      quote: "The real-time alerts have been a game-changer. I'm more mindful of my posture throughout the day, and my neck pain has significantly decreased.",
      author: "Alex Ray, Developer",
      company: "Innovate LLC",
    }
  ];
  
  const faqs = [
    {
      q: "What is Poisé?",
      a: "Poisé is your personal AI wellness coach, using your device's camera to provide real-time feedback on your posture. It helps you build healthier habits, reduce pain, and improve your overall wellbeing through intelligent analysis and personalized tips."
    },
    {
      q: "How are my camera feeds stored?",
      a: "Your privacy is our top priority. All posture analysis happens directly on your device. Your camera feed is never stored, recorded, or sent to the cloud. We only analyze the feed in real-time to provide feedback."
    },
    {
      q: "Does using Poisé have risks?",
      a: "Poisé is a wellness tool designed to help you become more aware of your posture. It is not a medical device and should not be used to diagnose or treat any medical conditions. Always consult with a healthcare professional for any health concerns."
    },
    {
      q: "How does the scoring work?",
      a: "Our AI model analyzes key points on your body (like your shoulders and ears) to determine your posture. Your score is based on the percentage of time you maintain good posture during an active session. The higher the score, the better your posture habits!"
    },
  ];

  const nextTestimonial = useCallback(() => setCurrentTestimonial(prev => (prev + 1) % testimonials.length), [testimonials.length]);
  const prevTestimonial = () => setCurrentTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    const timer = setInterval(() => {
        nextTestimonial();
    }, 5000);
    return () => clearInterval(timer);
  }, [nextTestimonial]);

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2);
  const getAvatarStyle = (index: number) => {
    const styles = [
        'bg-orange-100 text-orange-600 border-orange-200',
        'bg-blue-100 text-blue-600 border-blue-200',
        'bg-purple-100 text-purple-600 border-purple-200',
        'bg-green-100 text-green-600 border-green-200'
    ];
    return styles[index % styles.length];
  }


  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
         <div 
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 10% 20%, rgba(251, 146, 60, 0.2), transparent 40%),
              radial-gradient(circle at 90% 30%, rgba(59, 130, 246, 0.15), transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(244, 114, 182, 0.2), transparent 50%)
            `,
            filter: 'blur(100px)',
          }}
        />
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
          
          <div className="inline-block bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-600 mb-4">
            The future of wellness is here. <a href="#ai-model" className="font-semibold text-gray-800">Learn more &rarr;</a>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
            Reclaim Your Posture. <br className="hidden md:block"/> Elevate Your Life.
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-8">
            Poisé is your personal AI wellness coach, helping you build healthier habits for a pain-free future.
          </p>
          <div className="flex justify-center items-center gap-4">
            <button onClick={onGetStarted} className="bg-black text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-gray-800 transition-all transform hover:scale-105 shadow-xl">
              Start Tracking for Free <ArrowRightIcon />
            </button>
          </div>
          <p className="text-gray-400 mt-6 text-sm flex items-center justify-center gap-2">
             <CheckBadgeIcon className="w-4 h-4 text-green-500"/> No credit card required. 100% Private.
          </p>
        </section>
      </div>

      {/* How it Works Section */}
      <section className="py-24 bg-gray-50/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">How Poisé Works</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">Three simple steps to better health and productivity.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                        <VideoCameraIcon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">1. Connect Camera</h3>
                    <p className="text-gray-600 text-sm">Grant access to your camera. Our AI processes video locally—your feed never leaves your computer.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6">
                        <BoltIcon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">2. AI Feedback</h3>
                    <p className="text-gray-600 text-sm">Get real-time alerts when you slouch or lean. Poisé learns your habits and suggests actionable tips.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                        <PresentationChartLineIcon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">3. Track Progress</h3>
                    <p className="text-gray-600 text-sm">Visualize your posture trends over time. Achieve daily goals and build lasting muscle memory.</p>
                </div>
            </div>
        </div>
      </section>

      {/* Feature Deep Dive: Real-Time Monitoring */}
      <section id="real-time-monitoring" className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-16">
                <div className="w-full md:w-1/2">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-slate-50 h-[400px] flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
                           <defs>
                              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                                 <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="1"/>
                              </pattern>
                           </defs>
                           <rect width="800" height="600" fill="url(#grid-pattern)" />
                           
                           {/* Geometric Vector Illustration */}
                           <g transform="translate(400, 350)" className="text-slate-700">
                              {/* Body - Abstract */}
                              <path d="M-100 250 L-100 120 Q-100 60 0 60 Q100 60 100 120 L100 250" fill="#F1F5F9" stroke="currentColor" strokeWidth="2"/>
                              
                              {/* Shoulders */}
                              <circle cx="-100" cy="120" r="6" fill="#64748B" />
                              <circle cx="100" cy="120" r="6" fill="#64748B" />
                              <line x1="-100" y1="120" x2="100" y2="120" stroke="#64748B" strokeWidth="2" strokeDasharray="5,5" />

                              {/* Neck */}
                              <line x1="0" y1="60" x2="0" y2="-20" stroke="currentColor" strokeWidth="2"/>

                              {/* Head - Abstract */}
                              <rect x="-40" y="-100" width="80" height="100" rx="20" fill="#E2E8F0" stroke="currentColor" strokeWidth="2"/>
                              
                              {/* Ears/Tracking Points */}
                              <circle cx="-40" cy="-50" r="5" className="text-indigo-500 fill-current animate-pulse"/>
                              <circle cx="40" cy="-50" r="5" className="text-indigo-500 fill-current animate-pulse"/>
                              <line x1="-40" y1="-50" x2="40" y2="-50" stroke="#6366F1" strokeWidth="2" strokeDasharray="4,4" className="opacity-50"/>

                              {/* Center Line */}
                              <line x1="0" y1="-120" x2="0" y2="250" stroke="#10B981" strokeWidth="1" strokeDasharray="8,4" />
                           </g>
                           
                           {/* Scanning Effect */}
                           <rect x="0" y="0" width="800" height="2" className="text-green-400 fill-current opacity-30 animate-[scan_3s_ease-in-out_infinite]"/>
                           <style>{`
                             @keyframes scan {
                               0% { transform: translateY(100px); opacity: 0; }
                               20% { opacity: 0.5; }
                               80% { opacity: 0.5; }
                               100% { transform: translateY(500px); opacity: 0; }
                             }
                           `}</style>
                        </svg>
                        <div className="absolute bottom-6 left-6 z-20 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg flex items-center gap-3 border border-gray-100">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="font-semibold text-gray-800">Tracking Active</span>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/2">
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                        <VideoCameraIcon className="w-6 h-6" />
                    </div>
                    <h2 className="text-4xl font-bold mb-6">Real-Time Monitoring</h2>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                        Poisé acts as your digital mirror. Our system constantly monitors your seated position, detecting subtle deviations that lead to back pain and fatigue.
                    </p>
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-start gap-3">
                            <CheckCircleIcon className="w-6 h-6 text-indigo-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">Instant visual and audio alerts when you slouch.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircleIcon className="w-6 h-6 text-indigo-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">Detects forward head posture and leaning.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircleIcon className="w-6 h-6 text-indigo-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">Customizable sensitivity settings for your comfort.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
      </section>

      {/* Feature Deep Dive: AI Model */}
      <section id="ai-model" className="py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row-reverse items-center gap-16">
                <div className="w-full md:w-1/2">
                     <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-700 bg-gray-900 h-80 flex items-center justify-center">
                        <svg className="w-full h-full absolute inset-0" viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <filter id="glow">
                                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                                    <feMerge>
                                        <feMergeNode in="coloredBlur"/>
                                        <feMergeNode in="SourceGraphic"/>
                                    </feMerge>
                                </filter>
                            </defs>
                            
                            {/* Background Grid */}
                            <pattern id="small-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1F2937" strokeWidth="1"/>
                            </pattern>
                            <rect width="100%" height="100%" fill="url(#small-grid)" />

                            {/* Neural Network Nodes & Connections */}
                            <g stroke="#374151" strokeWidth="1">
                                {/* Connections - Abstract */}
                                <path d="M100 160 L250 80 M100 160 L250 160 M100 160 L250 240" className="animate-pulse" style={{animationDuration: '3s'}}/>
                                <path d="M250 80 L400 160 M250 160 L400 160 M250 240 L400 160" className="animate-pulse" style={{animationDuration: '4s'}}/>
                                <path d="M400 160 L500 160" stroke="#10B981" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_1s_linear_infinite]" />
                            </g>

                            {/* Nodes */}
                            <g fill="#111827" stroke="#10B981" strokeWidth="2">
                                <circle cx="100" cy="160" r="12" />
                                
                                <circle cx="250" cy="80" r="8" />
                                <circle cx="250" cy="160" r="8" />
                                <circle cx="250" cy="240" r="8" />
                                
                                <circle cx="400" cy="160" r="12" filter="url(#glow)"/>
                            </g>
                            
                            {/* Moving Packets (Data) */}
                            <circle r="4" fill="#34D399">
                                <animateMotion dur="2s" repeatCount="indefinite" path="M100 160 L250 80 L400 160" />
                            </circle>
                            <circle r="4" fill="#34D399">
                                <animateMotion dur="2.5s" repeatCount="indefinite" path="M100 160 L250 240 L400 160" />
                            </circle>

                            {/* Overlay Text/UI elements embedded in SVG for vector feel */}
                            <rect x="480" y="270" width="100" height="30" rx="4" fill="#064E3B" stroke="#10B981" strokeWidth="1" opacity="0.8"/>
                            <text x="530" y="290" textAnchor="middle" fill="#34D399" fontSize="12" fontFamily="monospace" fontWeight="bold">v2.5.0</text>
                            <style>{`
                                @keyframes dash {
                                    to { stroke-dashoffset: -8; }
                                }
                            `}</style>
                        </svg>
                        
                        <div className="absolute bottom-6 left-6 pointer-events-none">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                                <span className="text-green-400 font-mono text-sm">PROCESSING_TENSOR_DATA</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/2">
                    <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-xl flex items-center justify-center mb-6">
                        <BoltIcon className="w-6 h-6" />
                    </div>
                    <h2 className="text-4xl font-bold mb-6">The AI Model</h2>
                    <p className="text-lg text-gray-400 mb-6 leading-relaxed">
                        Powered by TensorFlow.js and MoveNet, our proprietary AI model runs entirely in your browser. It maps 17 key body points to analyze your skeletal structure in real-time.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                            <h4 className="font-bold text-white mb-2">Privacy-First Architecture</h4>
                            <p className="text-sm text-gray-400">Video data is processed locally. Zero latency, zero cloud storage.</p>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                            <h4 className="font-bold text-white mb-2">Adaptive Learning</h4>
                            <p className="text-sm text-gray-400">The model adapts to different lighting conditions and clothing types.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Pricing Preview Section (Still kept as a teaser) */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">Start your journey today</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Join thousands of users improving their health with Poisé.</p>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 inline-block max-w-md w-full">
                <h3 className="text-2xl font-bold mb-2">Free Forever</h3>
                <p className="text-gray-500 mb-6">Perfect for individuals getting started.</p>
                <button onClick={onGetStarted} className="w-full bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors">
                    Create Free Account
                </button>
                <p className="mt-4 text-sm text-gray-500">Looking for more? <a href="#" onClick={(e) => { e.preventDefault(); /* Handle nav to pricing page in App */ }} className="text-indigo-600 hover:underline">View Pro Plans</a></p>
            </div>
        </div>
      </section>

       {/* Testimonials Section */}
      <section className="py-24 bg-white border-y border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4">Trusted by the best.</h2>
           <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Poisé is used by leading institutions and companies to improve employee wellness.</p>
          <div className="relative max-w-xl mx-auto">
            <div className="overflow-hidden relative h-64">
                {testimonials.map((testimonial, index) => (
                  <div key={index} 
                       className={`min-w-full flex-shrink-0 px-2 absolute w-full h-full transition-opacity duration-700 ease-in-out ${index === currentTestimonial ? 'opacity-100' : 'opacity-0'}`}
                  >
                      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">
                        <p className="text-gray-700 flex-grow text-lg italic">"{testimonial.quote}"</p>
                        <div className="mt-6 flex items-center">
                          {/* Vector Avatar */}
                          <div className={`w-12 h-12 rounded-full mr-4 flex items-center justify-center font-bold text-sm border ${getAvatarStyle(index)}`}>
                             {getInitials(testimonial.author)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{testimonial.author}</p>
                            <p className="text-gray-500">{testimonial.company}</p>
                          </div>
                        </div>
                      </div>
                  </div>
                ))}
            </div>
            <button onClick={prevTestimonial} className="absolute top-1/2 -translate-y-1/2 -left-4 bg-white p-2 rounded-full shadow-md border hover:bg-gray-100 transition-colors z-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={nextTestimonial} className="absolute top-1/2 -translate-y-1/2 -right-4 bg-white p-2 rounded-full shadow-md border hover:bg-gray-100 transition-colors z-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
                {testimonials.map((_, index) => (
                    <button key={index} onClick={() => setCurrentTestimonial(index)} className={`w-2.5 h-2.5 rounded-full ${currentTestimonial === index ? 'bg-gray-800' : 'bg-gray-300'} transition-colors`}></button>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <h2 className="text-5xl font-bold mb-12 text-center">FAQs</h2>
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                        <button 
                          onClick={() => setOpenFaq(openFaq === index ? null : index)}
                          className="w-full flex justify-between items-center p-6 text-left"
                        >
                            <p className="text-lg font-medium">{faq.q}</p>
                            <span className={`text-gray-400 hover:text-gray-900 transition-transform duration-300 ${openFaq === index ? 'rotate-45' : ''}`}>
                               <PlusIcon />
                            </span>
                        </button>
                        <div 
                          className="grid transition-all duration-500 ease-in-out"
                          style={{ gridTemplateRows: openFaq === index ? '1fr' : '0fr' }}
                        >
                           <div className="overflow-hidden">
                               <div className="px-6 pb-6 text-gray-600">
                                 <p>{faq.a}</p>
                               </div>
                           </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
