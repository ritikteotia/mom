// ─── Constants: Industries ──────────────────────────────────────
// Industry options for the business profile wizard dropdown.

export interface IndustryOption {
  value: string;
  label: string;
  emoji: string;
}

export const INDUSTRIES: IndustryOption[] = [
  { value: "marketing_advertising", label: "Marketing & Advertising", emoji: "📢" },
  { value: "food_beverage", label: "Food & Beverage", emoji: "☕" },
  { value: "retail_ecommerce", label: "Retail & E-Commerce", emoji: "🛍️" },
  { value: "health_wellness", label: "Health & Wellness", emoji: "💪" },
  { value: "technology", label: "Technology & SaaS", emoji: "💻" },
  { value: "real_estate", label: "Real Estate", emoji: "🏠" },
  { value: "education", label: "Education & Training", emoji: "📚" },
  { value: "finance", label: "Finance & Insurance", emoji: "💰" },
  { value: "beauty_fashion", label: "Beauty & Fashion", emoji: "💄" },
  { value: "automotive", label: "Automotive", emoji: "🚗" },
  { value: "travel_hospitality", label: "Travel & Hospitality", emoji: "✈️" },
  { value: "fitness", label: "Fitness & Sports", emoji: "🏋️" },
  { value: "entertainment", label: "Entertainment & Media", emoji: "🎬" },
  { value: "home_services", label: "Home Services", emoji: "🔧" },
  { value: "legal", label: "Legal Services", emoji: "⚖️" },
  { value: "nonprofit", label: "Non-Profit & NGO", emoji: "🤝" },
  { value: "consulting", label: "Consulting & Professional Services", emoji: "📊" },
  { value: "creative_arts", label: "Creative Arts & Design", emoji: "🎨" },
  { value: "manufacturing", label: "Manufacturing", emoji: "🏭" },
  { value: "other", label: "Other", emoji: "🏢" },
] as const;

export function getIndustryLabel(value: string): string {
  return INDUSTRIES.find((i) => i.value === value)?.label ?? value;
}
