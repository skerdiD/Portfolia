import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/holdings(.*)",
  "/analytics(.*)",
  "/settings(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    if (process.env.E2E_TEST_MODE === "1") {
      const isE2EAuthenticated = req.cookies.get("e2e-auth")?.value === "1";

      if (!isE2EAuthenticated) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }

      return;
    }

    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
