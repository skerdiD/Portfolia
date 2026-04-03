"use client";

import Link from "next/link";
import { type MouseEvent, useEffect } from "react";
import {
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileCheck2,
  Layers3,
  MenuSquare,
  MoonStar,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  SunMedium,
  WandSparkles,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "portfolia-theme";

const navLinks = [
  { label: "Product", href: "#product-preview" },
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Reviews", href: "#social-proof" },
];

const heroStats = [
  { label: "Time to first draft", value: "< 5 min" },
  { label: "Proposal win lift", value: "+31%" },
  { label: "Avg. time saved weekly", value: "9.2 hrs" },
];

const painPoints = [
  {
    title: "Proposals take too long",
    description:
      "Teams burn hours rewriting scope and pricing for every single lead.",
    icon: Clock3,
  },
  {
    title: "Scope gets misunderstood",
    description:
      "Requirements become vague, then projects drift and revisions pile up.",
    icon: ScanSearch,
  },
  {
    title: "Pricing feels inconsistent",
    description:
      "Without structure, margins shrink and clients question every line item.",
    icon: CircleDollarSign,
  },
  {
    title: "Quality depends on who writes",
    description:
      "Great proposals should be repeatable, not dependent on one teammate.",
    icon: MenuSquare,
  },
];

const featureCards = [
  {
    title: "AI scope builder",
    description:
      "Turn rough notes into clear milestones, deliverables, and timelines.",
    icon: WandSparkles,
  },
  {
    title: "Smart pricing engine",
    description:
      "Generate structured pricing options with margin-safe recommendations.",
    icon: CircleDollarSign,
  },
  {
    title: "Reusable playbooks",
    description:
      "Save your best proposals as repeatable templates for every vertical.",
    icon: Layers3,
  },
  {
    title: "Brand-safe voice",
    description:
      "Keep tone, vocabulary, and formatting consistent across your team.",
    icon: ShieldCheck,
  },
  {
    title: "Client-ready exports",
    description:
      "Export polished PDFs and share a branded link in a single click.",
    icon: FileCheck2,
  },
  {
    title: "Collaboration notes",
    description:
      "Review AI suggestions, edit fast, and align before proposals go out.",
    icon: CheckCircle2,
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Input project details",
    description:
      "Drop in meeting notes, goals, timeline, and budget expectations.",
  },
  {
    step: "02",
    title: "AI generates proposal",
    description:
      "Portfolia creates scope, milestones, pricing options, and rationale.",
  },
  {
    step: "03",
    title: "Edit and export",
    description:
      "Adjust wording, lock sections, and send a client-ready proposal quickly.",
  },
];

const testimonials = [
  {
    quote:
      "Our proposal cycle dropped from two days to under an hour, and close rates improved in the same quarter.",
    name: "Maya Chen",
    role: "Founder, Northline Studio",
  },
  {
    quote:
      "The scope clarity is unreal. Clients ask fewer questions because everything is structured from the first draft.",
    name: "David Romero",
    role: "Creative Director, Anchor Eight",
  },
  {
    quote:
      "We finally have a consistent quality bar across the team, even when new account managers jump in.",
    name: "Priya Desai",
    role: "Operations Lead, Signalhaus",
  },
];

const brandLogos = [
  "NORTHLINE",
  "ANCHOR EIGHT",
  "SIGNALHAUS",
  "LUMIN",
  "TIDEWORKS",
  "BRIGHTFOLK",
];

function applyTheme(nextTheme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", nextTheme === "dark");
  root.style.colorScheme = nextTheme;
}

function getResolvedTheme(): Theme {
  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function LandingPage() {
  useEffect(() => {
    applyTheme(getResolvedTheme());
  }, []);

  const handleThemeToggle = (
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    const nextTheme: Theme = document.documentElement.classList.contains("dark")
      ? "light"
      : "dark";
    const root = document.documentElement;
    const documentWithViewTransition = document as Document & {
      startViewTransition?: (
        updateCallback: () => void | Promise<void>,
      ) => { finished: Promise<void> };
    };
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const canAnimate =
      Boolean(documentWithViewTransition.startViewTransition) &&
      !prefersReducedMotion;

    const updateTheme = () => {
      applyTheme(nextTheme);
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    };

    if (!canAnimate) {
      updateTheme();
      return;
    }

    const toggleRect = event.currentTarget.getBoundingClientRect();
    const originX = toggleRect.left + toggleRect.width / 2;
    const originY = toggleRect.top + toggleRect.height / 2;

    root.style.setProperty("--theme-reveal-x", `${originX}px`);
    root.style.setProperty("--theme-reveal-y", `${originY}px`);
    root.classList.add("theme-transition");

    const transition = documentWithViewTransition.startViewTransition?.(() => {
      updateTheme();
    });

    transition?.finished.finally(() => {
      root.classList.remove("theme-transition");
    });
  };

  return (
    <div className="landing-slow-reveal relative min-h-screen overflow-hidden pb-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-4 h-72 w-72 rounded-full bg-cyan-400/12 blur-3xl dark:bg-cyan-300/16" />
        <div className="absolute right-[-4rem] top-24 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl dark:bg-indigo-400/15" />
        <div className="absolute inset-x-0 top-0 h-[44rem] grid-fade opacity-80 dark:opacity-45" />
      </div>

      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-background/80 backdrop-blur-xl dark:border-slate-800/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-[0_14px_36px_-20px_rgba(6,182,212,0.75)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-heading text-lg font-semibold tracking-tight text-slate-950 dark:text-slate-100">
                Portfolia
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                AI Proposal Operating System
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-300 dark:hover:text-slate-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleThemeToggle}
              aria-label="Toggle theme"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/90 text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-slate-100"
            >
              <MoonStar className="h-4 w-4 dark:hidden" />
              <SunMedium className="hidden h-4 w-4 dark:block" />
            </button>
            <Link
              href="/sign-in"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "hidden sm:inline-flex dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-slate-100",
              )}
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className={cn(buttonVariants({ size: "sm" }), "gap-2")}
            >
              Generate Proposal
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-24 px-5 pt-14 sm:px-8 lg:px-10 lg:gap-28">
        <section
          id="hero"
          className="grid items-start gap-14 lg:grid-cols-[1.05fr_0.95fr]"
        >
          <div className="reveal-up max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/80 bg-cyan-50/85 px-3 py-1.5 text-sm font-medium text-cyan-800 shadow-sm dark:border-cyan-800/80 dark:bg-cyan-950/50 dark:text-cyan-200">
              <Sparkles className="h-4 w-4" />
              Built for freelancers and agencies
            </div>

            <h1 className="mt-6 text-balance font-heading text-5xl font-semibold leading-[0.94] text-slate-950 sm:text-6xl lg:text-7xl dark:text-slate-100">
              Win more clients with polished proposals in minutes.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl dark:text-slate-300">
              Portfolia turns messy project notes into clear, conversion-ready
              proposals with strong scope, pricing, and delivery structure so
              you can move from lead to signed deal faster.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/sign-up"
                className={cn(buttonVariants({ size: "lg" }), "gap-2")}
              >
                Generate Proposal
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#product-preview"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-100 dark:hover:bg-slate-800",
                )}
              >
                See Demo
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {heroStats.map((stat, index) => (
                <Card
                  key={stat.label}
                  className={cn(
                    "surface motion-card rounded-3xl border-slate-200/70 dark:border-slate-800/75",
                    index === 1 &&
                      "border-cyan-200/80 bg-cyan-50/65 dark:border-cyan-800/80 dark:bg-cyan-950/40",
                  )}
                >
                  <CardContent className="p-5">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">
                      {stat.value}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="reveal-up reveal-delay-2 relative">
            <div className="absolute -inset-3 -z-10 rounded-[2.5rem] bg-gradient-to-br from-cyan-200/45 via-transparent to-blue-200/45 blur-2xl dark:from-cyan-700/25 dark:to-indigo-700/20" />
            <Card className="surface overflow-hidden rounded-[2rem] border-slate-200/80 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.4)] dark:border-slate-800/85">
              <CardContent className="p-0">
                <div className="border-b border-slate-200/80 px-6 py-5 dark:border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                        Live Proposal Preview
                      </p>
                      <h2 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-slate-100">
                        Acme Co. Website Redesign
                      </h2>
                    </div>
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700 dark:border-emerald-900/80 dark:bg-emerald-950/40 dark:text-emerald-300">
                      Ready to send
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 p-6">
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      ["Scope Confidence", "92%"],
                      ["Estimated Margin", "41%"],
                      ["Close Probability", "High"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 dark:border-slate-800/80 dark:bg-slate-900/75"
                      >
                        <p className="text-xs uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                          {label}
                        </p>
                        <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-slate-100">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-[1.6rem] border border-slate-200/80 bg-white/85 p-5 dark:border-slate-800/80 dark:bg-slate-900/80">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                          Milestones
                        </h3>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          6 weeks
                        </span>
                      </div>
                      <div className="space-y-3">
                        {[
                          ["Discovery and audit", "Week 1"],
                          ["Wireframes and direction", "Week 2-3"],
                          ["UI implementation", "Week 4-5"],
                          ["Handover and launch", "Week 6"],
                        ].map(([label, week]) => (
                          <div
                            key={label}
                            className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-slate-50/85 px-3 py-2.5 dark:border-slate-700/80 dark:bg-slate-800/55"
                          >
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                              {label}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {week}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[1.6rem] border border-slate-200/80 bg-white/85 p-5 dark:border-slate-800/80 dark:bg-slate-900/80">
                      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                        Pricing Options
                      </h3>
                      <div className="mt-4 space-y-3">
                        {[
                          ["Essential", "$6,500"],
                          ["Growth", "$9,800"],
                          ["Premium", "$13,400"],
                        ].map(([plan, price], index) => (
                          <div
                            key={plan}
                            className={cn(
                              "rounded-xl border px-4 py-3",
                              index === 1
                                ? "border-cyan-200 bg-cyan-50 dark:border-cyan-800/80 dark:bg-cyan-950/45"
                                : "border-slate-200 bg-slate-50 dark:border-slate-700/80 dark:bg-slate-800/55",
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-slate-800 dark:text-slate-100">
                                {plan}
                              </span>
                              <span className="text-sm text-slate-600 dark:text-slate-300">
                                {price}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 rounded-xl border border-dashed border-cyan-300 bg-cyan-50/80 px-3 py-2 text-xs text-cyan-800 dark:border-cyan-800/80 dark:bg-cyan-950/45 dark:text-cyan-200">
                        AI note: Growth package aligns best with timeline and
                        margin target.
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="problem" className="reveal-up">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-300">
              The Problem
            </p>
            <h2 className="mt-4 text-balance font-heading text-4xl font-semibold text-slate-950 sm:text-5xl dark:text-slate-100">
              Great work gets lost in weak, slow proposal workflows.
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
              Freelancers and agencies often lose momentum between discovery
              calls and client approval because proposals are manual, unclear,
              and hard to scale.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {painPoints.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.title}
                  className="surface motion-card rounded-[1.65rem] border-slate-200/75 dark:border-slate-800/80"
                >
                  <CardContent className="p-6">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700 dark:bg-cyan-950/55 dark:text-cyan-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-slate-950 dark:text-slate-100">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-base leading-7 text-slate-600 dark:text-slate-300">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section
          id="solution"
          className="reveal-up reveal-delay-1 grid gap-8 lg:grid-cols-[0.92fr_1.08fr]"
        >
          <Card className="surface rounded-[2rem] border-slate-200/75 dark:border-slate-800/85">
            <CardContent className="p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-300">
                The Solution
              </p>
              <h2 className="mt-4 text-4xl font-semibold text-slate-950 dark:text-slate-100">
                Portfolia gives your team a repeatable proposal engine.
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
                Instead of starting from scratch, you move through a guided flow
                that captures project context, auto-builds strategic proposal
                drafts, and keeps quality consistent from first version to final
                export.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Outcome-driven proposal structure by default",
                  "Clear pricing and scope options clients can understand",
                  "Faster review cycles with fewer back-and-forth edits",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-cyan-600 dark:text-cyan-300" />
                    <span className="text-base text-slate-700 dark:text-slate-200">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="surface rounded-[2rem] border-slate-200/75 dark:border-slate-800/85">
            <CardContent className="grid gap-4 p-8">
              <div className="rounded-2xl border border-slate-200/75 bg-white/85 p-5 dark:border-slate-800/80 dark:bg-slate-900/75">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Pipeline status
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-950 dark:text-slate-100">
                  18 active proposals
                </p>
                <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-300">
                  +7 sent this week
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/75 bg-white/85 p-5 dark:border-slate-800/80 dark:bg-slate-900/75">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Team consistency score
                </p>
                <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-cyan-500 to-blue-600" />
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                  84% of drafts match your top-performing proposal format.
                </p>
              </div>
              <div className="rounded-2xl border border-cyan-200 bg-cyan-50/80 p-5 dark:border-cyan-800/80 dark:bg-cyan-950/45">
                <p className="text-sm font-semibold text-cyan-800 dark:text-cyan-200">
                  Revenue impact
                </p>
                <p className="mt-2 text-2xl font-semibold text-cyan-950 dark:text-cyan-100">
                  $54,300 projected uplift this quarter
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="features" className="reveal-up">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-300">
              Features
            </p>
            <h2 className="mt-4 text-balance font-heading text-4xl font-semibold text-slate-950 sm:text-5xl dark:text-slate-100">
              Everything needed to craft premium proposals at scale.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featureCards.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="surface motion-card rounded-[1.65rem] border-slate-200/75 dark:border-slate-800/80"
                >
                  <CardContent className="p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-[0_12px_35px_-18px_rgba(15,23,42,0.65)] dark:bg-slate-100 dark:text-slate-900">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-slate-950 dark:text-slate-100">
                      {feature.title}
                    </h3>
                    <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section id="product-preview" className="reveal-up reveal-delay-2">
          <Card className="surface overflow-hidden rounded-[2rem] border-slate-200/80 dark:border-slate-800/85">
            <CardContent className="p-0">
              <div className="grid gap-0 lg:grid-cols-[0.34fr_0.66fr]">
                <div className="border-b border-slate-200/80 bg-slate-50/75 p-6 lg:border-b-0 lg:border-r dark:border-slate-800/80 dark:bg-slate-900/75">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    Proposal Pipeline
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-slate-100">
                    Team workspace
                  </h3>
                  <div className="mt-6 space-y-3">
                    {[
                      ["Discovery received", "7"],
                      ["Draft generated", "11"],
                      ["Client review", "4"],
                      ["Signed", "6"],
                    ].map(([label, count], index) => (
                      <div
                        key={label}
                        className={cn(
                          "flex items-center justify-between rounded-xl border px-4 py-3",
                          index === 1
                            ? "border-cyan-200 bg-cyan-50 dark:border-cyan-800/80 dark:bg-cyan-950/45"
                            : "border-slate-200 bg-white dark:border-slate-700/80 dark:bg-slate-800/60",
                        )}
                      >
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                          {label}
                        </span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white/80 p-4 text-sm text-slate-600 dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-300">
                    Built for freelancers and agency teams who need speed
                    without sacrificing quality.
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-300">
                        Product Preview
                      </p>
                      <h3 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-slate-100">
                        Proposal Editor
                      </h3>
                    </div>
                    <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      Auto-saved 2m ago
                    </span>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
                    <div className="rounded-2xl border border-slate-200/75 bg-white/80 p-5 dark:border-slate-800/80 dark:bg-slate-900/80">
                      <div className="space-y-3">
                        <div className="h-3 w-2/5 rounded-full bg-slate-200 dark:bg-slate-700" />
                        <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-700" />
                        <div className="h-3 w-11/12 rounded-full bg-slate-200 dark:bg-slate-700" />
                        <div className="h-3 w-10/12 rounded-full bg-slate-200 dark:bg-slate-700" />
                      </div>
                      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
                        <p className="text-xs uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                          Deliverables
                        </p>
                        <div className="mt-3 space-y-2">
                          {[
                            "UX audit and sitemap",
                            "High-fidelity interface system",
                            "Responsive implementation package",
                          ].map((item) => (
                            <div
                              key={item}
                              className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200"
                            >
                              <div className="h-1.5 w-1.5 rounded-full bg-cyan-600 dark:bg-cyan-300" />
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200/75 bg-white/80 p-5 dark:border-slate-800/80 dark:bg-slate-900/80">
                      <p className="text-xs uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                        AI Suggestions
                      </p>
                      <div className="mt-4 space-y-3">
                        {[
                          "Add optional maintenance retainer section",
                          "Clarify CMS handover training scope",
                          "Use outcome-focused copy in opening summary",
                        ].map((tip) => (
                          <div
                            key={tip}
                            className="rounded-xl border border-cyan-200/80 bg-cyan-50/90 px-3 py-2.5 text-sm text-cyan-800 dark:border-cyan-800/80 dark:bg-cyan-950/45 dark:text-cyan-200"
                          >
                            {tip}
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" }),
                          "mt-4 w-full dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
                        )}
                      >
                        Apply all suggestions
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="how-it-works" className="reveal-up">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-300">
              How It Works
            </p>
            <h2 className="mt-4 text-balance font-heading text-4xl font-semibold text-slate-950 sm:text-5xl dark:text-slate-100">
              A 3-step flow from lead notes to client-ready proposal.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {howItWorks.map((item) => (
              <Card
                key={item.step}
                className="surface motion-card relative rounded-[1.65rem] border-slate-200/75 dark:border-slate-800/80"
              >
                <CardContent className="p-6">
                  <div className="inline-flex h-10 min-w-10 items-center justify-center rounded-full bg-slate-900 px-3 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
                    {item.step}
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold text-slate-950 dark:text-slate-100">
                    {item.title}
                  </h3>
                  <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="social-proof" className="reveal-up reveal-delay-1">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-300">
              Social Proof
            </p>
            <h2 className="mt-4 text-balance font-heading text-4xl font-semibold text-slate-950 sm:text-5xl dark:text-slate-100">
              Built for freelancers and agencies who need to close with
              confidence.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {testimonials.map((item) => (
              <Card
                key={item.name}
                className="surface motion-card rounded-[1.65rem] border-slate-200/75 dark:border-slate-800/80"
              >
                <CardContent className="p-6">
                  <p className="text-lg leading-8 text-slate-700 dark:text-slate-200">
                    <span aria-hidden="true">&ldquo;</span>
                    {item.quote}
                    <span aria-hidden="true">&rdquo;</span>
                  </p>
                  <div className="mt-6">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {item.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {item.role}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800/80 dark:bg-slate-900/70">
            <div className="grid grid-cols-2 gap-2 text-center sm:grid-cols-3 lg:grid-cols-6">
              {brandLogos.map((logo) => (
                <div
                  key={logo}
                  className="rounded-xl border border-slate-200/75 bg-slate-50/80 px-3 py-2 text-xs font-semibold tracking-[0.12em] text-slate-500 dark:border-slate-700/75 dark:bg-slate-800/65 dark:text-slate-300"
                >
                  {logo}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="reveal-up reveal-delay-2">
          <Card className="overflow-hidden rounded-[2rem] border-none bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800 text-white shadow-[0_30px_100px_-45px_rgba(8,47,73,0.75)]">
            <CardContent className="relative px-7 py-10 sm:px-10 sm:py-14">
              <div className="absolute -left-10 top-6 h-36 w-36 rounded-full bg-cyan-300/20 blur-3xl" />
              <div className="absolute -right-10 bottom-0 h-44 w-44 rounded-full bg-blue-300/20 blur-3xl" />
              <div className="relative">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-200">
                  Start Closing Faster
                </p>
                <h2 className="mt-4 max-w-3xl text-balance font-heading text-4xl font-semibold leading-tight sm:text-5xl">
                  Move from discovery call to premium proposal before your
                  competitor sends version one.
                </h2>
                <p className="mt-5 max-w-2xl text-lg text-slate-200">
                  Join freelancers and agencies using Portfolia to ship clearer
                  proposals, protect margins, and win better-fit projects.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/sign-up"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "gap-2 border border-cyan-200/50 bg-white text-slate-900 shadow-none hover:bg-slate-100",
                    )}
                  >
                    Generate Proposal
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/sign-in"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "border-white/30 bg-white/8 text-white hover:bg-white/16",
                    )}
                  >
                    See workspace
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="mx-auto mt-20 max-w-7xl border-t border-slate-200/75 px-5 pb-10 pt-8 sm:px-8 lg:px-10 dark:border-slate-800/80">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <p className="font-heading text-lg font-semibold text-slate-950 dark:text-slate-100">
                Portfolia
              </p>
            </div>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Proposal intelligence for freelancers and agencies that want
              better margins, faster delivery, and cleaner client decisions.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            <div className="space-y-2">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                Product
              </p>
              <Link
                href="#features"
                className="block text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-100"
              >
                Features
              </Link>
              <Link
                href="#product-preview"
                className="block text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-100"
              >
                Demo
              </Link>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                Company
              </p>
              <Link
                href="#social-proof"
                className="block text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-100"
              >
                Testimonials
              </Link>
              <Link
                href="#how-it-works"
                className="block text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-100"
              >
                How it works
              </Link>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                Contact
              </p>
              <Link
                href="mailto:hello@portfolia.app"
                className="block text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-100"
              >
                hello@portfolia.app
              </Link>
              <Link
                href="/sign-up"
                className="block text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-100"
              >
                Start free
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
