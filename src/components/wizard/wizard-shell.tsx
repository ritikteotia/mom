"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useWizardState } from "@/hooks/use-wizard-state";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StepBusinessInfo } from "./step-business-info";
import { StepGoals } from "./step-goals";
import { StepBudget } from "./step-budget";
import { StepVoice } from "./step-voice";
import { StepReview } from "./step-review";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, Rocket } from "lucide-react";

const TOTAL_STEPS = 5;

const STEP_TITLES = [
  "Business Details",
  "Marketing Goals",
  "Budget & Channels",
  "Brand Identity",
  "Review & Create",
];

export function WizardShell() {
  const router = useRouter();
  const {
    formData,
    currentStep,
    setCurrentStep,
    updateField,
    updateSocialLink,
    clearDraft,
    isLoaded,
  } = useWizardState();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  if (!isLoaded) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-text-secondary">Loading your workspace draft...</p>
      </div>
    );
  }

  // Validate the current step before advancing
  const validateStep = (step: number, updateState: boolean = true): boolean => {
    const stepErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.businessName.trim()) {
        stepErrors.businessName = "Business name is required";
      }
      if (!formData.industry) {
        stepErrors.industry = "Please select your industry";
      }
      if (!formData.description.trim()) {
        stepErrors.description = "Business description is required";
      } else if (formData.description.trim().length < 10) {
        stepErrors.description = "Please write a bit more (minimum 10 characters)";
      }
      if (formData.website.trim() && !/^https?:\/\/[^\s$.?#].[^\s]*$/i.test(formData.website)) {
        stepErrors.website = "Please enter a valid URL (e.g. https://example.com)";
      }
    } else if (step === 2) {
      if (formData.goals.length === 0) {
        stepErrors.goals = "Please select at least one marketing goal";
      }
    }

    if (updateState) {
      setErrors(stepErrors);
    }
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    setSubmitMessage("Creating your project space...");

    try {
      // Step 1: Create the Project and Profile
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to create project");
      }

      const createdProject = result.data;
      
      setSubmitMessage("Setting up workspace databases...");
      // Add a slight artificial delay for a premium feel & database updates
      await new Promise((resolve) => setTimeout(resolve, 800));

      setSubmitMessage("Redirecting to dashboard...");
      clearDraft();
      
      router.push(`/projects/${createdProject.id}`);
      router.refresh();
    } catch (e: unknown) {
      console.error("Submit error:", e);
      setErrors({ submit: (e instanceof Error ? e.message : String(e)) || "An unexpected error occurred while saving." });
      setIsSubmitting(false);
    }
  };

  const progressPercentage = ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100;

  return (
    <div className="relative">
      {/* ── Submitting State Modal ── */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="max-w-md space-y-6"
            >
              <div className="relative flex justify-center">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl w-16 h-16 mx-auto animate-pulse" />
                <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center border border-primary/20">
                  <Rocket className="h-8 w-8 text-primary animate-bounce" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-text-primary">
                  Building Your Marketing Space
                </h3>
                <p className="text-sm text-text-secondary animate-pulse">
                  {submitMessage}
                </p>
              </div>

              <div className="w-48 mx-auto h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-progress-bar rounded-full w-2/3" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-text-primary uppercase tracking-wider">
            <span>
              Step {currentStep} of {TOTAL_STEPS}: {STEP_TITLES[currentStep - 1]}
            </span>
            <span className="font-mono text-[10px] text-text-tertiary">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>

          <Progress value={progressPercentage} className="h-1.5" />

          {/* Step circles */}
          <div className="hidden sm:flex justify-between items-center pt-2">
            {STEP_TITLES.map((title, idx) => {
              const stepNum = idx + 1;
              const isPassed = currentStep > stepNum;
              const isActive = currentStep === stepNum;

              return (
                <div key={title} className="flex flex-col items-center space-y-1">
                  <button
                    disabled={isSubmitting || stepNum > currentStep && !validateStep(currentStep, false)}
                    onClick={() => {
                      // Allow backing to any step, but only advancing if active is validated
                      if (stepNum < currentStep) {
                        setCurrentStep(stepNum);
                      } else if (stepNum > currentStep && validateStep(currentStep)) {
                        // Only let jump if valid
                        let canJump = true;
                        for (let s = currentStep; s < stepNum; s++) {
                          if (!validateStep(s)) {
                            canJump = false;
                            break;
                          }
                        }
                        if (canJump) setCurrentStep(stepNum);
                      }
                    }}
                    className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center border transition-all cursor-pointer ${
                      isPassed
                        ? "bg-primary border-primary text-white"
                        : isActive
                        ? "bg-white border-primary text-primary ring-2 ring-primary-light"
                        : "bg-white border-border text-text-tertiary hover:border-border-hover hover:text-text-secondary"
                    }`}
                  >
                    {stepNum}
                  </button>
                  <span
                    className={`text-[10px] font-medium hidden md:inline-block ${
                      isActive ? "text-primary font-semibold" : "text-text-tertiary"
                    }`}
                  >
                    {title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wizard Form Shell */}
        <div className="glass-card p-6 sm:p-10 border border-border/80 bg-white shadow-xl shadow-slate-100/50 min-h-[400px] flex flex-col">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {currentStep === 1 && (
                  <StepBusinessInfo
                    data={formData}
                    updateField={updateField}
                    updateSocialLink={updateSocialLink}
                    errors={errors}
                  />
                )}
                {currentStep === 2 && (
                  <StepGoals
                    data={formData}
                    updateField={updateField}
                    errors={errors}
                  />
                )}
                {currentStep === 3 && (
                  <StepBudget
                    data={formData}
                    updateField={updateField}
                    errors={errors}
                  />
                )}
                {currentStep === 4 && (
                  <StepVoice
                    data={formData}
                    updateField={updateField}
                    errors={errors}
                  />
                )}
                {currentStep === 5 && (
                  <StepReview data={formData} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {errors.submit && (
            <div className="mt-6 p-4 rounded-lg bg-danger-light border border-danger/20 text-sm text-danger-foreground">
              {errors.submit}
            </div>
          )}

          {/* Stepper Buttons */}
          <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1 || isSubmitting}
              className={`flex items-center gap-1.5 ${
                currentStep === 1 ? "opacity-0 pointer-events-none" : ""
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            {currentStep < TOTAL_STEPS ? (
              <Button
                type="button"
                variant="primary"
                onClick={handleNext}
                disabled={isSubmitting}
                className="flex items-center gap-1.5"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                className="flex items-center gap-1.5 shadow-lg shadow-primary/25"
              >
                Submit & Create Project
                <Rocket className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
