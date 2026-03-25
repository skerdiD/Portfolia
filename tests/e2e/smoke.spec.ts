import { expect, test, type BrowserContext } from "@playwright/test";

async function signInForE2E(context: BrowserContext) {
  await context.addCookies([
    {
      name: "e2e-auth",
      value: "1",
      domain: "localhost",
      path: "/",
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
    },
  ]);
}

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /modern portfolio workspace/i }),
  ).toBeVisible();
});

test("guest is blocked from protected route", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(
    page.getByRole("heading", { name: /investment dashboard/i }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", {
      name: /this page could not be found|you are not allowed to access this page|welcome back/i,
    }),
  ).toBeVisible();
});

test("signed-in user can open dashboard", async ({ context, page }) => {
  await signInForE2E(context);
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: "Investment dashboard" })).toBeVisible();
});

test("signed-in user can open holdings", async ({ context, page }) => {
  await signInForE2E(context);
  await page.goto("/holdings");
  await expect(page.getByRole("heading", { name: "Holdings" })).toBeVisible();
});

test("signed-in user can open analytics", async ({ context, page }) => {
  await signInForE2E(context);
  await page.goto("/analytics");
  await expect(page.getByRole("heading", { name: "Analytics" })).toBeVisible();
});

test("signed-in user can open create-holding flow", async ({ context, page }) => {
  await signInForE2E(context);
  await page.goto("/holdings");

  await page.getByRole("button", { name: "Add holding" }).first().click();
  await expect(page.getByRole("heading", { name: "Add new holding" })).toBeVisible();
});
