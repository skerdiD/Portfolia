import { Bell, Palette, ShieldCheck, UserCircle2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function ToggleRow({
  title,
  description,
  enabled = false,
}: {
  title: string;
  description: string;
  enabled?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-4">
      <div>
        <div className="font-medium text-slate-950">{title}</div>
        <div className="mt-1 text-sm leading-6 text-muted-foreground">
          {description}
        </div>
      </div>

      <button
        aria-pressed={enabled}
        className={cn(
          "relative mt-1 h-7 w-12 rounded-full transition",
          enabled ? "bg-blue-600" : "bg-slate-200",
        )}
      >
        <span
          className={cn(
            "absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition",
            enabled ? "left-6" : "left-1",
          )}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Preferences"
        title="Settings"
        description="A polished settings surface for profile, portfolio preferences, notifications, and security."
        actions={
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            Foundation ready
          </Badge>
        }
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="surface rounded-[1.75rem]">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <UserCircle2 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-slate-950">
                Profile and account
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Personal identity and account-level preferences.
              </p>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Full name
                </label>
                <Input defaultValue="Skerdi Cacaj" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Email
                </label>
                <Input defaultValue="skerdi@example.com" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Portfolio display name
              </label>
              <Input defaultValue="Main Portfolio" />
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button className={buttonVariants()}>Save changes</button>
              <button className={buttonVariants({ variant: "outline" })}>
                Cancel
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="surface rounded-[1.75rem]">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-slate-950">
                Appearance and preferences
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Global dashboard defaults and display preferences.
              </p>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4">
                <div className="text-sm font-medium text-blue-700">Theme</div>
                <div className="mt-1 text-lg font-semibold text-slate-950">
                  Light premium
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/90 p-4">
                <div className="text-sm font-medium text-slate-500">Currency</div>
                <div className="mt-1 text-lg font-semibold text-slate-950">
                  USD
                </div>
              </div>
            </div>

            <ToggleRow
              title="Compact dashboard cards"
              description="Reduce vertical space and tighten the overall layout density."
            />
            <ToggleRow
              title="Display percentage change badges"
              description="Show visual performance pills in summary cards and tables."
              enabled
            />
          </CardContent>
        </Card>

        <Card className="surface rounded-[1.75rem]">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-slate-950">
                Notifications
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Placeholder controls for price alerts and portfolio updates.
              </p>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3">
            <ToggleRow
              title="Price movement alerts"
              description="Get notified when a tracked holding moves significantly."
              enabled
            />
            <ToggleRow
              title="Weekly summary email"
              description="Receive a recap of portfolio performance and allocation changes."
            />
            <ToggleRow
              title="Security notices"
              description="Important account or authentication-related notifications."
              enabled
            />
          </CardContent>
        </Card>

        <Card className="surface rounded-[1.75rem]">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-slate-950">
                Security
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Authentication and protection controls prepared for later integration.
              </p>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-4">
              <div className="font-medium text-slate-950">
                Two-factor authentication
              </div>
              <div className="mt-1 text-sm leading-6 text-muted-foreground">
                Recommended for better account protection.
              </div>
              <div className="mt-4">
                <button className={buttonVariants({ variant: "outline" })}>
                  Configure 2FA
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-4">
              <div className="font-medium text-slate-950">Active sessions</div>
              <div className="mt-1 text-sm leading-6 text-muted-foreground">
                Review devices and manage sign-in activity.
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button className={buttonVariants({ variant: "outline" })}>
                  View sessions
                </button>
                <button
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "text-rose-600 hover:bg-rose-50 hover:text-rose-700",
                  )}
                >
                  Sign out all
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}