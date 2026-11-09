export function getToken() { return localStorage.getItem('bs_token'); }
export function getUser() {
  const raw = localStorage.getItem('bs_user');
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
}
export function saveSession(token, user) {
  localStorage.setItem('bs_token', token);
  localStorage.setItem('bs_user', JSON.stringify(user));
}
export function clearSession() {
  localStorage.removeItem('bs_token');
  localStorage.removeItem('bs_user');
}