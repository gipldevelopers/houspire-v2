// src\app\lp3\components\pricing-section.js
'use client';

import { useState, useEffect } from 'react';
import { Check, X, ChevronLeft, ChevronRight, Sparkles, Zap, TrendingUp, Crown } from 'lucide-react';

export function PricingSection({
    selectPackage,
    expandedCards: externalExpandedCards,
    setExpandedCards: externalSetExpandedCards,
    isMobile: externalIsMobile,
    onPackageSelect
}) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showJealousyTrigger, setShowJealousyTrigger] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [showFloatingCart, setShowFloatingCart] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Package data
    const packages = {
        499: { name: 'Room Trial', price: 499 },
        4999: { name: 'Complete Home', price: 4999 },
        9999: { name: 'Premium', price: 9999 },
        14999: { name: 'Luxury', price: 14999 }
    };

    // Internal state for expandedCards if not provided via props
    const [internalExpandedCards, setInternalExpandedCards] = useState({
        trial: false,
        complete: false,
        premium: false,
        luxury: false
    });

    // Use external state if provided, otherwise use internal state
    const expandedCards = externalExpandedCards || internalExpandedCards;
    const setExpandedCards = externalSetExpandedCards || setInternalExpandedCards;

    // Default selectPackage function if not provided
    const handleSelectPackage = (price) => {
        const packageData = packages[price];
        if (packageData) {
            setSelectedPackage(packageData);
            setShowFloatingCart(true);

            // ✅ Store selected plan in localStorage
            localStorage.setItem('selectedPlanFromLanding', JSON.stringify({
            price: price,
            name: packageData.name,
            timestamp: Date.now()
            }));
        }

        // Open wizard with selected package
        if (onPackageSelect) {
            onPackageSelect(price);
        }

        // Call external selectPackage if provided
        if (selectPackage) {
            selectPackage(price);
        }
    };

    // Detect mobile if not provided
    const [isMobile, setIsMobile] = useState(externalIsMobile !== undefined ? externalIsMobile : false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (externalIsMobile === undefined) {
            const checkMobile = () => {
                setIsMobile(window.innerWidth < 768);
            };
            checkMobile();
            window.addEventListener('resize', checkMobile);
            return () => window.removeEventListener('resize', checkMobile);
        }
    }, [externalIsMobile]);

    const toggleCard = (card) => {
        setExpandedCards(prev => ({ ...prev, [card]: !prev[card] }));
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % 4);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + 4) % 4);
    };

    return (
        <section
            id="pricing"
            className="py-6 sm:py-8 md:py-12 px-3 sm:px-4 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden"
            onMouseEnter={() => setShowJealousyTrigger(true)}
            onMouseLeave={() => setShowJealousyTrigger(false)}
        >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Jealousy Trigger */}
            {showJealousyTrigger && (
                <div className="relative z-10 mb-4 text-center animate-in slide-in-from-top-5 duration-500">
                    <p className="text-sm font-medium text-yellow-700">
                        Don&apos;t let them get ahead of you!
                    </p>
                </div>
            )}

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className={`text-center mb-6 sm:mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-tight px-2">
                        Choose Your Perfect Package
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-3 sm:mb-4 px-2">
                        Premium designs delivered in 72 hours or less
                    </p>
                    <div className="w-24 sm:w-32 h-0.5 sm:h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full"></div>
                </div>

                {/* Desktop Grid Layout */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                    {/* PACKAGE 1: ROOM TRIAL */}
                    <div className={`relative bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-200 flex flex-col h-full transform hover:-translate-y-2 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '100ms' }}>
                        <div className="mb-2 sm:mb-3">
                            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
                                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </div>
                                <h3 className="text-base sm:text-lg font-bold text-gray-900">Single Room Trial</h3>
                            </div>
                            <p className="text-gray-600 text-xs">Try before committing</p>
                        </div>
                        <div className="mb-2 sm:mb-3">
                            <div className="flex items-baseline gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                                <span className="text-gray-400 line-through text-xs">₹2,999</span>
                                <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">₹499</span>
                            </div>
                            <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-bold border border-green-200">
                                <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                83% OFF
                            </div>
                        </div>
                        <ul className="space-y-1 sm:space-y-1.5 mb-3 sm:mb-4 flex-grow">
                            {['1 room 3D design', 'Randomly selected style', 'Basic budget breakdown', '3 vendor recommendations', '100% refund if unsatisfied'].map((feature, i) => (
                                <li key={i} className="flex items-start gap-1.5 sm:gap-2 text-xs">
                                    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-green-600" />
                                    </div>
                                    <span className="text-gray-700">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => handleSelectPackage(499)}
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-xs sm:text-sm mt-auto"
                        >
                            Start Trial for ₹499
                        </button>
                    </div>

                    {/* PACKAGE 2: COMPLETE HOME - MOST POPULAR */}
                    {/* <div className={`relative bg-gradient-to-br from-white to-orange-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 shadow-2xl border-2 border-orange-500 flex flex-col h-full transform hover:-translate-y-2 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '200ms' }}>
                        <div className="absolute -top-2.5 sm:-top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 sm:px-4 py-0.5 sm:py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                            ⭐ MOST POPULAR
                        </div>
                        <div className="mb-2 sm:mb-3 mt-1.5 sm:mt-2">
                            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
                                    <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </div>
                                <h3 className="text-base sm:text-lg font-bold text-gray-900">Smart Home</h3>
                            </div>
                            <p className="text-gray-600 text-xs">Everything you need</p>
                        </div>
                        <div className="mb-2 sm:mb-3">
                            <div className="flex items-baseline gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                                <span className="text-gray-400 line-through text-xs">₹19,999</span>
                                <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">₹4,999</span>
                            </div>
                            <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-bold border border-green-200">
                                <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                75% OFF
                            </div>
                        </div>
                        <ul className="space-y-1 sm:space-y-1.5 mb-3 sm:mb-4 flex-grow">
                            {['5-7 room designs', 'Choose from 5 styles', 'Complete budget breakdown', 'Material specifications', '10-15 vendor options'].map((feature, i) => (
                                <li key={i} className="flex items-start gap-1.5 sm:gap-2 text-xs">
                                    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-green-600" />
                                    </div>
                                    <span className="text-gray-700 font-medium">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => handleSelectPackage(4999)}
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg sm:rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 text-xs sm:text-sm mt-auto"
                        >
                            Get Complete Home for ₹4,999
                        </button>
                    </div> */}

                    {/* PACKAGE 2: COMPLETE HOME - MOST POPULAR */}
                    <div className={`relative bg-gradient-to-br from-white to-orange-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 shadow-2xl border-2 border-orange-500 flex flex-col h-full transform hover:-translate-y-2 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '200ms' }}>
                        {/* MOST POPULAR BADGE - Fixed positioning */}
                        <div className="absolute -top-2 sm:-top-2.5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-xs font-bold shadow-lg z-10 whitespace-nowrap">
                            ⭐ MOST POPULAR
                        </div>
                        
                        {/* Add padding-top to prevent content overlap with badge */}
                        <div className="pt-2 sm:pt-0">
                            <div className="mb-2 sm:mb-3 mt-1.5 sm:mt-2">
                                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
                                        <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-gray-900">Smart Home</h3>
                                </div>
                                <p className="text-gray-600 text-xs">Everything you need</p>
                            </div>
                            <div className="mb-2 sm:mb-3">
                                <div className="flex items-baseline gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                                    <span className="text-gray-400 line-through text-xs">₹19,999</span>
                                    <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">₹4,999</span>
                                </div>
                                <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-bold border border-green-200">
                                    <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                    75% OFF
                                </div>
                            </div>
                            <ul className="space-y-1 sm:space-y-1.5 mb-3 sm:mb-4 flex-grow">
                                {['5-7 room designs', 'Choose from 5 styles', 'Complete budget breakdown', 'Material specifications', '10-15 vendor options'].map((feature, i) => (
                                    <li key={i} className="flex items-start gap-1.5 sm:gap-2 text-xs">
                                        <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-green-600" />
                                        </div>
                                        <span className="text-gray-700 font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handleSelectPackage(4999)}
                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg sm:rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 text-xs sm:text-sm mt-auto"
                            >
                                Get Complete Home for ₹4,999
                            </button>
                        </div>
                    </div>

                    {/* PACKAGE 3: PREMIUM */}
                    <div className={`relative bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-200 flex flex-col h-full transform hover:-translate-y-2 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '300ms' }}>
                        <div className="mb-2 sm:mb-3">
                            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
                                    <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </div>
                                <h3 className="text-base sm:text-lg font-bold text-gray-900">Premium Home</h3>
                            </div>
                            <p className="text-gray-600 text-xs">Enhanced experience</p>
                        </div>
                        <div className="mb-2 sm:mb-3">
                            <div className="flex items-baseline gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                                <span className="text-gray-400 line-through text-xs">₹34,999</span>
                                <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">₹9,999</span>
                            </div>
                            <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-bold border border-green-200">
                                <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                71% OFF
                            </div>
                        </div>
                        <ul className="space-y-1 sm:space-y-1.5 mb-3 sm:mb-4 flex-grow">
                            {['7-10 room designs', '12 premium style options', '1 revision in the premium plan', 'Premium materials + alternatives', '3 consultation calls', 'Priority support', 'Project timeline tracking'].map((feature, i) => (
                                <li key={i} className="flex items-start gap-1.5 sm:gap-2 text-xs">
                                    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-green-600" />
                                    </div>
                                    <span className="text-gray-700">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => handleSelectPackage(9999)}
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-xs sm:text-sm mt-auto"
                        >
                            Choose Premium for ₹9,999
                        </button>
                    </div>

                    {/* PACKAGE 4: LUXURY */}
                    <div className={`relative bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-200 flex flex-col h-full transform hover:-translate-y-2 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '400ms' }}>
                        <div className="mb-2 sm:mb-3">
                            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
                                    <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </div>
                                <h3 className="text-base sm:text-lg font-bold text-gray-900">Luxury Home</h3>
                            </div>
                            <p className="text-gray-600 text-xs">White-glove service</p>
                        </div>
                        <div className="mb-2 sm:mb-3">
                            <div className="flex items-baseline gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                                <span className="text-gray-400 line-through text-xs">₹49,999</span>
                                <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">₹14,999</span>
                            </div>
                            <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-bold border border-green-200">
                                <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                70% OFF
                            </div>
                        </div>
                        <ul className="space-y-1 sm:space-y-1.5 mb-3 sm:mb-4 flex-grow">
                            {['10+ room designs', '20+ exclusive styles', '2 revisions in the luxury plan', 'Custom mood board', 'Dedicated designer', '24/7 priority support'].map((feature, i) => (
                                <li key={i} className="flex items-start gap-1.5 sm:gap-2 text-xs">
                                    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-green-600" />
                                    </div>
                                    <span className="text-gray-700">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => handleSelectPackage(14999)}
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-xs sm:text-sm mt-auto"
                        >
                            Get Luxury for ₹14,999
                        </button>
                    </div>
                </div>

                {/* Mobile Carousel */}
               <div className="md:hidden relative mb-12">
    <div className="overflow-hidden rounded-xl sm:rounded-2xl touch-pan-x">
        <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
            {/* Mobile Package Cards */}
            {[
                {
                    key: 'trial',
                    title: 'Single Room Trial',
                    subtitle: 'Try before committing',
                    oldPrice: '₹2,999',
                    price: '₹499',
                    discount: '83% OFF • Limited time',
                    features: ['1 room 3D design', 'Randomly selected style', 'Basic budget breakdown', '3 vendor recommendations', '100% refund if unsatisfied'],
                    packagePrice: 499,
                    icon: Sparkles
                },
                {
                    key: 'complete',
                    title: 'Smart Home',
                    subtitle: 'Everything you need',
                    oldPrice: '₹19,999',
                    price: '₹4,999',
                    discount: '75% OFF • Best value',
                    features: ['5-7 room designs', 'Choose from 5 styles', 'Complete budget breakdown', 'Material specifications', '10-15 vendor options', 'Unlimited revisions'],
                    packagePrice: 4999,
                    icon: Zap,
                    popular: true
                },
                {
                    key: 'premium',
                    title: 'Premium Home',
                    subtitle: 'Enhanced experience',
                    oldPrice: '₹34,999',
                    price: '₹9,999',
                    discount: '71% OFF • Premium features',
                    features: ['7-10 room designs', '12 premium style options', 'Premium materials + alternatives', '3 consultation calls', 'Priority support', 'Project timeline tracking'],
                    packagePrice: 9999,
                    icon: TrendingUp
                },
                {
                    key: 'luxury',
                    title: 'Luxury Home',
                    subtitle: 'White-glove service',
                    oldPrice: '₹49,999',
                    price: '₹14,999',
                    discount: '70% OFF • Ultimate package',
                    features: ['10+ room designs', '20+ exclusive styles', 'Custom mood board', 'Dedicated designer', '24/7 priority support'],
                    packagePrice: 14999,
                    icon: Crown
                }
            ].map((pkg, idx) => {
                const IconComponent = pkg.icon;
                return (
                    <div key={pkg.key} className="w-full flex-shrink-0 px-3">
                        <div className={`bg-white rounded-2xl p-6 shadow-xl border-2 ${pkg.popular ? 'border-orange-500 mt-6' : 'border-gray-200'} relative pt-${pkg.popular ? '10' : '6'}`}>
                            {pkg.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg z-20 whitespace-nowrap">
                                    ⭐ MOST POPULAR
                                </div>
                            )}
                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`w-10 h-10 bg-gradient-to-br ${pkg.popular ? 'from-orange-400 to-orange-600' : 'from-blue-400 to-blue-600'} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                                        <IconComponent className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">{pkg.title}</h3>
                                </div>
                                <p className="text-gray-600 text-sm">{pkg.subtitle}</p>
                            </div>
                            <div className="mb-4">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-gray-400 line-through text-sm">{pkg.oldPrice}</span>
                                    <span className="text-3xl font-bold text-gray-900">{pkg.price}</span>
                                </div>
                                <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                                    <TrendingUp className="w-3 h-3" />
                                    {pkg.discount}
                                </div>
                            </div>
                            <button
                                onClick={() => toggleCard(pkg.key)}
                                className="text-orange-500 text-sm font-semibold mb-4 flex items-center gap-1 hover:text-orange-600 transition-colors"
                            >
                                {expandedCards[pkg.key] ? 'Show less ▲' : 'See what\'s included ▼'}
                            </button>
                            {expandedCards[pkg.key] && (
                                <ul className="space-y-2 mb-4 animate-in slide-in-from-top-2 duration-300">
                                    {pkg.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm">
                                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <Check className="w-3 h-3 text-green-600" />
                                            </div>
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <button
                                onClick={() => handleSelectPackage(pkg.packagePrice)}
                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                {pkg.key === 'trial' ? 'Start Trial' : pkg.key === 'complete' ? 'Get Complete Home' : pkg.key === 'premium' ? 'Choose Premium' : 'Get Luxury'} {pkg.price}
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>

    {/* Carousel Controls */}
    <div className="flex justify-between items-center mt-4 sm:mt-6 px-2">
        <button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                prevSlide();
            }}
            className="bg-white rounded-full p-2.5 sm:p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110 border border-gray-200 z-10 relative"
            aria-label="Previous package"
            type="button"
        >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
        </button>
        <div className="flex gap-2">
            {[0, 1, 2, 3].map((index) => (
                <button
                    key={index}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCurrentSlide(index);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 z-10 relative ${currentSlide === index ? 'bg-orange-500 w-8' : 'bg-gray-300 w-2'
                        }`}
                    aria-label={`Go to package ${index + 1}`}
                    type="button"
                />
            ))}
        </div>
        <button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                nextSlide();
            }}
            className="bg-white rounded-full p-2.5 sm:p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110 border border-gray-200 z-10 relative"
            aria-label="Next package"
            type="button"
        >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
        </button>
    </div>
</div>

                {/* Compare all features button */}
                <div className="text-center mb-6">
                    <button
                        onClick={() => {
                            const comparisonTable = document.getElementById('comparison-table');
                            if (comparisonTable) {
                                comparisonTable.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                        }}
                        className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-semibold text-lg transition-all duration-300 hover:gap-3"
                    >
                        Compare all features
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Complete Feature Comparison Table */}
                <div id="comparison-table" className="max-w-7xl mx-auto px-2">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-6 text-gray-900 leading-tight">
                        Complete Feature Comparison
                    </h3>

                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto rounded-2xl shadow-2xl">
                        <table className="w-full border-collapse bg-white">
                            <thead>
                                <tr className="bg-gradient-to-r from-orange-50 to-orange-100">
                                    <th className="p-3 text-left font-bold text-base text-gray-800 w-[20%]">Feature</th>
                                    <th className="p-3 text-center font-bold text-base text-gray-800 w-[20%]">
                                        <button
                                            onClick={() => handleSelectPackage(499)}
                                            className="hover:text-orange-500 transition-colors"
                                        >
                                            Single Room Trial<br />
                                            <span className="text-xl">₹499</span>
                                        </button>
                                    </th>
                                    <th className="p-3 text-center font-bold text-base bg-gradient-to-r from-orange-500 to-orange-600 text-white w-[20%]">
                                        <button
                                            onClick={() => handleSelectPackage(4999)}
                                            className="hover:opacity-90 transition-opacity"
                                        >
                                            Smart Home<br />
                                            <span className="text-xl">₹4,999</span>
                                        </button>
                                    </th>
                                    <th className="p-3 text-center font-bold text-base text-gray-800 w-[20%]">
                                        <button
                                            onClick={() => handleSelectPackage(9999)}
                                            className="hover:text-orange-500 transition-colors"
                                        >
                                            Premium Home<br />
                                            <span className="text-xl">₹9,999</span>
                                        </button>
                                    </th>
                                    <th className="p-3 text-center font-bold text-base text-gray-800 w-[20%]">
                                        <button
                                            onClick={() => handleSelectPackage(14999)}
                                            className="hover:text-orange-500 transition-colors"
                                        >
                                            Luxury Home<br />
                                            <span className="text-xl">₹14,999</span>
                                        </button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Design Deliverables */}
                                <tr className="border-t-4 border-orange-200">
                                    <td colSpan={5} className="p-3 bg-gradient-to-r from-orange-50 to-orange-100 font-bold text-gray-800 text-base">
                                        🎨 Design Deliverables
                                    </td>
                                </tr>
                                <tr className="bg-white hover:bg-gray-50 transition-colors">
                                    <td className="p-3 font-semibold text-gray-800 text-sm">3D Renders</td>
                                    <td className="text-center p-3 text-gray-700 text-sm">1 room</td>
                                    <td className="text-center p-3 font-bold text-base text-green-600 bg-green-50">5-7 rooms</td>
                                    <td className="text-center p-3 text-gray-700 text-sm">7-10 rooms</td>
                                    <td className="text-center p-3 text-gray-700 text-sm">10+ rooms</td>
                                </tr>
                                <tr className="bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <td className="p-3 font-semibold text-gray-800 text-sm">Design Style Options</td>
                                    <td className="text-center p-3 text-gray-700 text-sm">Randomly selected</td>
                                    <td className="text-center p-3 font-bold text-base text-green-600 bg-green-50">5 styles</td>
                                    <td className="text-center p-3 text-gray-700 text-sm">12 premium styles</td>
                                    <td className="text-center p-3 text-gray-700 text-sm">20+ exclusive styles</td>
                                </tr>
                                <tr className="bg-white hover:bg-gray-50 transition-colors">
                                    <td className="p-3 font-semibold text-gray-800 text-sm">Custom Mood Board</td>
                                    <td className="text-center p-3 text-gray-400"><X className="w-4 h-4 mx-auto" /></td>
                                    <td className="text-center p-3 text-gray-400 bg-green-50"><X className="w-4 h-4 mx-auto" /></td>
                                    <td className="text-center p-3 text-gray-400"><X className="w-4 h-4 mx-auto" /></td>
                                    <td className="text-center p-3 text-green-600"><Check className="w-5 h-5 mx-auto" /></td>
                                </tr>

                                {/* Planning & Budget */}
                                <tr className="border-t-4 border-orange-200">
                                    <td colSpan={5} className="p-3 bg-gradient-to-r from-orange-50 to-orange-100 font-bold text-gray-800 text-base">
                                        📊 Planning & Budget
                                    </td>
                                </tr>
                                <tr className="bg-white hover:bg-gray-50 transition-colors">
                                    <td className="p-3 font-semibold text-gray-800 text-sm">Budget Breakdown</td>
                                    <td className="text-center p-3 text-green-600"><Check className="w-5 h-5 mx-auto" /></td>
                                    <td className="text-center p-3 text-green-600 bg-green-50"><Check className="w-5 h-5 mx-auto" /></td>
                                    <td className="text-center p-3 text-green-600"><Check className="w-5 h-5 mx-auto" /></td>
                                    <td className="text-center p-3 text-green-600"><Check className="w-5 h-5 mx-auto" /></td>
                                </tr>
                                <tr className="bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <td className="p-3 font-semibold text-gray-800 text-sm">Material Specifications</td>
                                    <td className="text-center p-3 text-gray-700 text-sm">Basic</td>
                                    <td className="text-center p-3 font-bold text-base text-green-600 bg-green-50">Complete</td>
                                    <td className="text-center p-3 text-gray-700 text-sm">Premium + alternatives</td>
                                    <td className="text-center p-3 text-gray-700 text-sm">Luxury + custom options</td>
                                </tr>
                                <tr className="bg-white hover:bg-gray-50 transition-colors">
                                    <td className="p-3 font-semibold text-gray-800 text-sm">Project Timeline</td>
                                    <td className="text-center p-3 text-gray-700 text-sm">Basic milestones</td>
                                    <td className="text-center p-3 font-bold text-base text-green-600 bg-green-50">Detailed timeline</td>
                                    <td className="text-center p-3 text-gray-700 text-sm">Timeline with tracking</td>
                                    <td className="text-center p-3 text-gray-700 text-sm">Real-time tracking + alerts</td>
                                </tr>

                                {/* Support & Services */}
                                <tr className="border-t-4 border-orange-200">
                                    <td colSpan={5} className="p-3 bg-gradient-to-r from-orange-50 to-orange-100 font-bold text-gray-800 text-base">
                                        💬 Support & Services
                                    </td>
                                </tr>
                                <tr className="bg-white hover:bg-gray-50 transition-colors">
                                    <td className="p-3 font-semibold text-gray-800 text-sm">Design Revisions</td>
                                    <td className="text-center p-3 text-gray-700 text-sm">No</td>
                                    <td className="text-center p-3 font-bold text-base text-green-600 bg-green-50">No</td>
                                    <td className="text-center p-3 text-gray-700 text-sm">1 Revision</td>
                                    <td className="text-center p-3 text-gray-700 text-sm">2 Revision</td>
                                </tr>
                                <tr className="bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <td className="p-3 font-semibold text-gray-800 text-sm">Consultation Calls</td>
                                    <td className="text-center p-3 text-gray-700 text-sm">No</td>
                                    <td className="text-center p-3 font-bold text-base text-green-600 bg-green-50">No</td>
                                    <td className="text-center p-3 text-gray-700 text-sm">1 call (30 min)</td>
                                    <td className="text-center p-3 text-gray-700 text-sm">2 call (30 min)</td>
                                </tr>
                                <tr className="bg-white hover:bg-gray-50 transition-colors">
                                    <td className="p-3 font-semibold text-gray-800 text-sm">Response Time</td>
                                    <td className="text-center p-3 text-gray-700 text-sm">24-48 hours</td>
                                    <td className="text-center p-3 font-bold text-base text-green-600 bg-green-50">12-24 hours</td>
                                    <td className="text-center p-3 text-gray-700 text-sm">6-12 hours</td>
                                    <td className="text-center p-3 text-gray-700 text-sm">2-4 hours</td>
                                </tr>

                                {/* Vendor & Execution */}
                                <tr className="border-t-4 border-orange-200">
                                    <td colSpan={5} className="p-3 bg-gradient-to-r from-orange-50 to-orange-100 font-bold text-gray-800 text-base">
                                        🔨 Vendor & Execution
                                    </td>
                                </tr>
                                <tr className="bg-white hover:bg-gray-50 transition-colors">
                                    <td className="p-3 font-semibold text-gray-800 text-sm">Vendor Recommendations</td>
                                    <td className="text-center p-3 text-gray-700 text-sm">3 vendors</td>
                                    <td className="text-center p-3 font-bold text-base text-green-600 bg-green-50">10-15 vendors</td>
                                    <td className="text-center p-3 text-gray-700 text-sm">15-20 vendors</td>
                                    <td className="text-center p-3 text-gray-700 text-sm">20+ pre-vetted vendors</td>
                                </tr>

                                {/* Delivery & Guarantee */}
                                <tr className="border-t-4 border-orange-200">
                                    <td colSpan={5} className="p-3 bg-gradient-to-r from-orange-50 to-orange-100 font-bold text-gray-800 text-base">
                                        ⚡ Delivery & Guarantee
                                    </td>
                                </tr>
                                <tr className="bg-white hover:bg-gray-50 transition-colors">
                                    <td className="p-3 font-semibold text-gray-800 text-sm">Delivery Time</td>
                                    <td className="text-center p-3 text-gray-700 text-sm">24 hours</td>
                                    <td className="text-center p-3 font-bold text-base text-green-600 bg-green-50">72 hours</td>
                                    <td className="text-center p-3 text-gray-700 text-sm">72 hours</td>
                                    <td className="text-center p-3 text-gray-700 text-sm">72 hours</td>
                                </tr>
                                <tr className="bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <td className="p-3 font-semibold text-gray-800 text-sm">Money-back Guarantee</td>
                                    <td className="text-center p-3 text-green-600"><Check className="w-5 h-5 mx-auto" /></td>
                                    <td className="text-center p-3 text-green-600 bg-green-50"><Check className="w-5 h-5 mx-auto" /></td>
                                    <td className="text-center p-3 text-green-600"><Check className="w-5 h-5 mx-auto" /></td>
                                    <td className="text-center p-3 text-green-600"><Check className="w-5 h-5 mx-auto" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Comparison - Accordion Style */}
                    <div className="md:hidden space-y-4">
                        {['Room Trial - ₹499', 'Complete Home - ₹4,999', 'Premium - ₹9,999', 'Luxury - ₹14,999'].map((packageName, idx) => {
                            const cardKeys = ['trial', 'complete', 'premium', 'luxury'];
                            const currentCard = cardKeys[idx];

                            return (
                                <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200">
                                    <button
                                        onClick={() => toggleCard(currentCard)}
                                        className="w-full p-4 text-left font-bold text-lg bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 transition-all flex justify-between items-center"
                                    >
                                        <span>{packageName}</span>
                                        <span className="text-orange-500">{expandedCards[currentCard] ? '▲' : '▼'}</span>
                                    </button>
                                    {expandedCards[currentCard] && (
                                        <div className="p-4 space-y-2 text-sm animate-in slide-in-from-top-2 duration-300">
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="font-semibold text-gray-700">3D Renders:</span>
                                                <span className="text-gray-600">{['1 room', '5-7 rooms', '7-10 rooms', '10+ rooms'][idx]}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="font-semibold text-gray-700">Design Styles:</span>
                                                <span className="text-gray-600">{['Randomly selected', '5 styles', '12 styles', '20+ styles'][idx]}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="font-semibold text-gray-700">Revisions:</span>
                                                <span className="text-gray-600">{['No', 'No', '1 Revision', '2 Revision'][idx]}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="font-semibold text-gray-700">Vendors:</span>
                                                <span className="text-gray-600">{['3 vendors', '10-15 vendors', '15-20 vendors', '20+ vendors'][idx]}</span>
                                            </div>
                                            <div className="flex justify-between py-2">
                                                <span className="font-semibold text-gray-700">Delivery:</span>
                                                <span className="text-gray-600">{['24 hours', '72 hours', '72 hours', '72 hours'][idx]}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </section>
    );
}
