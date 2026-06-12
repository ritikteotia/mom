// ─── Rate Limiter ───────────────────────────────────────────────
// In-memory token bucket rate limiter.
// For production, swap with Upstash Redis for distributed limiting.

interface RateLimitEntry {
  tokens: number;
  lastRefill: number;
}

interface RateLimitConfig {
  /** Maximum tokens (requests) in the bucket */
  maxTokens: number;
  /** Time window in milliseconds for full refill */
  refillIntervalMs: number;
}

const buckets = new Map<string, RateLimitEntry>();

/**
 * Check if a request is allowed under the rate limit.
 *
 * @param identifier - Unique key (e.g., userId or IP)
 * @param config - Rate limit configuration
 * @returns Object with `allowed` boolean and `remaining` tokens
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; retryAfterMs: number } {
  const now = Date.now();
  const entry = buckets.get(identifier);

  if (!entry) {
    // First request — create bucket with (maxTokens - 1) remaining
    buckets.set(identifier, {
      tokens: config.maxTokens - 1,
      lastRefill: now,
    });
    return { allowed: true, remaining: config.maxTokens - 1, retryAfterMs: 0 };
  }

  // Refill tokens based on elapsed time
  const elapsed = now - entry.lastRefill;
  const refillRate = config.maxTokens / config.refillIntervalMs;
  const tokensToAdd = elapsed * refillRate;
  entry.tokens = Math.min(config.maxTokens, entry.tokens + tokensToAdd);
  entry.lastRefill = now;

  if (entry.tokens < 1) {
    // Rate limited — calculate retry after
    const timeToNextToken = (1 - entry.tokens) / refillRate;
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: Math.ceil(timeToNextToken),
    };
  }

  // Consume a token
  entry.tokens -= 1;
  buckets.set(identifier, entry);

  return {
    allowed: true,
    remaining: Math.floor(entry.tokens),
    retryAfterMs: 0,
  };
}

/** Rate limit config for AI generation endpoints */
export const AI_GENERATION_LIMIT: RateLimitConfig = {
  maxTokens: 10, // 10 generations
  refillIntervalMs: 60 * 60 * 1000, // per hour
};

/** Rate limit config for general API endpoints */
export const API_GENERAL_LIMIT: RateLimitConfig = {
  maxTokens: 100, // 100 requests
  refillIntervalMs: 60 * 1000, // per minute
};

/**
 * Clean up stale entries periodically (call from a cron or middleware).
 * Entries older than 2x the refill interval are removed.
 */
export function cleanupStaleBuckets(refillIntervalMs: number): void {
  const cutoff = Date.now() - refillIntervalMs * 2;
  for (const [key, entry] of buckets.entries()) {
    if (entry.lastRefill < cutoff) {
      buckets.delete(key);
    }
  }
}
