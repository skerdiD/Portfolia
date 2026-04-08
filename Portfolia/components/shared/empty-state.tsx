import { Inbox } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <Card className="surface rounded-[1.75rem] border-white/80">
      <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center sm:px-8 sm:py-14">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-600 shadow-sm">
          {icon ?? <Inbox className="h-6 w-6" />}
        </div>
        <h3 className="mt-5 font-heading text-2xl font-semibold tracking-tight text-slate-950">
          {title}
        </h3>
        <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
          {description}
        </p>
        {action ? <div className="mt-6">{action}</div> : null}
      </CardContent>
    </Card>
  );
}
