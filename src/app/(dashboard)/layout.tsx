"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  FolderOpen,
  Settings,
  Plus,
  Map,
  Megaphone,
  BarChart3,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { PROJECT_SUBNAV } from "@/constants/nav";
import type { NavIcon } from "@/constants/nav";

const ICON_MAP: Record<NavIcon, React.ComponentType<{ className?: string }>> = {
  home: LayoutDashboard,
  folder: FolderOpen,
  settings: Settings,
  plus: Plus,
  map: Map,
  megaphone: Megaphone,
  chart: BarChart3,
};

interface SidebarLink {
  label: string;
  href: string;
  icon: NavIcon;
}

const NAV_LINKS: SidebarLink[] = [
  { label: "Dashboard", href: "/dashboard", icon: "home" },
  { label: "Projects", href: "/projects", icon: "folder" },
  { label: "Settings", href: "/settings", icon: "settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if current route is inside a specific project workspace
  const isProjectWorkspace =
    pathname.startsWith("/projects/") &&
    !pathname.endsWith("/new") &&
    pathname !== "/projects";
  const projectId = isProjectWorkspace ? pathname.split("/")[2] : null;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-border bg-surface
          transition-transform duration-200 ease-in-out
          lg:static lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">
              G
            </div>
            <span className="font-semibold text-text-primary text-[15px]">
              GrowthPilot
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-surface-hover text-text-tertiary"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {/* Main Links */}
          {NAV_LINKS.map((link) => {
            const Icon = ICON_MAP[link.icon];
            const isActive =
              pathname === link.href ||
              (link.href !== "/dashboard" && pathname.startsWith(link.href + "/"));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                  transition-colors duration-150
                  ${
                    isActive && !isProjectWorkspace
                      ? "bg-primary-light text-primary"
                      : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                  }
                `}
              >
                <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                {link.label}
              </Link>
            );
          })}

          {/* Project-Specific Links */}
          {isProjectWorkspace && projectId && (
            <div className="pt-4 mt-4 border-t border-border space-y-1">
              <div className="px-3 mb-2 text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                Workspace
              </div>
              {PROJECT_SUBNAV.map((subItem) => {
                const href = `/projects/${projectId}/${subItem.segment}`;
                const Icon = ICON_MAP[subItem.icon];
                const isSubActive =
                  pathname === href || pathname.startsWith(href + "/");

                return (
                  <Link
                    key={subItem.segment}
                    href={href}
                    className={`
                      flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                      transition-colors duration-150
                      ${
                        isSubActive
                          ? "bg-primary-light text-primary font-medium"
                          : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                      }
                    `}
                  >
                    <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                    {subItem.label}
                  </Link>
                );
              })}
            </div>
          )}
        </nav>

        {/* New Project Button */}
        <div className="px-3 pb-3">
          <Link
            href="/projects/new"
            className="flex items-center justify-center gap-2 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Link>
        </div>

        {/* User section */}
        <div className="border-t border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                },
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                Account
              </p>
              <p className="text-xs text-text-tertiary">Manage settings</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 items-center gap-4 border-b border-border bg-surface px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md hover:bg-surface-hover text-text-secondary"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Breadcrumb area */}
          <div className="flex-1" />

          {/* Right side */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:block text-xs text-text-tertiary">
              GrowthPilot v1.0
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
