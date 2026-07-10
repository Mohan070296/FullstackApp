import api from './client';

export const getRestaurants = (params) =>
  api.get('/restaurants', { params }).then((r) => r.data);

export const searchRestaurants = (q, page = 0, size = 12) =>
  api.get('/restaurants/search', { params: { q, page, size } }).then((r) => r.data);

export const getRestaurant = (id) =>
  api.get(`/restaurants/${id}`).then((r) => r.data);
