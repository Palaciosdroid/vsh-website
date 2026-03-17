import { test, expect } from "@playwright/test";

test.describe("Therapeuten-Suche", () => {
  test("Suchseite laedt mit Filtern", async ({ page }) => {
    await page.goto("/therapeuten");

    // Heading
    await expect(
      page.getByRole("heading", { name: "Therapeuten finden" })
    ).toBeVisible();

    // Desktop filter sidebar should be visible on wide viewports
    // (Playwright default viewport is 1280x720 which qualifies as lg)
    await expect(page.getByRole("button", { name: /Suchen/i })).toBeVisible();
  });

  test("Filter-Sidebar ist interaktiv", async ({ page }) => {
    await page.goto("/therapeuten");

    // Toggle between Karte and Liste views
    const listeButton = page.getByRole("button", { name: /Liste/i });
    await listeButton.click();

    // URL should not have changed page, still on /therapeuten
    await expect(page).toHaveURL(/\/therapeuten/);

    // Switch back to map
    const karteButton = page.getByRole("button", { name: /Karte/i });
    await karteButton.click();
    await expect(page).toHaveURL(/\/therapeuten/);
  });

  test("Suchergebnisse zeigen Karten oder Leer-Zustand", async ({ page }) => {
    await page.goto("/therapeuten");

    // Wait for loading to finish (spinner disappears)
    await page.waitForFunction(
      () => !document.querySelector('[class*="animate-spin"]'),
      { timeout: 15_000 }
    );

    // Either therapist cards are shown or the empty state message
    const hasResults = await page.getByText(/Ergebnis/i).isVisible();
    const hasEmpty = await page
      .getByText("Keine Therapeuten gefunden")
      .isVisible()
      .catch(() => false);

    expect(hasResults || hasEmpty).toBeTruthy();
  });
});
