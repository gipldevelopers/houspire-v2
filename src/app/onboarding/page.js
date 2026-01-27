// src\app\onboarding\page.js
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const QUESTIONS = [
  {
    id: "q1",
    title: "How would you describe your dream home?",
    options: [
      "Modern & Minimal",
      "Warm & Cozy",
      "Luxury & Premium",
      "Functional & Practical",
      "Not sure yet, need inspiration",
    ],
  },
  {
    id: "q2",
    title: "What matters most to you when planning interiors?",
    options: [
      "Speed (get it done quickly)",
      "Investment Clarity (clear budgets upfront)",
      "Aesthetics (design & style focus)",
      "Long-term Ease of Maintenance",
    ],
  },
  {
    id: "q3",
    title: "Which stage are you at right now?",
    options: [
      "Just bought my home",
      "About to get possession",
      "Already living in it",
      "Renovating my current home",
    ],
  },
  {
    id: "q4",
    title: "What is the biggest challenge you’re facing with interiors?",
    options: [
      "Too many options, hard to decide",
      "Unclear costs / hidden charges",
      "Lack of time to plan properly",
      "Coordinating with designers / contractors",
    ],
  },
];

const TIPS = [
  { title: "Color Psychology", text: "Blue rooms can feel cooler, while warm colors like red and orange can make a room feel up to 10° warmer." },
  { title: "Lighting Matters", text: "Layer ambient, task, and accent lighting for depth and comfort in any space." },
  { title: "Scale & Proportion", text: "Choose furniture that matches the room’s scale to keep layouts airy and functional." },
  { title: "Material Choices", text: "Low-maintenance finishes save time and cost over the long run." },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0..3
  const [answers, setAnswers] = useState({}); // { q1: "...", q2: "...", ... }
  const [tipIndex, setTipIndex] = useState(0);
  const total = QUESTIONS.length;
  const percent = useMemo(() => Math.round(((step + 1) / total) * 100), [step, total]);
  const current = QUESTIONS[step];

  useEffect(() => {
    const t = setInterval(() => setTipIndex((i) => (i + 1) % TIPS.length), 3500);
    return () => clearInterval(t);
  }, []);

  const selectOption = (value) => {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
  };

  const canNext = Boolean(answers[current.id]);

  const onNext = () => {
    if (!canNext) return;
    if (step < total - 1) setStep((s) => s + 1);
  };

  const onPrev = () => setStep((s) => Math.max(0, s - 1));

  const onFinish = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('projectId');
    
    // Store answers with projectId in your database
    await fetch('/api/projects/update-questionnaire', {
      method: 'POST',
      body: JSON.stringify({ projectId, answers })
    });
    
    router.push(`/dashboard/projects/${projectId}/uploads`);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background to-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {/* LEFT: questionnaire */}
          <div className="md:col-span-2">
            <Card className="border-0 shadow-xl bg-card/95 backdrop-blur">
              <CardHeader className="pb-2">
                <div className="text-sm text-muted-foreground">Question {step + 1} of {total}</div>
                <Progress value={percent} className="h-2 mt-2" />
                <CardTitle className="text-2xl md:text-3xl mt-4">
                  {current.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {current.options.map((opt) => {
                    const selected = answers[current.id] === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => selectOption(opt)}
                        className={cn(
                          "w-full text-left rounded-xl border p-4 transition-all",
                          "bg-background hover:bg-accent/40",
                          "flex items-center justify-between",
                          selected
                            ? "border-primary ring-2 ring-primary/30"
                            : "border-border"
                        )}
                      >
                        <span className="font-medium">{opt}</span>
                        <span
                          className={cn(
                            "ml-4 inline-flex h-6 w-6 items-center justify-center rounded-full border",
                            selected
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-transparent text-transparent"
                          )}
                        >
                          <Check className="h-4 w-4" />
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onPrev}
                    disabled={step === 0}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  {step < total - 1 ? (
                    <Button type="button" onClick={onNext} disabled={!canNext} className="gap-2">
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="button" onClick={onFinish} disabled={!canNext} className="gap-2">
                      Finish
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="text-center text-xs text-muted-foreground">
                  Your answers help us personalize styles, layouts, and budgets for your space.
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: tips & welcome */}
          <div className="md:col-span-1 space-y-4">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Info className="h-4 w-4" />
                  Did You Know?
                </div>
                <CardTitle className="text-base">{TIPS[tipIndex].title}</CardTitle>
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
                        "h-1.5 w-6 rounded-full",
                        i === tipIndex ? "bg-amber-500" : "bg-amber-300/60"
                      )}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg">Welcome to Houspire!</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  We’re here to help you create the perfect living space. Answer a few quick
                  questions to get personalized design recommendations tailored just for you.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
