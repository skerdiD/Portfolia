import { cn } from "@/lib/utils";

export function PortfoliaMark({
  className,
  iconClassName,
}: {
  className?: string;
  iconClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20",
        className,
      )}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 48 48"
        role="img"
        className={cn("h-7 w-7", iconClassName)}
        fill="none"
      >
        <path
          d="M16 35V13h12.2C33.1 13 36 15.8 36 20s-2.9 7-7.8 7H16"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21 25.5l4.2-4.2 3.5 3 5.6-7.2"
          stroke="#A7F3D0"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="34.3" cy="17.1" r="2" fill="#A7F3D0" />
      </svg>
    </div>
  );
}
