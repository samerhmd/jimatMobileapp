export type AuthPayload = {
  token: string;
  refresh_token?: string | null;
  user?: { id?: number; name?: string; email?: string };
  // epoch ms when token expires
  exp?: number;
};

const KEY = 'gymie_auth_v1';

export function saveAuth(p: AuthPayload) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch {}
}
export function getAuth(): AuthPayload | null {
  try {
    const raw = localStorage.getItem(KEY); if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}
export function clearAuth() {
  try { localStorage.removeItem(KEY); } catch {}
}
