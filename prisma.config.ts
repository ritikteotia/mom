// ─── Prisma Config (Prisma 7+) ──────────────────────────────────
// Connection URL for CLI operations (migrate, seed, studio).
// Runtime connections use the driver adapter in src/lib/db.ts.

import dotenv from "dotenv";
import path from "path";
import { defineConfig, env } from "prisma/config";

// Load .env.local first, then fall back to .env
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
