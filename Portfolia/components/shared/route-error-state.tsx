"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type RouteErrorStateProps = {
  title: string;
  description: string;
  reset: () => void;
};

export function RouteErrorState({
  title,
  description,
  reset,
}: RouteErrorStateProps) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center py-10">
      <Card className="surface w-full max-w-2xl rounded-[2rem] border-white/80 shadow-[0_26px_70px_-30px_rgba(15,23,42,0.22)]">
        <CardContent className="px-8 py-10 text-center sm:px-10 sm:py-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-50 text-amber-600 shadow-sm">
            <AlertTriangle className="h-7 w-7" />
          </div>

          <h2 className="mt-6 font-heading text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {title}
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            {description}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" onClick={reset} className="gap-2">
              <RefreshCcw className="h-4 w-4" />
              Try again
            </Button>
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Go to dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}