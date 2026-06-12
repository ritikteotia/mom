// ─── OpenAI Client Singleton ────────────────────────────────────
// Centralized OpenAI configuration. Never hardcode API keys.
// Uses a Proxy to lazily instantiate the client, avoiding build-time crashes.

import OpenAI from "openai";

const globalForOpenAI = globalThis as unknown as {
  openai: OpenAI | undefined;
};

/**
 * Get or initialize the OpenAI client.
 * Throws only when accessed at runtime if keys are missing.
 */
function getOpenAI(): OpenAI {
  if (globalForOpenAI.openai) {
    return globalForOpenAI.openai;
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing OPENAI_API_KEY environment variable. " +
        "Set it in .env.local to enable AI features."
    );
  }

  const client = new OpenAI({
    apiKey,
    timeout: 60_000,
    maxRetries: 2,
  });

  if (process.env.NODE_ENV !== "production") {
    globalForOpenAI.openai = client;
  }

  return client;
}

/**
 * Proxy wrapper around OpenAI client instance.
 * Delays initialization until a property is accessed at runtime.
 */
export const openai = new Proxy({} as OpenAI, {
  get(target, prop, receiver) {
    const client = getOpenAI();
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});

/** Default model for structured JSON output */
export const AI_MODEL = "gpt-4o" as const;

/** Max tokens for roadmap generation (longer output) */
export const ROADMAP_MAX_TOKENS = 4096 as const;

/** Max tokens for campaign generation (shorter output) */
export const CAMPAIGN_MAX_TOKENS = 2048 as const;
