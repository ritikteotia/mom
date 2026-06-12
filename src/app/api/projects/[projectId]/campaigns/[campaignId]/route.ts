import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { CampaignService } from "@/services/campaign.service";

interface RouteParams {
  params: Promise<{
    projectId: string;
    campaignId: string;
  }>;
}

// DELETE /api/projects/[projectId]/campaigns/[campaignId] - Delete campaign
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { projectId, campaignId } = await params;

    // Verify ownership of the project
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

    // Verify campaign belongs to project
    const campaign = await db.campaign.findFirst({
      where: {
        id: campaignId,
        projectId: projectId,
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { success: false, error: "Campaign not found" },
        { status: 404 }
      );
    }

    await CampaignService.deleteCampaign(campaignId);

    return NextResponse.json({ success: true, message: "Campaign deleted successfully" });
  } catch (error: any) {
    console.error("DELETE campaign error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete campaign" },
      { status: 500 }
    );
  }
}
