import { db } from "@/lib/db";
import { openai, AI_MODEL, ROADMAP_MAX_TOKENS } from "@/lib/openai";
import {
  ROADMAP_SYSTEM_PROMPT,
  buildRoadmapUserPrompt,
} from "@/prompts/roadmap-system";
import { roadmapDataSchema } from "@/prompts/schemas";
import { RoadmapStatus, ProjectStatus } from "@prisma/client";

export class RoadmapService {
  /**
   * Generates a 30-day marketing roadmap for a project using OpenAI
   * and saves it to the database.
   */
  static async generateAndSaveRoadmap(projectId: string) {
    // 1. Fetch project and business profile
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: { profile: true },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    if (!project.profile) {
      throw new Error("Business profile not complete. Please fill out the wizard.");
    }

    const { profile } = project;

    // 2. Set database status to GENERATING
    await db.project.update({
      where: { id: projectId },
      data: { status: ProjectStatus.GENERATING },
    });

    // Create or update roadmap with GENERATING status
    const dbRoadmap = await db.roadmap.upsert({
      where: { projectId },
      create: {
        projectId,
        status: RoadmapStatus.GENERATING,
      },
      update: {
        status: RoadmapStatus.GENERATING,
      },
    });

    try {
      // 3. Build prompts
      const userPrompt = buildRoadmapUserPrompt({
        businessName: profile.businessName,
        industry: profile.industry,
        description: profile.description,
        website: profile.website,
        socialLinks: profile.socialLinks as Record<string, string> | undefined,
        goals: profile.goals as string[],
        monthlyBudget: profile.monthlyBudget,
        currentChannels: profile.currentChannels as string[],
        brandVoice: profile.brandVoice,
        competitors: profile.competitors as string[],
      });

      // 4. Call OpenAI
      const response = await openai.chat.completions.create({
        model: AI_MODEL,
        messages: [
          { role: "system", content: ROADMAP_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        max_tokens: ROADMAP_MAX_TOKENS,
        temperature: 0.7,
      });

      const jsonString = response.choices[0]?.message?.content;
      if (!jsonString) {
        throw new Error("Empty response from AI engine");
      }

      // 5. Parse and validate AI output
      const rawJson = JSON.parse(jsonString);
      const validatedData = roadmapDataSchema.parse(rawJson);

      // 6. Save validated roadmap and activate project
      const updatedRoadmap = await db.roadmap.update({
        where: { id: dbRoadmap.id },
        data: {
          status: RoadmapStatus.COMPLETED,
          overview: validatedData.overview,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          targetAudience: validatedData.targetAudience as any,
          usps: validatedData.usps,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          plan: validatedData.plan as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          rawResponse: rawJson as any,
          generatedAt: new Date(),
        },
      });

      await db.project.update({
        where: { id: projectId },
        data: { status: ProjectStatus.ACTIVE },
      });

      return updatedRoadmap;
    } catch (error: unknown) {
      console.error(`AI Roadmap Generation failed for project ${projectId}:`, error);

      // Set status to FAILED in DB
      await db.roadmap.update({
        where: { id: dbRoadmap.id },
        data: { status: RoadmapStatus.FAILED },
      });

      await db.project.update({
        where: { id: projectId },
        data: { status: ProjectStatus.DRAFT }, // roll back project status to draft
      });

      throw error;
    }
  }

  /**
   * Fetches the roadmap associated with a project.
   */
  static async getRoadmapByProjectId(projectId: string) {
    return db.roadmap.findUnique({
      where: { projectId },
    });
  }
}
