import Link from "next/link";
import { SignUp } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
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
      description="Start with a secure, polished personal investment dashboard built for clarity."
      footer={
        <p className="text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-blue-600 transition hover:text-blue-700"
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