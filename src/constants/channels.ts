// ─── Constants: Marketing Channels ──────────────────────────────

export interface ChannelOption {
  value: string;
  label: string;
  icon: string;
  description: string;
}

export const CHANNELS: ChannelOption[] = [
  {
    value: "instagram",
    label: "Instagram",
    icon: "📸",
    description: "Visual content, Stories, Reels, and shopping.",
  },
  {
    value: "facebook",
    label: "Facebook",
    icon: "👥",
    description: "Community building, groups, and targeted ads.",
  },
  {
    value: "twitter",
    label: "X (Twitter)",
    icon: "🐦",
    description: "Real-time engagement, thought leadership, and trends.",
  },
  {
    value: "linkedin",
    label: "LinkedIn",
    icon: "💼",
    description: "B2B networking, professional content, and recruiting.",
  },
  {
    value: "tiktok",
    label: "TikTok",
    icon: "🎵",
    description: "Short-form video, viral trends, and Gen-Z reach.",
  },
  {
    value: "youtube",
    label: "YouTube",
    icon: "▶️",
    description: "Long-form video content, tutorials, and brand storytelling.",
  },
  {
    value: "email",
    label: "Email Marketing",
    icon: "📧",
    description: "Newsletters, drip campaigns, and customer retention.",
  },
  {
    value: "google_ads",
    label: "Google Ads",
    icon: "🔍",
    description: "Search ads, display network, and remarketing.",
  },
  {
    value: "seo",
    label: "SEO / Content Marketing",
    icon: "📝",
    description: "Blog posts, organic search, and content strategy.",
  },
  {
    value: "google_business",
    label: "Google My Business",
    icon: "📍",
    description: "Local search, reviews, and map listings.",
  },
  {
    value: "podcast",
    label: "Podcast",
    icon: "🎙️",
    description: "Audio content, interviews, and niche authority.",
  },
  {
    value: "local_events",
    label: "Local Events & Partnerships",
    icon: "🎪",
    description: "Community events, sponsorships, and local collabs.",
  },
] as const;

export function getChannelLabel(value: string): string {
  return CHANNELS.find((c) => c.value === value)?.label ?? value;
}
