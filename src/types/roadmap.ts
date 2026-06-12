// ─── Roadmap TypeScript Interfaces ───────────────────────────────
// Strict types for all JSON columns in the Roadmap model.

export interface TargetAudienceDemographics {
  ageRange: string;
  gender: string;
  location: string;
  incomeLevel: string;
}

export interface TargetAudiencePsychographics {
  interests: string[];
  values: string[];
  lifestyle: string;
}

export interface TargetAudienceAnalysis {
  demographics: TargetAudienceDemographics;
  psychographics: TargetAudiencePsychographics;
  painPoints: string[];
  buyingMotivations: string[];
}

export type TaskType = "content" | "engagement" | "analysis" | "setup" | "optimization";
export type Priority = "high" | "medium" | "low";

export interface RoadmapDay {
  day: number;
  title: string;
  channel: string;
  taskType: TaskType;
  description: string;
  deliverables: string[];
  estimatedTime: string;
  priority: Priority;
}

export interface RoadmapWeek {
  week: number;
  theme: string;
  objective: string;
  days: RoadmapDay[];
  kpis: string[];
}

export interface RoadmapPlan {
  weeks: RoadmapWeek[];
  totalEstimatedBudget: number;
  expectedOutcomes: string[];
}

export interface RoadmapData {
  overview: string;
  targetAudience: TargetAudienceAnalysis;
  usps: string[];
  plan: RoadmapPlan;
}
