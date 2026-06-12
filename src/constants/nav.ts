// ─── Constants: Navigation ──────────────────────────────────────
// Sidebar navigation items for the dashboard layout.

export interface NavItem {
  label: string;
  href: string;
  icon: NavIcon;
  badge?: string;
}

export type NavIcon =
  | "home"
  | "folder"
  | "map"
  | "megaphone"
  | "chart"
  | "settings"
  | "plus";

export const SIDEBAR_NAV: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "home",
  },
  {
    label: "Projects",
    href: "/projects",
    icon: "folder",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: "settings",
  },
] as const;

/** Project-level sub-navigation (shown when inside a project) */
export interface ProjectNavItem {
  label: string;
  /** Relative to /projects/[projectId]/ */
  segment: string;
  icon: NavIcon;
}

export const PROJECT_SUBNAV: ProjectNavItem[] = [
  { label: "Roadmap", segment: "roadmap", icon: "map" },
  { label: "Campaigns", segment: "campaigns", icon: "megaphone" },
  { label: "Reports", segment: "reports", icon: "chart" },
] as const;
