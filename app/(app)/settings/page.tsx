import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import {
  Globe2,
  Lock,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";
import { getCurrentUserSettings } from "@/lib/db/queries";
import { protectPageRequest } from "@/lib/security/arcjet";
import { getDashboardViewLabel, getRiskPreferenceLabel } from "@/lib/settings/preferences";
import { PageHeader } from "@/components/shared/page-header";
import { SettingsPreferencesForm } from "@/components/settings/settings-preferences-form";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/portfolio/formatters";
import { cn } from "@/lib/utils";

function SettingRow({
  label,
  value,
  helper,
  valueClassName,
}: {
  label: string;
  value: string;
  helper?: string;
  valueClassName?: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </div>
      <div
        className={cn(
          "mt-1 min-w-0 text-sm font-semibold text-slate-950 sm:text-base",
          valueClassName,
        )}
      >
        {value}
      </div>
      {helper ? <div className="mt-1 text-xs text-slate-500">{helper}</div> : null}
    </div>
  );
}

export default async function SettingsPage() {
  const protection = await protectPageRequest();

  if (!protection.allowed) {
    throw new Error(protection.message);
  }

  const [{ userId }, user, settings] = await Promise.all([
    auth(),
    currentUser(),
    getCurrentUserSettings(),
  ]);
  const primaryEmail = user?.emailAddresses.find(
    (entry) => entry.id === user?.primaryEmailAddressId,
  )?.emailAddress;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Workspace preferences"
        title="Settings"
        description="Manage account identity, portfolio display defaults, risk context, and security posture for your investment workspace."
        actions={
          <Badge variant="secondary" className="rounded-full px-3 py-1.5">
            {settings.defaultCurrency} workspace
          </Badge>
        }
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="surface motion-card rounded-[1.75rem]">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <UserCircle2 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-slate-950">
                Account profile
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Identity fields from your authenticated Clerk account.
              </p>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <SettingRow
                label="Full name"
                value={user?.fullName || user?.username || "Portfolio User"}
              />
              <SettingRow
                label="Primary email"
                value={primaryEmail || "Email unavailable"}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <SettingRow
                label="User ID"
                value={userId || "Unknown"}
                valueClassName="break-all font-mono text-[0.95rem] sm:text-sm"
              />
              <SettingRow
                label="Member since"
                value={
                  user?.createdAt
                    ? formatDate(new Date(user.createdAt))
                    : "Unavailable"
                }
              />
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <Link href="/dashboard" className={buttonVariants({ variant: "outline" })}>
                Back to dashboard
              </Link>
              <Link href="/holdings" className={buttonVariants({ variant: "secondary" })}>
                Review holdings
              </Link>
            </div>
          </CardContent>
        </Card>

        <SettingsPreferencesForm settings={settings} />

        <Card className="surface motion-card rounded-[1.75rem]">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-slate-950">
                Security posture
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Runtime protections and access controls active in this environment.
              </p>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div className="font-medium text-slate-950">Authentication provider</div>
                <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                  Clerk active
                </Badge>
              </div>
              <div className="mt-2 text-sm leading-6 text-slate-600">
                Session-based route protection is enforced for all app routes.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div className="font-medium text-slate-950">Request defense</div>
                <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                  Arcjet enabled
                </Badge>
              </div>
              <div className="mt-2 text-sm leading-6 text-slate-600">
                Bot detection, shield, and route-level rate limiting protect pages and mutations.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div className="font-medium text-slate-950">Data isolation</div>
                <Badge variant="outline" className="border-violet-200 bg-violet-50 text-violet-700">
                  User scoped
                </Badge>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                <Lock className="h-4 w-4 text-slate-400" />
                Queries are filtered by authenticated user id before returning holdings or analytics.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="surface motion-card rounded-[1.75rem]">
        <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
              <Globe2 className="h-5 w-5" />
            </div>
            <div>
              <div className="font-medium text-slate-950">Environment health</div>
              <div className="text-sm text-slate-600">
                {settings.portfolioName} uses {settings.defaultCurrency} labels, {getRiskPreferenceLabel(settings.riskPreference).toLowerCase()} risk context, and {getDashboardViewLabel(settings.dashboardView).toLowerCase()}.
              </div>
            </div>
          </div>
          <Badge variant="outline" className="w-fit border-slate-200 bg-white px-3 py-1.5">
            Fintech-ready baseline
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
