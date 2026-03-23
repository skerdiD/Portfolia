import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
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
      title="Welcome back"
      description="Sign in to continue into your private investment workspace."
      footer={
        <p className="text-sm text-slate-500">
          New to Portfolia?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-blue-600 transition hover:text-blue-700"
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