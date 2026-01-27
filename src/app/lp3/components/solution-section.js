// src\app\lp3\components\solution-section.js
'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { PlanningWizardModal } from './PlanningWizardModal';

export function SolutionSection() {
    const [mounted, setMounted] = useState(false);
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        setMounted(true);
        
        // Start step progression animation
        const timer = setInterval(() => {
            setActiveStep(prev => {
                const next = prev < 3 ? prev + 1 : 0;
                return next;
            });
        }, 2000); // Change step every 2 seconds

        return () => clearInterval(timer);
    }, []);

    const steps = [
        {
            icon: '📸',
            title: 'Upload Photos',
            time: '0h',
            // description: 'Share your space photos instantly'
            description: 'Upload floorplan or photos'
        },
        {
            icon: '🏠',
            title: '3D Renders',
            time: '24h',
            description: 'Get photorealistic designs'
        },
        {
            icon: '💰',
            title: 'Budget Ready',
            time: '48h',
            description: 'Complete transparent cost breakdown'
        },
        {
            icon: '🔧',
            title: 'Vendors Ready',
            time: '72h',
            description: 'connect with verified contractors'
        }
    ];

    return (
        <section id="how-it-works" className="py-10 sm:py-12 md:py-16 px-3 sm:px-4 bg-gradient-to-b from-[#7C3AED] to-[#9333EA] text-white">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-3 sm:mb-4 leading-tight">
                    Pay Just ₹499, Not Lakhs
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-center text-purple-100 mb-8 sm:mb-12 px-2">
                    No middleman • No commission • Just transparency
                </p>

                {/* Desktop: Timeline with Animation */}
                <div className="hidden md:block mb-16">
                    <div className="flex items-start justify-between max-w-5xl mx-auto relative">
                        {/* Background connecting line */}
                        <div className="absolute top-10 left-20 right-20 h-1 bg-white/60 z-0"></div>

                        {steps.map((step, index) => (
                            <div key={index} className="flex flex-col items-center relative z-10 flex-1">
                                <div
                                    className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 relative cursor-pointer ${
                                        mounted ? 'opacity-100' : 'opacity-0'
                                    } ${
                                        index === activeStep 
                                            ? 'bg-white scale-110 ring-4 ring-white/50' 
                                            : index < activeStep 
                                                ? 'bg-white/90 scale-100 ring-2 ring-white/30' 
                                                : 'bg-white/70 scale-95'
                                    }`}
                                    style={{
                                        transition: `opacity 0.6s ease-out ${index * 0.2}s, transform 0.3s ease-out`
                                    }}
                                    onClick={() => setActiveStep(index)}
                                >
                                    <span 
                                        className={`text-4xl transition-all duration-300 ${
                                            index === activeStep 
                                                ? 'scale-125 animate-bounce' 
                                                : 'scale-100'
                                        }`}
                                    >
                                        {step.icon}
                                    </span>
                                    
                                    {/* Completion checkmark */}
                                    {index < activeStep && (
                                        <span className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                            <CheckCircle2 className="w-4 h-4 text-white" />
                                        </span>
                                    )}
                                    
                                    {/* Active step indicator */}
                                    {index === activeStep && (
                                        <span className="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center animate-pulse">
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        </span>
                                    )}
                                </div>
                                
                                {/* Step content */}
                                <p className={`text-sm font-semibold mt-3 transition-all duration-300 ${
                                    index === activeStep ? 'text-white text-lg' : 'text-white'
                                }`}>
                                    {step.title}
                                </p>
                                <p className="text-xs text-purple-200">{step.time}</p>
                                <p className="text-xs text-purple-300 text-center mt-1">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile: Vertical Timeline with Animation */}
                <div className="md:hidden mb-12">
                    <div className="flex flex-col gap-6 max-w-sm mx-auto relative">
                        {/* Vertical connecting line */}
                        <div className="absolute left-8 top-0 bottom-0 w-1 bg-white/60"></div>

                        {steps.map((step, index) => (
                            <div key={index} className="flex items-start gap-4 relative">
                                <div 
                                    className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center shadow-lg relative z-10 transition-all duration-300 cursor-pointer ${
                                        index === activeStep 
                                            ? 'bg-white scale-110 ring-4 ring-white/50' 
                                            : index < activeStep 
                                                ? 'bg-white/90 scale-100 ring-2 ring-white/30' 
                                                : 'bg-white/70 scale-95'
                                    }`}
                                    onClick={() => setActiveStep(index)}
                                >
                                    <span 
                                        className={`text-3xl transition-all duration-300 ${
                                            index === activeStep 
                                                ? 'scale-125 animate-bounce' 
                                                : 'scale-100'
                                        }`}
                                    >
                                        {step.icon}
                                    </span>
                                    
                                    {index < activeStep && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                            <CheckCircle2 className="w-3 h-3 text-white" />
                                        </span>
                                    )}
                                    
                                    {index === activeStep && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center animate-pulse">
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        </span>
                                    )}
                                </div>
                                
                                <div className="flex-1 pt-2">
                                    <p className={`text-base font-semibold transition-all duration-300 ${
                                        index === activeStep ? 'text-white text-lg' : 'text-white'
                                    }`}>
                                        {step.title}
                                    </p>
                                    <p className="text-sm text-purple-200 mb-1">{step.time}</p>
                                    <p className="text-xs text-purple-300">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Three Main Cards - No Animations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
                    <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-lg sm:rounded-xl text-center hover:bg-white/15 transition-all hover:scale-105 border border-white/20">
                        <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">📤</div>
                        <h3 className="text-lg sm:text-xl font-bold mb-1.5 sm:mb-2 text-white">Upload Photos & Preferences</h3>
                        <p className="text-purple-100 text-xs sm:text-sm">
                            We analyze your space in 24 hours
                        </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-lg sm:rounded-xl text-center hover:bg-white/15 transition-all hover:scale-105 border border-white/20">
                        <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🎨</div>
                        <h3 className="text-lg sm:text-xl font-bold mb-1.5 sm:mb-2 text-white">Choose Your Style</h3>
                        <p className="text-purple-100 text-xs sm:text-sm">
                            Select from 20 curated Indian & global styles
                        </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-lg sm:rounded-xl text-center hover:bg-white/15 transition-all hover:scale-105 border border-white/20 sm:col-span-2 md:col-span-1">
                        <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">📦</div>
                        <h3 className="text-lg sm:text-xl font-bold mb-1.5 sm:mb-2 text-white">Get Everything in 72 Hours</h3>
                        <p className="text-purple-100 text-xs sm:text-sm">
                            Complete package delivered with full transparency
                        </p>
                    </div>
                </div>

                {/* Pricing Highlight */}
                <p className="text-center mt-8 sm:mt-12 mb-4 sm:mb-6 text-base sm:text-lg md:text-xl font-bold">
                    ₹499 • One-time Payment • No Hidden Costs
                </p>

                {/* CTA Button */}
                <div className="text-center px-2">
                    <button
                        onClick={() => {
                            setSelectedPackage(499);
                            setIsWizardOpen(true);
                        }}
                        className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 bg-white text-[#7C3AED] rounded-full font-bold text-base sm:text-lg hover:bg-gray-100 transition-all shadow-2xl hover:shadow-white/20 hover:scale-105"
                    >
                        See What You Get →
                    </button>
                </div>
            </div>

            {/* Planning Wizard Modal */}
            <PlanningWizardModal 
                open={isWizardOpen} 
                onOpenChange={(open) => {
                    setIsWizardOpen(open);
                    if (!open) {
                        setSelectedPackage(null);
                    }
                }}
                selectedPackage={selectedPackage}
            />
        </section>
    );
}
