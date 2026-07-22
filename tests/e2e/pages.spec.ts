import { test, expect } from '@playwright/test';

test('rules page has a full table of contents', async ({ page }) => {
  await page.goto('/rules');
  await expect(page.locator('.rules-toc a')).toHaveCount(8);
});

test('home page loads without console errors and shows the hero', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(page.locator('.hero-lot-card')).toBeVisible();
  await expect(page.locator('#liveAuctionsGrid')).toBeVisible();
  expect(errors).toEqual([]);
});

test('404 page renders for an unknown lot route', async ({ page }) => {
  const res = await page.goto('/lot/does-not-exist');
  expect(res?.status()).toBe(404);
  await expect(page.locator('text=Сторінку не знайдено')).toBeVisible();
});
