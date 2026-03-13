import { expect, test } from "@playwright/test";

test("top bar hands the logo off to the sidebar after leaving the top of the page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /^settings$/i }).click();

  const pageScrollRoot = page.locator("[data-page-scroll-root]");
  const topbarFrame = page.locator(".app-shell__topbar-frame");
  const topbar = page.locator(".app-shell__topbar");
  const sidebarBrandCap = page.locator(".georim-sidebar-brand-cap");

  await expect(topbarFrame).toHaveAttribute("data-shell-scrolled", "false");
  await expect(sidebarBrandCap).toHaveCount(0);

  await pageScrollRoot.evaluate((node) => {
    node.scrollTo({ top: 420, behavior: "auto" });
  });

  await expect(topbarFrame).toHaveAttribute("data-shell-scrolled", "true");
  await expect(sidebarBrandCap).toBeVisible();

  await expect
    .poll(async () =>
      topbar.evaluate((element) => Number.parseFloat(getComputedStyle(element).left || "0"))
    )
    .toBeGreaterThan(60);

  await pageScrollRoot.evaluate((node) => {
    node.scrollTo({ top: 0, behavior: "auto" });
  });

  await expect(topbarFrame).toHaveAttribute("data-shell-scrolled", "false");
  await expect(sidebarBrandCap).toHaveCount(0);

  await expect
    .poll(async () =>
      topbar.evaluate((element) => Number.parseFloat(getComputedStyle(element).left || "0"))
    )
    .toBeLessThan(2);
});

test("clicking the compact sidebar logo returns the app to the default home state", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /^events$/i }).click();
  await page.getByRole("heading", { name: "Summer Music Festival 2026" }).click();

  const pageScrollRoot = page.locator("[data-page-scroll-root]");
  const topbarFrame = page.locator(".app-shell__topbar-frame");
  const sidebarBrandCap = page.locator(".georim-sidebar-brand-cap");

  await pageScrollRoot.evaluate((node) => {
    node.scrollTo({ top: 420, behavior: "auto" });
  });

  await expect(topbarFrame).toHaveAttribute("data-shell-scrolled", "true");
  await expect(sidebarBrandCap).toBeVisible();

  await sidebarBrandCap.click();

  await expect(page.getByRole("heading", { name: /welcome john/i })).toBeVisible();
  await expect(topbarFrame).toHaveAttribute("data-shell-scrolled", "false");
  await expect(sidebarBrandCap).toHaveCount(0);
  await expect
    .poll(async () => pageScrollRoot.evaluate((node) => node.scrollTop))
    .toBe(0);
});
