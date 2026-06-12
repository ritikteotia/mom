import { db } from "@/lib/db";
import { openai, AI_MODEL, CAMPAIGN_MAX_TOKENS } from "@/lib/openai";
import {
  CAMPAIGN_SYSTEM_PROMPT,
  buildCampaignUserPrompt,
} from "@/prompts/campaign-system";
import { campaignOutputSchema } from "@/prompts/schemas";
import { CampaignType, CampaignStatus } from "@prisma/client";

export class CampaignService {
  /**
   * Generates a campaign copy block using OpenAI, saves it in DB, and returns it.
   */
  static async generateAndSaveCampaign(
    projectId: string,
    channel: string,
    type: CampaignType,
    briefDescription?: string
  ) {
    // 1. Fetch project context
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: { profile: true },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    if (!project.profile) {
      throw new Error("Business profile not found. Please fill out the wizard.");
    }

    const { profile } = project;

    // 2. Build prompts
    const userPrompt = buildCampaignUserPrompt({
      businessName: profile.businessName,
      industry: profile.industry,
      description: profile.description,
      brandVoice: profile.brandVoice,
      channel,
      type,
      briefDescription,
    });

    // 3. Call OpenAI
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        { role: "system", content: CAMPAIGN_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      max_tokens: CAMPAIGN_MAX_TOKENS,
      temperature: 0.7,
    });

    const jsonString = response.choices[0]?.message?.content;
    if (!jsonString) {
      throw new Error("Empty response from AI engine");
    }

    // 4. Parse and validate AI output
    const rawJson = JSON.parse(jsonString);
    const validatedData = campaignOutputSchema.parse(rawJson);

    // Split campaign fields
    const { title, description, ...copyContent } = validatedData;

    // 5. Save campaign in database
    const campaign = await db.campaign.create({
      data: {
        projectId,
        title,
        description,
        channel,
        type,
        status: CampaignStatus.DRAFT,
        content: copyContent as any,
      },
    });

    return campaign;
  }

  /**
   * List all campaigns for a project.
   */
  static async getCampaignsByProjectId(projectId: string) {
    return db.campaign.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Delete a campaign.
   */
  static async deleteCampaign(campaignId: string) {
    return db.campaign.delete({
      where: { id: campaignId },
    });
  }

  /**
   * Update campaign status.
   */
  static async updateCampaignStatus(campaignId: string, status: CampaignStatus) {
    return db.campaign.update({
      where: { id: campaignId },
      data: { status },
    });
  }
}
