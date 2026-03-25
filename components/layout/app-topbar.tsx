"use client";

import Link from "next/link";
import {
  Show,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { CalendarDays, Menu, PanelLeft, PanelLeftClose, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const titleMap: Record<string, { title: string; description: string }> = {
  "/dashboard": {
    title: "Dashboard",
    description: "Portfolio summary and live workspace overview",
  },
  "/holdings": {
    title: "Holdings",
    description: "Manage positions, prices, and notes",
  },
  "/watchlist": {
    title: "Watchlist",
    description: "Track assets before they become holdings",
  },
  "/analytics": {
    title: "Analytics",
    description: "Performance trends and allocation insights",
  },
  "/settings": {
    title: "Settings",
    description: "Account preferences and security controls",
  },
};

export function AppTopbar({
  onOpenSidebar,
  sidebarCollapsed,
  onToggleSidebar,
}: {
  onOpenSidebar: () => void;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}) {
  const pathname = usePathname();
  const { user } = useUser();

  const current =
    Object.entries(titleMap).find(([route]) => pathname.startsWith(route))?.[1] ??
    titleMap["/dashboard"];
  const displayName = user?.fullName || user?.username || "Portfolio User";
  const primaryEmail = user?.primaryEmailAddress?.emailAddress || "Secure session";
  const today = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

          <button
            onClick={onToggleSidebar}
            className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:inline-flex"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <PanelLeft className="h-4.5 w-4.5" />
            ) : (
              <PanelLeftClose className="h-4.5 w-4.5" />
            )}
          </button>

          <div className="min-w-0 space-y-1">
            <div className="truncate font-heading text-2xl font-semibold tracking-tight text-slate-950 sm:text-[1.75rem]">
              {current.title}
            </div>
            <div className="hidden truncate text-sm text-muted-foreground sm:block">
              {current.description}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-600 shadow-sm xl:flex">
            <CalendarDays className="h-4 w-4 text-slate-400" />
            {today}
          </div>

          <div className="relative hidden w-[250px] xl:block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="h-10 rounded-xl pl-11"
              placeholder="Search holdings, tickers, insights..."
            />
          </div>

          <Show when="signed-out">
            <Link
              href="/sign-in"
              prefetch={false}
              className={buttonVariants({ size: "sm", className: "rounded-xl" })}
            >
              Sign in
            </Link>
          </Show>

          <Show when="signed-in">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/90 px-3 py-2 shadow-sm">
              <div className="hidden text-right sm:block">
                <div className="max-w-[140px] truncate text-sm font-medium text-slate-950">
                  {displayName}
                </div>
                <div className="max-w-[160px] truncate text-xs text-muted-foreground">
                  {primaryEmail}
                </div>
              </div>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-9 w-9",
                  },
                }}
              />
            </div>
          </Show>
        </div>
      </div>
    </header>
  );
}
