"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Map,
  Sparkles,
  Loader2,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Clock,
  AlertCircle,
  TrendingUp,
  Target,
  ArrowRight,
  Lightbulb,
  Users,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { sanitizeHtml } from "@/lib/sanitize";

interface RoadmapDay {
  day: number;
  title: string;
  channel: string;
  taskType: "content" | "engagement" | "analysis" | "setup" | "optimization";
  description: string;
  deliverables: string[];
  estimatedTime: string;
  priority: "high" | "medium" | "low";
}

interface RoadmapWeek {
  week: number;
  theme: string;
  objective: string;
  days: RoadmapDay[];
  kpis: string[];
}

interface TargetAudience {
  demographics: {
    ageRange: string;
    gender: string;
    location: string;
    incomeLevel: string;
  };
  psychographics: {
    interests: string[];
    values: string[];
    lifestyle: string;
  };
  painPoints: string[];
  buyingMotivations: string[];
}

interface Roadmap {
  id: string;
  status: "PENDING" | "GENERATING" | "COMPLETED" | "FAILED";
  overview: string | null;
  targetAudience: TargetAudience | null;
  usps: string[] | null;
  plan: {
    weeks: RoadmapWeek[];
    totalEstimatedBudget: number;
    expectedOutcomes: string[];
  } | null;
}

interface Project {
  id: string;
  name: string;
  status: string;
  profile: {
    industry: string;
    description: string;
    monthlyBudget: number;
    goals: string[];
    currentChannels: string[];
  } | null;
  roadmap: Roadmap | null;
}

interface PageProps {
  params: Promise<{ projectId: string }>;
}

const SHIFTING_MESSAGES = [
  "Analyzing your industry landscape...",
  "Studying local market demographics...",
  "Identifying target customer pain points...",
  "Formulating core value propositions...",
  "Determining highest impact channels...",
  "Drafting week-by-week thematic steps...",
  "Structuring daily marketing actions...",
  "Detailing copy prompts and deliverables...",
  "Assembling your 30-day growth roadmap...",
];

export default function RoadmapPage({ params }: PageProps) {
  const { projectId } = use(params);
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generation states
  const [generating, setGenerating] = useState(false);
  const [generatingMessageIdx, setGeneratingMessageIdx] = useState(0);

  // UI state
  const [activeWeek, setActiveWeek] = useState(1);
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({});
  const [completedDays, setCompletedDays] = useState<Record<number, boolean>>({});
  const [showAudiencePanel, setShowAudiencePanel] = useState(false);

  // Fetch project details
  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to fetch project");
      }

      // Find the specific project
      const currentProject = json.data.find((p: { id: string }) => p.id === projectId);
      if (!currentProject) {
        throw new Error("Project not found");
      }

      setProject(currentProject);
      
      // Load completed days from localStorage
      const savedCompleted = localStorage.getItem(`gp_completed_${projectId}`);
      if (savedCompleted) {
        setCompletedDays(JSON.parse(savedCompleted));
      }

      // If project has ACTIVE status and roadmap is COMPLETED, set generating false
      if (currentProject.roadmap?.status === "COMPLETED") {
        setGenerating(false);
      } else if (currentProject.roadmap?.status === "GENERATING") {
        setGenerating(true);
      }
    } catch (err: unknown) {
      console.error(err);
      setError((err instanceof Error ? err.message : String(err)) || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  // Handle message shifting during generation
  useEffect(() => {
    if (!generating) return;

    const interval = setInterval(() => {
      setGeneratingMessageIdx((prev) => (prev + 1) % SHIFTING_MESSAGES.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [generating]);

  // If DB shows GENERATING, poll status
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (project?.roadmap?.status === "GENERATING" || generating) {
      const poll = async () => {
        try {
          const res = await fetch(`/api/projects`);
          const json = await res.json();
          const currentProject = json.data.find((p: { id: string }) => p.id === projectId);
          
          if (currentProject && currentProject.roadmap?.status === "COMPLETED") {
            setProject(currentProject);
            setGenerating(false);
          } else if (currentProject && currentProject.roadmap?.status === "FAILED") {
            setProject(currentProject);
            setGenerating(false);
            setError("Roadmap generation failed. Please try again.");
          } else {
            // Keep polling every 4 seconds
            timer = setTimeout(poll, 4000);
          }
        } catch (e) {
          console.error("Polling error", e);
        }
      };

      timer = setTimeout(poll, 4000);
    }

    return () => clearTimeout(timer);
  }, [project?.roadmap?.status, generating]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    setGeneratingMessageIdx(0);

    try {
      const res = await fetch("/api/generate/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Generation request failed");
      }

      // Generation started or completed
      if (json.data && json.data.status === "COMPLETED") {
        await fetchProject();
        setGenerating(false);
      }
    } catch (err: unknown) {
      console.error("Generation error:", err);
      setError((err instanceof Error ? err.message : String(err)) || "Failed to trigger roadmap generation");
      setGenerating(false);
    }
  };

  const toggleDayExpand = (day: number) => {
    setExpandedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const toggleDayComplete = (day: number) => {
    const updated = {
      ...completedDays,
      [day]: !completedDays[day],
    };
    setCompletedDays(updated);
    localStorage.setItem(`gp_completed_${projectId}`, JSON.stringify(updated));
  };

  if (loading) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-text-secondary">Loading your roadmap...</p>
      </div>
    );
  }

  if (error && !generating) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-danger mx-auto" />
        <h3 className="text-lg font-semibold text-text-primary">Something went wrong</h3>
        <p className="text-sm text-text-secondary">{error}</p>
        <Button variant="primary" onClick={fetchProject}>
          Reload Page
        </Button>
      </div>
    );
  }

  const roadmap = project?.roadmap;

  // ─── Case 1: Generating State ───
  if (generating || roadmap?.status === "GENERATING") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full space-y-6">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl animate-pulse" />
            <div className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin flex items-center justify-center">
              <Sparkles className="h-10 w-10 text-primary animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-text-primary">
              Generating Your Roadmap
            </h2>
            <p className="text-sm text-text-secondary h-6 transition-all duration-300 font-medium">
              {SHIFTING_MESSAGES[generatingMessageIdx]}
            </p>
          </div>

          <p className="text-xs text-text-tertiary">
            This takes about 30 seconds. The AI is crafting an industry-specific growth strategy for you.
          </p>

          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-accent animate-loading-bar rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  // ─── Case 2: Pending/Draft State ───
  if (!roadmap || roadmap.status === "PENDING" || roadmap.status === "FAILED") {
    return (
      <div className="p-4 sm:p-8 max-w-3xl mx-auto space-y-8">
        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary flex items-center gap-2">
            <Map className="h-7 w-7 text-primary" />
            Marketing Roadmap
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Let&apos;s assemble your custom 30-day strategy.
          </p>
        </div>

        <div className="glass-card p-6 sm:p-10 border border-border bg-white text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center border border-primary/20 mx-auto">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-text-primary">
              Ready to Generate Your Roadmap?
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Based on your business details, monthly budget of{" "}
              <strong className="text-text-primary">
                ${project?.profile?.monthlyBudget.toLocaleString()}
              </strong>
              , and target goals, GrowthPilot will compile a structured 30-day step-by-step marketing schedule.
            </p>
          </div>

          <div className="pt-2">
            <Button
              onClick={handleGenerate}
              className="px-8 py-3.5 h-auto text-sm font-semibold shadow-lg shadow-primary/25"
            >
              Generate 30-Day Marketing Roadmap
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {roadmap?.status === "FAILED" && (
            <p className="text-xs text-danger font-medium mt-2 bg-danger-light p-3 rounded-lg border border-danger/10 max-w-sm mx-auto">
              The previous attempt failed. Clicking above will try generating again.
            </p>
          )}
        </div>
      </div>
    );
  }

  // ─── Case 3: Completed Roadmap Timeline ───
  const { weeks, expectedOutcomes, totalEstimatedBudget } = roadmap.plan || {
    weeks: [],
    expectedOutcomes: [],
    totalEstimatedBudget: 0,
  };

  const currentWeekData = weeks.find((w) => w.week === activeWeek);

  // Calculate stats
  const totalTasks = weeks.reduce((sum, w) => sum + w.days.length, 0);
  const completedTasksCount = Object.values(completedDays).filter(Boolean).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8 relative">
      {/* Target Audience Sidebar Panel overlay */}
      <AnimatePresence>
        {showAudiencePanel && roadmap.targetAudience && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAudiencePanel(false)}
              className="fixed inset-0 z-40 bg-black backdrop-blur-xs"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white border-l border-border p-6 sm:p-8 overflow-y-auto shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Target Customer Profile
                </h2>
                <button
                  onClick={() => setShowAudiencePanel(false)}
                  className="p-1 rounded-md hover:bg-slate-100 text-text-tertiary hover:text-text-primary text-sm font-semibold"
                >
                  Close
                </button>
              </div>

              <div className="flex-1 py-6 space-y-6 text-sm">
                {/* Demographics */}
                <div className="space-y-2.5">
                  <h3 className="font-semibold text-text-primary text-[14px]">📊 Demographics</h3>
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-border/50 text-xs">
                    <div>
                      <span className="text-text-tertiary block font-medium">Age Range</span>
                      <span className="text-text-primary font-semibold">{roadmap.targetAudience.demographics.ageRange}</span>
                    </div>
                    <div>
                      <span className="text-text-tertiary block font-medium">Gender</span>
                      <span className="text-text-primary font-semibold">{roadmap.targetAudience.demographics.gender}</span>
                    </div>
                    <div>
                      <span className="text-text-tertiary block font-medium">Location</span>
                      <span className="text-text-primary font-semibold truncate block">{roadmap.targetAudience.demographics.location}</span>
                    </div>
                    <div>
                      <span className="text-text-tertiary block font-medium">Income Level</span>
                      <span className="text-text-primary font-semibold">{roadmap.targetAudience.demographics.incomeLevel}</span>
                    </div>
                  </div>
                </div>

                {/* Psychographics */}
                <div className="space-y-2.5">
                  <h3 className="font-semibold text-text-primary text-[14px]">🧠 Psychographics</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-text-tertiary font-medium">Lifestyle</span>
                      <p className="text-text-secondary text-xs mt-0.5 leading-relaxed">
                        {roadmap.targetAudience.psychographics.lifestyle}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-text-tertiary font-medium block mb-1">Interests</span>
                      <div className="flex flex-wrap gap-1">
                        {roadmap.targetAudience.psychographics.interests.map((interest) => (
                          <span key={interest} className="px-2 py-0.5 rounded bg-slate-100 text-text-primary text-[10px] font-medium border border-border">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-text-tertiary font-medium block mb-1">Values</span>
                      <div className="flex flex-wrap gap-1">
                        {roadmap.targetAudience.psychographics.values.map((val) => (
                          <span key={val} className="px-2 py-0.5 rounded bg-slate-100 text-text-primary text-[10px] font-medium border border-border">
                            {val}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pain Points */}
                <div className="space-y-2.5">
                  <h3 className="font-semibold text-text-primary text-[14px]">⚠️ Pain Points</h3>
                  <ul className="list-disc list-inside space-y-1 text-xs text-text-secondary">
                    {roadmap.targetAudience.painPoints.map((pp, idx) => (
                      <li key={idx} className="leading-relaxed">{pp}</li>
                    ))}
                  </ul>
                </div>

                {/* Buying Motivations */}
                <div className="space-y-2.5">
                  <h3 className="font-semibold text-text-primary text-[14px]">💎 Buying Motivations</h3>
                  <ul className="list-disc list-inside space-y-1 text-xs text-text-secondary">
                    {roadmap.targetAudience.buyingMotivations.map((bm, idx) => (
                      <li key={idx} className="leading-relaxed">{bm}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Header / Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <Map className="h-7 w-7 text-primary" />
            Marketing Roadmap
          </h1>
          <p className="mt-1.5 text-sm text-text-secondary">
            Your customized 30-day growth strategy for <strong className="text-text-primary">{project?.name}</strong>.
          </p>
        </div>

        {/* Action controls */}
        <div className="flex flex-wrap gap-2.5">
          {roadmap.targetAudience && (
            <Button
              variant="outline"
              onClick={() => setShowAudiencePanel(true)}
              className="flex items-center gap-1.5 text-xs font-semibold py-2 h-10"
            >
              <Users className="h-4 w-4" />
              Target Customer
            </Button>
          )}

          <Button
            variant="outline"
            onClick={handleGenerate}
            className="flex items-center gap-1.5 text-xs font-semibold py-2 h-10 hover:border-primary/30"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            Regenerate Strategy
          </Button>
        </div>
      </div>

      {/* Overview & Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 border border-border bg-white lg:col-span-2 space-y-3">
          <h2 className="font-semibold text-text-primary text-sm uppercase tracking-wider">
            Strategy Overview
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            {roadmap.overview}
          </p>

          {/* USPs */}
          {roadmap.usps && (
            <div className="pt-2">
              <span className="text-xs font-bold text-text-tertiary block mb-2 uppercase">Brand USPs</span>
              <div className="flex flex-wrap gap-1.5">
                {roadmap.usps.map((usp) => (
                  <span
                    key={usp}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-50 border border-border text-xs font-medium text-text-primary"
                  >
                    <Award className="h-3.5 w-3.5 text-accent mr-1" />
                    {usp}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Progress Tracker Card */}
        <div className="glass-card p-6 border border-border bg-slate-50/50 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-semibold text-text-primary text-sm uppercase tracking-wider">
              Roadmap Progress
            </h3>

            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-extrabold text-primary">
                {progressPercent}%
              </span>
              <span className="text-xs text-text-secondary font-medium">
                ({completedTasksCount} of {totalTasks} tasks complete)
              </span>
            </div>

            <div className="h-2 w-full bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="border-t border-border/60 pt-4 mt-6 text-xs text-text-secondary space-y-2">
            <div className="flex justify-between">
              <span className="font-medium text-text-tertiary">Estimated Spend Limit</span>
              <span className="font-semibold text-text-primary">
                ${project?.profile?.monthlyBudget.toLocaleString()} / mo
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-text-tertiary">Estimated Week Budget</span>
              <span className="font-semibold text-text-primary">
                ${(totalEstimatedBudget || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline view tab navigation */}
      <div className="space-y-6">
        <div className="border-b border-border">
          <div className="flex overflow-x-auto space-x-8 pb-px">
            {weeks.map((wk) => {
              const isActive = wk.week === activeWeek;
              const weekCompletedCount = wk.days.filter((d) => completedDays[d.day]).length;
              const weekProgress = Math.round((weekCompletedCount / wk.days.length) * 100);

              return (
                <button
                  key={wk.week}
                  onClick={() => setActiveWeek(wk.week)}
                  className={`
                    pb-4 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2
                    ${
                      isActive
                        ? "border-primary text-primary font-bold"
                        : "border-transparent text-text-secondary hover:text-text-primary"
                    }
                  `}
                >
                  Week {wk.week}
                  {weekCompletedCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-primary-light text-primary text-[10px] font-bold">
                      {weekCompletedCount}/{wk.days.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Week Header */}
        {currentWeekData && (
          <div className="space-y-6">
            <div className="glass-card p-5 border border-border/50 bg-slate-50/20">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-1">
                Week {currentWeekData.week} Focus
              </span>
              <h3 className="text-lg font-bold text-text-primary leading-tight">
                {currentWeekData.theme}
              </h3>
              <p className="text-sm text-text-secondary mt-1.5 leading-relaxed">
                <strong className="text-text-primary">Objective:</strong> {currentWeekData.objective}
              </p>
            </div>

            {/* Daily Tasks List */}
            <div className="space-y-4">
              {currentWeekData.days.map((dayData) => {
                const isExpanded = !!expandedDays[dayData.day];
                const isCompleted = !!completedDays[dayData.day];

                return (
                  <div
                    key={dayData.day}
                    className={`
                      glass-card border rounded-xl overflow-hidden transition-all duration-200 bg-white
                      ${
                        isCompleted
                          ? "border-success/20 bg-success-light/5 hover:border-success/30"
                          : isExpanded
                          ? "border-primary/30 shadow-md"
                          : "border-border hover:border-border-hover"
                      }
                    `}
                  >
                    {/* Collapsed/Header view */}
                    <div className="flex items-center justify-between p-4 sm:p-5 gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Checkbox button */}
                        <button
                          type="button"
                          onClick={() => toggleDayComplete(dayData.day)}
                          className="flex-shrink-0 cursor-pointer"
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-6.5 w-6.5 text-success fill-success-light" />
                          ) : (
                            <div className="h-6 w-6 rounded-full border-2 border-border hover:border-primary transition-colors bg-white" />
                          )}
                        </button>

                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-text-tertiary uppercase block">
                            Day {dayData.day} — {dayData.channel}
                          </span>
                          <h4
                            onClick={() => toggleDayExpand(dayData.day)}
                            className={`font-semibold text-text-primary text-[15px] sm:text-base cursor-pointer hover:text-primary transition-colors truncate ${
                              isCompleted ? "line-through text-text-tertiary" : ""
                            }`}
                          >
                            {dayData.title}
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Task Type Tag */}
                        <span className="hidden md:inline-flex px-2 py-0.5 rounded bg-slate-50 border border-border text-[10px] font-medium text-text-secondary uppercase">
                          {dayData.taskType}
                        </span>

                        {/* Priority Badge */}
                        <span
                          className={`
                            px-2 py-0.5 rounded text-[10px] font-medium uppercase
                            ${
                              dayData.priority === "high"
                                ? "bg-danger-light text-danger-foreground border border-danger/10"
                                : dayData.priority === "medium"
                                ? "bg-warning-light text-warning-foreground border border-warning/10"
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                            }
                          `}
                        >
                          {dayData.priority}
                        </span>

                        <button
                          type="button"
                          onClick={() => toggleDayExpand(dayData.day)}
                          className="p-1 rounded hover:bg-slate-50 text-text-tertiary cursor-pointer"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronRight className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Content View */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-border/50 bg-slate-50/20"
                        >
                          <div className="p-5 space-y-4 text-sm">
                            {/* Description */}
                            <div className="space-y-1">
                              <span className="text-xs font-bold text-text-tertiary uppercase">Task Description</span>
                              <p className="text-text-secondary leading-relaxed text-sm">
                                {dayData.description}
                              </p>
                            </div>

                            {/* Deliverables */}
                            {dayData.deliverables.length > 0 && (
                              <div className="space-y-1.5">
                                <span className="text-xs font-bold text-text-tertiary uppercase block">Deliverables</span>
                                <ul className="space-y-1">
                                  {dayData.deliverables.map((deliv, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-xs text-text-secondary">
                                      <span className="text-primary font-bold mt-0.5">•</span>
                                      <span>{deliv}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Time estimate */}
                            <div className="flex items-center gap-1.5 text-xs text-text-secondary bg-white border border-border p-2.5 rounded-lg w-max shadow-xs">
                              <Clock className="h-3.5 w-3.5 text-text-tertiary" />
                              <span className="font-medium">Estimated Time:</span>
                              <span className="font-semibold text-text-primary">{dayData.estimatedTime}</span>
                            </div>

                            {/* CTA Copy Helper shortcut to campaigns generator */}
                            <div className="border-t border-border/50 pt-4 mt-2 flex items-center justify-between">
                              <span className="text-xs text-text-tertiary">
                                Want to draft social copy, emails, or ad headlines for this task?
                              </span>
                              <Link
                                href={`/projects/${projectId}/campaigns?initChannel=${encodeURIComponent(
                                  dayData.channel
                                )}&initTitle=${encodeURIComponent(dayData.title)}`}
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs text-primary font-semibold flex items-center gap-1"
                                >
                                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                                  AI Copy Generator
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Weekly Outcomes & KPIs footer info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="glass-card p-5 border border-border bg-slate-50/20 space-y-2">
                <span className="text-xs font-bold text-text-tertiary uppercase flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Target KPI Metrics
                </span>
                <ul className="list-disc list-inside space-y-1 text-xs text-text-secondary">
                  {currentWeekData.kpis.map((kpi, idx) => (
                    <li key={idx}>{kpi}</li>
                  ))}
                </ul>
              </div>

              <div className="glass-card p-5 border border-border bg-slate-50/20 space-y-2">
                <span className="text-xs font-bold text-text-tertiary uppercase flex items-center gap-1.5">
                  <Lightbulb className="h-4 w-4 text-accent" />
                  Expected Outcomes
                </span>
                <ul className="list-disc list-inside space-y-1 text-xs text-text-secondary">
                  {expectedOutcomes.map((outcome, idx) => (
                    <li key={idx}>{outcome}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
