import api from './client';

export const generateQr = (orderId) =>
  api.post('/payments/generate-qr', { orderId }).then((r) => r.data);

export const getPaymentStatus = (id) =>
  api.get(`/payments/${id}/status`).then((r) => r.data);

export const confirmPayment = (id) =>
  api.post(`/payments/${id}/confirm`).then((r) => r.data);
