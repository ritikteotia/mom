"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Folder, ArrowRight, Loader2 } from "lucide-react";
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
  };
}

export default function ProjectsPage() {
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
        console.error("Projects loading error:", err);
        setError(err.message || "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const getStatusBadge = (status: Project["status"]) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-light text-success-foreground border border-success/10">
            Active
          </span>
        );
      case "GENERATING":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light text-primary border border-primary/10 animate-pulse">
            Generating
          </span>
        );
      case "DRAFT":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-light text-text-secondary border border-border">
            Draft
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            Projects
          </h1>
          <p className="mt-1.5 text-sm text-text-secondary">
            Manage your marketing campaigns and AI roadmaps.
          </p>
        </div>

        <Link href="/projects/new">
          <Button variant="primary" className="flex items-center gap-1.5 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Create Project
          </Button>
        </Link>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="glass-card p-6 border border-border/80 h-48 flex flex-col justify-between shimmer"
            >
              <div className="space-y-3">
                <div className="h-4 bg-border/40 rounded w-2/3" />
                <div className="h-3 bg-border/40 rounded w-1/2" />
              </div>
              <div className="h-8 bg-border/40 rounded w-1/3 mt-6" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="glass-card p-8 text-center border border-danger/10 bg-danger-light/20">
          <div className="text-danger text-3xl mb-3">⚠️</div>
          <h3 className="text-lg font-semibold text-text-primary">Failed to load projects</h3>
          <p className="text-sm text-text-secondary mt-1">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      ) : projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-12 text-center border border-border/80 max-w-md mx-auto"
        >
          <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center border border-primary/20 mx-auto mb-4">
            <Folder className="h-7 w-7 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-text-primary">No projects yet</h3>
          <p className="mt-2 text-sm text-text-secondary max-w-sm mx-auto leading-relaxed">
            Outline your business, goals, and budget to generate a custom 30-day AI marketing roadmap.
          </p>
          <Link href="/projects/new" className="inline-block mt-6">
            <Button variant="primary" className="flex items-center gap-1.5 shadow-md shadow-primary/10">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card p-6 border border-border bg-white flex flex-col justify-between hover:shadow-xl hover:border-border-hover transition-all duration-200"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold text-text-primary text-[17px] tracking-tight truncate flex-1">
                    {project.name}
                  </h3>
                  {getStatusBadge(project.status)}
                </div>

                <div className="space-y-2 text-xs text-text-secondary">
                  <div className="flex justify-between">
                    <span className="text-text-tertiary font-medium">Industry</span>
                    <span className="font-medium text-text-primary">
                      {project.profile ? getIndustryLabel(project.profile.industry) : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-tertiary font-medium">Monthly Budget</span>
                    <span className="font-semibold text-text-primary">
                      {project.profile ? `$${project.profile.monthlyBudget.toLocaleString()}` : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/50 flex justify-end">
                <Link href={`/projects/${project.id}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="group flex items-center gap-1 text-xs font-semibold py-1.5 px-3 rounded-lg text-primary hover:bg-primary-light hover:text-primary transition-colors cursor-pointer"
                  >
                    Open Workspace
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
