import Link from "next/link";
import { ArrowRight, BarChart3, PieChart, Wallet2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: Wallet2,
    title: "Add your first holding",
    description:
      "Create a stock, crypto, ETF, cash, or custom position to start building a real portfolio.",
  },
  {
    icon: BarChart3,
    title: "Unlock performance analytics",
    description:
      "Portfolio value, gain/loss, and return metrics begin updating from your actual holdings data.",
  },
  {
    icon: PieChart,
    title: "See allocation clearly",
    description:
      "As assets are added, the dashboard turns into a full visual analytics workspace.",
  },
];

export function EmptyDashboardState() {
  return (
    <Card className="surface overflow-hidden rounded-[1.9rem]">
      <CardContent className="p-6 sm:p-8">
        <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr] xl:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
              Dashboard setup
            </div>

            <h2 className="font-heading text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Your analytics workspace is ready
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Portfolia is set up and authenticated. Add your first holding to turn
              this dashboard into a live investment analytics product with summary
              metrics, allocation visuals, and performance tracking.
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
                Open analytics
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {steps.map((step) => {
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