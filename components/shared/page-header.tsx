import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "surface-muted flex flex-col gap-5 rounded-[1.6rem] border-white/80 px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6 sm:py-6",
        className,
      )}
    >
      <div className="max-w-3xl min-w-0">
        {eyebrow ? (
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 sm:text-sm">
            {eyebrow}
          </div>
        ) : null}
        <h1 className="font-heading text-[2rem] font-semibold tracking-tight text-slate-950 sm:text-[2.45rem]">
          {title}
        </h1>
        {description ? (
          <p className="mt-2.5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            {description}
          </p>
        ) : null}
      </div>

      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
