import api from './client';

export const getCart = () => api.get('/cart').then((r) => r.data);

export const addCartItem = (foodItemId, quantity = 1) =>
  api.post('/cart/items', { foodItemId, quantity }).then((r) => r.data);

export const updateCartItem = (id, quantity) =>
  api.put(`/cart/items/${id}`, { quantity }).then((r) => r.data);

export const removeCartItem = (id) =>
  api.delete(`/cart/items/${id}`).then((r) => r.data);

export const clearCart = () => api.delete('/cart');
