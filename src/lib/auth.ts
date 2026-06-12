// ─── Auth Helpers ───────────────────────────────────────────────
// Clerk utility functions for server-side auth.

import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import type { User } from "@prisma/client";

/**
 * Get the current authenticated user from the database.
 * Creates the user record if it doesn't exist yet (first login sync).
 * Returns null if no active session.
 */
export async function getCurrentUser(): Promise<User | null> {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return null;
  }

  // Try to find existing user
  const existingUser = await db.user.findUnique({
    where: { clerkId },
  });

  if (existingUser) {
    return existingUser;
  }

  // First login — sync from Clerk and create DB record
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const newUser = await db.user.create({
    data: {
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      avatarUrl: clerkUser.imageUrl,
    },
  });

  return newUser;
}

/**
 * Require authentication — throws if no user is found.
 * Use this in API routes that must be protected.
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized: No active session");
  }

  return user;
}

/**
 * Get just the Clerk user ID without a DB lookup.
 * Useful for lightweight auth checks.
 */
export async function getClerkUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}
