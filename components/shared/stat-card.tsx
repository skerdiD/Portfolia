import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const toneStyles = {
  primary: {
    iconWrap: "bg-blue-50 text-blue-600",
    trend: "bg-blue-50 text-blue-700",
  },
  success: {
    iconWrap: "bg-emerald-50 text-emerald-600",
    trend: "bg-emerald-50 text-emerald-700",
  },
  danger: {
    iconWrap: "bg-rose-50 text-rose-600",
    trend: "bg-rose-50 text-rose-700",
  },
};

export function StatCard({
  title,
  value,
  detail,
  icon: Icon,
  trend,
  tone = "primary",
}: {
  title: string;
  value: string;
  detail?: string;
  icon: LucideIcon;
  tone?: keyof typeof toneStyles;
  trend?: {
    label: string;
    positive?: boolean;
  };
}) {
  const styles = toneStyles[tone];

  return (
    <Card className="surface rounded-[1.75rem]">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <div className="font-heading text-3xl font-semibold tracking-tight text-slate-950">
              {value}
            </div>
          </div>

          <div
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm",
              styles.iconWrap,
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>

        {detail ? (
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{detail}</p>
        ) : null}

        {trend ? (
          <div
            className={cn(
              "mt-4 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium",
              trend.positive ? styles.trend : "bg-rose-50 text-rose-700",
            )}
          >
            {trend.label}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}