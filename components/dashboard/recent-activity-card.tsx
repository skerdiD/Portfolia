"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Clock3 } from "lucide-react";
import type { HoldingRecord } from "@/lib/portfolio/calculations";
import { buttonVariants } from "@/components/ui/button";
import { formatDate } from "@/lib/portfolio/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type RecentActivityCardProps = {
  holdings: HoldingRecord[];
};

type ActivityItem = {
  id: string;
  title: string;
  description: string;
  date: Date;
};

function buildActivities(holdings: HoldingRecord[]): ActivityItem[] {
  const items: ActivityItem[] = [];

  for (const holding of holdings) {
    items.push({
      id: `${holding.id}-created`,
      title: `Holding added`,
      description: `${holding.assetName} (${holding.symbol}) was added to your portfolio.`,
      date: holding.createdAt,
    });

    if (holding.updatedAt.getTime() !== holding.createdAt.getTime()) {
      items.push({
        id: `${holding.id}-updated`,
        title: `Holding updated`,
        description: `${holding.assetName} was updated with refreshed position data.`,
        date: holding.updatedAt,
      });
    }
  }

  return items
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);
}

export function RecentActivityCard({ holdings }: RecentActivityCardProps) {
  const items = useMemo(() => buildActivities(holdings), [holdings]);

  return (
    <Card className="surface rounded-[1.75rem]">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-950">
          Recent activity
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          A timeline view based on your most recent holding changes.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div key={item.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="mt-1 h-3 w-3 rounded-full bg-blue-600" />
                {index !== items.length - 1 ? (
                  <div className="mt-2 h-full w-px bg-slate-200" />
                ) : null}
              </div>

              <div className="flex-1 rounded-[1.35rem] border border-slate-200/80 bg-white/85 px-4 py-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-medium text-slate-950">{item.title}</div>
                  <div className="text-sm text-slate-500">{formatDate(item.date)}</div>
                </div>
                <div className="mt-1 text-sm leading-6 text-slate-600">
                  {item.description}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[1.35rem] border border-slate-200/80 bg-slate-50/70 px-5 py-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm">
              <Clock3 className="h-5 w-5" />
            </div>
            <div className="mt-3 text-base font-semibold text-slate-900">
              No activity yet
            </div>
            <div className="mt-1 text-sm text-slate-500">
              Your timeline will populate when holdings are added or updated.
            </div>
            <Link
              href="/holdings"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-4")}
            >
              Add first holding
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
