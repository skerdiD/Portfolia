import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { getDemoUserEmail } from "@/lib/auth/demo-account";
import { getDemoUserIdByEmail } from "@/lib/auth/demo-user-lookup";
import {
  getAnalyticsChartDataWithHoldingsByUser,
  getUserSettingsByUser,
} from "@/lib/db/queries";
import { DashboardPageClient } from "@/components/dashboard/dashboard-page-client";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function DemoPage() {
  const demoEmail = getDemoUserEmail();
  const demoUserId = await getDemoUserIdByEmail(demoEmail);
  const [analytics, settings] = await Promise.all([
    getAnalyticsChartDataWithHoldingsByUser(demoUserId),
    getUserSettingsByUser(demoUserId),
  ]);

  return (
    <main className="relative min-h-dvh overflow-hidden bg-background px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-blue-500/8 blur-3xl" />
        <div className="absolute right-0 top-32 h-80 w-80 rounded-full bg-cyan-400/8 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col gap-6">
        <header className="flex flex-col justify-between gap-4 rounded-[1.5rem] border border-cyan-100 bg-cyan-50/85 p-5 shadow-sm sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-cyan-600 shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">
                Public read-only demo
              </div>
              <h1 className="mt-1 font-heading text-2xl font-semibold tracking-tight">
                Portfolia sample workspace
              </h1>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
                This route bypasses shared-account sign-in friction and shows the seeded
                demo portfolio without allowing destructive actions.
              </p>
            </div>
          </div>

          <Link
            href="/sign-in"
            className={buttonVariants({
              variant: "outline",
              className: "gap-2 rounded-2xl bg-white/90",
            })}
          >
            Sign in
            <ArrowRight className="h-4 w-4" />
          </Link>
        </header>

        <DashboardPageClient
          holdings={analytics.holdings}
          summary={analytics.summary}
          allocation={analytics.allocation}
          performanceHistory={analytics.performanceHistory}
          settings={settings}
        />
      </div>
    </main>
  );
}
