"use client";

import React from "react";
import { BusinessProfileFormData } from "@/types/profile";
import { CHANNELS } from "@/constants/channels";
import { DollarSign, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface StepBudgetProps {
  data: BusinessProfileFormData;
  updateField: <K extends keyof BusinessProfileFormData>(
    field: K,
    value: BusinessProfileFormData[K]
  ) => void;
  errors: Record<string, string>;
}

export function StepBudget({ data, updateField, errors }: StepBudgetProps) {
  const toggleChannel = (value: string) => {
    const currentChannels = [...data.currentChannels];
    const index = currentChannels.indexOf(value);

    if (index > -1) {
      currentChannels.splice(index, 1);
    } else {
      currentChannels.push(value);
    }

    updateField("currentChannels", currentChannels);
  };

  const formatCurrency = (val: number) => {
    if (val >= 1000) {
      return `$${(val / 1000).toFixed(0)}k`;
    }
    return `$${val}`;
  };

  return (
    <div className="space-y-8">
      {/* Budget Slider Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            What is your monthly marketing budget?
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            We will customize campaign recommendations based on your spend range.
          </p>
        </div>

        <div className="glass-card p-6 border border-border bg-slate-50/50 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-secondary">
              Estimated Monthly Budget
            </span>
            <div className="flex items-baseline gap-1 bg-white px-4 py-2 rounded-lg border border-border shadow-sm">
              <span className="text-lg font-bold text-text-primary">
                ${data.monthlyBudget.toLocaleString()}
              </span>
              <span className="text-xs text-text-tertiary">/mo</span>
            </div>
          </div>

          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="50000"
              step="500"
              value={data.monthlyBudget}
              onChange={(e) => updateField("monthlyBudget", Number(e.target.value))}
              className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary focus-visible:outline-none"
            />
            <div className="flex justify-between text-xs text-text-tertiary px-1 font-mono">
              <span>$0</span>
              <span>$10k</span>
              <span>$20k</span>
              <span>$30k</span>
              <span>$40k</span>
              <span>$50k+</span>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-2 pt-2">
            {[500, 1000, 2500, 5000, 10000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => updateField("monthlyBudget", preset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  data.monthlyBudget === preset
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-text-secondary border-border hover:bg-surface-hover"
                }`}
              >
                {formatCurrency(preset)}
              </button>
            ))}
          </div>
        </div>
        {errors.monthlyBudget && (
          <p className="text-xs text-danger mt-1">{errors.monthlyBudget}</p>
        )}
      </div>

      <hr className="border-border" />

      {/* Channels Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">
            Which channels do you currently use?
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Select the channels where you already have a presence or want to start.
          </p>
        </div>

        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {CHANNELS.map((channel) => {
              const isSelected = data.currentChannels.includes(channel.value);

              return (
                <motion.div
                  key={channel.value}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleChannel(channel.value)}
                  className={`relative flex items-center gap-3 p-4 rounded-xl border-2 text-left cursor-pointer transition-all duration-200 select-none ${
                    isSelected
                      ? "border-primary bg-primary-light/50"
                      : "border-border bg-surface hover:border-border-hover"
                  }`}
                >
                  <div className="text-2xl">{channel.icon}</div>
                  <div className="flex-1 pr-6">
                    <h3 className="font-semibold text-text-primary text-xs sm:text-sm">
                      {channel.label}
                    </h3>
                  </div>

                  <div className="absolute right-3">
                    {isSelected ? (
                      <CheckCircle2 className="h-4 w-4 text-primary fill-primary-light" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-border" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
          {errors.currentChannels && (
            <p className="text-xs text-danger mt-3">{errors.currentChannels}</p>
          )}
        </div>
      </div>
    </div>
  );
}
