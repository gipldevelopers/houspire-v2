"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, ChevronLeft, ChevronRight, Info, X, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { projectService } from "@/services/project.service";
import { toast } from "sonner";

// Updated QUESTIONS for Onboarding Modal
const QUESTIONS = [
  {
    id: "q1",
    title: "What are you looking to create, and what do you need clarity on?",
    options: [
      "Calm & minimal",
      "Modern & stylish",
      "Warm & functional",
      "Simple & luxe",
    ],
  },
  {
    id: "q2",
    title: "Where are you in your interior journey right now?",
    options: [
      "Just bought / getting possession",
      "Researching & comparing options",
      "Spoken to designers but still unsure",
      "Ready to start — need final clarity",
      "In execution — need better direction",
    ],
  },
];

const TIPS = [
  { title: "Color Psychology", text: "Blue rooms can feel cooler, while warm colors like red and orange can make a room feel up to 10° warmer." },
  { title: "Lighting Matters", text: "Layer ambient, task, and accent lighting for depth and comfort in any space." },
  { title: "Scale & Proportion", text: "Choose furniture that matches the room's scale to keep layouts airy and functional." },
  { title: "Material Choices", text: "Low-maintenance finishes save time and cost over the long run." },
];

export default function OnboardingModal({ isOpen, onClose, projectId, onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [tipIndex, setTipIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasExistingAnswers, setHasExistingAnswers] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const total = QUESTIONS.length;
  const percent = useMemo(() => Math.round(((step + 1) / total) * 100), [step, total]);
  const current = QUESTIONS[step];

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTipIndex((i) => (i + 1) % TIPS.length), 3500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (isOpen && projectId) {
      loadExistingAnswers();
      markOnboardingStarted();
    }
  }, [isOpen, projectId]);

  const loadExistingAnswers = async () => {
    try {
      const statusResponse = await projectService.getOnboardingStatus(projectId);
      if (statusResponse.success) {
        const { onboarding } = statusResponse.data;
        
        if (onboarding.hasQuestionnaire) {
          setHasExistingAnswers(true);
        }
        
        if (onboarding.onboardingCompleted) {
          toast.info('Onboarding already completed!');
          handleSuccessfulCompletion();
          return;
        }
      }
    } catch (error) {
      console.error('Error loading onboarding status:', error);
    }
  };

  const markOnboardingStarted = async () => {
    try {
      await projectService.startOnboarding(projectId);
    } catch (error) {
      console.error('Error marking onboarding started:', error);
    }
  };

  const selectOption = (value) => {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
    
    // Auto-advance to next question after a short delay
    setTimeout(() => {
      if (step < total - 1) {
        setStep((s) => s + 1);
        // Scroll to top for better UX
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // If it's the last question, auto-submit
        onFinish();
      }
    }, 300);
  };

  const canNext = Boolean(answers[current.id]);

  const onNext = () => {
    if (!canNext) return;
    if (step < total - 1) setStep((s) => s + 1);
  };

  const onPrev = () => setStep((s) => Math.max(0, s - 1));

  const handleSuccessfulCompletion = () => {
    if (onComplete) {
      onComplete();
    }
    onClose();
    window.location.href = `/dashboard/projects/${projectId}/uploads`;
  };

  const onFinish = async () => {
    if (!canNext) return;
    
    setIsSubmitting(true);

    try {
      const response = await projectService.saveQuestionnaire(projectId, answers);
      
      if (response.success) {
        toast.success('Onboarding completed successfully!');
        handleSuccessfulCompletion();
      } else {
        throw new Error(response.message || 'Failed to save questionnaire');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error(error.message || 'Failed to complete onboarding. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculatedProgress = useMemo(() => {
    const answeredQuestions = Object.keys(answers).length;
    return Math.round(((answeredQuestions + (hasExistingAnswers ? total : 0)) / total) * 100);
  }, [answers, hasExistingAnswers, total]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-2 sm:p-4">
      <div className="w-full max-w-6xl h-full max-h-[95vh] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 h-full overflow-y-auto">
          {/* MAIN CONTENT - Full width on mobile, 2/3 on desktop */}
          <div className="md:col-span-2">
            <Card className="border-0 shadow-xl md:shadow-2xl bg-card/95 backdrop-blur relative h-full flex flex-col">
              <CardHeader className="pb-3 md:pb-4 flex-shrink-0">
                {/* Mobile Header with Close Button */}
                <div className="flex items-center justify-between mb-3 md:mb-0">
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground">
                      {step + 1}/{total}
                    </div>
                    {hasExistingAnswers && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        Resuming
                      </span>
                    )}
                  </div>
                  
                  {/* Mobile Close Button */}
                  {isMobile && (
                    <button
                      onClick={onClose}
                      className="p-2 rounded-full hover:bg-accent transition-colors"
                      disabled={isSubmitting}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-primary">{calculatedProgress}%</span>
                  </div>
                  <Progress value={percent} className="h-2" />
                </div>

                {/* Question Title */}
                <CardTitle className="text-xl md:text-2xl lg:text-3xl mt-4 md:mt-6 leading-tight">
                  {current.title}
                </CardTitle>
                
                {hasExistingAnswers && step === 0 && (
                  <CardDescription className="text-sm text-blue-600 dark:text-blue-400">
                    Welcome back! Continue from where you left off.
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="flex-1 flex flex-col space-y-4 md:space-y-6 pb-4 md:pb-6">
                {/* Options */}
                <div className="space-y-2 md:space-y-3 flex-1">
                  {current.options.map((opt) => {
                    const selected = answers[current.id] === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => selectOption(opt)}
                        disabled={isSubmitting}
                        className={cn(
                          "w-full text-left rounded-lg md:rounded-xl border p-3 md:p-4 transition-all duration-200",
                          "bg-background hover:bg-accent/40 hover:border-primary/30",
                          "flex items-center justify-between group",
                          selected
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                            : "border-border",
                          isSubmitting && "opacity-50 cursor-not-allowed",
                          "touch-manipulation active:scale-[0.98]"
                        )}
                      >
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors text-sm md:text-base">
                          {opt}
                        </span>
                        <span
                          className={cn(
                            "ml-3 md:ml-4 inline-flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full border transition-all flex-shrink-0",
                            selected
                              ? "bg-primary text-primary-foreground border-primary shadow-sm scale-110"
                              : "bg-transparent text-transparent border-muted-foreground/30 group-hover:border-primary/50"
                          )}
                        >
                          <Check className="h-3 w-3 md:h-4 md:w-4" />
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Progress Dots - Mobile Only */}
                {isMobile && (
                  <div className="flex justify-center space-x-1.5 py-2">
                    {QUESTIONS.map((_, index) => (
                      <div
                        key={index}
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-300",
                          index === step
                            ? "bg-primary w-6"
                            : index < step || answers[QUESTIONS[index].id]
                            ? "bg-primary/50 w-4"
                            : "bg-muted w-2"
                        )}
                      />
                    ))}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-2 md:pt-4 flex-shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onPrev}
                    disabled={step === 0 || isSubmitting}
                    className="gap-1 md:gap-2 transition-all text-sm md:text-base"
                    size={isMobile ? "sm" : "default"}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden xs:inline">Previous</span>
                  </Button>

                  {step < total - 1 ? (
                    <Button 
                      type="button" 
                      onClick={onNext} 
                      disabled={!canNext || isSubmitting}
                      className="gap-1 md:gap-2 transition-all hover:shadow-md text-sm md:text-base"
                      size={isMobile ? "sm" : "default"}
                    >
                      <span className="hidden xs:inline">Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      type="button" 
                      onClick={onFinish} 
                      disabled={!canNext || isSubmitting}
                      className="gap-1 md:gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transition-all hover:shadow-lg text-sm md:text-base"
                      size={isMobile ? "sm" : "default"}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="hidden xs:inline ml-1">Saving...</span>
                        </>
                      ) : (
                        <>
                          <span className="hidden xs:inline">Complete</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {/* Helper Text */}
                <div className="text-center text-xs text-muted-foreground flex-shrink-0">
                  {hasExistingAnswers ? (
                    "Your progress is automatically saved. You can close and return anytime."
                  ) : (
                    "Your answers help us personalize styles, layouts, and budgets for your space."
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SIDEBAR - Hidden on mobile, shown on desktop */}
          <div className="hidden md:flex md:col-span-1 flex-col space-y-4 lg:space-y-6">
            {/* Tips Card */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 flex-1">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Info className="h-4 w-4" />
                  Did You Know?
                </div>
                <CardTitle className="text-base lg:text-lg">{TIPS[tipIndex].title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {TIPS[tipIndex].text}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1">
                  {TIPS.map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "h-1.5 w-6 rounded-full transition-all duration-500",
                        i === tipIndex 
                          ? "bg-amber-500 w-8" 
                          : "bg-amber-300/60"
                      )}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Welcome Card */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/10 flex-1">
              <CardHeader>
                <CardTitle className="text-lg lg:text-xl flex items-center gap-2">
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Welcome to Houspire!
                  </span>
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {hasExistingAnswers ? (
                    <>
                      Great to see you back! Complete your onboarding to unlock personalized design recommendations tailored just for you.
                    </>
                  ) : (
                    <>
                      We're here to help you create the perfect living space. Answer a few quick questions to get personalized design recommendations tailored just for you.
                    </>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs lg:text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span>Personalized style recommendations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span>Customized budget planning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                    <span>Tailored vendor suggestions</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Overview Card */}
            <Card className="border-0 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base lg:text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Onboarding</span>
                      <span className="font-medium">{calculatedProgress}%</span>
                    </div>
                    <Progress value={calculatedProgress} className="h-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="font-semibold text-green-700 dark:text-green-300">
                        {Object.keys(answers).length}
                      </div>
                      <div className="text-muted-foreground">Answered</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="font-semibold text-blue-700 dark:text-blue-300">
                        {total - Object.keys(answers).length}
                      </div>
                      <div className="text-muted-foreground">Remaining</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* MOBILE BOTTOM SHEET - For tips and progress on mobile */}
          {isMobile && (
            <div className="md:hidden space-y-4">
              {/* Mobile Tips Carousel */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Info className="h-4 w-4" />
                      Did You Know?
                    </div>
                    <div className="flex items-center gap-1">
                      {TIPS.map((_, i) => (
                        <span
                          key={i}
                          className={cn(
                            "h-1.5 w-3 rounded-full transition-all duration-500",
                            i === tipIndex 
                              ? "bg-amber-500 w-4" 
                              : "bg-amber-300/60"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <CardTitle className="text-base">{TIPS[tipIndex].title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {TIPS[tipIndex].text}
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Mobile Progress Summary */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Progress Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="font-semibold text-green-700 dark:text-green-300 text-lg">
                          {Object.keys(answers).length}
                        </div>
                        <div className="text-muted-foreground">Answered</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="font-semibold text-blue-700 dark:text-blue-300 text-lg">
                          {total - Object.keys(answers).length}
                        </div>
                        <div className="text-muted-foreground">Remaining</div>
                      </div>
                    </div>
                    <div className="text-xs text-center text-muted-foreground">
                      {hasExistingAnswers ? (
                        "Your progress is automatically saved"
                      ) : (
                        "Get personalized recommendations for your space"
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}