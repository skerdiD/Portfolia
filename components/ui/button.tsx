import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "secondary" | "outline" | "ghost";
type ButtonSize = "default" | "sm" | "lg" | "icon";

export function buttonVariants({
  variant = "default",
  size = "default",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  const variantStyles: Record<ButtonVariant, string> = {
    default:
      "bg-blue-600 text-white shadow-[0_10px_25px_-14px_rgba(37,99,235,0.8)] hover:bg-blue-700",
    secondary:
      "bg-slate-100 text-slate-900 hover:bg-slate-200",
    outline:
      "border border-slate-200 bg-white text-slate-900 shadow-sm hover:bg-slate-50",
    ghost:
      "bg-transparent text-slate-700 hover:bg-slate-100",
  };

  const sizeStyles: Record<ButtonSize, string> = {
    default: "h-11 px-5 py-2.5 rounded-2xl",
    sm: "h-10 px-4 py-2 rounded-xl",
    lg: "h-12 px-6 py-3 rounded-2xl",
    icon: "h-11 w-11 rounded-2xl",
  };

  return cn(
    "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-[transform,box-shadow,background-color,border-color,color] duration-150 ease-out disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 enabled:active:scale-[0.985] motion-reduce:transform-none",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button };
