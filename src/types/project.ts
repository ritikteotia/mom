// ─── Project TypeScript Interfaces ──────────────────────────────

import type { ProjectStatus } from "@prisma/client";

export interface ProjectSummary {
  id: string;
  name: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  hasProfile: boolean;
  hasRoadmap: boolean;
  campaignCount: number;
}

export interface ProjectDetail {
  id: string;
  name: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  profile: ProjectProfile | null;
  roadmapStatus: string | null;
}

export interface ProjectProfile {
  businessName: string;
  industry: string;
  description: string;
  monthlyBudget: number;
}

export interface CreateProjectInput {
  name: string;
}

export interface UpdateProjectInput {
  name?: string;
  status?: ProjectStatus;
}
