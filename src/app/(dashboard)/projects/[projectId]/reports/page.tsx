"use client";

import React, { useState, useEffect, use } from "react";
import {
  BarChart3,
  TrendingUp,
  Target,
  DollarSign,
  PieChart,
  Users,
  Compass,
  Download,
  Loader2,
  AlertCircle,
  HelpCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getIndustryLabel } from "@/constants/industries";
import { getGoalLabel } from "@/constants/goals";
import { getChannelLabel } from "@/constants/channels";

interface Project {
  id: string;
  name: string;
  profile?: {
    industry: string;
    description: string;
    monthlyBudget: number;
    goals: string[];
    currentChannels: string[];
  };
}

interface PageProps {
  params: Promise<{ projectId: string }>;
}

export default function ReportsPage({ params }: PageProps) {
  const { projectId } = use(params);

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProject() {
      try {
        const res = await fetch(`/api/projects`);
        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.error || "Failed to load project details");
        }

        const currentProject = json.data.find((p: { id: string }) => p.id === projectId);
        if (!currentProject) {
          throw new Error("Project not found");
        }

        setProject(currentProject);
      } catch (err: unknown) {
        console.error(err);
        setError((err instanceof Error ? err.message : String(err)) || "Failed to load reports workspace");
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-text-secondary">Loading reports workspace...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-danger mx-auto" />
        <h3 className="text-lg font-semibold text-text-primary">Something went wrong</h3>
        <p className="text-sm text-text-secondary">{error || "Project not found"}</p>
      </div>
    );
  }

  const budget = project.profile?.monthlyBudget || 1000;
  const goals = project.profile?.goals || [];
  const channels = project.profile?.currentChannels || [];

  // Generate budget allocations dynamically
  const channelCount = channels.length || 1;
  const budgetPerChannel = budget / channelCount;

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8 text-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <BarChart3 className="h-7 w-7 text-primary" />
            Performance Reports
          </h1>
          <p className="mt-1.5 text-sm text-text-secondary">
            AI-modeled ROI and channels allocation reports for <strong className="text-text-primary">{project.name}</strong>.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => window.print()}
          className="flex items-center gap-1.5 text-xs font-semibold py-2 h-10 border-border"
        >
          <Download className="h-4 w-4" />
          Export PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Allocation Report */}
        <div className="glass-card p-6 border border-border bg-white lg:col-span-2 space-y-6">
          <div>
            <h3 className="font-bold text-text-primary text-base flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Budget Allocation Report
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              Estimated distribution of your monthly budget of <strong>${budget.toLocaleString()}</strong> across selected channels.
            </p>
          </div>

          <div className="space-y-4">
            {channels.length > 0 ? (
              channels.map((chan) => (
                <div key={chan} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-text-primary capitalize">
                      {getChannelLabel(chan)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-text-secondary">
                        {Math.round((1 / channels.length) * 100)}%
                      </span>
                      <span className="font-bold text-text-primary">
                        ${Math.round(budgetPerChannel).toLocaleString()}/mo
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full bg-gradient-to-r from-primary to-accent"
                      style={{ width: `${(1 / channels.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-text-tertiary italic">No channels selected.</p>
            )}
          </div>
        </div>

        {/* Expected Outcomes Card */}
        <div className="glass-card p-6 border border-border bg-slate-50/50 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-text-primary text-base flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              Projected Metrics (30d)
            </h3>
            <p className="text-xs text-text-secondary">
              Estimated milestones based on industry conversion standards.
            </p>

            <div className="space-y-4 pt-2">
              {goals.map((goal, idx) => {
                let label = "";
                let target = "";
                if (goal === "brand_awareness") {
                  label = "Organic Reach";
                  target = "+25% increase";
                } else if (goal === "lead_generation") {
                  label = "New Leads Captured";
                  target = "50 - 150 leads";
                } else if (goal === "sales_revenue") {
                  label = "Gross Sales Boost";
                  target = "+10% - 15%";
                } else if (goal === "website_traffic") {
                  label = "Unique Site Visits";
                  target = "+1,500 visitors";
                } else {
                  label = getGoalLabel(goal);
                  target = "Est. +20% Lift";
                }

                return (
                  <div key={goal} className="flex items-center justify-between border-b border-border/50 pb-2.5">
                    <div>
                      <span className="text-xs text-text-tertiary block font-medium">Goal Metric {idx + 1}</span>
                      <span className="font-semibold text-text-primary">{label}</span>
                    </div>
                    <span className="text-xs font-bold text-success-foreground bg-success-light px-2.5 py-1 rounded-lg border border-success/10">
                      {target}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Performance & Industry Analysis Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Industry Benchmarks */}
        <div className="glass-card p-6 border border-border bg-white space-y-4">
          <div>
            <h3 className="font-bold text-text-primary text-base flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              Industry Benchmarks ({getIndustryLabel(project.profile?.industry || "")})
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              Average engagement rates in your business category.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 text-center">
            <div className="bg-slate-50 p-4 border border-border/50 rounded-xl">
              <span className="text-xs text-text-tertiary block font-medium">Avg Social Click-Through (CTR)</span>
              <span className="text-xl font-bold text-text-primary mt-1 block">2.4% - 3.8%</span>
            </div>
            <div className="bg-slate-50 p-4 border border-border/50 rounded-xl">
              <span className="text-xs text-text-tertiary block font-medium">Avg Email Open Rate</span>
              <span className="text-xl font-bold text-text-primary mt-1 block">18.5% - 24.1%</span>
            </div>
            <div className="bg-slate-50 p-4 border border-border/50 rounded-xl">
              <span className="text-xs text-text-tertiary block font-medium">Avg Lead Form Conv.</span>
              <span className="text-xl font-bold text-text-primary mt-1 block">4.2% - 6.7%</span>
            </div>
            <div className="bg-slate-50 p-4 border border-border/50 rounded-xl">
              <span className="text-xs text-text-tertiary block font-medium">Customer Acquisition (CAC)</span>
              <span className="text-xl font-bold text-text-primary mt-1 block">Low to Moderate</span>
            </div>
          </div>
        </div>

        {/* Marketing Recommendations Checklist */}
        <div className="glass-card p-6 border border-border bg-white space-y-4">
          <div>
            <h3 className="font-bold text-text-primary text-base flex items-center gap-2">
              <Compass className="h-5 w-5 text-primary" />
              Strategic Growth Recommendations
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              Core priorities for maximize budget efficiency.
            </p>
          </div>

          <div className="space-y-3 pt-1 text-xs">
            <div className="flex gap-2">
              <CheckCircle className="h-4.5 w-4.5 text-success flex-shrink-0 mt-0.5" />
              <p className="text-text-secondary">
                <strong className="text-text-primary">Establish profile keywords:</strong> Fully optimize search listings (GMB, Instagram bio description) prior to driving search traffic.
              </p>
            </div>
            <div className="flex gap-2">
              <CheckCircle className="h-4.5 w-4.5 text-success flex-shrink-0 mt-0.5" />
              <p className="text-text-secondary">
                <strong className="text-text-primary">Prioritize organic engagement:</strong> Direct 20% of your weekly marketing hours to engaging with other local business profiles.
              </p>
            </div>
            <div className="flex gap-2">
              <CheckCircle className="h-4.5 w-4.5 text-success flex-shrink-0 mt-0.5" />
              <p className="text-text-secondary">
                <strong className="text-text-primary">Utilize visual content prompts:</strong> Capture photos matching the prompt details in the campaign library for reels.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
