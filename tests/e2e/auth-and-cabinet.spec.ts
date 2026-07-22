import { test, expect } from '@playwright/test';

/** Solves the register form's canvas captcha by intercepting the glyphs it draws, then fills
    and submits step 1. Reload happens first so the interception is in place before the canvas
    ever paints. */
async function fillAndSubmitRegisterStep1(page: import('@playwright/test').Page, opts: {
  nickname: string; email: string; password: string;
}) {
  await page.goto('/register');
  await page.addInitScript(() => {
    const orig = CanvasRenderingContext2D.prototype.fillText;
    (window as unknown as { __cap: string }).__cap = '';
    CanvasRenderingContext2D.prototype.fillText = function (ch, x, y) {
      if (String(ch).length === 1) (window as unknown as { __cap: string }).__cap += ch;
      return orig.call(this, ch, x, y);
    };
  });
  await page.reload();
  await page.selectOption('select[name="country"]', 'UA');
  await page.fill('input[name="nickname"]', opts.nickname);
  await page.fill('input[name="fullname"]', 'Test User');
  await page.fill('input[name="email"]', opts.email);
  await page.fill('input[name="phone"]', '671234567');
  await page.fill('input[name="password"]', opts.password);
  await page.fill('input[name="password2"]', opts.password);
  const cap = await page.evaluate(() => (window as unknown as { __cap: string }).__cap.slice(-4));
  await page.fill('input[name="captcha"]', cap);
  await page.evaluate(() => {
    const cb = document.querySelector<HTMLInputElement>('input[name="consent"]')!;
    cb.checked = true;
    cb.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.click('[data-action="submit-register"]');
}

test('register, confirm by e-mail code, and land in the cabinet', async ({ page }) => {
  await fillAndSubmitRegisterStep1(page, {
    nickname: 'E2E_Register', email: 'e2e-register@example.com', password: 'secret99',
  });

  await expect(page.locator('.af-demo-note strong')).toBeVisible();
  const code = (await page.locator('.af-demo-note strong').textContent())!.trim();
  for (let i = 0; i < 4; i++) {
    await page.fill(`.af-code-box[data-idx="${i}"]`, code[i]);
  }
  await expect(page.locator('#afConfirmBtn')).toBeEnabled();
  await page.click('[data-action="submit-code"]');
  await expect(page.locator('.af-done-mark')).toBeVisible();

  await page.click('a[href*="/cabinet"]');
  await expect(page.locator('.cab-layout')).toBeVisible();
  await expect(page.locator('.cab-nick')).toHaveText('E2E_Register');
});

test('login accepts a salted-hash password row (not just legacy plaintext)', async ({ page }) => {
  // Every other test seeds plaintext `password` fields, which verifyPassword() accepts via its
  // one-time legacy fallback — that alone wouldn't catch a broken hashPassword/verifyPassword
  // round-trip. Here we seed a row hashed exactly like auth-store.ts does (salted SHA-256) to
  // prove the real path works, without re-running the full registration UI just for that.
  await page.addInitScript(({ salt, hash }) => {
    localStorage.setItem('vh_users', JSON.stringify([{
      login: 'E2E_HashedLogin', fullName: '', email: 'e2e-hashed@example.com', phoneCode: '+380',
      phone: '', country: 'UA', password: hash, passwordSalt: salt, regDate: new Date().toISOString(),
    }]));
  }, await (async () => {
    const salt = crypto.randomUUID();
    const bytes = new TextEncoder().encode(`${salt}:secret99`);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    const hash = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
    return { salt, hash };
  })());

  await page.goto('/login');
  await page.fill('input[name="loginOrEmail"]', 'e2e-hashed@example.com');
  await page.fill('input[name="loginPassword"]', 'secret99');
  await page.click('[data-action="submit-login"]');
  await page.waitForURL('**/cabinet**');
  await expect(page.locator('#accountBtnLabel')).toHaveText('E2E_HashedLogin');
});

test('cabinet: save profile settings and change password', async ({ page }) => {
  // Seeding the account directly is a legitimate arrange-step here — the previous test already
  // covers the registration UI itself; this test's subject is the settings/password forms.
  await page.addInitScript(() => {
    localStorage.setItem('vh_users', JSON.stringify([{
      login: 'E2E_Settings', fullName: '', email: 'e2e-settings@example.com', phoneCode: '+380',
      phone: '', country: 'UA', password: 'secret99', regDate: new Date().toISOString(),
    }]));
    localStorage.setItem('vh_user', 'E2E_Settings');
  });
  await page.goto('/cabinet?tab=settings');
  await page.fill('#setCity', 'Харків');
  await page.click('[data-action="save-profile"]');
  await expect(page.locator('.toast', { hasText: 'Дані збережено' })).toBeVisible();

  await page.click('[data-tab="password"]');
  await page.fill('#pwCurrent', 'secret99');
  await page.fill('#pwNew', 'newpass77');
  await page.fill('#pwRepeat', 'newpass77');
  await page.click('[data-action="change-password"]');
  await expect(page.locator('.toast', { hasText: 'Пароль змінено' })).toBeVisible();

  await page.click('.cab-logout');
  await page.waitForURL((url) => url.pathname === '/');
});

test('login: rejects the wrong password, accepts the right one', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('vh_users', JSON.stringify([{
      login: 'E2E_Login', fullName: '', email: 'e2e-login@example.com', phoneCode: '+380',
      phone: '', country: 'UA', password: 'correct-horse', regDate: new Date().toISOString(),
    }]));
  });
  await page.goto('/login');
  await page.fill('input[name="loginOrEmail"]', 'e2e-login@example.com');
  await page.fill('input[name="loginPassword"]', 'wrong-guess');
  await page.click('[data-action="submit-login"]');
  await expect(page.locator('#afLoginErr')).toContainText('Невірний пароль');

  await page.fill('input[name="loginPassword"]', 'correct-horse');
  await page.click('[data-action="submit-login"]');
  await page.waitForURL('**/cabinet**');
  await expect(page.locator('#accountBtnLabel')).toHaveText('E2E_Login');
});

test('forgot-password flow issues a demo reset password', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('vh_users', JSON.stringify([{
      login: 'ResetMe', fullName: '', email: 'reset-me@example.com', phoneCode: '+380',
      phone: '', country: 'UA', password: 'oldpass1', regDate: new Date().toISOString(),
    }]));
  });
  await page.goto('/login');
  await page.click('[data-action="show-forgot"]');
  await page.fill('input[name="resetEmail"]', 'reset-me@example.com');
  await page.click('[data-action="submit-reset"]');
  await expect(page.locator('.af-note').last()).toContainText('новий пароль');
});
