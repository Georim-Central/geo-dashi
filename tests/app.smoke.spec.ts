import { expect, test } from '@playwright/test';

test('dashboard and create event flow renders', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Dashboard (MVP)');
  await expect(page.getByRole('heading', { name: 'Events Dashboard' })).toBeVisible();

  await page.getByRole('main').getByRole('button', { name: 'Create Event' }).click();
  await expect(page.getByRole('heading', { name: 'Create New Event' })).toBeVisible();
});

test('ticketing modal buttons open and close correctly', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('heading', { name: 'Summer Music Festival 2026' }).click();
  await page.getByRole('main').getByRole('button', { name: 'Ticketing' }).first().click();

  await page.getByRole('button', { name: 'Add Ticket Type' }).click();
  await expect(page.getByRole('heading', { name: 'Add Ticket Type' })).toBeVisible();
  await page.getByRole('button', { name: 'Create Ticket' }).click();
  await expect(page.getByRole('heading', { name: 'Add Ticket Type' })).toHaveCount(0);

  await page.getByRole('button', { name: 'Create Code' }).click();
  await expect(page.getByRole('heading', { name: 'Create Promo Code' })).toBeVisible();
  await page.getByRole('button', { name: 'Create Code' }).nth(1).click();
  await expect(page.getByRole('heading', { name: 'Create Promo Code' })).toHaveCount(0);
});
