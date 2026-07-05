import type { Lang } from '../types';
import { AUTH_T, AUTH_COUNTRIES, AUTH_PHONE_CODES, AUTH_LANG_NAMES } from './auth-texts';
import {
  addUser, findUser, loginTaken, emailTaken, setSession, updateUser, hashPassword, verifyPassword,
  type StoredUser,
} from './auth-store';
import { supabase } from '../lib/supabase';

/** Standalone driver for /login and /register — the Violity-style split-screen pages.
    Renders everything client-side so the aside language switcher re-translates instantly. */

type Mode = 'login' | 'register';
type View = 'form' | 'confirm' | 'done' | 'forgot' | 'forgot-done';

let lang: Lang = 'uk';
let mode: Mode = 'login';
let view: View = 'form';
let captchaCode = '';
/** Register wizard state: the validated-but-unconfirmed user + the e-mail code we "sent". */
let pendingUser: StoredUser | null = null;
let confirmCode = '';
/** Countdown for the "check your inbox" timer (Violity shows one) — epoch ms when it runs out. */
let confirmDeadline = 0;
let confirmTimerId: number | undefined;
/** Field values survive re-renders (language switch, captcha refresh). */
const vals: Record<string, string> = {};
let consentChecked = false;
let rememberChecked = true;
let resetPassword = '';

const t = (key: string): string => AUTH_T[key]?.[lang] ?? AUTH_T[key]?.uk ?? key;

function qs<T extends HTMLElement>(sel: string): T | null {
  return document.querySelector(sel) as T | null;
}

function redirectTarget(): string {
  const p = new URLSearchParams(location.search);
  const ret = p.get('return');
  if (ret && ret.startsWith('/')) return ret;
  const after = p.get('after');
  return after ? `/cabinet?tab=${encodeURIComponent(after)}` : '/cabinet';
}

/** Same anonymous-auth backing live.ts uses — keeps shared bidding working for accounts
    created through this flow. Silently no-ops without a Supabase project. */
async function backAuthProfile(name: string): Promise<void> {
  if (!supabase) return;
  try {
    const { data: sess } = await supabase.auth.getSession();
    let userId = sess.session?.user?.id ?? null;
    if (!userId) {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error || !data.user) return;
      userId = data.user.id;
    }
    await supabase.from('profiles').upsert({ id: userId, display_name: name }, { onConflict: 'id' });
  } catch { /* offline / anon auth disabled — local demo mode stands */ }
}

// ---------- captcha ----------

function newCaptcha(): void {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  captchaCode = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function drawCaptcha(): void {
  const canvas = qs<HTMLCanvasElement>('#afCaptcha') as HTMLCanvasElement | null;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(150,150,140,0.08)';
  ctx.fillRect(0, 0, w, h);
  const ink = getComputedStyle(document.documentElement).getPropertyValue('--sage') || '#8a9a8f';
  for (let i = 0; i < 3; i++) {
    ctx.strokeStyle = ink.trim();
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.moveTo(Math.random() * w, Math.random() * h);
    ctx.bezierCurveTo(Math.random() * w, Math.random() * h, Math.random() * w, Math.random() * h, Math.random() * w, Math.random() * h);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.font = 'italic 26px Georgia, serif';
  ctx.fillStyle = ink.trim();
  const startX = 16;
  captchaCode.split('').forEach((ch, i) => {
    ctx.save();
    ctx.translate(startX + i * 24, h / 2 + 8);
    ctx.rotate((Math.random() - 0.5) * 0.5);
    ctx.fillText(ch, 0, 0);
    ctx.restore();
  });
}

// ---------- field validation ----------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Returns an error-key or '' for a register-form field, given its current value. */
function fieldError(name: string, value: string): string {
  const v = value.trim();
  switch (name) {
    case 'country': return v ? '' : 'err_country';
    case 'nickname':
      if (!v) return 'err_required';
      if (v.length < 3 || v.length > 25) return 'err_nickname_len';
      if (loginTaken(v)) return 'err_nickname_taken';
      return '';
    case 'fullname': return v ? '' : 'err_required';
    case 'email':
      if (!v) return 'err_required';
      if (!EMAIL_RE.test(v)) return 'err_email_invalid';
      if (emailTaken(v)) return 'err_email_taken';
      return '';
    case 'phone': return /^[\d\s()-]{5,}$/.test(v) ? '' : 'err_phone';
    case 'password':
      return v.length >= 6 && v.length <= 12 ? '' : 'err_password_len';
    case 'password2':
      if (v.length < 6 || v.length > 12) return 'err_password_len';
      return v === (vals.password ?? '') ? '' : 'err_password_match';
    case 'captcha':
      return v.toLowerCase() === captchaCode ? '' : 'err_captcha';
    default: return '';
  }
}

/** Paints the ✓ / error state of one .af-field wrap (Violity shows a green check by valid rows). */
function paintField(wrap: HTMLElement, err: string, showError: boolean): void {
  const value = (wrap.querySelector('input, select') as HTMLInputElement | null)?.value ?? '';
  wrap.classList.toggle('valid', !err && value.trim() !== '');
  wrap.classList.toggle('invalid', showError && !!err);
  const errEl = wrap.querySelector<HTMLElement>('.af-err');
  if (errEl) errEl.textContent = showError && err ? t(err) : '';
}

// ---------- render helpers ----------

function inputRow(name: string, opts: { type?: string; max?: number; placeholder: string; value?: string; toggleEye?: boolean }): string {
  const type = opts.type ?? 'text';
  const maxAttr = opts.max ? `maxlength="${opts.max}"` : '';
  const counter = opts.max ? `<span class="af-max">${opts.max}</span>` : '';
  const eye = opts.toggleEye
    ? `<button type="button" class="af-eye" data-eye="${name}">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="14" height="14"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.6"/></svg>
         <span>${t('show_password')}</span>
       </button>`
    : '';
  return `
    <div class="af-field" data-field="${name}">
      <div class="af-input-wrap">
        <input name="${name}" type="${type}" ${maxAttr} placeholder="${opts.placeholder}" value="${(opts.value ?? '').replace(/"/g, '&quot;')}" autocomplete="off">
        ${counter}
        <span class="af-check" aria-hidden="true">✓</span>
      </div>
      ${eye}
      <div class="af-err"></div>
    </div>`;
}

/** Facebook/Google buttons, shared by the login and register forms — same spot Violity puts
    them (above the e-mail/password fields, with an "or" divider under them). There's no real
    OAuth app registered yet (that needs a Supabase project with the providers configured, plus
    Meta/Google developer apps), so this is an honest demo stand-in: it signs into a fixed local
    account instantly, same spirit as the e-mail-confirmation code shown right in the UI. */
function socialRowHtml(): string {
  return `
    <div class="af-social-label">${t('social_label')}</div>
    <div class="af-social-row">
      <button type="button" class="af-social-btn" data-action="social-login" data-provider="facebook" aria-label="${t('social_facebook')}">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.86c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34v7.03C18.34 21.2 22 17.06 22 12.06Z"/></svg>
      </button>
      <button type="button" class="af-social-btn" data-action="social-login" data-provider="google" aria-label="${t('social_google')}">
        <span class="af-social-g" aria-hidden="true">G</span>
      </button>
    </div>
    <div class="af-divider"><span>${t('or_divider')}</span></div>
    <p class="af-demo-note af-social-note">${t('social_demo_note')}</p>`;
}

function stepsHtml(active: 1 | 2 | 3): string {
  const sub = active === 1 ? t('reg_step1') : active === 2 ? t('reg_step2') : t('reg_step3');
  return `
    <div class="af-steps" aria-hidden="true">
      ${[1, 2, 3].map(n => `
        <span class="af-step ${n === active ? 'active' : ''} ${n < active ? 'passed' : ''}">${n}</span>
        ${n < 3 ? `<span class="af-step-line ${n < active ? 'passed' : ''}"></span>` : ''}
      `).join('')}
    </div>
    <h1 class="af-title">${view === 'done' ? t('done_title') : t('reg_title')}</h1>
    <div class="af-subtitle">${sub}</div>`;
}

// ---------- views ----------

function renderRegisterForm(): string {
  const langOpts = (Object.keys(AUTH_LANG_NAMES) as Lang[])
    .map(l => `<option value="${l}" ${l === lang ? 'selected' : ''}>${AUTH_LANG_NAMES[l]}</option>`).join('');
  const countryOpts = `<option value="" ${!vals.country ? 'selected' : ''} disabled hidden>${t('field_country')}</option>` +
    AUTH_COUNTRIES.map(c => `<option value="${c.code}" ${vals.country === c.code ? 'selected' : ''}>${c.label[lang]}</option>`).join('');
  const codeOpts = AUTH_PHONE_CODES
    .map(c => `<option value="${c}" ${(vals.phoneCode ?? '+380') === c ? 'selected' : ''}>${c}</option>`).join('');

  return `
    ${stepsHtml(1)}
    ${socialRowHtml()}
    <div class="af-section">${t('sec_lang_country')}</div>
    <div class="af-field" data-field="sitelang">
      <div class="af-input-wrap">
        <select name="sitelang" aria-label="${t('field_site_lang')}">${langOpts}</select>
        <span class="af-check" aria-hidden="true">✓</span>
      </div>
    </div>
    <div class="af-field" data-field="country">
      <div class="af-input-wrap">
        <select name="country" aria-label="${t('field_country')}">${countryOpts}</select>
        <span class="af-check" aria-hidden="true">✓</span>
      </div>
      <div class="af-err"></div>
    </div>

    <div class="af-section">${t('sec_contact')}</div>
    ${inputRow('nickname', { max: 25, placeholder: t('field_nickname'), value: vals.nickname })}
    ${inputRow('fullname', { max: 80, placeholder: t('field_fullname'), value: vals.fullname })}
    ${inputRow('email', { type: 'email', placeholder: t('field_email'), value: vals.email })}
    <div class="af-field" data-field="phone">
      <div class="af-phone-row">
        <select name="phoneCode" aria-label="${t('field_phone_code')}">${codeOpts}</select>
        <div class="af-input-wrap">
          <input name="phone" type="tel" placeholder="${t('field_phone')}" value="${vals.phone ?? ''}" autocomplete="off">
          <span class="af-check" aria-hidden="true">✓</span>
        </div>
      </div>
      <div class="af-err"></div>
    </div>

    <div class="af-section">${t('sec_security')}</div>
    ${inputRow('password', { type: 'password', max: 12, placeholder: t('field_password'), value: vals.password, toggleEye: true })}
    ${inputRow('password2', { type: 'password', max: 12, placeholder: t('field_password2'), value: vals.password2, toggleEye: true })}

    <div class="af-field af-captcha-field" data-field="captcha">
      <div class="af-captcha-row">
        <canvas id="afCaptcha" width="118" height="44" aria-label="captcha"></canvas>
        <div class="af-input-wrap">
          <input name="captcha" type="text" maxlength="4" placeholder="${t('captcha_label')}" value="" autocomplete="off">
          <span class="af-check" aria-hidden="true">✓</span>
        </div>
      </div>
      <button type="button" class="af-refresh" data-action="refresh-captcha">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="12" height="12"><path d="M21 12a9 9 0 1 1-2.6-6.4M21 3v6h-6"/></svg>
        ${t('captcha_refresh')}
      </button>
      <div class="af-err"></div>
    </div>

    <div class="af-consent ${consentChecked ? 'checked' : ''}" data-field="consent">
      <label>
        <input type="checkbox" name="consent" ${consentChecked ? 'checked' : ''}>
        <span class="af-consent-text">${t('consent_text')}</span>
      </label>
      <div class="af-err"></div>
    </div>

    <button class="btn btn-primary af-submit" data-action="submit-register">${t('btn_register')}</button>`;
}

/** Step 2, left panel — Violity shows a read-only summary card of everything entered in step 1;
    the actual code entry lives in the aside (renderAsideConfirm). */
function renderConfirm(): string {
  const u = pendingUser;
  const countryLabel = AUTH_COUNTRIES.find(c => c.code === u?.country)?.label[lang] ?? t('summary_not_set');
  const row = (label: string, value: string) => `
    <div class="af-summary-row"><span class="af-summary-label">${label}</span><span class="af-summary-value">${value || t('summary_not_set')}</span></div>`;
  return `
    ${stepsHtml(2)}
    <div class="af-summary">
      ${row(t('field_site_lang'), AUTH_LANG_NAMES[lang])}
      ${row(t('field_country'), countryLabel)}
      ${row(t('field_nickname'), u?.login ?? '')}
      ${row(t('field_fullname'), u?.fullName ?? '')}
      ${row(t('field_email'), u?.email ?? '')}
      ${row(t('field_phone'), u?.phone ? `${u.phoneCode} ${u.phone}` : '')}
      ${row(t('field_password'), '•'.repeat(u?.password.length ?? 0))}
    </div>`;
}

/** Step 2, right aside — «Підтвердження e-mail»: instruction, 4 code boxes, inbox countdown,
    resend link once it runs out, confirm button disabled until all boxes are filled. */
function renderAsideConfirm(): string {
  const secondsLeft = Math.max(0, Math.round((confirmDeadline - Date.now()) / 1000));
  const boxes = [0, 1, 2, 3].map(i =>
    `<input class="af-code-box" data-idx="${i}" inputmode="numeric" maxlength="1" autocomplete="off" aria-label="${t('field_code')} ${i + 1}">`
  ).join('<span class="af-code-dash">-</span>');
  return `
    <h2>${t('confirm_title')}</h2>
    <p>${t('confirm_aside_text').replace('{email}', `<strong>${pendingUser?.email ?? ''}</strong>`)}</p>
    <p class="af-demo-note af-demo-note-aside">${t('demo_code_note')} <strong class="mono">${confirmCode}</strong></p>
    <div class="af-code-row">${boxes}</div>
    <div class="af-countdown" id="afCountdown">
      ${secondsLeft > 0
        ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="13" height="13"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg> ${t('check_spam')} <span id="afTimerSec">${secondsLeft}</span> c`
        : `<button type="button" class="af-link" data-action="resend-code">${t('resend_code')}</button>`}
    </div>
    <div class="af-err af-form-err" id="afCodeErr"></div>
    <button class="btn btn-primary af-submit af-confirm-btn" id="afConfirmBtn" data-action="submit-code" disabled>${t('btn_confirm')}</button>`;
}

function startConfirmTimer(): void {
  if (confirmTimerId) window.clearInterval(confirmTimerId);
  confirmTimerId = window.setInterval(() => {
    const el = document.getElementById('afTimerSec');
    const secondsLeft = Math.max(0, Math.round((confirmDeadline - Date.now()) / 1000));
    if (!el || secondsLeft <= 0) {
      window.clearInterval(confirmTimerId);
      confirmTimerId = undefined;
      const box = document.getElementById('afCountdown');
      if (box) box.innerHTML = `<button type="button" class="af-link" data-action="resend-code">${t('resend_code')}</button>`;
      return;
    }
    el.textContent = String(secondsLeft);
  }, 1000);
}

function renderDone(): string {
  return `
    ${stepsHtml(3)}
    <div class="af-done-mark" aria-hidden="true">✓</div>
    <p class="af-note" style="text-align:center;">${t('done_text')}</p>
    <a class="btn btn-primary af-submit" href="${redirectTarget()}">${t('btn_to_cabinet')}</a>`;
}

function renderLoginForm(): string {
  return `
    <h1 class="af-title">${t('login_title')}</h1>
    <div class="af-subtitle">Vintage Hall</div>
    ${socialRowHtml()}
    ${inputRow('loginOrEmail', { placeholder: t('field_login_or_email'), value: vals.loginOrEmail })}
    ${inputRow('loginPassword', { type: 'password', placeholder: t('field_password'), value: vals.loginPassword, toggleEye: true })}
    <div class="af-login-row">
      <label class="af-remember">
        <input type="checkbox" name="remember" ${rememberChecked ? 'checked' : ''}>
        <span>${t('remember_me')}</span>
      </label>
      <button type="button" class="af-link" data-action="show-forgot">${t('forgot_password')}</button>
    </div>
    <div class="af-err af-form-err" id="afLoginErr"></div>
    <button class="btn btn-primary af-submit" data-action="submit-login">${t('btn_login')}</button>`;
}

function renderForgot(): string {
  return `
    <h1 class="af-title">${t('reset_title')}</h1>
    <div class="af-subtitle">Vintage Hall</div>
    <p class="af-note">${t('reset_text')}</p>
    ${inputRow('resetEmail', { type: 'email', placeholder: t('field_email'), value: vals.resetEmail })}
    <div class="af-err af-form-err" id="afResetErr"></div>
    <button class="btn btn-primary af-submit" data-action="submit-reset">${t('btn_reset')}</button>
    <button type="button" class="af-link af-back-link" data-action="show-login">${t('back_to_login')}</button>`;
}

function renderForgotDone(): string {
  return `
    <h1 class="af-title">${t('reset_title')}</h1>
    <div class="af-subtitle">Vintage Hall</div>
    <p class="af-note">${t('reset_done')} <strong class="mono">${resetPassword}</strong></p>
    <button type="button" class="btn btn-primary af-submit" data-action="show-login">${t('back_to_login')}</button>`;
}

function renderAside(): void {
  const aside = qs<HTMLElement>('#authAsideBody');
  if (!aside) return;
  const search = location.search;
  if (mode === 'register' && view === 'confirm') {
    aside.innerHTML = renderAsideConfirm();
    startConfirmTimer();
    qs<HTMLInputElement>('.af-code-box[data-idx="0"]')?.focus();
    return;
  }
  if (mode === 'register') {
    aside.innerHTML = `
      <h2>${t('aside_login_title')}</h2>
      <p>${t('aside_login_text')}</p>
      <a class="auth-aside-btn" href="/login${search}">${t('btn_go_login')}</a>`;
  } else {
    aside.innerHTML = `
      <h2>${t('aside_reg_title')}</h2>
      <p>${t('aside_reg_text')}</p>
      <a class="auth-aside-btn" href="/register${search}">${t('btn_go_register')}</a>`;
  }
}

function render(): void {
  const form = qs<HTMLElement>('#authForm');
  if (!form) return;
  let html = '';
  if (mode === 'register') {
    html = view === 'confirm' ? renderConfirm() : view === 'done' ? renderDone() : renderRegisterForm();
  } else {
    html = view === 'forgot' ? renderForgot() : view === 'forgot-done' ? renderForgotDone() : renderLoginForm();
  }
  form.innerHTML = html;
  const back = qs<HTMLAnchorElement>('#authBackLink');
  if (back) back.textContent = t('back_home');
  renderAside();
  if (mode === 'register' && view === 'form') drawCaptcha();
  document.documentElement.lang = lang;
  document.title = mode === 'register' ? `${t('reg_title')} — Vintage Hall` : `${t('login_title')} — Vintage Hall`;
}

// ---------- submit handlers ----------

const REGISTER_FIELDS = ['country', 'nickname', 'fullname', 'email', 'phone', 'password', 'password2', 'captcha'];

function submitRegister(): void {
  let firstBad: HTMLElement | null = null;
  for (const name of REGISTER_FIELDS) {
    const wrap = qs<HTMLElement>(`.af-field[data-field="${name === 'country' ? 'country' : name}"]`);
    if (!wrap) continue;
    const err = fieldError(name, vals[name] ?? '');
    paintField(wrap, err, true);
    if (err && !firstBad) firstBad = wrap;
  }
  const consentWrap = qs<HTMLElement>('.af-consent');
  if (consentWrap) {
    const errEl = consentWrap.querySelector<HTMLElement>('.af-err');
    if (errEl) errEl.textContent = consentChecked ? '' : t('err_consent');
    if (!consentChecked && !firstBad) firstBad = consentWrap;
  }
  if (firstBad) { firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }

  // pendingUser holds the plaintext password only transiently, in memory, for the confirm-step
  // summary card (masked as dots) — it's hashed in submitCode() right before it ever touches
  // localStorage, so the plaintext never gets persisted.
  pendingUser = {
    login: vals.nickname.trim(),
    fullName: vals.fullname.trim(),
    email: vals.email.trim(),
    phoneCode: vals.phoneCode ?? '+380',
    phone: vals.phone.trim(),
    country: vals.country,
    password: vals.password,
    regDate: new Date().toISOString(),
  };
  // 4-digit code, matching the four aside entry boxes (Violity's layout).
  confirmCode = String(Math.floor(1000 + Math.random() * 9000));
  confirmDeadline = Date.now() + 300_000;
  view = 'confirm';
  render();
}

function enteredCode(): string {
  return Array.from(document.querySelectorAll<HTMLInputElement>('.af-code-box'))
    .map(b => b.value.trim()).join('');
}

async function submitCode(): Promise<void> {
  const errBox = qs<HTMLElement>('#afCodeErr');
  if (enteredCode() !== confirmCode) {
    if (errBox) errBox.textContent = t('err_code');
    return;
  }
  if (!pendingUser) return;
  const { hash, salt } = await hashPassword(pendingUser.password);
  addUser({ ...pendingUser, password: hash, passwordSalt: salt });
  setSession(pendingUser.login, true);
  void backAuthProfile(pendingUser.login);
  view = 'done';
  render();
}

async function submitLogin(): Promise<void> {
  const errBox = qs<HTMLElement>('#afLoginErr');
  const user = findUser(vals.loginOrEmail ?? '');
  if (!user) { if (errBox) errBox.textContent = t('err_login_notfound'); return; }
  if (!(await verifyPassword(vals.loginPassword ?? '', user))) {
    if (errBox) errBox.textContent = t('err_password_wrong');
    return;
  }
  setSession(user.login, rememberChecked);
  void backAuthProfile(user.login);
  location.href = redirectTarget();
}

/** Fixed demo profiles for the social buttons — created on first use, then just signed back in.
    See the comment on socialRowHtml for why this doesn't hit a real Facebook/Google app. */
const SOCIAL_DEMO_PROFILES: Record<'facebook' | 'google', Pick<StoredUser, 'login' | 'fullName' | 'email'>> = {
  facebook: { login: 'Facebook_User', fullName: 'Facebook User', email: 'demo.facebook@vintagehall.local' },
  google: { login: 'Google_User', fullName: 'Google User', email: 'demo.google@vintagehall.local' },
};

async function socialLogin(provider: 'facebook' | 'google'): Promise<void> {
  const preset = SOCIAL_DEMO_PROFILES[provider];
  if (!findUser(preset.login)) {
    const { hash, salt } = await hashPassword(crypto.randomUUID());
    addUser({
      ...preset, phoneCode: '+380', phone: '', country: 'UA',
      password: hash, passwordSalt: salt, regDate: new Date().toISOString(),
    });
  }
  setSession(preset.login, rememberChecked);
  void backAuthProfile(preset.login);
  location.href = redirectTarget();
}

async function submitReset(): Promise<void> {
  const errBox = qs<HTMLElement>('#afResetErr');
  const email = (vals.resetEmail ?? '').trim();
  if (!EMAIL_RE.test(email)) { if (errBox) errBox.textContent = t('err_email_invalid'); return; }
  const user = findUser(email);
  if (!user) { if (errBox) errBox.textContent = t('err_login_notfound'); return; }
  // Demo "reset e-mail": no mail service, so a temporary password is generated and shown —
  // only its hash is persisted, matching every other password write in this store.
  resetPassword = Math.random().toString(36).slice(2, 10);
  const { hash, salt } = await hashPassword(resetPassword);
  updateUser(user.login, { password: hash, passwordSalt: salt });
  view = 'forgot-done';
  render();
}

// ---------- events ----------

function bind(): void {
  const root = qs<HTMLElement>('.auth-shell');
  if (!root) return;

  root.addEventListener('input', (e) => {
    const el = e.target as HTMLInputElement;
    // Segmented confirmation-code boxes: digits only, auto-advance, enable the button when full.
    if (el.classList?.contains('af-code-box')) {
      el.value = el.value.replace(/\D/g, '').slice(0, 1);
      if (el.value) {
        const next = qs<HTMLInputElement>(`.af-code-box[data-idx="${Number(el.dataset.idx) + 1}"]`);
        next?.focus();
      }
      const btn = qs<HTMLButtonElement>('#afConfirmBtn') as HTMLButtonElement | null;
      if (btn) btn.disabled = enteredCode().length < 4;
      const errBox = qs<HTMLElement>('#afCodeErr');
      if (errBox) errBox.textContent = '';
      return;
    }
    if (!el.name) return;
    vals[el.name] = el.value;
    const wrap = el.closest<HTMLElement>('.af-field');
    if (wrap && wrap.dataset.field) {
      // live re-validate, but only surface the error text once the field was already marked bad
      const showErr = wrap.classList.contains('invalid');
      paintField(wrap, fieldError(wrap.dataset.field, vals[el.name] ?? ''), showErr);
    }
  });

  root.addEventListener('change', (e) => {
    const el = e.target as HTMLInputElement | HTMLSelectElement;
    if (el instanceof HTMLInputElement && el.name === 'consent') {
      consentChecked = el.checked;
      el.closest('.af-consent')?.classList.toggle('checked', el.checked);
      const errEl = el.closest('.af-consent')?.querySelector<HTMLElement>('.af-err');
      if (errEl && el.checked) errEl.textContent = '';
      return;
    }
    if (el instanceof HTMLInputElement && el.name === 'remember') { rememberChecked = el.checked; return; }
    if (el.name === 'sitelang') {
      lang = el.value as Lang;
      try { localStorage.setItem('vh_lang', lang); } catch { /* ignore */ }
      render();
      return;
    }
    if (!el.name) return;
    vals[el.name] = el.value;
    const wrap = el.closest<HTMLElement>('.af-field');
    if (wrap?.dataset.field) paintField(wrap, fieldError(wrap.dataset.field, el.value), true);
  });

  root.addEventListener('focusout', (e) => {
    const el = e.target as HTMLInputElement;
    if (!(el instanceof HTMLInputElement) || !el.name) return;
    const wrap = el.closest<HTMLElement>('.af-field');
    if (wrap?.dataset.field && el.value.trim() !== '') {
      paintField(wrap, fieldError(wrap.dataset.field, el.value), true);
    }
  });

  root.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>('[data-action], [data-eye], [data-lang]');
    if (!target) return;

    if (target.dataset.action === 'social-login' && target.dataset.provider) {
      void socialLogin(target.dataset.provider as 'facebook' | 'google');
      return;
    }

    if (target.dataset.eye) {
      const input = qs<HTMLInputElement>(`.af-field input[name="${target.dataset.eye}"]`);
      if (input) {
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        const label = target.querySelector('span');
        if (label) label.textContent = show ? t('hide_password') : t('show_password');
      }
      return;
    }

    if (target.dataset.lang) {
      lang = target.dataset.lang as Lang;
      try { localStorage.setItem('vh_lang', lang); } catch { /* ignore */ }
      document.querySelectorAll('#authLangSwitch button').forEach(b => b.classList.toggle('active', b === target));
      render();
      return;
    }

    switch (target.dataset.action) {
      case 'resend-code':
        // Demo resend: a fresh code + a fresh inbox countdown.
        confirmCode = String(Math.floor(1000 + Math.random() * 9000));
        confirmDeadline = Date.now() + 300_000;
        renderAside();
        break;
      case 'refresh-captcha': newCaptcha(); vals.captcha = ''; {
        const input = qs<HTMLInputElement>('.af-field input[name="captcha"]');
        if (input) input.value = '';
        const wrap = qs<HTMLElement>('.af-field[data-field="captcha"]');
        if (wrap) { wrap.classList.remove('valid', 'invalid'); const errEl = wrap.querySelector<HTMLElement>('.af-err'); if (errEl) errEl.textContent = ''; }
        drawCaptcha();
      } break;
      case 'submit-register': submitRegister(); break;
      case 'submit-code': submitCode(); break;
      case 'submit-login': submitLogin(); break;
      case 'show-forgot': view = 'forgot'; render(); break;
      case 'show-login': view = 'form'; render(); break;
      case 'submit-reset': submitReset(); break;
    }
  });

  // Enter key submits the visible form; Backspace in an empty code box steps back.
  root.addEventListener('keydown', (e) => {
    const el = e.target as HTMLInputElement;
    if (e.key === 'Backspace' && el instanceof HTMLInputElement && el.classList.contains('af-code-box') && !el.value) {
      qs<HTMLInputElement>(`.af-code-box[data-idx="${Number(el.dataset.idx) - 1}"]`)?.focus();
      return;
    }
    if (e.key !== 'Enter' || !(e.target instanceof HTMLInputElement)) return;
    e.preventDefault();
    if (mode === 'register') {
      if (view === 'form') submitRegister();
      else if (view === 'confirm') submitCode();
    } else {
      if (view === 'form') submitLogin();
      else if (view === 'forgot') submitReset();
    }
  });
}

export function initAuthPage(pageMode: Mode): void {
  mode = pageMode;
  try {
    const saved = localStorage.getItem('vh_lang');
    if (saved === 'uk' || saved === 'en' || saved === 'pl' || saved === 'ru') lang = saved;
  } catch { /* ignore */ }
  document.querySelectorAll<HTMLButtonElement>('#authLangSwitch button').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === lang);
  });
  newCaptcha();
  bind();
  render();
}
