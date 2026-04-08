import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  density = "default",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  density?: "default" | "compact";
  className?: string;
}) {
  const isCompact = density === "compact";

  return (
    <div
      className={cn(
        "surface-muted flex flex-col rounded-[1.6rem] border-white/80 sm:flex-row sm:items-end sm:justify-between",
        isCompact
          ? "gap-3 px-5 py-4 sm:px-6 sm:py-[1.125rem]"
          : "gap-5 px-5 py-5 sm:px-6 sm:py-6",
        className,
      )}
    >
      <div className="max-w-3xl min-w-0">
        {eyebrow ? (
          <div
            className={cn(
              "text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 sm:text-sm",
              isCompact ? "mb-1.5" : "mb-2",
            )}
          >
            {eyebrow}
          </div>
        ) : null}
        <h1
          className={cn(
            "font-heading font-semibold tracking-tight text-slate-950",
            isCompact ? "text-[1.75rem] sm:text-[2.05rem]" : "text-[2rem] sm:text-[2.45rem]",
          )}
        >
          {title}
        </h1>
        {description ? (
          <p
            className={cn(
              "max-w-2xl text-sm text-muted-foreground sm:text-base",
              isCompact ? "mt-2 leading-[1.65]" : "mt-2.5 leading-7",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>

      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
