import { api } from './api';
export const register = (data) => api('/auth/register', { method: 'POST', body: JSON.stringify(data) });
export const login = (data) => api('/auth/login', { method: 'POST', body: JSON.stringify(data) });
export const me = () => api('/auth/me');
export const forgotPassword = (email) => api('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
export const resetPassword = (data) => api('/auth/reset-password', { method: 'POST', body: JSON.stringify(data) });