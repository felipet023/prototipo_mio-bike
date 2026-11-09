import { api } from './api';
export const preview = () => api('/pedidos/preview');
export const crearPedido = (data) => api('/pedidos', { method: 'POST', body: JSON.stringify(data) });
export const misPedidos = () => api('/pedidos');
export const getPedido = (id) => api(`/pedidos/${id}`);
export const todosPedidos = (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return api(`/admin/pedidos${q ? '?' + q : ''}`);
};
export const cambiarEstado = (id, estado) => api(`/admin/pedidos/${id}/estado`, { method: 'PUT', body: JSON.stringify({ estado }) });