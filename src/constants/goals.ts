// ─── Constants: Marketing Goals ─────────────────────────────────

export interface GoalOption {
  value: string;
  label: string;
  icon: string;
  description: string;
}

export const GOALS: GoalOption[] = [
  {
    value: "brand_awareness",
    label: "Brand Awareness",
    icon: "📣",
    description: "Increase visibility and recognition in your market.",
  },
  {
    value: "lead_generation",
    label: "Lead Generation",
    icon: "🎯",
    description: "Attract and capture potential customer information.",
  },
  {
    value: "sales_revenue",
    label: "Increase Sales / Revenue",
    icon: "💵",
    description: "Drive more purchases and boost bottom line.",
  },
  {
    value: "customer_retention",
    label: "Customer Retention",
    icon: "🔄",
    description: "Keep existing customers engaged and coming back.",
  },
  {
    value: "community_building",
    label: "Community Building",
    icon: "🤝",
    description: "Build a loyal community around your brand.",
  },
  {
    value: "foot_traffic",
    label: "Increase Foot Traffic",
    icon: "🚶",
    description: "Drive more visitors to your physical location.",
  },
  {
    value: "website_traffic",
    label: "Website Traffic",
    icon: "🌐",
    description: "Increase visitors to your website or online store.",
  },
  {
    value: "social_following",
    label: "Grow Social Following",
    icon: "📈",
    description: "Build a larger, engaged audience on social media.",
  },
  {
    value: "thought_leadership",
    label: "Thought Leadership",
    icon: "🧠",
    description: "Establish authority and expertise in your industry.",
  },
  {
    value: "product_launch",
    label: "Product / Service Launch",
    icon: "🚀",
    description: "Successfully introduce a new offering to the market.",
  },
  {
    value: "client_acquisition",
    label: "Client Acquisition",
    icon: "🤝",
    description: "Win new clients through targeted outreach.",
  },
  {
    value: "local_awareness",
    label: "Local Awareness",
    icon: "📍",
    description: "Become the go-to choice in your local area.",
  },
] as const;

export function getGoalLabel(value: string): string {
  return GOALS.find((g) => g.value === value)?.label ?? value;
}
