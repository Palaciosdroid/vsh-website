import { test, expect } from "@playwright/test";

test.describe("Auth – Login", () => {
  test("Login-Seite wird geladen", async ({ page }) => {
    await page.goto("/auth/login");

    // Heading
    await expect(page.getByRole("heading", { name: "Anmelden" })).toBeVisible();

    // Description text
    await expect(
      page.getByText("Melden Sie sich mit Ihrer E-Mail-Adresse an")
    ).toBeVisible();

    // Email input
    await expect(page.getByLabel("E-Mail")).toBeVisible();

    // Submit button (Magic Link is default mode)
    await expect(
      page.getByRole("button", { name: "Magic Link senden" })
    ).toBeVisible();
  });

  test("Formular-Validierung bei leeren Feldern", async ({ page }) => {
    await page.goto("/auth/login");

    // Switch to password mode so both fields are present
    await page.getByRole("button", { name: "Passwort" }).click();

    // Both email and password fields should be required
    const emailInput = page.getByLabel("E-Mail");
    const passwordInput = page.getByLabel("Passwort");
    await expect(emailInput).toHaveAttribute("required", "");
    await expect(passwordInput).toHaveAttribute("required", "");

    // Attempting to submit the empty form should not navigate away
    await page.getByRole("button", { name: "Anmelden" }).click();
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("Unauthentifizierte Nutzer werden von /dashboard zu /auth/login umgeleitet", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    // The dashboard layout redirects unauthenticated users to /auth/login
    await page.waitForURL(/\/auth\/login/);
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
