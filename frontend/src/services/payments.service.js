import { api } from './api';
export const simulate = (data) => api('/payments/simulate', { method: 'POST', body: JSON.stringify(data) });