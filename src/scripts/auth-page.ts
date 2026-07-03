import type { Lang } from '../types';
import { AUTH_T, AUTH_COUNTRIES, AUTH_PHONE_CODES, AUTH_LANG_NAMES } from './auth-texts';
import {
  addUser, findUser, loginTaken, emailTaken, setSession, updateUser, type StoredUser,
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

function stepsHtml(active: 1 | 2 | 3): string {
  const sub = active === 1 ? t('reg_step1') : active === 2 ? t('reg_step2') : t('reg_step3');
  return `
    <div class="af-steps" aria-hidden="true">
      ${[1, 2, 3].map(n => `
        <span class="af-step ${n === active ? 'active' : ''} ${n < active ? 'passed' : ''}">${n}</span>
        ${n < 3 ? '<span class="af-step-line"></span>' : ''}
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
    <div class="af-section">${t('sec_lang_country')}</div>
    <div class="af-field" data-field="sitelang">
      <div class="af-input-wrap">
        <select name="sitelang">${langOpts}</select>
        <span class="af-check" aria-hidden="true">✓</span>
      </div>
    </div>
    <div class="af-field" data-field="country">
      <div class="af-input-wrap">
        <select name="country">${countryOpts}</select>
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

function renderConfirm(): string {
  return `
    ${stepsHtml(2)}
    <p class="af-note">${t('confirm_text')} <strong>${pendingUser?.email ?? ''}</strong>.</p>
    <p class="af-demo-note">${t('demo_code_note')} <strong class="mono">${confirmCode}</strong></p>
    ${inputRow('code', { max: 6, placeholder: t('field_code') })}
    <button class="btn btn-primary af-submit" data-action="submit-code">${t('btn_confirm')}</button>`;
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
  confirmCode = String(Math.floor(100000 + Math.random() * 900000));
  view = 'confirm';
  render();
}

function submitCode(): void {
  const wrap = qs<HTMLElement>('.af-field[data-field="code"]');
  const entered = (vals.code ?? '').trim();
  if (entered !== confirmCode) {
    if (wrap) paintField(wrap, 'err_code', true);
    return;
  }
  if (!pendingUser) return;
  addUser(pendingUser);
  setSession(pendingUser.login, true);
  void backAuthProfile(pendingUser.login);
  view = 'done';
  render();
}

function submitLogin(): void {
  const errBox = qs<HTMLElement>('#afLoginErr');
  const user = findUser(vals.loginOrEmail ?? '');
  if (!user) { if (errBox) errBox.textContent = t('err_login_notfound'); return; }
  if (user.password !== (vals.loginPassword ?? '')) { if (errBox) errBox.textContent = t('err_password_wrong'); return; }
  setSession(user.login, rememberChecked);
  void backAuthProfile(user.login);
  location.href = redirectTarget();
}

function submitReset(): void {
  const errBox = qs<HTMLElement>('#afResetErr');
  const email = (vals.resetEmail ?? '').trim();
  if (!EMAIL_RE.test(email)) { if (errBox) errBox.textContent = t('err_email_invalid'); return; }
  const user = findUser(email);
  if (!user) { if (errBox) errBox.textContent = t('err_login_notfound'); return; }
  // Demo "reset e-mail": no mail service, so a temporary password is generated and shown.
  resetPassword = Math.random().toString(36).slice(2, 10);
  updateUser(user.login, { password: resetPassword });
  view = 'forgot-done';
  render();
}

// ---------- events ----------

function bind(): void {
  const root = qs<HTMLElement>('#authShell');
  if (!root) return;

  root.addEventListener('input', (e) => {
    const el = e.target as HTMLInputElement;
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

  // Enter key submits the visible form
  root.addEventListener('keydown', (e) => {
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
