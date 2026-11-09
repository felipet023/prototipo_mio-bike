import { api } from './api';
export const getCarrito = () => api('/carrito');
export const addItem = (data) => api('/carrito/items', { method: 'POST', body: JSON.stringify(data) });
export const updateItem = (id, cantidad) => api(`/carrito/items/${id}`, { method: 'PUT', body: JSON.stringify({ cantidad }) });
export const removeItem = (id) => api(`/carrito/items/${id}`, { method: 'DELETE' });
export const clearCarrito = () => api('/carrito', { method: 'DELETE' });