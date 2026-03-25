"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CircleDollarSign,
  X,
  LayoutDashboard,
  Settings,
  WalletCards,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  collapsed = false,
  onNavigate,
}: {
  mobile?: boolean;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isCollapsed = !mobile && collapsed;

  return (
    <aside
      className={cn(
        "surface z-40 flex h-screen w-full flex-col border-r border-slate-200/80 transition-[width] duration-300 ease-out",
        mobile
          ? "rounded-none border-r bg-white/95 shadow-2xl"
          : isCollapsed
            ? "fixed inset-y-0 left-0 w-[5.5rem] rounded-none border-r bg-white/90"
            : "fixed inset-y-0 left-0 w-[18.5rem] rounded-none border-r bg-white/90",
      )}
    >
      <div
        className={cn(
          "flex border-b border-slate-200/70 py-5",
          isCollapsed ? "justify-center px-2" : "items-center gap-3 px-5",
        )}
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20">
          <CircleDollarSign className="h-5 w-5" />
        </div>
        {!isCollapsed ? (
          <div>
            <div className="font-heading text-xl font-semibold tracking-tight text-slate-950">
              Portfolia
            </div>
            <div className="text-xs text-muted-foreground">
              Personal portfolio dashboard
            </div>
          </div>
        ) : null}
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

      <div className={cn("flex-1 py-5", isCollapsed ? "px-2" : "px-4")}>
        {!isCollapsed ? (
          <div className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Workspace
          </div>
        ) : null}

        <TooltipProvider>
          <nav className="space-y-2" aria-label="Primary">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              const navLink = (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group flex rounded-2xl text-sm font-medium transition-all",
                    isCollapsed
                      ? "justify-center px-2 py-3"
                      : "items-center gap-3 px-4 py-3",
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
                  {!isCollapsed ? (
                    <span className="min-w-0">
                      <span className="block">{item.label}</span>
                      <span className="block truncate text-xs font-normal text-slate-500">
                        {item.description}
                      </span>
                    </span>
                  ) : null}
                </Link>
              );

              if (!isCollapsed) {
                return navLink;
              }

              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{navLink}</TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10}>
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </nav>
        </TooltipProvider>
      </div>

      <div className={cn("border-t border-slate-200/70 p-4", isCollapsed ? "px-2" : "")}>
        <div className={cn(isCollapsed ? "min-h-[80px]" : "min-h-[170px]")} />
      </div>
    </aside>
  );
}
