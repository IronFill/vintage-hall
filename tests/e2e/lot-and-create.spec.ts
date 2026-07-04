import { test, expect } from '@playwright/test';

const SELLER = {
  login: 'Collector_e2e', fullName: 'Андрій Лучин', email: 'collector-e2e@example.com',
  phoneCode: '+380', phone: '671234567', country: 'UA', password: 'secret99',
  regDate: new Date().toISOString(),
};

async function loginAs(page: import('@playwright/test').Page, login: string) {
  await page.addInitScript((user) => {
    localStorage.setItem('vh_users', JSON.stringify([user]));
    localStorage.setItem('vh_user', user.login);
  }, { login: SELLER.login, ...SELLER });
  void login;
}

test('catalog cards render a plate placeholder and a lot detail opens', async ({ page }) => {
  await page.goto('/catalog');
  const firstCard = page.locator('.lot').first();
  await expect(firstCard).toBeVisible();
  // No real photo on the seeded lots — every card must show the framed catalogue plate,
  // never a broken image or a blank box.
  await expect(firstCard.locator('.lot-plate')).toBeVisible();
  await expect(firstCard.locator('.lot-plate-label')).not.toBeEmpty();

  await firstCard.click();
  await expect(page.locator('#checkoutModal.active')).toBeVisible();
});

test('signed-in seller can publish a lot via the Violity-style create form', async ({ page }) => {
  await loginAs(page, SELLER.login);
  await page.goto('/cabinet?tab=create');
  await expect(page.locator('#saleDetails')).toBeHidden();

  await page.fill('#newName', 'E2E тестовий лот');
  await expect(page.locator('#newNameCount')).toHaveText(String(90 - 'E2E тестовий лот'.length));

  await page.click('[data-action="choose-sale-type"][data-sale="auction"]');
  await expect(page.locator('#saleDetails')).toBeVisible();
  await expect(page.locator('#startPriceField')).toBeVisible();

  await page.fill('#newStartPrice', '1200');
  await page.click('[data-action="publish-listing"]');

  await expect(page.locator('.cab-title')).toHaveText('Мої лоти');
  await expect(page.locator('#cabinetContent')).toContainText('E2E тестовий лот');
});
