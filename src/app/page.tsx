"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Target,
  Calendar,
  BarChart3,
  Zap,
  Shield,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: Target,
    title: "Audience Analysis",
    description:
      "AI identifies your ideal customers — demographics, psychographics, pain points, and buying motivations.",
  },
  {
    icon: Calendar,
    title: "30-Day Roadmap",
    description:
      "Get a day-by-day action plan with specific tasks, deliverables, and time estimates.",
  },
  {
    icon: Sparkles,
    title: "Campaign Ideas",
    description:
      "AI-generated social posts, email copy, and ad concepts ready for your channels.",
  },
  {
    icon: BarChart3,
    title: "KPI Tracking",
    description:
      "Clear success metrics for every week so you know exactly what to measure.",
  },
  {
    icon: Zap,
    title: "Instant Generation",
    description:
      "From business details to complete marketing plan in under 60 seconds.",
  },
  {
    icon: Shield,
    title: "Budget-Aware",
    description:
      "Every recommendation respects your actual budget — from $500 to $50,000/month.",
  },
];

interface Step {
  step: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    step: "01",
    title: "Tell Us About Your Business",
    description:
      "Answer a few questions about your industry, goals, target audience, and budget.",
  },
  {
    step: "02",
    title: "AI Analyzes Your Market",
    description:
      "Our AI engine builds a detailed profile of your ideal customer and competitive landscape.",
  },
  {
    step: "03",
    title: "Get Your 30-Day Roadmap",
    description:
      "Receive a complete marketing plan with daily tasks, campaign ideas, and KPIs.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">
              G
            </div>
            <span className="font-semibold text-text-primary text-[15px]">
              GrowthPilot
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 gradient-bg opacity-60" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} custom={0}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-medium border border-primary/10">
                <Sparkles className="h-3 w-3" />
                AI-Powered Marketing
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              custom={1}
              className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-text-primary leading-[1.1]"
            >
              Your AI Marketing{" "}
              <span className="gradient-text">Consultant</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              custom={2}
              className="mt-6 text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
            >
              Get a personalized 30-day marketing roadmap for your small business.
              Audience analysis, campaign ideas, and daily action plans — all
              powered by AI.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              custom={3}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/sign-up"
                className="group flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
              >
                Start Free — No Card Required
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors px-4 py-3"
              >
                See How It Works ↓
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="mt-16 mx-auto max-w-3xl"
          >
            <div className="glass-card p-1 shadow-xl">
              <div className="rounded-[14px] bg-gradient-to-br from-slate-50 to-blue-50/50 p-6 sm:p-8">
                {/* Mock roadmap preview */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-2.5 w-2.5 rounded-full bg-danger" />
                  <div className="h-2.5 w-2.5 rounded-full bg-warning" />
                  <div className="h-2.5 w-2.5 rounded-full bg-success" />
                  <div className="flex-1" />
                  <span className="text-xs text-text-tertiary font-mono">growthpilot.app</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">W1</div>
                    <div className="flex-1 h-3 bg-primary/15 rounded-full">
                      <div className="h-full w-4/5 bg-primary rounded-full" />
                    </div>
                    <span className="text-xs text-text-tertiary">80%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent text-xs font-bold">W2</div>
                    <div className="flex-1 h-3 bg-accent/15 rounded-full">
                      <div className="h-full w-3/5 bg-accent rounded-full" />
                    </div>
                    <span className="text-xs text-text-tertiary">60%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center text-success text-xs font-bold">W3</div>
                    <div className="flex-1 h-3 bg-success/15 rounded-full">
                      <div className="h-full w-2/5 bg-success rounded-full" />
                    </div>
                    <span className="text-xs text-text-tertiary">40%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center text-warning text-xs font-bold">W4</div>
                    <div className="flex-1 h-3 bg-warning/15 rounded-full">
                      <div className="h-full w-1/5 bg-warning rounded-full" />
                    </div>
                    <span className="text-xs text-text-tertiary">20%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 px-6 bg-surface">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              custom={0}
              className="text-3xl sm:text-4xl font-bold text-text-primary"
            >
              Everything You Need to{" "}
              <span className="gradient-text">Grow</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              custom={1}
              className="mt-4 text-text-secondary max-w-xl mx-auto"
            >
              GrowthPilot combines AI intelligence with marketing expertise to
              give you an actionable plan — not just generic advice.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={fadeInUp}
                  custom={i}
                  className="glass-card p-6 group hover:scale-[1.02] transition-transform duration-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                    <Icon className="h-5 w-5 text-primary group-hover:text-white transition-colors duration-200" />
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              custom={0}
              className="text-3xl sm:text-4xl font-bold text-text-primary"
            >
              Three Steps to Your{" "}
              <span className="gradient-text">Marketing Plan</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="space-y-8"
          >
            {STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                variants={fadeInUp}
                custom={i}
                className="flex gap-6 items-start"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary-light text-primary font-bold text-lg flex items-center justify-center">
                  {step.step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-1">
                    {step.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div
            variants={fadeInUp}
            custom={0}
            className="glass-card p-10 sm:p-14 bg-gradient-to-br from-primary-light to-accent-light"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Ready to Grow?
            </h2>
            <p className="text-text-secondary mb-8 max-w-lg mx-auto">
              Join hundreds of small businesses using AI to transform their
              marketing. Your personalized roadmap is just minutes away.
            </p>
            <Link
              href="/sign-up"
              className="group inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-xl text-sm font-medium hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
            >
              Get Your Free Marketing Plan
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-8 px-6">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-white font-bold text-[10px]">
              G
            </div>
            <span className="text-sm text-text-tertiary">
              GrowthPilot © {new Date().getFullYear()}
            </span>
          </div>
          <p className="text-xs text-text-tertiary">
            AI-powered marketing for small businesses
          </p>
        </div>
      </footer>
    </div>
  );
}
