"use client";

import React from "react";
import { BusinessProfileFormData } from "@/types/profile";
import { GOALS } from "@/constants/goals";
import { Target, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface StepGoalsProps {
  data: BusinessProfileFormData;
  updateField: <K extends keyof BusinessProfileFormData>(
    field: K,
    value: BusinessProfileFormData[K]
  ) => void;
  errors: Record<string, string>;
}

export function StepGoals({ data, updateField, errors }: StepGoalsProps) {
  const toggleGoal = (value: string) => {
    const currentGoals = [...data.goals];
    const index = currentGoals.indexOf(value);

    if (index > -1) {
      currentGoals.splice(index, 1);
    } else {
      currentGoals.push(value);
    }

    updateField("goals", currentGoals);
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          What are your marketing goals?
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Select all that apply to guide the AI in generating target metrics and focuses.
        </p>
      </div>

      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {GOALS.map((goal) => {
            const isSelected = data.goals.includes(goal.value);

            return (
              <motion.div
                key={goal.value}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleGoal(goal.value)}
                className={`relative flex items-start gap-4 p-5 rounded-xl border-2 text-left cursor-pointer transition-all duration-200 select-none ${
                  isSelected
                    ? "border-primary bg-primary-light/50 shadow-sm"
                    : "border-border bg-surface hover:border-border-hover hover:bg-surface-hover"
                }`}
              >
                {/* Select state indicator */}
                <div className="absolute top-4 right-4">
                  {isSelected ? (
                    <CheckCircle2 className="h-5 w-5 text-primary fill-primary-light" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border border-border" />
                  )}
                </div>

                {/* Emoji Icon */}
                <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-xl shadow-sm border border-border/50">
                  {goal.icon}
                </div>

                <div className="pr-6">
                  <h3 className="font-semibold text-text-primary text-[15px]">
                    {goal.label}
                  </h3>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                    {goal.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
        {errors.goals && (
          <p className="text-xs text-danger mt-3 bg-danger-light p-2.5 rounded-lg border border-danger/10">
            {errors.goals}
          </p>
        )}
      </div>
    </div>
  );
}
