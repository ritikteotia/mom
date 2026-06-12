// ─── Report TypeScript Interfaces ───────────────────────────────

import type { ReportType } from "@prisma/client";

export interface ReportSection {
  title: string;
  content: string;
  metrics?: ReportMetric[];
}

export interface ReportMetric {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
}

export interface ReportContent {
  summary: string;
  sections: ReportSection[];
  recommendations: string[];
  generatedAt: string;
}

export interface ReportSummary {
  id: string;
  title: string;
  type: ReportType;
  createdAt: string;
}

export interface ReportDetail {
  id: string;
  title: string;
  type: ReportType;
  content: ReportContent;
  createdAt: string;
}

export interface GenerateReportInput {
  projectId: string;
  type: ReportType;
}
