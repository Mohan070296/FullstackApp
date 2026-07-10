import api from './client';

export const getFoods = (params) =>
  api.get('/foods', { params }).then((r) => r.data);

export const searchFoods = (q, page = 0, size = 12) =>
  api.get('/foods/search', { params: { q, page, size } }).then((r) => r.data);

export const getFood = (id) =>
  api.get(`/foods/${id}`).then((r) => r.data);

export const getFoodsByRestaurant = (restaurantId) =>
  api.get(`/foods/restaurant/${restaurantId}`).then((r) => r.data);
