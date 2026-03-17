import { test, expect } from "@playwright/test";

test.describe("Oeffentliche Seiten", () => {
  test("Homepage laedt mit VSH-Branding", async ({ page }) => {
    await page.goto("/");

    // VSH title text in hero
    await expect(
      page.getByText("Verband Schweizer Hypnosetherapeuten")
    ).toBeVisible();

    // Main headline
    await expect(
      page.getByRole("heading", { name: /Finden Sie Ihren/i })
    ).toBeVisible();

    // Search CTA
    await expect(
      page.getByPlaceholder(/PLZ, Ort oder Spezialisierung/i)
    ).toBeVisible();

    // Specializations section
    await expect(
      page.getByRole("heading", { name: "Beliebte Spezialisierungen" })
    ).toBeVisible();
  });

  test("Therapeuten-Verzeichnis laedt", async ({ page }) => {
    await page.goto("/therapeuten");

    // Page heading
    await expect(
      page.getByRole("heading", { name: "Therapeuten finden" })
    ).toBeVisible();

    // View toggle buttons
    await expect(page.getByRole("button", { name: /Karte/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Liste/i })).toBeVisible();
  });

  test("Navigationslinks funktionieren", async ({ page }) => {
    await page.goto("/");

    // Navigate to FAQ via link
    const faqLink = page.getByRole("link", { name: /FAQ/i }).first();
    await faqLink.click();
    await expect(page).toHaveURL(/\/faq/);

    // Navigate to Kontakt
    await page.goto("/");
    const kontaktLink = page.getByRole("link", { name: /Kontakt/i }).first();
    await kontaktLink.click();
    await expect(page).toHaveURL(/\/kontakt/);
  });

  test("FAQ-Seite rendert Inhalte", async ({ page }) => {
    await page.goto("/faq");

    // FAQ heading
    await expect(
      page.getByRole("heading", { name: /Häufig gestellte Fragen|FAQ/i })
    ).toBeVisible();

    // At least one question should be visible
    await expect(
      page.getByText("Kann jeder hypnotisiert werden?")
    ).toBeVisible();

    // Category heading
    await expect(page.getByText("Zur Hypnosetherapie")).toBeVisible();
  });

  test("Kontaktformular wird angezeigt", async ({ page }) => {
    await page.goto("/kontakt");

    // Form fields
    await expect(page.getByLabel(/Name/i)).toBeVisible();
    await expect(page.getByLabel(/E-Mail/i)).toBeVisible();
    await expect(page.getByLabel(/Nachricht/i)).toBeVisible();

    // Submit button
    await expect(
      page.getByRole("button", { name: /Senden|Absenden|Nachricht/i })
    ).toBeVisible();
  });
});
