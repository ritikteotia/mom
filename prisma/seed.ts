// ─── Database Seed Script ───────────────────────────────────────
// Populates the database with two test profiles for development.
// Run with: npx prisma db seed

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // ─── Create Test User ──────────────────────────────────────────
  const testUser = await prisma.user.upsert({
    where: { clerkId: "seed_dev_user_001" },
    update: {},
    create: {
      clerkId: "seed_dev_user_001",
      email: "dev@growthpilot.test",
      firstName: "Dev",
      lastName: "Tester",
      avatarUrl: null,
    },
  });

  console.log(`✅ User created: ${testUser.email}`);

  // ─── Project 1: MOM Agency ────────────────────────────────────
  const momProject = await prisma.project.upsert({
    where: { id: "seed_project_mom_agency" },
    update: {},
    create: {
      id: "seed_project_mom_agency",
      name: "MOM Agency",
      status: "ACTIVE",
      userId: testUser.id,
      profile: {
        create: {
          businessName: "MOM Agency",
          industry: "marketing_advertising",
          description:
            "MOM Agency is a full-service digital marketing agency specializing in brand strategy, " +
            "social media management, and performance marketing for mid-size B2B companies. " +
            "We help businesses scale their online presence through data-driven campaigns " +
            "and creative storytelling.",
          website: "https://momagency.com",
          socialLinks: {
            instagram: "https://instagram.com/momagency",
            linkedin: "https://linkedin.com/company/momagency",
            twitter: "https://twitter.com/momagency",
          },
          targetAudience:
            "B2B marketing managers and CMOs at mid-size companies (50-500 employees) " +
            "who are looking to scale their digital marketing efforts but lack in-house expertise. " +
            "Primarily in tech, SaaS, and professional services industries.",
          goals: [
            "lead_generation",
            "brand_awareness",
            "client_acquisition",
            "thought_leadership",
          ],
          monthlyBudget: 5000,
          currentChannels: ["linkedin", "instagram", "email", "google_ads"],
          brandVoice:
            "Professional yet approachable. We speak with authority on marketing topics " +
            "but keep our tone conversational and jargon-free. Think Harvard Business Review " +
            "meets a friendly mentor over coffee.",
          competitors: [
            "HubSpot Agency Partners",
            "WebFX",
            "Ignite Visibility",
          ],
        },
      },
      roadmap: {
        create: {
          status: "COMPLETED",
          overview:
            "A comprehensive 30-day marketing roadmap for MOM Agency focused on establishing " +
            "thought leadership on LinkedIn, launching a lead generation funnel, and optimizing " +
            "Google Ads performance for client acquisition.",
          targetAudience: {
            demographics: {
              ageRange: "30-55",
              gender: "All",
              location: "United States, United Kingdom, Canada",
              incomeLevel: "Decision-makers with marketing budgets of $10K-$100K/month",
            },
            psychographics: {
              interests: [
                "Digital marketing trends",
                "Business growth strategies",
                "Marketing automation",
                "Data analytics",
              ],
              values: [
                "ROI-driven results",
                "Transparency",
                "Innovation",
                "Strategic partnership",
              ],
              lifestyle:
                "Busy professionals who consume content during commutes and lunch breaks. " +
                "Active on LinkedIn and industry newsletters.",
            },
            painPoints: [
              "Struggling to attribute marketing spend to revenue",
              "Overwhelmed by the number of channels to manage",
              "Difficulty finding a trustworthy agency partner",
              "Internal teams lack specialized digital skills",
            ],
            buyingMotivations: [
              "Proven case studies with measurable ROI",
              "Industry expertise and thought leadership",
              "Flexible engagement models",
              "Transparent reporting and communication",
            ],
          },
          usps: [
            "Data-driven strategies with transparent ROI reporting",
            "Dedicated account teams with industry-specific expertise",
            "Flexible month-to-month contracts with no lock-in",
            "Proprietary analytics dashboard for real-time performance tracking",
          ],
          plan: {
            weeks: [
              {
                week: 1,
                theme: "Foundation & Authority Building",
                objective:
                  "Establish MOM Agency as a thought leader on LinkedIn and set up tracking infrastructure.",
                days: [
                  {
                    day: 1,
                    title: "Audit Current LinkedIn Presence",
                    channel: "linkedin",
                    taskType: "analysis",
                    description:
                      "Review all existing LinkedIn content, analyze engagement rates, and identify top-performing post types.",
                    deliverables: ["LinkedIn audit report", "Content performance spreadsheet"],
                    estimatedTime: "2-3 hours",
                    priority: "high",
                  },
                  {
                    day: 2,
                    title: "Develop Content Pillar Strategy",
                    channel: "linkedin",
                    taskType: "setup",
                    description:
                      "Define 4 content pillars: Industry Insights, Case Studies, Team Culture, and Tactical Tips.",
                    deliverables: [
                      "Content pillar document",
                      "Editorial calendar template",
                    ],
                    estimatedTime: "3-4 hours",
                    priority: "high",
                  },
                  {
                    day: 3,
                    title: "Write First Thought Leadership Post",
                    channel: "linkedin",
                    taskType: "content",
                    description:
                      "Craft a data-backed LinkedIn article on '5 Marketing Metrics That Actually Matter for B2B Companies'.",
                    deliverables: ["Published LinkedIn article"],
                    estimatedTime: "2-3 hours",
                    priority: "high",
                  },
                  {
                    day: 4,
                    title: "Set Up Google Ads Tracking",
                    channel: "google_ads",
                    taskType: "setup",
                    description:
                      "Configure Google Tag Manager, set up conversion tracking, and create UTM parameter standards.",
                    deliverables: [
                      "GTM container configured",
                      "Conversion tracking live",
                      "UTM naming guide",
                    ],
                    estimatedTime: "3-4 hours",
                    priority: "high",
                  },
                  {
                    day: 5,
                    title: "Design Lead Magnet",
                    channel: "email",
                    taskType: "content",
                    description:
                      "Create a downloadable PDF guide: 'The B2B Marketing Playbook: 10 Strategies for 2024'.",
                    deliverables: ["Lead magnet PDF", "Landing page copy"],
                    estimatedTime: "4-5 hours",
                    priority: "medium",
                  },
                ],
                kpis: [
                  "LinkedIn post impressions > 5,000",
                  "Profile views increase by 30%",
                  "Google Ads tracking verified",
                ],
              },
              {
                week: 2,
                theme: "Lead Generation Funnel Launch",
                objective:
                  "Launch the lead magnet funnel and begin targeted email outreach.",
                days: [
                  {
                    day: 8,
                    title: "Build Lead Magnet Landing Page",
                    channel: "seo",
                    taskType: "setup",
                    description:
                      "Create a high-converting landing page for the B2B Marketing Playbook with A/B test variants.",
                    deliverables: ["Landing page live", "A/B test configured"],
                    estimatedTime: "3-4 hours",
                    priority: "high",
                  },
                  {
                    day: 9,
                    title: "Set Up Email Nurture Sequence",
                    channel: "email",
                    taskType: "setup",
                    description:
                      "Write a 5-email welcome/nurture sequence for new leads who download the playbook.",
                    deliverables: ["5 email drafts", "Automation workflow"],
                    estimatedTime: "4-5 hours",
                    priority: "high",
                  },
                  {
                    day: 10,
                    title: "Launch LinkedIn Ad Campaign",
                    channel: "linkedin",
                    taskType: "content",
                    description:
                      "Create and launch a Sponsored Content campaign promoting the lead magnet to target audience.",
                    deliverables: ["3 ad creatives", "Campaign live"],
                    estimatedTime: "2-3 hours",
                    priority: "high",
                  },
                  {
                    day: 11,
                    title: "Publish Case Study",
                    channel: "linkedin",
                    taskType: "content",
                    description:
                      "Write and publish a detailed case study showing 150% ROI improvement for a past client.",
                    deliverables: ["Case study blog post", "LinkedIn summary post"],
                    estimatedTime: "3-4 hours",
                    priority: "medium",
                  },
                  {
                    day: 12,
                    title: "Instagram Behind-the-Scenes Content",
                    channel: "instagram",
                    taskType: "content",
                    description:
                      "Create a series of Stories and a Reel showing the agency team at work and company culture.",
                    deliverables: ["5 Stories", "1 Reel"],
                    estimatedTime: "2-3 hours",
                    priority: "medium",
                  },
                ],
                kpis: [
                  "Lead magnet downloads > 50",
                  "Email open rate > 40%",
                  "LinkedIn ad CTR > 1.5%",
                ],
              },
              {
                week: 3,
                theme: "Optimization & Engagement",
                objective:
                  "Optimize campaigns based on Week 2 data and increase community engagement.",
                days: [
                  {
                    day: 15,
                    title: "Analyze Week 2 Performance",
                    channel: "google_ads",
                    taskType: "analysis",
                    description:
                      "Pull analytics from all channels, identify top performers, and adjust budgets accordingly.",
                    deliverables: ["Performance report", "Budget reallocation plan"],
                    estimatedTime: "2-3 hours",
                    priority: "high",
                  },
                  {
                    day: 16,
                    title: "Optimize Google Ads Campaigns",
                    channel: "google_ads",
                    taskType: "optimization",
                    description:
                      "Refine keyword targeting, adjust bids, add negative keywords, and test new ad copy.",
                    deliverables: ["Updated campaigns", "New ad variations"],
                    estimatedTime: "2-3 hours",
                    priority: "high",
                  },
                  {
                    day: 17,
                    title: "Host LinkedIn Live Q&A",
                    channel: "linkedin",
                    taskType: "engagement",
                    description:
                      "Host a 30-minute LinkedIn Live session on 'Common B2B Marketing Mistakes' to drive engagement.",
                    deliverables: ["LinkedIn Live event", "Promotional posts"],
                    estimatedTime: "3-4 hours",
                    priority: "medium",
                  },
                  {
                    day: 18,
                    title: "Create Email Re-engagement Campaign",
                    channel: "email",
                    taskType: "content",
                    description:
                      "Design a re-engagement email series for cold leads who haven't opened recent emails.",
                    deliverables: ["3 re-engagement emails", "Segment criteria"],
                    estimatedTime: "2-3 hours",
                    priority: "medium",
                  },
                  {
                    day: 19,
                    title: "Publish Industry Trends Post",
                    channel: "linkedin",
                    taskType: "content",
                    description:
                      "Write an in-depth analysis of emerging marketing trends backed by industry data.",
                    deliverables: ["Trend analysis article"],
                    estimatedTime: "2-3 hours",
                    priority: "medium",
                  },
                ],
                kpis: [
                  "Google Ads CPC reduced by 15%",
                  "Email re-engagement rate > 10%",
                  "LinkedIn Live attendees > 30",
                ],
              },
              {
                week: 4,
                theme: "Scale & Measure",
                objective:
                  "Scale successful campaigns, compile a comprehensive report, and plan for Month 2.",
                days: [
                  {
                    day: 22,
                    title: "Scale Top-Performing Ads",
                    channel: "google_ads",
                    taskType: "optimization",
                    description:
                      "Increase budget on best-performing Google and LinkedIn ad sets by 50%.",
                    deliverables: ["Budget increase applied", "Performance projections"],
                    estimatedTime: "1-2 hours",
                    priority: "high",
                  },
                  {
                    day: 23,
                    title: "Launch Referral Program",
                    channel: "email",
                    taskType: "setup",
                    description:
                      "Design and launch a client referral program with incentives for successful referrals.",
                    deliverables: ["Referral program page", "Email announcement"],
                    estimatedTime: "3-4 hours",
                    priority: "medium",
                  },
                  {
                    day: 24,
                    title: "Create Monthly Content Calendar",
                    channel: "instagram",
                    taskType: "setup",
                    description:
                      "Plan and schedule the next month's content across all channels using insights from Month 1.",
                    deliverables: ["Content calendar for Month 2"],
                    estimatedTime: "3-4 hours",
                    priority: "high",
                  },
                  {
                    day: 26,
                    title: "Compile Month-End Report",
                    channel: "google_ads",
                    taskType: "analysis",
                    description:
                      "Create a comprehensive report covering all KPIs, spend, leads generated, and ROI.",
                    deliverables: ["Monthly performance report", "Executive summary"],
                    estimatedTime: "3-4 hours",
                    priority: "high",
                  },
                  {
                    day: 28,
                    title: "Strategic Planning Session",
                    channel: "email",
                    taskType: "analysis",
                    description:
                      "Review Month 1 results, identify scalable wins, and draft the Month 2 strategy.",
                    deliverables: ["Month 2 strategy document", "Priority action items"],
                    estimatedTime: "2-3 hours",
                    priority: "high",
                  },
                ],
                kpis: [
                  "Total leads generated > 150",
                  "Cost per lead < $33",
                  "Overall ROI positive",
                  "Client pipeline value > $25,000",
                ],
              },
            ],
            totalEstimatedBudget: 5000,
            expectedOutcomes: [
              "150+ qualified leads in the pipeline",
              "Established thought leadership presence on LinkedIn",
              "Functional lead generation funnel with email nurture",
              "Data-driven ad optimization strategy in place",
              "Clear Month 2 roadmap based on Month 1 insights",
            ],
          },
          generatedAt: new Date(),
        },
      },
    },
  });

  console.log(`✅ Project created: ${momProject.name}`);

  // ─── Create MOM Agency Campaigns ──────────────────────────────
  await prisma.campaign.createMany({
    data: [
      {
        title: "B2B Marketing Playbook Lead Magnet",
        channel: "linkedin",
        type: "AD",
        description:
          "Sponsored Content campaign promoting our downloadable B2B Marketing Playbook to target CMOs and marketing managers.",
        content: {
          headline: "Stop Guessing. Start Growing.",
          body: "Download our free B2B Marketing Playbook — 10 data-backed strategies used by the top 5% of growing companies.",
          cta: "Download Free Playbook",
          hashtags: ["#B2BMarketing", "#MarketingStrategy", "#GrowthMarketing"],
        },
        status: "PUBLISHED",
        scheduledDate: new Date("2024-02-15"),
        projectId: momProject.id,
      },
      {
        title: "Case Study: 150% ROI for TechCorp",
        channel: "linkedin",
        type: "SOCIAL_POST",
        description:
          "Detailed case study post showcasing how we helped TechCorp achieve 150% ROI on their marketing investment.",
        content: {
          headline: "How We Helped TechCorp Achieve 150% Marketing ROI",
          body: "When TechCorp came to us, they were spending $50K/month with zero attribution. Here's exactly how we turned it around in 90 days...",
          cta: "Read the full case study →",
          hashtags: ["#CaseStudy", "#MarketingROI", "#B2B"],
        },
        status: "PUBLISHED",
        scheduledDate: new Date("2024-02-11"),
        projectId: momProject.id,
      },
      {
        title: "Weekly Newsletter: Marketing Pulse",
        channel: "email",
        type: "EMAIL",
        description:
          "Weekly email newsletter delivering curated marketing insights, tips, and agency updates to our subscriber list.",
        content: {
          headline: "Marketing Pulse: This Week in Digital",
          body: "Your weekly dose of actionable marketing insights, industry trends, and tactical tips to grow your business.",
          cta: "Subscribe Now",
          subjectLine: "📊 This Week: 3 LinkedIn Hacks That Actually Work",
          previewText: "Plus: Why your email open rates are dropping and how to fix it",
        },
        status: "SCHEDULED",
        scheduledDate: new Date("2024-02-20"),
        projectId: momProject.id,
      },
    ],
  });

  console.log("  📢 3 campaigns created for MOM Agency");

  // ─── Create MOM Agency Report ─────────────────────────────────
  await prisma.generatedReport.create({
    data: {
      title: "Week 1 Performance Summary",
      type: "WEEKLY_SUMMARY",
      content: {
        summary:
          "Strong first week with LinkedIn impressions exceeding targets by 40%. " +
          "Google Ads tracking is fully operational. Lead magnet design is ahead of schedule.",
        sections: [
          {
            title: "LinkedIn Performance",
            content:
              "Published 3 posts averaging 2,100 impressions each. The thought leadership article " +
              "on marketing metrics received 47 reactions and 12 comments.",
            metrics: [
              { label: "Total Impressions", value: "7,200", change: "+40%", trend: "up" },
              { label: "Profile Views", value: "342", change: "+65%", trend: "up" },
              { label: "Connection Requests", value: "28", trend: "up" },
            ],
          },
          {
            title: "Google Ads Setup",
            content:
              "Tracking infrastructure is fully configured. GTM container deployed with " +
              "4 conversion events. UTM standards documented and shared with the team.",
            metrics: [
              { label: "Conversion Events", value: "4", trend: "neutral" },
              { label: "Setup Status", value: "Complete", trend: "up" },
            ],
          },
        ],
        recommendations: [
          "Double down on data-driven LinkedIn posts — they outperform opinion pieces by 3x",
          "Schedule posts between 8-10 AM EST for maximum reach",
          "Consider LinkedIn newsletter feature for higher visibility",
        ],
        generatedAt: new Date().toISOString(),
      },
      projectId: momProject.id,
    },
  });

  console.log("  📊 1 report created for MOM Agency");

  // ─── Project 2: Cafe Reveria ──────────────────────────────────
  const cafeProject = await prisma.project.upsert({
    where: { id: "seed_project_cafe_reveria" },
    update: {},
    create: {
      id: "seed_project_cafe_reveria",
      name: "Cafe Reveria",
      status: "ACTIVE",
      userId: testUser.id,
      profile: {
        create: {
          businessName: "Cafe Reveria",
          industry: "food_beverage",
          description:
            "Cafe Reveria is a cozy specialty coffee shop in downtown Portland, Oregon. " +
            "We serve single-origin pour-overs, house-made pastries, and seasonal drinks. " +
            "Our space doubles as a community hub with local art displays, open mic nights, " +
            "and co-working-friendly seating.",
          website: "https://cafereveria.com",
          socialLinks: {
            instagram: "https://instagram.com/cafereveria",
            tiktok: "https://tiktok.com/@cafereveria",
          },
          targetAudience:
            "Local Portland residents aged 22-40 who value specialty coffee, community spaces, " +
            "and supporting local businesses. Mix of remote workers, students, and weekend brunch-goers. " +
            "They're active on Instagram and TikTok, care about sustainability, and discover new cafes " +
            "through Google Maps reviews and word-of-mouth.",
          goals: [
            "foot_traffic",
            "local_awareness",
            "community_building",
            "social_following",
          ],
          monthlyBudget: 800,
          currentChannels: ["instagram", "google_business", "local_events"],
          brandVoice:
            "Warm, inviting, and a little quirky. We talk like your favorite barista — " +
            "knowledgeable about coffee but never pretentious. Emojis welcome. " +
            "Our posts feel like a friend's recommendation, not a corporate announcement.",
          competitors: [
            "Stumptown Coffee Roasters",
            "Heart Coffee Roasters",
            "Coava Coffee",
          ],
        },
      },
      roadmap: {
        create: {
          status: "COMPLETED",
          overview:
            "A budget-friendly 30-day marketing roadmap for Cafe Reveria focused on increasing " +
            "foot traffic through Instagram content, Google My Business optimization, and community events.",
          targetAudience: {
            demographics: {
              ageRange: "22-40",
              gender: "All",
              location: "Portland, Oregon (5-mile radius)",
              incomeLevel: "Middle income, willing to spend $5-15 per visit",
            },
            psychographics: {
              interests: [
                "Specialty coffee",
                "Local food scene",
                "Art and culture",
                "Sustainability",
                "Remote work",
              ],
              values: [
                "Community",
                "Quality over quantity",
                "Local support",
                "Authenticity",
              ],
              lifestyle:
                "Urban professionals and creatives who frequent coffee shops 3-5 times per week. " +
                "They post about their coffee on social media and value Instagram-worthy spaces.",
            },
            painPoints: [
              "Hard to find a good workspace with great coffee",
              "Chain coffee shops feel impersonal",
              "Want to discover local spots but rely on Google reviews",
              "Looking for community events in their neighborhood",
            ],
            buyingMotivations: [
              "Beautiful, Instagram-worthy drinks and space",
              "Friendly, knowledgeable staff",
              "Consistent quality and unique seasonal offerings",
              "Sense of belonging to a community",
            ],
          },
          usps: [
            "Single-origin pour-overs with full origin traceability",
            "House-made pastries baked fresh daily",
            "Community hub: art shows, open mic, co-working space",
            "Cozy, Instagram-worthy interior design",
          ],
          plan: {
            weeks: [
              {
                week: 1,
                theme: "Instagram Glow-Up",
                objective:
                  "Revamp the Instagram profile and establish a consistent visual brand.",
                days: [
                  {
                    day: 1,
                    title: "Instagram Profile Audit & Refresh",
                    channel: "instagram",
                    taskType: "setup",
                    description:
                      "Update bio, profile photo, highlights, and link-in-bio. Create consistent branded templates.",
                    deliverables: ["Updated profile", "5 highlight covers", "Linktree setup"],
                    estimatedTime: "2-3 hours",
                    priority: "high",
                  },
                  {
                    day: 2,
                    title: "Content Photoshoot",
                    channel: "instagram",
                    taskType: "content",
                    description:
                      "Photograph signature drinks, pastries, interior shots, and latte art for content library.",
                    deliverables: ["30+ edited photos", "Content library organized"],
                    estimatedTime: "3-4 hours",
                    priority: "high",
                  },
                  {
                    day: 3,
                    title: "Create First Reel: Latte Art Process",
                    channel: "instagram",
                    taskType: "content",
                    description:
                      "Film and edit a satisfying 30-second Reel showing the latte art creation process.",
                    deliverables: ["1 published Reel"],
                    estimatedTime: "1-2 hours",
                    priority: "high",
                  },
                  {
                    day: 4,
                    title: "Google My Business Optimization",
                    channel: "google_business",
                    taskType: "optimization",
                    description:
                      "Update hours, photos, menu, posts, and respond to all recent reviews.",
                    deliverables: ["Updated GMB profile", "Review responses"],
                    estimatedTime: "1-2 hours",
                    priority: "high",
                  },
                  {
                    day: 5,
                    title: "Plan Community Event",
                    channel: "local_events",
                    taskType: "setup",
                    description:
                      "Plan an 'Open Mic & Brew' night for Week 3. Book performers and design promotional flyer.",
                    deliverables: ["Event plan", "Promotional flyer"],
                    estimatedTime: "2-3 hours",
                    priority: "medium",
                  },
                ],
                kpis: [
                  "Instagram followers +50",
                  "First Reel > 1,000 views",
                  "GMB profile completeness 100%",
                ],
              },
              {
                week: 2,
                theme: "Engage the Community",
                objective:
                  "Build local awareness through engagement and user-generated content.",
                days: [
                  {
                    day: 8,
                    title: "Launch UGC Campaign: #MyReveriaOrder",
                    channel: "instagram",
                    taskType: "engagement",
                    description:
                      "Launch a hashtag campaign encouraging customers to share their orders. Offer a weekly free drink prize.",
                    deliverables: ["Campaign announcement post", "In-store signage"],
                    estimatedTime: "1-2 hours",
                    priority: "high",
                  },
                  {
                    day: 9,
                    title: "TikTok Debut: Behind the Counter",
                    channel: "tiktok",
                    taskType: "content",
                    description:
                      "Film a fun 'day in the life of a barista' TikTok showing morning prep to closing.",
                    deliverables: ["1 TikTok video"],
                    estimatedTime: "1-2 hours",
                    priority: "medium",
                  },
                  {
                    day: 10,
                    title: "Local Partnership Outreach",
                    channel: "local_events",
                    taskType: "engagement",
                    description:
                      "Reach out to 5 local businesses for cross-promotion (bookstores, yoga studios, etc.).",
                    deliverables: ["5 outreach emails", "Partnership proposal template"],
                    estimatedTime: "2-3 hours",
                    priority: "medium",
                  },
                  {
                    day: 11,
                    title: "Seasonal Drink Launch Post",
                    channel: "instagram",
                    taskType: "content",
                    description:
                      "Announce the new seasonal drink with a carousel post showing the drink, ingredients, and story.",
                    deliverables: ["Carousel post (5 slides)"],
                    estimatedTime: "1-2 hours",
                    priority: "high",
                  },
                  {
                    day: 12,
                    title: "Respond & Engage",
                    channel: "instagram",
                    taskType: "engagement",
                    description:
                      "Dedicate time to reply to all comments, DMs, engage with local accounts, and repost UGC.",
                    deliverables: ["Engagement log"],
                    estimatedTime: "1 hour",
                    priority: "medium",
                  },
                ],
                kpis: [
                  "#MyReveriaOrder posts > 15",
                  "Instagram engagement rate > 5%",
                  "2+ local partnerships confirmed",
                ],
              },
              {
                week: 3,
                theme: "Event & Buzz",
                objective:
                  "Host the community event and generate local buzz.",
                days: [
                  {
                    day: 15,
                    title: "Event Promo Blitz",
                    channel: "instagram",
                    taskType: "content",
                    description:
                      "Post countdown Stories, a Reel teaser, and share the event on local Facebook groups.",
                    deliverables: ["3 Stories", "1 Reel", "Facebook posts"],
                    estimatedTime: "2-3 hours",
                    priority: "high",
                  },
                  {
                    day: 16,
                    title: "GMB Event Post",
                    channel: "google_business",
                    taskType: "content",
                    description:
                      "Create a Google My Business event post for 'Open Mic & Brew' night.",
                    deliverables: ["GMB event post live"],
                    estimatedTime: "30 minutes",
                    priority: "medium",
                  },
                  {
                    day: 18,
                    title: "Host Open Mic & Brew Night",
                    channel: "local_events",
                    taskType: "engagement",
                    description:
                      "Run the event, capture photos/video content, collect email sign-ups from attendees.",
                    deliverables: ["Event photos", "Attendee email list"],
                    estimatedTime: "4-5 hours",
                    priority: "high",
                  },
                  {
                    day: 19,
                    title: "Post-Event Content",
                    channel: "instagram",
                    taskType: "content",
                    description:
                      "Share highlights from Open Mic night via a Reel and carousel. Tag performers and attendees.",
                    deliverables: ["1 Reel", "1 carousel post"],
                    estimatedTime: "2-3 hours",
                    priority: "high",
                  },
                  {
                    day: 20,
                    title: "Send Thank-You Email",
                    channel: "email",
                    taskType: "content",
                    description:
                      "Send a thank-you email to event attendees with a 10% off coupon for their next visit.",
                    deliverables: ["Thank-you email with coupon"],
                    estimatedTime: "1 hour",
                    priority: "medium",
                  },
                ],
                kpis: [
                  "Event attendance > 40 people",
                  "Email sign-ups > 25",
                  "Event Reel > 2,000 views",
                ],
              },
              {
                week: 4,
                theme: "Sustain & Grow",
                objective:
                  "Maintain momentum, review results, and plan for ongoing growth.",
                days: [
                  {
                    day: 22,
                    title: "Review All Analytics",
                    channel: "instagram",
                    taskType: "analysis",
                    description:
                      "Compile Instagram Insights, GMB analytics, and foot traffic data for the full month.",
                    deliverables: ["Monthly analytics report"],
                    estimatedTime: "2-3 hours",
                    priority: "high",
                  },
                  {
                    day: 23,
                    title: "Customer Feedback Survey",
                    channel: "email",
                    taskType: "engagement",
                    description:
                      "Send a short survey to email list asking about their experience and what events they'd like to see.",
                    deliverables: ["Survey (5 questions)", "Email with survey link"],
                    estimatedTime: "1-2 hours",
                    priority: "medium",
                  },
                  {
                    day: 24,
                    title: "Plan Next Month's Content",
                    channel: "instagram",
                    taskType: "setup",
                    description:
                      "Create a content calendar for Month 2 based on what performed best in Month 1.",
                    deliverables: ["Month 2 content calendar"],
                    estimatedTime: "2-3 hours",
                    priority: "high",
                  },
                  {
                    day: 26,
                    title: "Test Promoted Instagram Post",
                    channel: "instagram",
                    taskType: "optimization",
                    description:
                      "Boost the top-performing Reel with a $50 budget targeting locals within 5 miles.",
                    deliverables: ["Promoted post live"],
                    estimatedTime: "30 minutes",
                    priority: "medium",
                  },
                  {
                    day: 28,
                    title: "Month-End Review & Plan",
                    channel: "instagram",
                    taskType: "analysis",
                    description:
                      "Final review of all results. Document wins, lessons learned, and set Month 2 goals.",
                    deliverables: ["Month-end summary", "Month 2 goals document"],
                    estimatedTime: "2-3 hours",
                    priority: "high",
                  },
                ],
                kpis: [
                  "Instagram followers +200 (total month)",
                  "Foot traffic increase > 15%",
                  "Email list > 50 subscribers",
                  "GMB reviews +10",
                ],
              },
            ],
            totalEstimatedBudget: 800,
            expectedOutcomes: [
              "200+ new Instagram followers",
              "15% increase in daily foot traffic",
              "50+ email subscribers for future marketing",
              "Established community event series",
              "Strong Google My Business presence with fresh reviews",
            ],
          },
          generatedAt: new Date(),
        },
      },
    },
  });

  console.log(`✅ Project created: ${cafeProject.name}`);

  // ─── Create Cafe Reveria Campaigns ────────────────────────────
  await prisma.campaign.createMany({
    data: [
      {
        title: "#MyReveriaOrder UGC Campaign",
        channel: "instagram",
        type: "SOCIAL_POST",
        description:
          "User-generated content campaign encouraging customers to share their Cafe Reveria orders with a branded hashtag.",
        content: {
          headline: "Share Your Reveria Order ☕",
          body: "📸 Order your favorite drink, snap a pic, and tag us with #MyReveriaOrder for a chance to win a free drink every week! We'll repost our favorites.",
          cta: "Tag #MyReveriaOrder",
          hashtags: [
            "#MyReveriaOrder",
            "#CafeReveria",
            "#PortlandCoffee",
            "#SpecialtyCoffee",
          ],
        },
        status: "PUBLISHED",
        scheduledDate: new Date("2024-02-08"),
        projectId: cafeProject.id,
      },
      {
        title: "Open Mic & Brew Night",
        channel: "local_events",
        type: "EVENT",
        description:
          "Monthly community event featuring local performers, specialty drinks, and pastry pairings.",
        content: {
          headline: "Open Mic & Brew Night 🎤☕",
          body: "Join us for an evening of local talent, great coffee, and community vibes. Sign up to perform or just come enjoy the show! Free pastry with every specialty drink.",
          cta: "RSVP on Instagram",
        },
        status: "SCHEDULED",
        scheduledDate: new Date("2024-02-18"),
        projectId: cafeProject.id,
      },
      {
        title: "Spring Lavender Latte Launch",
        channel: "instagram",
        type: "SOCIAL_POST",
        description:
          "Instagram carousel post announcing the new seasonal Lavender Honey Latte with behind-the-scenes creation story.",
        content: {
          headline: "Introducing: Lavender Honey Latte 💜🍯",
          body: "Spring is here and so is our newest creation. Made with locally-sourced lavender, raw Portland honey, and our signature single-origin espresso. Available for a limited time!",
          cta: "Come try it today!",
          hashtags: [
            "#LavenderLatte",
            "#SeasonalDrink",
            "#PortlandEats",
            "#CafeReveria",
          ],
        },
        status: "DRAFT",
        projectId: cafeProject.id,
      },
    ],
  });

  console.log("  📢 3 campaigns created for Cafe Reveria");

  // ─── Create Cafe Reveria Report ───────────────────────────────
  await prisma.generatedReport.create({
    data: {
      title: "Week 1 Instagram Performance",
      type: "WEEKLY_SUMMARY",
      content: {
        summary:
          "Exceptional first week on Instagram. The latte art Reel went semi-viral in the Portland " +
          "food community. Profile visits up 120% and we gained 68 new followers.",
        sections: [
          {
            title: "Instagram Growth",
            content:
              "The latte art Reel reached 3,200 views — well above our 1,000 target. " +
              "The content photoshoot provided a strong library for the next 3 weeks.",
            metrics: [
              { label: "New Followers", value: "68", change: "+136%", trend: "up" },
              { label: "Reel Views", value: "3,200", change: "+220%", trend: "up" },
              { label: "Profile Visits", value: "445", change: "+120%", trend: "up" },
              { label: "Engagement Rate", value: "6.2%", trend: "up" },
            ],
          },
          {
            title: "Google My Business",
            content:
              "Profile updated to 100% completeness. Responded to all 12 pending reviews. " +
              "Received 3 new 5-star reviews during the week.",
            metrics: [
              { label: "Profile Completeness", value: "100%", trend: "up" },
              { label: "New Reviews", value: "3", trend: "up" },
              { label: "Average Rating", value: "4.8", trend: "neutral" },
            ],
          },
        ],
        recommendations: [
          "Post Reels 3x per week — latte art and drink-making content performs best",
          "Partner with local food bloggers for expanded reach",
          "Add a Google Maps link to Instagram bio for easy navigation",
        ],
        generatedAt: new Date().toISOString(),
      },
      projectId: cafeProject.id,
    },
  });

  console.log("  📊 1 report created for Cafe Reveria");

  console.log("\n🎉 Seed completed successfully!");
  console.log(`   Users: 1`);
  console.log(`   Projects: 2 (MOM Agency + Cafe Reveria)`);
  console.log(`   Campaigns: 6`);
  console.log(`   Reports: 2`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
