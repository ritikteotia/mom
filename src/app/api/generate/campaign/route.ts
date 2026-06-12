import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkRateLimit, AI_GENERATION_LIMIT } from "@/lib/rate-limit";
import { CampaignService } from "@/services/campaign.service";
import { CampaignType } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { projectId, channel, type, briefDescription } = body;

    if (!projectId || !channel || !type) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters (projectId, channel, type)" },
        { status: 400 }
      );
    }

    // Verify ownership
    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { userId: true },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    if (project.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access to project" },
        { status: 403 }
      );
    }

    // Validate type matches prisma CampaignType
    if (!Object.values(CampaignType).includes(type as CampaignType)) {
      return NextResponse.json(
        { success: false, error: `Invalid campaign type. Must be one of: ${Object.values(CampaignType).join(", ")}` },
        { status: 400 }
      );
    }

    // Check rate limit
    const limit = checkRateLimit(user.id, AI_GENERATION_LIMIT);
    if (!limit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Please try again later.",
          retryAfterMs: limit.retryAfterMs,
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(limit.retryAfterMs / 1000).toString(),
          },
        }
      );
    }

    // Generate campaign copy
    const campaign = await CampaignService.generateAndSaveCampaign(
      projectId,
      channel,
      type as CampaignType,
      briefDescription
    );

    return NextResponse.json({ success: true, data: campaign }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/generate/campaign error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate campaign content" },
      { status: 500 }
    );
  }
}
