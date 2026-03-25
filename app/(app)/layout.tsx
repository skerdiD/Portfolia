import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect, unauthorized } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (process.env.E2E_TEST_MODE === "1") {
    const cookieStore = await cookies();
    const e2eAuthCookie = cookieStore.get("e2e-auth")?.value;

    if (e2eAuthCookie !== "1") {
      redirect("/unauthorized");
    }

    return <main>{children}</main>;
  }

  const { userId } = await auth();

  if (!userId) {
    unauthorized();
  }

  return <AppShell>{children}</AppShell>;
}
