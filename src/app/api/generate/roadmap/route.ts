import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkRateLimit, AI_GENERATION_LIMIT } from "@/lib/rate-limit";
import { RoadmapService } from "@/services/roadmap.service";

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { projectId } = body;

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "Missing projectId parameter" },
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

    // Generate roadmap
    const roadmap = await RoadmapService.generateAndSaveRoadmap(projectId);

    return NextResponse.json({ success: true, data: roadmap });
  } catch (error: unknown) {
    console.error("POST /api/generate/roadmap error:", error);
    return NextResponse.json(
      { success: false, error: (error instanceof Error ? error.message : String(error)) || "Failed to generate roadmap" },
      { status: 500 }
    );
  }
}
