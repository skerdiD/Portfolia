import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LandingPage } from "@/components/marketing/landing-page";

export default async function HomePage() {
  if (process.env.E2E_TEST_MODE === "1") {
    const cookieStore = await cookies();
    const e2eAuthCookie = cookieStore.get("e2e-auth")?.value;

    if (e2eAuthCookie === "1") {
      redirect("/dashboard");
    }
  } else {
    const { userId } = await auth();

    if (userId) {
      redirect("/dashboard");
    }
  }

  return <LandingPage />;
}
