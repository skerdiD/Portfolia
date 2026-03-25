import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  CircleDollarSign,
  Layers3,
  ShieldCheck,
  Sparkles,
  Wallet2,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const featureCards = [
  {
    title: "Holdings Management",
    description:
      "Track stocks, crypto, ETFs, and cash positions with a clean structured workflow.",
    icon: Wallet2,
  },
  {
    title: "Portfolio Analytics",
    description:
      "Turn raw positions into performance metrics, allocation insights, and portfolio trends.",
    icon: BarChart3,
  },
  {
    title: "Premium UI System",
    description:
      "Modern fintech styling with elegant dashboards, refined typography, and polished spacing.",
    icon: Sparkles,
  },
  {
    title: "Secure Account Layer",
    description:
      "Clerk authentication, protected routes, and isolated user-level access by default.",
    icon: ShieldCheck,
  },
];

const previewStats = [
  { label: "Portfolio Value", value: "$148,240" },
  { label: "Unrealized P&L", value: "+$12,860" },
  { label: "Return", value: "+9.50%" },
];

export default async function HomePage() {
  if (process.env.E2E_TEST_MODE === "1") {
    const cookieStore = await cookies();
    const e2eAuthCookie = cookieStore.get("e2e-auth")?.value;

    if (e2eAuthCookie === "1") {
      redirect("/dashboard");
    }
  } else {
    const { userId } = await auth();

    if (userId) {
      redirect("/dashboard");
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="grid-fade absolute inset-x-0 top-0 h-[38rem]" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20">
            <CircleDollarSign className="h-5 w-5" />
          </div>
          <div>
            <div className="font-heading text-xl font-semibold tracking-tight">
              Portfolia
            </div>
            <div className="text-xs text-muted-foreground">
              Personal investment intelligence
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "hidden sm:inline-flex",
            )}
          >
            Sign in
          </Link>
          <Link href="/sign-up" className={buttonVariants({ size: "sm" })}>
            Get started
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8 lg:px-10 lg:pb-24 lg:pt-14">
        <div className="grid items-start gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <section className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-blue-50/80 px-3 py-1.5 text-sm font-medium text-blue-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Premium personal investment dashboard
            </div>

            <h1 className="text-balance font-heading text-5xl font-semibold leading-[0.98] text-slate-950 sm:text-6xl lg:text-7xl">
              A modern portfolio workspace built for clarity, not clutter.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
              Portfolia gives your investments a premium analytics layer with
              elegant dashboards, structured holdings management, and polished
              fintech-style visual hierarchy.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/sign-up"
                className={cn(buttonVariants({ size: "lg" }), "gap-2")}
              >
                Create account
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/sign-in"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                Sign in
              </Link>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {previewStats.map((item) => (
                <Card
                  key={item.label}
                  className="surface rounded-3xl border-white/80 shadow-[0_18px_45px_-25px_rgba(15,23,42,0.18)]"
                >
                  <CardContent className="p-5">
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                      {item.value}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="relative">
            <div className="absolute inset-x-10 top-8 -z-10 h-40 rounded-full bg-blue-500/10 blur-3xl" />
            <Card className="surface overflow-hidden rounded-[2rem] border-white/80 shadow-[0_26px_70px_-30px_rgba(15,23,42,0.22)]">
              <CardContent className="p-0">
                <div className="border-b border-slate-200/70 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Portfolio overview
                      </p>
                      <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                        Designed like a real fintech product
                      </h2>
                    </div>
                    <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                      Live preview
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 p-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    {previewStats.map((item, index) => (
                      <div
                        key={item.label}
                        className={cn(
                          "rounded-3xl border p-5",
                          index === 1
                            ? "border-blue-200 bg-blue-50/70"
                            : "border-slate-200 bg-white/90",
                        )}
                      >
                        <p className="text-sm text-slate-500">{item.label}</p>
                        <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-950">
                            Performance trend
                          </h3>
                          <p className="text-sm text-slate-500">
                            Elegant analytics surface
                          </p>
                        </div>
                        <div className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                          30D
                        </div>
                      </div>
                      <div className="grid-fade relative h-52 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50">
                        <div className="absolute inset-0 flex items-end px-4 pb-5">
                          <svg
                            viewBox="0 0 320 120"
                            className="h-full w-full"
                            fill="none"
                          >
                            <path
                              d="M0 88C24 82 36 90 60 80C80 72 95 76 118 64C138 54 156 58 180 50C199 44 218 49 240 38C266 26 280 35 320 16"
                              stroke="url(#lineGradient)"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                            />
                            <defs>
                              <linearGradient
                                id="lineGradient"
                                x1="0"
                                y1="0"
                                x2="320"
                                y2="0"
                                gradientUnits="userSpaceOnUse"
                              >
                                <stop stopColor="#2563eb" />
                                <stop offset="1" stopColor="#22c55e" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-5">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                        <Layers3 className="h-4 w-4" />
                        Allocation
                      </div>
                      <div className="mt-6 flex items-center justify-center">
                        <div className="relative h-52 w-52 rounded-full bg-[conic-gradient(#2563eb_0_34%,#7c3aed_34%_68%,#ef4444_68%_84%,#22c55e_84%_100%)]">
                          <div className="absolute inset-[18%] rounded-full bg-white" />
                        </div>
                      </div>
                      <div className="mt-6 grid gap-3">
                        {[
                          ["Stocks", "34%"],
                          ["Crypto", "34%"],
                          ["ETFs", "16%"],
                          ["Cash", "16%"],
                        ].map(([label, value]) => (
                          <div
                            key={label}
                            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                          >
                            <span className="font-medium text-slate-700">{label}</span>
                            <span className="text-sm text-slate-500">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        <section className="mt-20 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featureCards.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card
                key={feature.title}
                className="surface rounded-[1.75rem] border-white/80 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.16)]"
              >
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-950">
                    {feature.title}
                  </h3>
                  <p className="mt-2 leading-7 text-slate-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </section>
      </main>
    </div>
  );
}
