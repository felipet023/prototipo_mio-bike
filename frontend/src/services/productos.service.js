import { api } from './api';
export const getProductos = (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return api(`/productos${q ? '?' + q : ''}`);
};
export const getProducto = (id) => api(`/productos/${id}`);
export const createProducto = (data) => api('/productos', { method: 'POST', body: JSON.stringify(data) });
export const updateProducto = (id, data) => api(`/productos/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteProducto = (id) => api(`/productos/${id}`, { method: 'DELETE' });
export const uploadImagen = (id, file) => {
  const fd = new FormData(); fd.append('imagen', file);
  return api(`/productos/${id}/imagen`, { method: 'POST', body: fd });
};