import api from './client';

export const placeOrder = (deliveryAddress) =>
  api.post('/orders', { deliveryAddress }).then((r) => r.data);

export const getOrders = (page = 0, size = 10) =>
  api.get('/orders', { params: { page, size } }).then((r) => r.data);

export const getOrder = (id) =>
  api.get(`/orders/${id}`).then((r) => r.data);

export const cancelOrder = (id) =>
  api.put(`/orders/${id}/cancel`).then((r) => r.data);
