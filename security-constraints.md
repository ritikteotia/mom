# MOM — Security Constraints

> **CRITICAL**: All code must comply with these constraints. Any violation is a security incident.

## 1. Database & Injection Protection

### Zero Raw SQL
- All database interactions **must** happen via Prisma ORM.
- Do not use `$queryRaw` or `$executeRaw` unless explicitly approved in writing.
- All user inputs must be passed through Prisma's parameterized queries.

### Data Isolation
- Users can only read/write `Projects`, `Campaigns`, `Reports`, and `Roadmaps` tied to their specific `userId`.
- Every database query in API routes must include a `where: { userId }` clause.
- The `userId` is derived from the authenticated Clerk session, never from client input.

---

## 2. AI & Prompt Injection Safeguards

### Output Sanitization
- All AI-generated content (text, roadmaps, campaign copy) **must** be sanitized before DOM rendering.
- Use `sanitizeHtml()` from `src/lib/sanitize.ts` for any HTML/Markdown content.
- Use `sanitizeText()` for plain text fields.
- Use `sanitizeObject()` for recursive sanitization of entire response objects.

### System Prompt Isolation
- User inputs from the Wizard are **strictly delineated** from the system prompt.
- System prompts are defined in `src/prompts/` and are immutable at runtime.
- User data is injected via a separate `user` message in the OpenAI API call.
- Never concatenate user input directly into system prompt strings.

### Response Validation
- All AI JSON responses are validated against Zod schemas before database persistence.
- Invalid responses trigger a retry or graceful error — never store unvalidated AI output.

---

## 3. Authentication & API Security

### Protected Routes
- All `/dashboard/*` routes are protected by Clerk middleware (`src/middleware.ts`).
- All `/api/generate/*` and `/api/projects/*` routes verify the Clerk session token.
- Use `requireAuth()` from `src/lib/auth.ts` at the start of every protected API handler.

### Rate Limiting
- `/api/generate/roadmap` and `/api/generate/campaign` are rate-limited.
- Default: 10 generations per user per hour.
- Rate limiter implemented in `src/lib/rate-limit.ts`.
- Returns `429 Too Many Requests` with `Retry-After` header when exceeded.

### CORS & Headers
- API routes only accept requests from the same origin.
- Sensitive routes use `POST` method only.

---

## 4. Secret Management

### No Hardcoded Secrets
- **Never** hardcode API keys, database URLs, JWT secrets, or webhook secrets.
- All secrets live in `.env.local` (git-ignored).
- Use `process.env.VARIABLE_NAME` exclusively.

### Client-Safe Variables
- Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.
- The following are safe for client exposure:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
  - `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
  - `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`
  - `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`
  - `NEXT_PUBLIC_APP_NAME`
  - `NEXT_PUBLIC_APP_URL`
- **Never** prefix these with `NEXT_PUBLIC_`:
  - `CLERK_SECRET_KEY`
  - `CLERK_WEBHOOK_SECRET`
  - `OPENAI_API_KEY`
  - `DATABASE_URL`

---

## 5. Input Validation

### API Input Validation
- All API route handlers validate incoming request bodies with Zod schemas.
- Invalid inputs return `400 Bad Request` with structured error details.
- File uploads (if added later) must be validated for type, size, and content.

### Form Validation
- Client-side validation is a UX convenience, not a security measure.
- Server-side validation is **always** the authoritative check.
