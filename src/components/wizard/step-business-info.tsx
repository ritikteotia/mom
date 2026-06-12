"use client";

import React from "react";
import { BusinessProfileFormData } from "@/types/profile";
import { INDUSTRIES } from "@/constants/industries";
import { Sparkles, Globe, Link2 } from "lucide-react";

interface StepBusinessInfoProps {
  data: BusinessProfileFormData;
  updateField: <K extends keyof BusinessProfileFormData>(
    field: K,
    value: BusinessProfileFormData[K]
  ) => void;
  updateSocialLink: (
    platform: keyof BusinessProfileFormData["socialLinks"],
    value: string
  ) => void;
  errors: Record<string, string>;
}

export function StepBusinessInfo({
  data,
  updateField,
  updateSocialLink,
  errors,
}: StepBusinessInfoProps) {
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Tell us about your business
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Provide basic details to help the AI understand your industry and offer.
        </p>
      </div>

      <div className="space-y-4">
        {/* Business Name */}
        <div>
          <label
            htmlFor="businessName"
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            Business Name <span className="text-danger">*</span>
          </label>
          <input
            id="businessName"
            type="text"
            value={data.businessName}
            onChange={(e) => updateField("businessName", e.target.value)}
            className="w-full px-4 h-11 bg-white border border-border rounded-lg focus-visible:outline-2 focus-visible:outline-primary placeholder:text-text-tertiary text-sm"
            placeholder="e.g. Cafe Reveria"
          />
          {errors.businessName && (
            <p className="text-xs text-danger mt-1">{errors.businessName}</p>
          )}
        </div>

        {/* Industry */}
        <div>
          <label
            htmlFor="industry"
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            Industry <span className="text-danger">*</span>
          </label>
          <select
            id="industry"
            value={data.industry}
            onChange={(e) => updateField("industry", e.target.value)}
            className="w-full px-4 h-11 bg-white border border-border rounded-lg focus-visible:outline-2 focus-visible:outline-primary text-sm cursor-pointer"
          >
            <option value="">Select your industry</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind.value} value={ind.value}>
                {ind.emoji} {ind.label}
              </option>
            ))}
          </select>
          {errors.industry && (
            <p className="text-xs text-danger mt-1">{errors.industry}</p>
          )}
        </div>

        {/* Business Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            Business Description <span className="text-danger">*</span>
          </label>
          <textarea
            id="description"
            value={data.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={4}
            className="w-full p-4 bg-white border border-border rounded-lg focus-visible:outline-2 focus-visible:outline-primary placeholder:text-text-tertiary text-sm resize-none"
            placeholder="What products or services do you sell? Who is your main customer? What makes you unique? (e.g. A local specialty coffee shop serving artisanal drinks and organic pastries, focused on creating a cozy community space for freelancers and locals.)"
          />
          {errors.description && (
            <p className="text-xs text-danger mt-1">{errors.description}</p>
          )}
        </div>

        {/* Website (Optional) */}
        <div>
          <label
            htmlFor="website"
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            Website (Optional)
          </label>
          <div className="relative">
            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
            <input
              id="website"
              type="text"
              value={data.website}
              onChange={(e) => updateField("website", e.target.value)}
              className="w-full pl-10 pr-4 h-11 bg-white border border-border rounded-lg focus-visible:outline-2 focus-visible:outline-primary placeholder:text-text-tertiary text-sm"
              placeholder="https://example.com"
            />
          </div>
          {errors.website && (
            <p className="text-xs text-danger mt-1">{errors.website}</p>
          )}
        </div>

        {/* Social Links (Optional) */}
        <div className="pt-2">
          <h3 className="text-sm font-medium text-text-primary mb-3 flex items-center gap-1.5">
            <Link2 className="h-4 w-4 text-text-secondary" />
            Social Profiles (Optional)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="block text-xs font-medium text-text-secondary mb-1">
                Instagram URL
              </span>
              <input
                type="text"
                value={data.socialLinks.instagram || ""}
                onChange={(e) => updateSocialLink("instagram", e.target.value)}
                className="w-full px-3 h-10 bg-white border border-border rounded-lg focus-visible:outline-2 focus-visible:outline-primary placeholder:text-text-tertiary text-xs"
                placeholder="https://instagram.com/handle"
              />
            </div>
            <div>
              <span className="block text-xs font-medium text-text-secondary mb-1">
                LinkedIn URL
              </span>
              <input
                type="text"
                value={data.socialLinks.linkedin || ""}
                onChange={(e) => updateSocialLink("linkedin", e.target.value)}
                className="w-full px-3 h-10 bg-white border border-border rounded-lg focus-visible:outline-2 focus-visible:outline-primary placeholder:text-text-tertiary text-xs"
                placeholder="https://linkedin.com/company/name"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
