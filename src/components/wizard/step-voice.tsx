"use client";

import React from "react";
import { BusinessProfileFormData } from "@/types/profile";
import { MessageSquare, Plus, Trash2, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepVoiceProps {
  data: BusinessProfileFormData;
  updateField: <K extends keyof BusinessProfileFormData>(
    field: K,
    value: BusinessProfileFormData[K]
  ) => void;
  errors: Record<string, string>;
}

const TONE_PRESETS = [
  { label: "Professional & Trustworthy", value: "professional_trustworthy", description: "Corporate, reliable, authoritative" },
  { label: "Friendly & Warm", value: "friendly_warm", description: "Approachable, empathetic, conversational" },
  { label: "Bold & Creative", value: "bold_creative", description: "Innovative, stands out, non-traditional" },
  { label: "Premium & Elegant", value: "premium_elegant", description: "High-end, sophisticated, minimal" },
  { label: "Playful & Humorous", value: "playful_humorous", description: "Witty, fun, high energy" },
];

export function StepVoice({ data, updateField, errors }: StepVoiceProps) {
  const handleCompetitorChange = (index: number, value: string) => {
    const newCompetitors = [...data.competitors];
    newCompetitors[index] = value;
    updateField("competitors", newCompetitors);
  };

  const addCompetitor = () => {
    updateField("competitors", [...data.competitors, ""]);
  };

  const removeCompetitor = (index: number) => {
    const newCompetitors = [...data.competitors];
    newCompetitors.splice(index, 1);
    // Keep at least one entry
    if (newCompetitors.length === 0) {
      newCompetitors.push("");
    }
    updateField("competitors", newCompetitors);
  };

  const handleToneSelect = (presetLabel: string) => {
    // Append or set the brand voice
    const currentVoice = data.brandVoice;
    if (currentVoice.includes(presetLabel)) {
      // Remove it
      updateField(
        "brandVoice",
        currentVoice.replace(presetLabel, "").trim().replace(/^,\s*|,\s*$/g, "")
      );
    } else {
      // Add it
      const separator = currentVoice ? ", " : "";
      updateField("brandVoice", `${currentVoice}${separator}${presetLabel}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Brand Voice / Tone */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Define your brand voice
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Choose your communication style. This controls the tone of the AI-generated copywriting.
          </p>
        </div>

        {/* Tone Presets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TONE_PRESETS.map((preset) => {
            const isSelected = data.brandVoice.includes(preset.label);
            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => handleToneSelect(preset.label)}
                className={`flex flex-col p-4 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary-light/40 shadow-sm"
                    : "border-border bg-surface hover:border-border-hover"
                }`}
              >
                <span className="font-semibold text-text-primary text-sm">
                  {preset.label}
                </span>
                <span className="text-xs text-text-secondary mt-1">
                  {preset.description}
                </span>
              </button>
            );
          })}
        </div>

        {/* Brand Voice Freeform */}
        <div>
          <label
            htmlFor="brandVoice"
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            Custom Brand Voice details (Optional)
          </label>
          <textarea
            id="brandVoice"
            value={data.brandVoice}
            onChange={(e) => updateField("brandVoice", e.target.value)}
            rows={3}
            className="w-full p-4 bg-white border border-border rounded-lg focus-visible:outline-2 focus-visible:outline-primary placeholder:text-text-tertiary text-sm resize-none"
            placeholder="e.g. Energetic but professional, use simple language, avoid industry buzzwords. Focus on the organic and local aspect of our coffee."
          />
          {errors.brandVoice && (
            <p className="text-xs text-danger mt-1">{errors.brandVoice}</p>
          )}
        </div>
      </div>

      <hr className="border-border" />

      {/* Competitors Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
            Who are your main competitors?
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Specify their names or website URLs. The AI will inspect standard marketing tactics for their sectors.
          </p>
        </div>

        <div className="space-y-3">
          {data.competitors.map((competitor, index) => (
            <div key={index} className="flex gap-2 items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={competitor}
                  onChange={(e) => handleCompetitorChange(index, e.target.value)}
                  className="w-full px-4 h-11 bg-white border border-border rounded-lg focus-visible:outline-2 focus-visible:outline-primary placeholder:text-text-tertiary text-sm"
                  placeholder={`Competitor ${index + 1} Name or URL (e.g. Starbucks or www.competitor.com)`}
                />
              </div>

              {data.competitors.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCompetitor(index)}
                  className="h-11 w-11 rounded-lg border border-border text-text-secondary hover:text-danger hover:border-danger/30 hover:bg-danger-light flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addCompetitor}
            className="flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Another Competitor
          </Button>
        </div>
      </div>
    </div>
  );
}
