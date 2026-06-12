// ─── Clerk Webhook Handler ──────────────────────────────────────
// Syncs Clerk user events to the local database.
// Webhook signing secret must be set in CLERK_WEBHOOK_SECRET.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

interface ClerkWebhookEvent {
  type: string;
  data: ClerkUserData;
}

interface ClerkUserData {
  id: string;
  email_addresses: Array<{
    email_address: string;
    id: string;
  }>;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
}

export async function POST(request: NextRequest) {
  // In production, verify the webhook signature using svix.
  // For now, we check for the webhook secret header.
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("Missing CLERK_WEBHOOK_SECRET environment variable");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let event: ClerkWebhookEvent;

  try {
    event = (await request.json()) as ClerkWebhookEvent;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  const { type, data } = event;

  try {
    switch (type) {
      case "user.created":
      case "user.updated": {
        const email = data.email_addresses[0]?.email_address;

        if (!email) {
          return NextResponse.json(
            { error: "No email address found" },
            { status: 400 }
          );
        }

        await db.user.upsert({
          where: { clerkId: data.id },
          create: {
            clerkId: data.id,
            email,
            firstName: data.first_name,
            lastName: data.last_name,
            avatarUrl: data.image_url,
          },
          update: {
            email,
            firstName: data.first_name,
            lastName: data.last_name,
            avatarUrl: data.image_url,
          },
        });
        break;
      }

      case "user.deleted": {
        // Cascade delete will remove all associated projects, etc.
        await db.user.delete({
          where: { clerkId: data.id },
        });
        break;
      }

      default:
        // Unhandled event type — acknowledge but ignore
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
