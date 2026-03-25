"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
  children: React.ReactNode;
};

export function Dialog({
  open,
  onOpenChange,
  trigger,
  children,
}: DialogProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onOpenChange]);

  return (
    <>
      <span
        onClick={() => onOpenChange(true)}
        className="inline-flex"
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpenChange(true);
          }
        }}
      >
        {trigger}
      </span>

      {open && typeof window !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 py-8 sm:px-6 sm:py-10">
              <button
                type="button"
                aria-label="Close dialog"
                className="dialog-overlay-enter absolute inset-0 bg-slate-950/45 backdrop-blur-[3px]"
                onClick={() => onOpenChange(false)}
              />
              <div
                className={cn(
                  "dialog-panel-enter relative z-[101] w-full max-w-3xl",
                )}
                onClick={(event) => event.stopPropagation()}
              >
                {children}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
