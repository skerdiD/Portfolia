import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CircleDollarSign,
  Gauge,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const points = [
  {
    icon: BarChart3,
    title: "Portfolio analytics",
    description:
      "Turn positions into performance trends, allocation breakdowns, and clear financial visibility.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    description:
      "Authenticated routes and user-isolated access keep every portfolio workspace secure.",
  },
  {
    icon: Gauge,
    title: "Performance-first UX",
    description:
      "Fast workflows, sharp hierarchy, and clean data surfaces built like a real product.",
  },
];

export function AuthPageShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden text-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-0 h-80 w-80 rounded-full bg-blue-500/12 blur-3xl dark:bg-blue-500/18" />
        <div className="absolute right-0 top-24 h-96 w-96 rounded-full bg-cyan-400/12 blur-3xl dark:bg-cyan-400/16" />
        <div className="absolute inset-y-0 right-0 w-[45%] bg-gradient-to-l from-cyan-100/35 to-transparent dark:from-cyan-900/28" />
        <div className="grid-fade absolute inset-0 opacity-85 dark:opacity-45" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[84rem] flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20">
              <CircleDollarSign className="h-5 w-5" />
            </div>
            <div>
              <div className="font-heading text-xl font-semibold tracking-tight text-slate-950 transition group-hover:text-blue-700 dark:text-slate-100 dark:group-hover:text-cyan-300">
                Portfolia
              </div>
              <div className="text-xs text-muted-foreground dark:text-slate-400">
                Personal investment intelligence
              </div>
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-white dark:border-slate-700 dark:bg-slate-900/85 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            Back home
            <ArrowRight className="h-4 w-4" />
          </Link>
        </header>

        <div className="flex flex-1 items-center py-8 lg:py-12">
          <div className="grid w-full items-stretch gap-7 lg:grid-cols-[1fr_1.08fr] lg:gap-10">
            <div className="surface flex flex-col justify-between rounded-[2rem] border-white/80 p-6 shadow-[0_30px_80px_-36px_rgba(15,23,42,0.28)] sm:p-8">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-blue-50/85 px-3 py-1.5 text-sm font-medium text-blue-700 shadow-sm dark:border-cyan-800/80 dark:bg-cyan-950/45 dark:text-cyan-200">
                  <Sparkles className="h-4 w-4" />
                  Secure account access
                </div>

                <h1 className="font-heading text-4xl font-semibold tracking-tight text-slate-950 sm:text-[3.5rem] sm:leading-[1.02] dark:text-slate-100">
                  {title}
                </h1>

                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                  {description}
                </p>

                <div className="mt-8 space-y-3.5">
                  {points.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="rounded-[1.4rem] border border-slate-200/80 bg-white/82 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200/80 hover:shadow-sm dark:border-slate-700/80 dark:bg-slate-900/70 dark:hover:border-cyan-700/80"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm dark:bg-cyan-950/55 dark:text-cyan-300">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-950 dark:text-slate-100">
                              {item.title}
                            </div>
                            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 grid gap-3 rounded-[1.5rem] border border-blue-100 bg-gradient-to-br from-blue-50/85 to-cyan-50/85 p-5 sm:grid-cols-3 dark:border-slate-700/80 dark:from-slate-900/80 dark:to-cyan-950/45">
                <div>
                  <div className="text-xs font-medium uppercase tracking-[0.16em] text-blue-700 dark:text-cyan-300">UX</div>
                  <div className="mt-1 text-xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">Premium</div>
                </div>
                <div>
                  <div className="text-xs font-medium uppercase tracking-[0.16em] text-blue-700 dark:text-cyan-300">Security</div>
                  <div className="mt-1 text-xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">Protected</div>
                </div>
                <div>
                  <div className="text-xs font-medium uppercase tracking-[0.16em] text-blue-700 dark:text-cyan-300">Data</div>
                  <div className="mt-1 text-xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">Accurate</div>
                </div>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-x-12 top-10 -z-10 h-40 rounded-full bg-blue-500/14 blur-3xl dark:bg-cyan-500/18" />
              <div className="w-full max-w-[36rem]">
                <div className="mb-5 space-y-1 text-center lg:pl-2 lg:text-left">
                  <div className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    Portfolia access
                  </div>
                  {footer ? <div className="pt-1">{footer}</div> : null}
                </div>

                <div className="rounded-[2.15rem] border border-white/70 bg-white/45 p-3 shadow-[0_30px_76px_-34px_rgba(15,23,42,0.28)] backdrop-blur-xl dark:border-slate-600/80 dark:bg-slate-900/45 sm:p-4">
                  <div className="surface rounded-[1.7rem] border-white/80 px-2 py-3 shadow-[0_20px_55px_-28px_rgba(15,23,42,0.26)] dark:border-slate-700/80 sm:px-3 sm:py-4">
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
