// ─── Campaign TypeScript Interfaces ─────────────────────────────

import type { CampaignStatus, CampaignType } from "@prisma/client";

export interface CampaignContent {
  headline: string;
  body: string;
  cta: string;
  hashtags?: string[];
  imagePrompt?: string;
  subjectLine?: string;
  previewText?: string;
}

export interface CampaignSummary {
  id: string;
  title: string;
  channel: string;
  type: CampaignType;
  status: CampaignStatus;
  scheduledDate: string | null;
  createdAt: string;
}

export interface CampaignDetail {
  id: string;
  title: string;
  channel: string;
  type: CampaignType;
  description: string;
  content: CampaignContent | null;
  scheduledDate: string | null;
  status: CampaignStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateCampaignInput {
  projectId: string;
  channel: string;
  type: CampaignType;
  briefDescription?: string;
}
