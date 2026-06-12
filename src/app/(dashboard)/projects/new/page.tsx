import { WizardShell } from "@/components/wizard/wizard-shell";

export default function NewProjectPage() {
  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
          Create New Project
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-text-secondary max-w-2xl">
          Build a comprehensive, AI-generated marketing roadmap for your business.
          Follow the steps below to outline your objectives and target profile.
        </p>
      </div>

      <WizardShell />
    </div>
  );
}
