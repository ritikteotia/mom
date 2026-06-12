"use client";

import React, { useState, useEffect, use } from "react";
import { useSearchParams } from "next/navigation";
import {
  Megaphone,
  Sparkles,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  Plus,
  Trash2,
  Calendar,
  Layers,
  Image,
  Mail,
  Camera as InstaIcon,
  Search,
  Globe,
  FileText,
  Clock,
  Eye,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { sanitizeHtml } from "@/lib/sanitize";

interface CampaignContent {
  headline: string;
  body: string;
  cta: string;
  hashtags?: string[];
  imagePrompt?: string;
  subjectLine?: string;
  previewText?: string;
}

interface Campaign {
  id: string;
  title: string;
  channel: string;
  type: "SOCIAL_POST" | "EMAIL" | "AD" | "BLOG" | "EVENT" | "OTHER";
  description: string;
  content: CampaignContent | null;
  status: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "COMPLETED";
  createdAt: string;
}

interface Project {
  id: string;
  name: string;
  profile?: {
    industry: string;
    description: string;
    currentChannels: string[];
  };
}

interface PageProps {
  params: Promise<{ projectId: string }>;
}

export default function CampaignsPage({ params }: PageProps) {
  const { projectId } = use(params);
  const searchParams = useSearchParams();

  const [project, setProject] = useState<Project | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter tabs
  const [activeTab, setActiveTab] = useState("all");

  // Form modal states
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [formChannel, setFormChannel] = useState("instagram");
  const [formType, setFormType] = useState("SOCIAL_POST");
  const [formBrief, setFormBrief] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Copy details view states
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Fetch campaigns & project details
  const loadData = async () => {
    try {
      // Fetch project metadata
      const projRes = await fetch(`/api/projects`);
      const projJson = await projRes.json();
      if (projRes.ok && projJson.success) {
        const found = projJson.data.find((p: any) => p.id === projectId);
        if (found) setProject(found);
      }

      // Fetch campaigns lists
      const campRes = await fetch(`/api/projects/${projectId}/campaigns`);
      // Wait, let's make sure `/api/projects/[projectId]/campaigns` endpoint is built or if we should fetch directly or filter
      // Wait! We haven't built the GET `/api/projects/[projectId]/campaigns` API endpoint yet.
      // Let's check: yes, we'll build it right after this file or combine it.
      // Wait, we can fetch all campaigns for the project. Let's design the endpoint to return it.
      const campJson = await campRes.json();
      if (!campRes.ok || !campJson.success) {
        throw new Error(campJson.error || "Failed to load campaigns");
      }
      setCampaigns(campJson.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load campaigns data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId]);

  // Pre-populate form based on query params from roadmap day
  useEffect(() => {
    const initChannel = searchParams.get("initChannel");
    const initTitle = searchParams.get("initTitle");

    if (initChannel || initTitle) {
      if (initChannel) {
        const lower = initChannel.toLowerCase();
        if (lower.includes("instagram")) {
          setFormChannel("instagram");
          setFormType("SOCIAL_POST");
        } else if (lower.includes("email")) {
          setFormChannel("email");
          setFormType("EMAIL");
        } else if (lower.includes("google ad") || lower.includes("search ad") || lower.includes("ads")) {
          setFormChannel("google_ads");
          setFormType("AD");
        } else if (lower.includes("blog") || lower.includes("seo") || lower.includes("article")) {
          setFormChannel("seo");
          setFormType("BLOG");
        } else if (lower.includes("facebook")) {
          setFormChannel("facebook");
          setFormType("SOCIAL_POST");
        } else if (lower.includes("linkedin")) {
          setFormChannel("linkedin");
          setFormType("SOCIAL_POST");
        } else {
          setFormChannel("other");
          setFormType("OTHER");
        }
      }

      if (initTitle) {
        setFormBrief(`Campaign context: ${initTitle}\nProvide structured copywriting and design instructions for this marketing action.`);
      }

      setShowGenerateModal(true);
    }
  }, [searchParams]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBrief.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/generate/campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          channel: formChannel,
          type: formType,
          briefDescription: formBrief,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to generate campaign");
      }

      const newCampaign = json.data;
      setCampaigns((prev) => [newCampaign, ...prev]);
      setShowGenerateModal(false);
      setFormBrief("");
      
      // Open details modal of newly created campaign
      setActiveCampaign(newCampaign);
      setShowDetailsModal(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate campaign copy");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (campaignId: string) => {
    setIsDeleting(campaignId);
    try {
      const res = await fetch(`/api/projects/${projectId}/campaigns/${campaignId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to delete campaign");
      }
      setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
      if (activeCampaign?.id === campaignId) {
        setShowDetailsModal(false);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Deletion failed");
    } finally {
      setIsDeleting(null);
    }
  };

  const copyFieldToClipboard = (field: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getChannelIcon = (channel: string) => {
    const lower = channel.toLowerCase();
    if (lower.includes("instagram")) return <InstaIcon className="h-4 w-4" />;
    if (lower.includes("email")) return <Mail className="h-4 w-4" />;
    if (lower.includes("google")) return <Search className="h-4 w-4" />;
    if (lower.includes("seo") || lower.includes("blog")) return <Globe className="h-4 w-4" />;
    return <Megaphone className="h-4 w-4" />;
  };

  const getChannelBadgeColor = (channel: string) => {
    const lower = channel.toLowerCase();
    if (lower.includes("instagram")) return "bg-pink-50 text-pink-700 border-pink-100";
    if (lower.includes("email")) return "bg-blue-50 text-blue-700 border-blue-100";
    if (lower.includes("google")) return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (lower.includes("seo") || lower.includes("blog")) return "bg-indigo-50 text-indigo-700 border-indigo-100";
    return "bg-slate-50 text-slate-700 border-slate-100";
  };

  // Filter campaigns
  const filteredCampaigns = campaigns.filter((c) => {
    if (activeTab === "all") return true;
    return c.channel.toLowerCase().includes(activeTab.toLowerCase());
  });

  // Unique channel list in active campaigns for tabs
  const existingChannels = Array.from(new Set(campaigns.map((c) => c.channel.toLowerCase())));

  if (loading) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-text-secondary">Loading your campaigns workspace...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8 relative">
      {/* ── Modal: Generate Campaign ── */}
      <AnimatePresence>
        {showGenerateModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => !isGenerating && setShowGenerateModal(false)}
              className="fixed inset-0 z-50 bg-black backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:max-w-xl md:mx-auto z-50 bg-white border border-border rounded-xl shadow-2xl p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Generate AI Copywriting
                </h3>
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={() => setShowGenerateModal(false)}
                  className="text-text-tertiary hover:text-text-primary font-semibold text-sm cursor-pointer"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleGenerate} className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  {/* Channel select */}
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                      Target Channel
                    </label>
                    <select
                      value={formChannel}
                      onChange={(e) => setFormChannel(e.target.value)}
                      className="w-full px-3 h-10 bg-white border border-border rounded-lg text-xs"
                    >
                      <option value="instagram">Instagram</option>
                      <option value="facebook">Facebook</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="tiktok">TikTok</option>
                      <option value="email">Email Newsletter</option>
                      <option value="google_ads">Google Search Ads</option>
                      <option value="seo">SEO Blog Post</option>
                      <option value="other">Other / General Copy</option>
                    </select>
                  </div>

                  {/* Type select */}
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                      Campaign Type
                    </label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value)}
                      className="w-full px-3 h-10 bg-white border border-border rounded-lg text-xs"
                    >
                      <option value="SOCIAL_POST">Social Media Post</option>
                      <option value="EMAIL">Email Marketing</option>
                      <option value="AD">Paid Advertisement</option>
                      <option value="BLOG">SEO Article Outline</option>
                      <option value="EVENT">Local Event / Offline</option>
                      <option value="OTHER">Other Promotional</option>
                    </select>
                  </div>
                </div>

                {/* Brief description prompt */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                    Describe the campaign focus or event
                  </label>
                  <textarea
                    rows={4}
                    value={formBrief}
                    onChange={(e) => setFormBrief(e.target.value)}
                    className="w-full p-3 bg-white border border-border rounded-lg placeholder:text-text-tertiary text-xs resize-none"
                    placeholder="e.g. A special weekend promotion: buy any croissant and get a free double espresso, only on Saturday and Sunday morning. Focus on local coffee lovers."
                    required
                  />
                </div>

                {error && (
                  <div className="p-3 bg-danger-light border border-danger/20 rounded-lg text-xs text-danger flex gap-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowGenerateModal(false)}
                    disabled={isGenerating}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isGenerating}
                    className="shadow-md shadow-primary/25"
                  >
                    {isGenerating ? "Writing Copy..." : "Generate Campaign Copy"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Modal: Campaign Copy details viewer ── */}
      <AnimatePresence>
        {showDetailsModal && activeCampaign && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetailsModal(false)}
              className="fixed inset-0 z-50 bg-black backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:max-w-2xl md:mx-auto z-50 bg-white border border-border rounded-xl shadow-2xl p-6 sm:p-8 flex flex-col max-h-[85vh]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${getChannelBadgeColor(activeCampaign.channel)}`}>
                    {getChannelIcon(activeCampaign.channel)}
                    {activeCampaign.channel}
                  </span>
                  <h3 className="text-lg font-bold text-text-primary mt-1.5">
                    {activeCampaign.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDetailsModal(false)}
                  className="text-text-tertiary hover:text-text-primary font-semibold text-sm cursor-pointer"
                >
                  Close
                </button>
              </div>

              {/* Copy Body Scroll Area */}
              <div className="flex-1 overflow-y-auto py-6 space-y-6 text-sm">
                {/* Description info */}
                <div className="bg-slate-50 border border-border p-4 rounded-xl flex gap-2">
                  <Info className="h-4.5 w-4.5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold text-text-tertiary uppercase block">AI Strategy Notes</span>
                    <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                      {activeCampaign.description}
                    </p>
                  </div>
                </div>

                {activeCampaign.content && (
                  <div className="space-y-5">
                    {/* Subject Line & Preview (Email only) */}
                    {activeCampaign.content.subjectLine && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-border/50">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-text-tertiary uppercase">Subject Line</span>
                            <button
                              onClick={() => copyFieldToClipboard("subject", activeCampaign.content?.subjectLine || "")}
                              className="text-primary text-[10px] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                            >
                              {copiedField === "subject" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              Copy
                            </button>
                          </div>
                          <p className="text-xs text-text-primary font-semibold mt-1">
                            {activeCampaign.content.subjectLine}
                          </p>
                        </div>
                        {activeCampaign.content.previewText && (
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-text-tertiary uppercase">Preview Text</span>
                              <button
                                onClick={() => copyFieldToClipboard("preview", activeCampaign.content?.previewText || "")}
                                className="text-primary text-[10px] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                              >
                                {copiedField === "preview" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                Copy
                              </button>
                            </div>
                            <p className="text-xs text-text-secondary mt-1">
                              {activeCampaign.content.previewText}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Headline */}
                    <div className="space-y-1 bg-white border border-border p-4 rounded-xl shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-text-tertiary uppercase">Headline / Header Hook</span>
                        <button
                          onClick={() => copyFieldToClipboard("headline", activeCampaign.content?.headline || "")}
                          className="text-primary text-xs font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          {copiedField === "headline" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          Copy
                        </button>
                      </div>
                      <p className="text-sm font-bold text-text-primary mt-1">
                        {activeCampaign.content.headline}
                      </p>
                    </div>

                    {/* Body Copy */}
                    <div className="space-y-1 bg-white border border-border p-4 rounded-xl shadow-xs">
                      <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-2">
                        <span className="text-xs font-bold text-text-tertiary uppercase">Main Copy / Caption</span>
                        <button
                          onClick={() => copyFieldToClipboard("body", activeCampaign.content?.body || "")}
                          className="text-primary text-xs font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          {copiedField === "body" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          Copy
                        </button>
                      </div>
                      <p className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">
                        {activeCampaign.content.body}
                      </p>

                      {/* Hashtags */}
                      {activeCampaign.content.hashtags && activeCampaign.content.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-border/30">
                          {activeCampaign.content.hashtags.map((tag) => (
                            <span key={tag} className="text-xs text-primary font-medium">
                              {tag.startsWith("#") ? tag : `#${tag}`}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Call to Action */}
                    <div className="space-y-1 bg-white border border-border p-4 rounded-xl shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-text-tertiary uppercase">Call To Action</span>
                        <button
                          onClick={() => copyFieldToClipboard("cta", activeCampaign.content?.cta || "")}
                          className="text-primary text-xs font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          {copiedField === "cta" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          Copy
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-text-primary mt-1">
                        {activeCampaign.content.cta}
                      </p>
                    </div>

                    {/* Visual Image Generation Prompt */}
                    {activeCampaign.content.imagePrompt && (
                      <div className="space-y-1 bg-slate-50 border border-border/80 p-4 rounded-xl">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-text-tertiary uppercase border-b border-border/50 pb-2 mb-2">
                          <Image className="h-4 w-4 text-accent" />
                          AI Image Generator Prompt (Midjourney / DALL-E)
                          <div className="flex-1" />
                          <button
                            onClick={() => copyFieldToClipboard("imagePrompt", activeCampaign.content?.imagePrompt || "")}
                            className="text-primary text-[10px] font-semibold flex items-center gap-1 hover:underline cursor-pointer normal-case"
                          >
                            {copiedField === "imagePrompt" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            Copy
                          </button>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed italic">
                          &quot;{activeCampaign.content.imagePrompt}&quot;
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-4 mt-auto flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const confirmDel = confirm("Are you sure you want to delete this campaign?");
                    if (confirmDel) handleDelete(activeCampaign.id);
                  }}
                  disabled={isDeleting === activeCampaign.id}
                  className="text-danger hover:bg-danger-light hover:text-danger border-danger/20"
                >
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  Delete Copy
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <Megaphone className="h-7 w-7 text-primary" />
            AI Campaigns Library
          </h1>
          <p className="mt-1.5 text-sm text-text-secondary">
            Draft, generate, and copy AI-written marketing campaigns for <strong className="text-text-primary">{project?.name}</strong>.
          </p>
        </div>

        <Button
          onClick={() => {
            setError(null);
            setShowGenerateModal(true);
          }}
          className="flex items-center gap-1.5 shadow-md shadow-primary/15 self-start sm:self-auto h-11"
        >
          <Plus className="h-4 w-4" />
          Create Copy
        </Button>
      </div>

      {/* Tabs list & filters */}
      {campaigns.length > 0 ? (
        <div className="space-y-6">
          <div className="border-b border-border">
            <div className="flex overflow-x-auto space-x-6 pb-px">
              <button
                onClick={() => setActiveTab("all")}
                className={`
                  pb-4 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap
                  ${
                    activeTab === "all"
                      ? "border-primary text-primary font-bold"
                      : "border-transparent text-text-secondary hover:text-text-primary"
                  }
                `}
              >
                All Campaigns
              </button>
              {existingChannels.map((channel) => (
                <button
                  key={channel}
                  onClick={() => setActiveTab(channel)}
                  className={`
                    pb-4 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap capitalize
                    ${
                      activeTab === channel
                        ? "border-primary text-primary font-bold"
                        : "border-transparent text-text-secondary hover:text-text-primary"
                    }
                  `}
                >
                  {channel.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Grid list of campaigns */}
          {filteredCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map((camp, idx) => (
                <motion.div
                  key={camp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass-card p-6 border border-border bg-white flex flex-col justify-between hover:shadow-xl transition-all duration-200"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[9px] font-bold uppercase ${getChannelBadgeColor(camp.channel)}`}>
                        {getChannelIcon(camp.channel)}
                        {camp.channel}
                      </span>
                      <span className="text-[10px] text-text-tertiary font-mono">
                        {new Date(camp.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <h3 className="font-semibold text-text-primary text-[16px] tracking-tight leading-snug line-clamp-1">
                      {camp.title}
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                      {camp.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/50 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => {
                        const confirmDel = confirm("Are you sure you want to delete this campaign?");
                        if (confirmDel) handleDelete(camp.id);
                      }}
                      disabled={isDeleting === camp.id}
                      className="p-1.5 rounded-lg text-text-tertiary hover:text-danger hover:bg-danger-light transition-colors cursor-pointer"
                      title="Delete Campaign"
                    >
                      {isDeleting === camp.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setActiveCampaign(camp);
                        setShowDetailsModal(true);
                      }}
                      className="group flex items-center gap-1 text-xs font-semibold py-1.5 px-3 rounded-lg text-primary hover:bg-primary-light transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View Copy
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center border border-border/80 max-w-md mx-auto">
              <div className="text-4xl mb-3">📁</div>
              <h3 className="text-base font-semibold text-text-primary">No campaigns in this tab</h3>
              <p className="text-xs text-text-secondary mt-1 max-w-xs mx-auto">
                No campaigns have been generated for the selected channel tab yet.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Empty Library State */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-12 text-center border border-border/80 max-w-md mx-auto space-y-6"
        >
          <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center border border-primary/20 mx-auto">
            <Megaphone className="h-7 w-7 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-text-primary">Your Campaign Library is Empty</h3>
            <p className="text-sm text-text-secondary max-w-sm mx-auto leading-relaxed">
              Generate AI-written copy for newsletters, Instagram posts, Google Search ads, or blogs.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-1.5 shadow-md shadow-primary/10 mx-auto"
          >
            <Sparkles className="h-4 w-4" />
            Generate First Campaign
          </Button>
        </motion.div>
      )}
    </div>
  );
}
