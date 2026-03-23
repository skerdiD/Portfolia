import Link from "next/link";
import { LockKeyhole, ShieldAlert } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function UnauthorizedState() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="grid-fade absolute inset-0" />
      </div>

      <Card className="surface relative z-10 w-full max-w-2xl rounded-[2rem] border-white/80 shadow-[0_26px_70px_-30px_rgba(15,23,42,0.24)]">
        <CardContent className="px-8 py-10 text-center sm:px-10 sm:py-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-50 text-rose-600 shadow-sm">
            <ShieldAlert className="h-7 w-7" />
          </div>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-sm font-medium text-slate-600">
            <LockKeyhole className="h-4 w-4" />
            Protected workspace
          </div>

          <h1 className="mt-5 font-heading text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            You are not allowed to access this page
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            This area is reserved for authenticated portfolio access. Sign in to continue
            into your private investment workspace.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/sign-in" className={buttonVariants({ size: "lg" })}>
              Sign in
            </Link>
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Back home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}