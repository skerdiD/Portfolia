import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { clerkAppearance } from "@/components/auth/clerk-appearance";

export default async function SignInPage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <AuthPageShell
      title="Welcome back to Portfolia"
      description="Sign in to continue tracking holdings, watching assets, and reviewing your portfolio performance in one place."
      footer={
        <p className="text-sm text-slate-600 dark:text-slate-300">
          New to Portfolia?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-blue-600 transition hover:text-blue-700 dark:text-cyan-300 dark:hover:text-cyan-200"
          >
            Create an account
          </Link>
        </p>
      }
    >
      <SignIn
        appearance={clerkAppearance}
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/dashboard"
        forceRedirectUrl="/dashboard"
      />
    </AuthPageShell>
  );
}
