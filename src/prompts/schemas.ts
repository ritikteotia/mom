import { z } from "zod";

// ─── Target Audience Demographics ───
export const targetAudienceDemographicsSchema = z.object({
  ageRange: z.string(),
  gender: z.string(),
  location: z.string(),
  incomeLevel: z.string(),
});

// ─── Target Audience Psychographics ───
export const targetAudiencePsychographicsSchema = z.object({
  interests: z.array(z.string()),
  values: z.array(z.string()),
  lifestyle: z.string(),
});

// ─── Target Audience Analysis ───
export const targetAudienceAnalysisSchema = z.object({
  demographics: targetAudienceDemographicsSchema,
  psychographics: targetAudiencePsychographicsSchema,
  painPoints: z.array(z.string()),
  buyingMotivations: z.array(z.string()),
});

// ─── Roadmap Day ───
export const roadmapDaySchema = z.object({
  day: z.number().int().min(1).max(30),
  title: z.string(),
  channel: z.string(),
  taskType: z.enum(["content", "engagement", "analysis", "setup", "optimization"]),
  description: z.string(),
  deliverables: z.array(z.string()),
  estimatedTime: z.string(),
  priority: z.enum(["high", "medium", "low"]),
});

// ─── Roadmap Week ───
export const roadmapWeekSchema = z.object({
  week: z.number().int().min(1).max(4),
  theme: z.string(),
  objective: z.string(),
  days: z.array(roadmapDaySchema),
  kpis: z.array(z.string()),
});

// ─── Roadmap Plan ───
export const roadmapPlanSchema = z.object({
  weeks: z.array(roadmapWeekSchema),
  totalEstimatedBudget: z.number(),
  expectedOutcomes: z.array(z.string()),
});

// ─── Full Roadmap Output Schema ───
export const roadmapDataSchema = z.object({
  overview: z.string(),
  targetAudience: targetAudienceAnalysisSchema,
  usps: z.array(z.string()),
  plan: roadmapPlanSchema,
});

// ─── Campaign Output Schema ───
export const campaignOutputSchema = z.object({
  title: z.string(),
  description: z.string(),
  headline: z.string(),
  body: z.string(),
  cta: z.string(),
  hashtags: z.array(z.string()).optional(),
  imagePrompt: z.string().optional(),
  subjectLine: z.string().optional(),
  previewText: z.string().optional(),
});
