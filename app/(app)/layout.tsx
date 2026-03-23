import { auth } from "@clerk/nextjs/server";
import { unauthorized } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    unauthorized();
  }

  return <AppShell>{children}</AppShell>;
}
