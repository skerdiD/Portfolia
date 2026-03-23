"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!mobileSidebarOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileSidebarOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileSidebarOpen]);

  return (
    <div className="relative min-h-dvh">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-blue-500/8 blur-3xl" />
        <div className="absolute right-0 top-32 h-80 w-80 rounded-full bg-cyan-400/8 blur-3xl" />
      </div>

      <div className="hidden lg:block">
        <AppSidebar />
      </div>

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-slate-950/35 backdrop-blur-[2px]"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 h-full w-[88%] max-w-[320px] animate-in slide-in-from-left-8 duration-200">
            <AppSidebar mobile onNavigate={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="relative z-10 lg:pl-[18.5rem]">
        <AppTopbar onOpenSidebar={() => setMobileSidebarOpen(true)} />
        <main className="px-4 pb-8 pt-3 sm:px-6 lg:px-8 lg:pb-10 lg:pt-4">
          <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
