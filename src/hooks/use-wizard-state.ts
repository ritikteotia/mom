"use client";

import { useState, useEffect } from "react";
import { BusinessProfileFormData } from "@/types/profile";

const LOCAL_STORAGE_KEY = "mom_wizard_draft";

const INITIAL_DATA: BusinessProfileFormData = {
  businessName: "",
  industry: "",
  description: "",
  website: "",
  socialLinks: {
    instagram: "",
    twitter: "",
    linkedin: "",
    facebook: "",
    tiktok: "",
    youtube: "",
  },
  targetAudience: "",
  goals: [],
  monthlyBudget: 1000,
  currentChannels: [],
  brandVoice: "",
  competitors: [""], // start with one empty entry
};

export function useWizardState() {
  const [formData, setFormData] = useState<BusinessProfileFormData>(INITIAL_DATA);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure structure matches
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({
          ...INITIAL_DATA,
          ...parsed,
          socialLinks: {
            ...INITIAL_DATA.socialLinks,
            ...(parsed.socialLinks || {}),
          },
        });
      }
    } catch (e) {
      console.error("Failed to load wizard draft", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to local storage when data changes
  useEffect(() => {
    if (!isLoaded) return;

    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
      } catch (e) {
        console.error("Failed to save wizard draft", e);
      }
    }, 1000); // debounce 1 second

    return () => clearTimeout(timeoutId);
  }, [formData, isLoaded]);

  const updateField = <K extends keyof BusinessProfileFormData>(
    field: K,
    value: BusinessProfileFormData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateSocialLink = (platform: keyof BusinessProfileFormData["socialLinks"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  const clearDraft = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setFormData(INITIAL_DATA);
    setCurrentStep(1);
  };

  return {
    formData,
    currentStep,
    setCurrentStep,
    updateField,
    updateSocialLink,
    clearDraft,
    isLoaded,
  };
}
