import { expect, test } from "@playwright/test";

test("profile menu shows account actions and opens account settings", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Open profile menu" }).click();

  await expect(page.getByRole("dialog", { name: "Profile menu" })).toBeVisible();
  await expect(page.getByText("Switch to attending")).toBeVisible();
  await expect(page.getByText("Help Center")).toBeVisible();
  await expect(page.getByText("Account Settings")).toBeVisible();
  await expect(page.getByText("Log out")).toBeVisible();
  await expect(page.getByText("john.doe@georim.com")).toBeVisible();

  await page.getByRole("button", { name: "Account Settings" }).click();
  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
});
