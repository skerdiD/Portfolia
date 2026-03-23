import Link from "next/link";
import { ArrowRight, BarChart3, Sparkles, Wallet2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const setupSteps = [
  {
    icon: Wallet2,
    title: "Add your first holding",
    description:
      "Start by creating a stock, crypto, ETF, or cash position inside your portfolio.",
  },
  {
    icon: BarChart3,
    title: "Unlock analytics",
    description:
      "Portfolio value, allocation views, and performance charts appear as soon as holdings exist.",
  },
  {
    icon: Sparkles,
    title: "Build your private dashboard",
    description:
      "Each account keeps its own isolated data, ready for personal portfolio analysis.",
  },
];

export function NewUserEmptyState() {
  return (
    <Card className="surface overflow-hidden rounded-[1.9rem]">
      <CardContent className="p-6 sm:p-8">
        <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr] xl:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
              <Sparkles className="h-4 w-4" />
              New portfolio setup
            </div>

            <h2 className="font-heading text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Your portfolio starts here
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              You are signed in and your private workspace is ready. Add your first
              holding to transform this shell into a real investment dashboard.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/holdings"
                className={cn(buttonVariants({ size: "lg" }), "gap-2")}
              >
                Go to holdings
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/analytics"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                View analytics page
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {setupSteps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className="rounded-[1.5rem] border border-slate-200/80 bg-white/85 p-5 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-950">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600 sm:text-base">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}