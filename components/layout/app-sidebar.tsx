"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CircleDollarSign,
  X,
  ShieldCheck,
  LayoutDashboard,
  Settings,
  WalletCards,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Portfolio snapshot",
  },
  {
    label: "Holdings",
    href: "/holdings",
    icon: WalletCards,
    description: "Positions and edits",
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    description: "Advanced performance",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Account preferences",
  },
];

export function AppSidebar({
  mobile = false,
  onNavigate,
}: {
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "surface z-40 flex h-screen w-full flex-col border-r border-slate-200/80",
        mobile
          ? "rounded-none border-r bg-white/95 shadow-2xl"
          : "fixed inset-y-0 left-0 w-[18.5rem] rounded-none border-r bg-white/90",
      )}
    >
      <div className="flex items-center gap-3 border-b border-slate-200/70 px-5 py-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20">
          <CircleDollarSign className="h-5 w-5" />
        </div>
        <div>
          <div className="font-heading text-xl font-semibold tracking-tight text-slate-950">
            Portfolia
          </div>
          <div className="text-xs text-muted-foreground">
            Personal portfolio dashboard
          </div>
        </div>
        {mobile && onNavigate ? (
          <button
            type="button"
            onClick={onNavigate}
            aria-label="Close navigation"
            className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        ) : null}
      </div>

      <div className="flex-1 px-4 py-5">
        <div className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Workspace
        </div>

        <nav className="space-y-2" aria-label="Primary">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                  active
                    ? "bg-blue-50 text-blue-700 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.2)]"
                    : "text-slate-600 hover:bg-white hover:text-slate-950 hover:shadow-sm",
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl transition",
                    active
                      ? "bg-white text-blue-600 shadow-sm"
                      : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700",
                  )}
                >
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <span className="min-w-0">
                  <span className="block">{item.label}</span>
                  <span className="block truncate text-xs font-normal text-slate-500">
                    {item.description}
                  </span>
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-200/70 p-4">
        <div className="rounded-[1.5rem] border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            Security posture
          </div>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Clerk auth, Arcjet rate limiting, and user-scoped queries are active for this workspace.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-700">
              Protected routes
            </span>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-blue-700">
              Mutation guardrails
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
