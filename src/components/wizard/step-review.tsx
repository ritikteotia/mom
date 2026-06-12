"use client";

import React from "react";
import { BusinessProfileFormData } from "@/types/profile";
import { getIndustryLabel } from "@/constants/industries";
import { getGoalLabel } from "@/constants/goals";
import { getChannelLabel } from "@/constants/channels";
import { ShieldCheck, Calendar, HelpCircle } from "lucide-react";

interface StepReviewProps {
  data: BusinessProfileFormData;
}

export function StepReview({ data }: StepReviewProps) {
  const activeCompetitors = data.competitors.filter((c) => c.trim() !== "");

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          Review your marketing profile
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Review your entries before saving. You can edit these details at any time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Business Information Card */}
        <div className="glass-card p-5 border border-border space-y-4">
          <div className="border-b border-border/50 pb-2">
            <h3 className="font-semibold text-text-primary text-[15px]">
              🏢 Business Info
            </h3>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-xs text-text-tertiary block font-medium">
                Business Name
              </span>
              <span className="text-text-primary font-medium">
                {data.businessName || "Not specified"}
              </span>
            </div>
            <div>
              <span className="text-xs text-text-tertiary block font-medium">
                Industry
              </span>
              <span className="text-text-primary font-medium">
                {data.industry ? getIndustryLabel(data.industry) : "Not specified"}
              </span>
            </div>
            <div>
              <span className="text-xs text-text-tertiary block font-medium">
                Website
              </span>
              <span className="text-text-primary font-mono truncate block">
                {data.website || "None"}
              </span>
            </div>
            <div>
              <span className="text-xs text-text-tertiary block font-medium">
                Description
              </span>
              <p className="text-text-secondary text-xs leading-relaxed line-clamp-3">
                {data.description || "No description provided."}
              </p>
            </div>
          </div>
        </div>

        {/* Goals & Channels Card */}
        <div className="glass-card p-5 border border-border space-y-4">
          <div className="border-b border-border/50 pb-2">
            <h3 className="font-semibold text-text-primary text-[15px]">
              🎯 Goals & Budget
            </h3>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-xs text-text-tertiary block font-medium">
                Monthly Budget
              </span>
              <span className="text-text-primary font-semibold">
                ${data.monthlyBudget.toLocaleString()} / month
              </span>
            </div>
            <div>
              <span className="text-xs text-text-tertiary block font-medium mb-1">
                Selected Goals
              </span>
              {data.goals.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {data.goals.map((g) => (
                    <span
                      key={g}
                      className="inline-flex items-center px-2 py-1 rounded bg-primary-light text-primary text-[11px] font-medium border border-primary/10"
                    >
                      {getGoalLabel(g)}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-text-tertiary italic text-xs">
                  No goals selected
                </span>
              )}
            </div>
            <div>
              <span className="text-xs text-text-tertiary block font-medium mb-1">
                Channels
              </span>
              {data.currentChannels.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {data.currentChannels.map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center px-2 py-1 rounded bg-secondary-light text-text-primary text-[11px] font-medium border border-border"
                    >
                      {getChannelLabel(c)}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-text-tertiary italic text-xs">
                  No channels specified
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Brand Voice & Competitors Card */}
        <div className="glass-card p-5 border border-border md:col-span-2 space-y-4">
          <div className="border-b border-border/50 pb-2">
            <h3 className="font-semibold text-text-primary text-[15px]">
              ✨ Brand Voice & Competitors
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-xs text-text-tertiary block font-medium">
                Brand Voice & Tone
              </span>
              <p className="text-text-secondary mt-1 text-xs leading-relaxed">
                {data.brandVoice || "Friendly & warm tone (default)"}
              </p>
            </div>
            <div>
              <span className="text-xs text-text-tertiary block font-medium mb-1">
                Competitors
              </span>
              {activeCompetitors.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 text-xs text-text-secondary">
                  {activeCompetitors.map((comp, i) => (
                    <li key={i}>{comp}</li>
                  ))}
                </ul>
              ) : (
                <span className="text-text-tertiary italic text-xs">
                  No competitors listed
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 border border-border flex gap-3">
        <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium text-text-primary text-xs sm:text-sm">
            What happens next?
          </h4>
          <p className="text-text-secondary text-xs mt-1 leading-relaxed">
            Clicking submit will create your marketing project. Afterwards, you will be
            redirected to the dashboard where the AI engine will construct a personalized
            30-day roadmap tailored directly to these details.
          </p>
        </div>
      </div>
    </div>
  );
}
