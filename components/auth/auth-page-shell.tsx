import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CircleDollarSign,
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
    icon: Sparkles,
    title: "Premium fintech feel",
    description:
      "Elegant cards, strong hierarchy, and refined UI details built for product-quality UX.",
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
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-12 top-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="grid-fade absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20">
              <CircleDollarSign className="h-5 w-5" />
            </div>
            <div>
              <div className="font-heading text-xl font-semibold tracking-tight text-slate-950">
                Portfolia
              </div>
              <div className="text-xs text-muted-foreground">
                Personal investment intelligence
              </div>
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-white"
          >
            Back home
            <ArrowRight className="h-4 w-4" />
          </Link>
        </header>

        <div className="flex flex-1 items-center py-10 lg:py-14">
          <div className="grid w-full items-stretch gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
            <div className="surface flex flex-col justify-between rounded-[2rem] border-white/80 p-6 shadow-[0_25px_70px_-30px_rgba(15,23,42,0.2)] sm:p-8">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-blue-50/80 px-3 py-1.5 text-sm font-medium text-blue-700 shadow-sm">
                  <Sparkles className="h-4 w-4" />
                  Secure account access
                </div>

                <h1 className="font-heading text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                  {title}
                </h1>

                <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                  {description}
                </p>

                <div className="mt-8 space-y-4">
                  {points.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-4"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-950">
                              {item.title}
                            </div>
                            <p className="mt-1 text-sm leading-6 text-slate-600">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 rounded-[1.5rem] border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-5">
                <div className="text-sm font-medium uppercase tracking-[0.16em] text-blue-700">
                  Built for modern investing
                </div>
                <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                  Premium portfolio UX from day one
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-full max-w-[30rem]">
                <div className="mb-5 space-y-1 text-center lg:text-left">
                  <div className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Portfolia access
                  </div>
                  {footer ? <div className="pt-1">{footer}</div> : null}
                </div>

                <div className="surface rounded-[2rem] border-white/80 p-3 shadow-[0_25px_70px_-30px_rgba(15,23,42,0.22)] sm:p-4">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}