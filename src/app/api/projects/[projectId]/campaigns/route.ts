import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { CampaignService } from "@/services/campaign.service";

interface RouteParams {
  params: Promise<{ projectId: string }>;
}

// GET /api/projects/[projectId]/campaigns - List campaigns for a project
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { projectId } = await params;

    // Verify ownership
    const project = await db.project.findFirst({
      where: {
        id: projectId,
        userId: user.id,
      },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found or unauthorized" },
        { status: 404 }
      );
    }

    const campaigns = await CampaignService.getCampaignsByProjectId(projectId);

    return NextResponse.json({ success: true, data: campaigns });
  } catch (error: any) {
    console.error("GET /api/projects/[projectId]/campaigns error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load campaigns" },
      { status: 500 }
    );
  }
}
