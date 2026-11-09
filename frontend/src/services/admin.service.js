import { api } from './api';
export const getDashboard = () => api('/admin/dashboard');
export const getUsuarios = (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return api(`/admin/usuarios${q ? '?' + q : ''}`);
};
export const updateUsuario = (id, data) => api(`/admin/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const cambiarRol = (id, rol) => api(`/admin/usuarios/${id}/rol`, { method: 'PUT', body: JSON.stringify({ rol }) });
export const cambiarEstado = (id, activo) => api(`/admin/usuarios/${id}/estado`, { method: 'PUT', body: JSON.stringify({ activo }) });
export const deleteUsuario = (id) => api(`/admin/usuarios/${id}`, { method: 'DELETE' });
export const getReporte = (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return api(`/admin/reportes${q ? '?' + q : ''}`);
};
export const exportReporteUrl = (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/admin/reportes/export${q ? '?' + q : ''}`;
};