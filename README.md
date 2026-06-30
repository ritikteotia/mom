# MOM 🚀
> Your AI-Powered Marketing Consultant for Small Businesses.

MOM (Marketing Operations Manager) is a production-ready SaaS application designed to empower small businesses with elite-level marketing strategies. It collects business information via an interactive wizard and generates a custom, budget-aware 30-day marketing roadmap, campaign copy, and conversion performance analysis.

---

## 🛠️ Tech Stack

*   **Framework**: Next.js 16 (App Router)
*   **Language**: TypeScript (Rigorous strict typing)
*   **Database**: PostgreSQL via Prisma ORM 7
*   **Authentication**: Clerk
*   **Styling**: Tailwind CSS v4 + Framer Motion
*   **AI Engine**: OpenAI API (`gpt-4o` with JSON structure modes)
*   **Sanitization**: Isomorphic-DOMPurify (XSS Mitigation)

---

## ✨ Key Features

1.  **Animated Landing Page**: Sleek Notion/Apple-like aesthetic using custom Tailwind v4 theme configurations and Framer Motion entrance animations.
2.  **Data Collection Wizard**: Multi-step interactive wizard with debounced `localStorage` draft saving, step validation, budget selectors, and tone customizers.
3.  **Dynamic Sidebar Workspace**: Route-aware workspace sidebar highlighting Project-specific items (Roadmap, Campaigns, Reports) dynamically.
4.  **AI Roadmap Generator**: Translates business context and budget constraints into a detailed 30-day calendar complete with themes, daily tasks, deliverables, and KPI metrics.
5.  **Campaigns Copy Library**: One-click copywriting creator for newsletters, Instagram posts, Google search ads, and blogs with clipboard utilities and image generation visual prompts.
6.  **Performance Estimator Reports**: Real-time modeled reports visualizing budget distributions, milestone trajectories, and category benchmarks.
7.  **Secure Authentication**: Integrated Clerk authentication with secure middleware and a dedicated sign-out flow.

---

## 🚀 Getting Started

### Prerequisites

*   Node.js v20+
*   PostgreSQL database instance
*   Clerk account (API keys)
*   OpenAI account (API key)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ritikteotia/mom.git
   cd mom
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (`.env.local`):
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/mom?schema=public"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
   CLERK_SECRET_KEY="your_clerk_secret_key"
   OPENAI_API_KEY="your_openai_api_key"
   ```

4. Apply database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Seed test profiles:
   ```bash
   npx prisma db seed
   ```

6. Start local development server:
   ```bash
   npm run dev
   ```

---

## 🔒 Security Summary

*   **SQL Injection Prevention**: Rigorous use of Prisma ORM query parameters (no raw SQL).
*   **XSS Mitigation**: Strict DOMPurify sanitization wrappers applied to all AI-generated content before rendering.
*   **Build-time safety**: Lazy client instantiation (Proxy wrapper) preventing evaluation crashes when environment variables are omitted during production builds.
