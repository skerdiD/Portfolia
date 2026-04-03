import { SignUp } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { clerkAppearance } from "@/components/auth/clerk-appearance";

export default async function SignUpPage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <AuthPageShell
      title="Create your Portfolia account"
      description="Start with a secure, polished personal investment dashboard designed for real-world portfolio tracking."
      footer={
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-blue-600 transition hover:text-blue-700 dark:text-cyan-300 dark:hover:text-cyan-200"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <SignUp
        appearance={clerkAppearance}
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/dashboard"
        forceRedirectUrl="/dashboard"
      />
    </AuthPageShell>
  );
}
