/** Local user registry backing the Violity-style registration/login flow.
    This is a client-side demo store (localStorage) — passwords are kept as-is because there is
    no backend to hash against; the Supabase anonymous-auth layer (live.ts) still provides the
    real auth backing for shared bids. Swapping this for supabase.auth.signUp/signInWithPassword
    is the intended production path. */

export interface StoredUser {
  login: string;          // «Ваше ім'я на сайті» — unique nickname, max 25 chars
  fullName: string;       // «Ім'я та прізвище», max 80
  email: string;
  phoneCode: string;      // e.g. +380
  phone: string;
  country: string;
  password: string;
  regDate: string;        // ISO date of registration
  city?: string;
  address?: string;       // Нова Пошта / delivery address
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
