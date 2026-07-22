import type { Lang } from '../types';
import { AUTH_T } from './auth-texts';
import { supabase } from '../lib/supabase';

let lang: Lang = 'uk';
const t = (key: string): string => AUTH_T[key]?.[lang] ?? AUTH_T[key]?.uk ?? key;

/** Standalone driver for /reset-password — the page a "forgot password" e-mail link lands on.
    Supabase's client parses the recovery token out of the URL on load (detectSessionInUrl,
    on by default) and turns it into a real, temporary session; we just need to confirm that
    session exists, then call updateUser with the new password. */
export function initResetPasswordPage(): void {
  try {
    const saved = localStorage.getItem('vh_lang');
    if (saved === 'uk' || saved === 'en' || saved === 'pl' || saved === 'ru') lang = saved;
  } catch { /* ignore */ }

  const root = document.getElementById('resetPasswordRoot');
  if (!root) return;

  void (async () => {
    if (!supabase) {
      root.innerHTML = `<p class="af-note">${t('reset_unavailable')}</p>
        <a class="btn btn-primary af-submit" href="/login">${t('back_to_login')}</a>`;
      return;
    }

    const sb = supabase;
    const { data } = await sb.auth.getSession();
    if (!data.session) {
      root.innerHTML = `<p class="af-note">${t('reset_invalid_link')}</p>
        <a class="btn btn-primary af-submit" href="/login">${t('back_to_login')}</a>`;
      return;
    }

    root.innerHTML = `
      <h1 class="af-title">${t('reset_new_title')}</h1>
      <div class="af-field" data-field="rpPassword">
        <div class="af-input-wrap">
          <input id="rpPassword" type="password" maxlength="12" placeholder="${t('field_password')}" autocomplete="new-password">
        </div>
      </div>
      <div class="af-field" data-field="rpPassword2">
        <div class="af-input-wrap">
          <input id="rpPassword2" type="password" maxlength="12" placeholder="${t('field_password2')}" autocomplete="new-password">
        </div>
      </div>
      <div class="af-err af-form-err" id="rpErr"></div>
      <button class="btn btn-primary af-submit" id="rpSubmit">${t('reset_new_submit')}</button>`;

    const submit = async (): Promise<void> => {
      const errBox = document.getElementById('rpErr');
      const put = (msg: string): void => { if (errBox) errBox.textContent = msg; };
      const p1 = (document.getElementById('rpPassword') as HTMLInputElement).value;
      const p2 = (document.getElementById('rpPassword2') as HTMLInputElement).value;
      if (p1.length < 6 || p1.length > 12) { put(t('err_password_len')); return; }
      if (p1 !== p2) { put(t('err_password_match')); return; }
      const { error } = await sb.auth.updateUser({ password: p1 });
      if (error) { put(error.message); return; }
      root.innerHTML = `
        <div class="af-done-mark" aria-hidden="true">✓</div>
        <p class="af-note" style="text-align:center;">${t('reset_new_done')}</p>
        <a class="btn btn-primary af-submit" href="/login">${t('back_to_login')}</a>`;
    };

    document.getElementById('rpSubmit')?.addEventListener('click', () => void submit());
    root.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); void submit(); }
    });
  })();
}
