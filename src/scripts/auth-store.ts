/** Local user registry backing the Violity-style registration/login flow.
    This is a client-side demo store (localStorage) used only when no Supabase project is
    configured (see lib/supabase.ts) — the real production path is supabase.auth.signUp /
    signInWithPassword, which never touches this file. `password` holds a salted SHA-256 digest
    (hashPassword/verifyPassword below), not the plaintext — a client-side hash is not a
    substitute for server-side auth (no salt-per-request-cost, no rate limiting), but it means a
    stray localStorage dump or a careless browser extension doesn't hand over every password in
    the clear, which plaintext storage did. */

export interface StoredUser {
  login: string;          // «Ваше ім'я на сайті» — unique nickname, max 25 chars
  fullName: string;       // «Ім'я та прізвище», max 80
  email: string;
  phoneCode: string;      // e.g. +380
  phone: string;
  country: string;
  /** Salted SHA-256 hex digest, or '' for legacy accounts that never set a password. */
  password: string;
  /** Per-user random salt the digest above was computed with. Absent only on rows written
      before this field existed — verifyPassword treats those as plaintext once, for a graceful
      one-time migration path. */
  passwordSalt?: string;
  regDate: string;        // ISO date of registration
  city?: string;
  address?: string;       // Нова Пошта / delivery address
}

/** SHA-256 over `${salt}:${password}`, hex-encoded. Runs in the browser via Web Crypto — no
    dependency, no server round-trip. */
async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/** Hashes a plaintext password for storage. Pass an existing salt when re-hashing to verify;
    omit it to mint a fresh salt for a new/changed password. */
export async function hashPassword(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
  const useSalt = salt ?? crypto.randomUUID();
  const hash = await sha256Hex(`${useSalt}:${password}`);
  return { hash, salt: useSalt };
}

/** Checks a plaintext password against a stored user row, salted-hash first with a one-time
    plaintext fallback for rows written before salting existed. */
export async function verifyPassword(password: string, user: StoredUser): Promise<boolean> {
  if (!user.password) return false;
  if (!user.passwordSalt) return user.password === password; // legacy plaintext row
  const { hash } = await hashPassword(password, user.passwordSalt);
  return hash === user.password;
}

const USERS_KEY = 'vh_users';
const SESSION_KEY = 'vh_user';

export function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch { return []; }
}

export function saveUsers(users: StoredUser[]): void {
  try { localStorage.setItem(USERS_KEY, JSON.stringify(users)); } catch { /* ignore */ }
}

export function findUser(loginOrEmail: string): StoredUser | undefined {
  const v = loginOrEmail.trim().toLowerCase();
  return loadUsers().find(u => u.login.toLowerCase() === v || u.email.toLowerCase() === v);
}

export function loginTaken(login: string): boolean {
  const v = login.trim().toLowerCase();
  return loadUsers().some(u => u.login.toLowerCase() === v);
}

export function emailTaken(email: string): boolean {
  const v = email.trim().toLowerCase();
  return loadUsers().some(u => u.email.toLowerCase() === v);
}

export function addUser(user: StoredUser): void {
  const users = loadUsers();
  users.push(user);
  saveUsers(users);
}

export function updateUser(login: string, patch: Partial<StoredUser>): StoredUser | undefined {
  const users = loadUsers();
  const idx = users.findIndex(u => u.login === login);
  if (idx === -1) return undefined;
  users[idx] = { ...users[idx], ...patch };
  saveUsers(users);
  return users[idx];
}

/** «Запам'ятати мене»: remembered sessions live in localStorage (survive the browser closing),
    unchecked ones in sessionStorage (this tab only) — same key so the rest of the app reads one place. */
export function setSession(login: string, remember: boolean): void {
  try {
    if (remember) {
      localStorage.setItem(SESSION_KEY, login);
      sessionStorage.removeItem(SESSION_KEY);
    } else {
      sessionStorage.setItem(SESSION_KEY, login);
      localStorage.removeItem(SESSION_KEY);
    }
  } catch { /* ignore */ }
}

export function getSession(): string | null {
  try {
    return localStorage.getItem(SESSION_KEY) ?? sessionStorage.getItem(SESSION_KEY);
  } catch { return null; }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  } catch { /* ignore */ }
}
