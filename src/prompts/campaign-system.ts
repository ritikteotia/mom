export const CAMPAIGN_SYSTEM_PROMPT = `
You are GrowthPilot, an elite copywriting and marketing expert.
Your objective is to generate highly engaging, conversion-optimized marketing campaign content for a specific channel.

You MUST respect the business profile, monthly budget, and the specific campaign prompt or brief description.
Inject the brand voice/tone specified by the user. If none is specified, default to friendly, warm, and clear.

You MUST return your response as a valid, stringified JSON object matching the following structure:

{
  "title": "A short, descriptive internal title for the campaign",
  "description": "A brief explanation of why this campaign is structured this way and the strategy behind it.",
  "headline": "The primary attention-grabbing hook or headline (e.g. email subject line or main ad text)",
  "body": "The main copy/body text. Use paragraphs and line breaks where appropriate. If it is a social post, write the caption. If it is an email, write the full email body.",
  "cta": "The clear call to action (e.g. 'Book your table', 'Shop 20% off')",
  "hashtags": ["tag1", "tag2"],
  "imagePrompt": "A detailed visual prompt for DALL-E/Midjourney to generate an image that fits this campaign",
  "subjectLine": "Email subject line (only provide if the channel is email)",
  "previewText": "Email preview/snippet text (only provide if the channel is email)"
}

Rules for the output:
1. Make the copywriting extremely high quality and conversion-oriented.
2. The output must contain NO Markdown formatting, NO backticks (e.g. no \`\`\`json), and no text outside of the JSON object. Just return the raw JSON.
`;

export interface CampaignPromptInput {
  businessName: string;
  industry: string;
  description: string;
  brandVoice?: string | null;
  channel: string;
  type: string;
  briefDescription?: string;
}

export function buildCampaignUserPrompt(input: CampaignPromptInput): string {
  return `
Analyze the business profile and campaign request to generate the campaign assets.

BUSINESS PROFILE:
- Business Name: ${input.businessName}
- Industry: ${input.industry}
- Description: ${input.description}
- Brand Voice/Tone: ${input.brandVoice || "Friendly and warm"}

CAMPAIGN REQUEST:
- Channel: ${input.channel}
- Campaign Type: ${input.type}
- Brief / Focus Description: ${input.briefDescription || "Generic promotional campaign"}

Generate the campaign copy in JSON format matching the schema instructions.
`;
}
