// ─── Business Profile TypeScript Interfaces ─────────────────────

export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
}

export interface BusinessProfileFormData {
  businessName: string;
  industry: string;
  description: string;
  website: string;
  socialLinks: SocialLinks;
  targetAudience: string;
  goals: string[];
  monthlyBudget: number;
  currentChannels: string[];
  brandVoice: string;
  competitors: string[];
}

export interface UpsertBusinessProfileInput {
  projectId: string;
  data: BusinessProfileFormData;
}

/** Wizard step validation — each step validates a subset of fields */
export interface WizardStepValidation {
  step: number;
  isValid: boolean;
  errors: Record<string, string>;
}
