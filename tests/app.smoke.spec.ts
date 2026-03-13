import { expect, test } from '@playwright/test';

test('home and create event flow renders', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Georim Home (MVP)');
  await expect(page.getByRole('heading', { name: /welcome john/i })).toBeVisible();

  await page.getByRole('main').getByRole('button', { name: /create event/i }).click();
  await expect(page.getByRole('heading', { name: /create new event/i })).toBeVisible();
});

test('ticketing modal buttons open and close correctly', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('georim.active-subscription-tier', 'premium');
  });
  await page.goto('/');

  await page.getByRole('button', { name: 'Events' }).click();
  await page.getByRole('heading', { name: 'Summer Music Festival 2026' }).click();
  await page.getByRole('tab', { name: 'Ticketing' }).click();

  await page.getByRole('button', { name: 'Add Ticket Type' }).click();
  await expect(page.getByRole('heading', { name: 'Add Ticket Type' })).toBeVisible();
  await page.getByPlaceholder('e.g., General Admission').fill('QA Ticket');
  await page.getByPlaceholder('50.00').fill('25');
  await page.getByPlaceholder('100').fill('50');
  await page.getByRole('button', { name: 'Create Ticket' }).click();
  await expect(page.getByRole('heading', { name: 'Add Ticket Type' })).toHaveCount(0);

  await page.getByRole('button', { name: 'Create Code' }).click();
  await expect(page.getByRole('heading', { name: 'Create Promo Code' })).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByRole('heading', { name: 'Create Promo Code' })).toHaveCount(0);
});
