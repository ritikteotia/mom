import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const businessProfileSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  industry: z.string().min(1, "Industry is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  socialLinks: z.object({
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
    facebook: z.string().optional(),
    tiktok: z.string().optional(),
    youtube: z.string().optional(),
  }).optional(),
  targetAudience: z.string().min(5, "Target audience description is required"),
  goals: z.array(z.string()).min(1, "Select at least one goal"),
  monthlyBudget: z.number().min(0, "Budget must be a positive number"),
  currentChannels: z.array(z.string()),
  brandVoice: z.string().optional(),
  competitors: z.array(z.string()).optional(),
});

// GET /api/projects - List all projects for current user
export async function GET() {
  try {
    const user = await requireAuth();

    const projects = await db.project.findMany({
      where: { userId: user.id },
      include: {
        profile: true,
        roadmap: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: projects });
  } catch (error: unknown) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json(
      { success: false, error: (error instanceof Error ? error.message : String(error)) || "Internal server error" },
      { status: (error instanceof Error ? error.message : String(error))?.includes("Unauthorized") ? 401 : 500 }
    );
  }
}

// POST /api/projects - Create new project and business profile
export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const validated = businessProfileSchema.parse(body);

    // Filter out empty competitors
    const filteredCompetitors = validated.competitors?.filter((c) => c.trim() !== "") || [];

    // Create Project and BusinessProfile in a transaction
    const project = await db.$transaction(async (tx) => {
      const newProject = await tx.project.create({
        data: {
          name: validated.businessName,
          status: "DRAFT",
          userId: user.id,
        },
      });

      const newProfile = await tx.businessProfile.create({
        data: {
          projectId: newProject.id,
          businessName: validated.businessName,
          industry: validated.industry,
          description: validated.description,
          website: validated.website || null,
          socialLinks: validated.socialLinks || {},
          targetAudience: validated.targetAudience,
          goals: validated.goals,
          monthlyBudget: validated.monthlyBudget,
          currentChannels: validated.currentChannels,
          brandVoice: validated.brandVoice || "",
          competitors: filteredCompetitors,
        },
      });

      return {
        ...newProject,
        profile: newProfile,
      };
    });

    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/projects error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: (error instanceof Error ? error.message : String(error)) || "Internal server error" },
      { status: (error instanceof Error ? error.message : String(error))?.includes("Unauthorized") ? 401 : 500 }
    );
  }
}
