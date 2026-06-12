"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  FolderOpen,
  Plus,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Sparkles,
  Loader2,
  Calendar,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getIndustryLabel } from "@/constants/industries";
import { motion } from "framer-motion";

interface Project {
  id: string;
  name: string;
  status: "DRAFT" | "GENERATING" | "ACTIVE" | "ARCHIVED";
  createdAt: string;
  profile?: {
    industry: string;
    monthlyBudget: number;
    goals: string[];
  };
  roadmap?: {
    status: string;
  };
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.error || "Failed to load projects");
        }

        setProjects(json.data);
      } catch (err: any) {
        console.error("Dashboard projects loading error:", err);
        setError(err.message || "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const totalProjects = projects.length;
  const activeRoadmaps = projects.filter((p) => p.roadmap?.status === "COMPLETED").length;
  const totalBudget = projects.reduce((sum, p) => sum + (p.profile?.monthlyBudget || 0), 0);

  const getStatusBadge = (status: Project["status"]) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-success-light text-success-foreground border border-success/10">
            Active
          </span>
        );
      case "GENERATING":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary-light text-primary border border-primary/10 animate-pulse">
            Generating
          </span>
        );
      case "DRAFT":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-secondary-light text-text-secondary border border-border">
            Draft
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
            Archived
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <LayoutDashboard className="h-6 sm:h-7 w-6 sm:w-7 text-primary" />
            Dashboard
          </h1>
          <p className="mt-1.5 text-sm text-text-secondary">
            Welcome back! Here&apos;s an overview of your active marketing spaces.
          </p>
        </div>

        {totalProjects > 0 && (
          <Link href="/projects/new">
            <Button variant="primary" className="flex items-center gap-1.5 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-8">
          {/* Skeleton Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass-card p-6 border border-border h-24 shimmer" />
            ))}
          </div>
          {/* Skeleton Projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((n) => (
              <div key={n} className="glass-card p-6 border border-border h-40 shimmer" />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="glass-card p-8 text-center border border-danger/10 bg-danger-light/20">
          <div className="text-danger text-3xl mb-3">⚠️</div>
          <h3 className="text-lg font-semibold text-text-primary">Failed to load dashboard</h3>
          <p className="text-sm text-text-secondary mt-1">{error}</p>
        </div>
      ) : totalProjects === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-12 text-center border border-border/80 max-w-lg mx-auto space-y-6"
        >
          <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center border border-primary/20 mx-auto">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-text-primary">Welcome to GrowthPilot</h3>
            <p className="text-sm text-text-secondary max-w-sm mx-auto leading-relaxed">
              Generate detailed customer avatars, campaign copy, and a day-by-day 30-day marketing roadmap for your small business.
            </p>
          </div>
          <Link href="/projects/new" className="inline-block">
            <Button variant="primary" className="flex items-center gap-1.5 shadow-md shadow-primary/10">
              Create Your First Project
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      ) : (
        /* Dashboard Content */
        <div className="space-y-8">
          {/* Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Stat 1 */}
            <div className="glass-card p-6 border border-border bg-white flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider block">
                  Total Projects
                </span>
                <span className="text-2xl font-bold text-text-primary mt-1 block">
                  {totalProjects}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary">
                <FolderOpen className="h-5 w-5" />
              </div>
            </div>

            {/* Stat 2 */}
            <div className="glass-card p-6 border border-border bg-white flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider block">
                  Active Roadmaps
                </span>
                <span className="text-2xl font-bold text-text-primary mt-1 block">
                  {activeRoadmaps}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center text-accent">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>

            {/* Stat 3 */}
            <div className="glass-card p-6 border border-border bg-white flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider block">
                  Managed Budget
                </span>
                <span className="text-2xl font-bold text-text-primary mt-1 block">
                  ${totalBudget.toLocaleString()}
                  <span className="text-xs text-text-tertiary font-medium">/mo</span>
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Projects list */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg font-bold text-text-primary">
                Active Projects
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.slice(0, 4).map((project) => (
                  <div
                    key={project.id}
                    className="glass-card p-5 border border-border bg-white flex flex-col justify-between hover:shadow-md transition-all duration-200"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <span className="font-semibold text-text-primary text-[15px] truncate block flex-1">
                          {project.name}
                        </span>
                        {getStatusBadge(project.status)}
                      </div>
                      <span className="text-xs text-text-secondary block">
                        {project.profile ? getIndustryLabel(project.profile.industry) : "N/A"}
                      </span>
                    </div>

                    <div className="mt-6 pt-3 border-t border-border/50 flex items-center justify-between">
                      <span className="text-[10px] text-text-tertiary font-mono">
                        Budget: ${project.profile?.monthlyBudget.toLocaleString()}/mo
                      </span>
                      <Link href={`/projects/${project.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs font-semibold text-primary py-1 px-2.5 hover:bg-primary-light hover:text-primary transition-colors cursor-pointer"
                        >
                          Workspace →
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {totalProjects > 4 && (
                <div className="text-center pt-2">
                  <Link href="/projects" className="text-sm font-semibold text-primary hover:underline">
                    View all {totalProjects} projects →
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Tips / Knowledge Base Sidebar */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-text-primary">
                Marketing Intelligence
              </h2>

              <div className="glass-card p-5 border border-border bg-slate-50/20 space-y-4 text-xs leading-relaxed text-text-secondary">
                <div className="flex gap-2.5">
                  <Lightbulb className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-text-primary text-xs">Test and Iterate</h4>
                    <p className="mt-1">
                      Always run social copy variations for 3-5 days before choosing a primary format. Small shifts in headline hooks yield 30%+ CTA lifts.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-3 border-t border-border/50">
                  <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-text-primary text-xs">Verify your SEO</h4>
                    <p className="mt-1">
                      Check your Google Business listing details weekly. Replying to positive reviews builds local authority and improves ranking positions.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-3 border-t border-border/50">
                  <Sparkles className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-text-primary text-xs">Leverage visual prompts</h4>
                    <p className="mt-1">
                      Copy visual prompts directly from the Campaign Copy view into DALL-E to generate premium visual assets corresponding perfectly to the text hooks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
