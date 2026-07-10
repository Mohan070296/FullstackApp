import api from './client';

export const adminGetRestaurants = (page = 0, size = 20) =>
  api.get('/admin/restaurants', { params: { page, size } }).then((r) => r.data);

export const adminCreateRestaurant = (data) =>
  api.post('/admin/restaurants', data).then((r) => r.data);

export const adminUpdateRestaurant = (id, data) =>
  api.put(`/admin/restaurants/${id}`, data).then((r) => r.data);

export const adminDeleteRestaurant = (id) =>
  api.delete(`/admin/restaurants/${id}`);

export const adminGetFoods = (restaurantId, page = 0, size = 20) =>
  api.get('/admin/foods', { params: { restaurantId, page, size } }).then((r) => r.data);

export const adminCreateFood = (data) =>
  api.post('/admin/foods', data).then((r) => r.data);

export const adminUpdateFood = (id, data) =>
  api.put(`/admin/foods/${id}`, data).then((r) => r.data);

export const adminDeleteFood = (id) =>
  api.delete(`/admin/foods/${id}`);

export const adminGetCategories = () =>
  api.get('/admin/categories').then((r) => r.data);

export const adminCreateCategory = (data) =>
  api.post('/admin/categories', data).then((r) => r.data);

export const adminUpdateCategory = (id, data) =>
  api.put(`/admin/categories/${id}`, data).then((r) => r.data);

export const adminDeleteCategory = (id) =>
  api.delete(`/admin/categories/${id}`);

export const adminGetOrders = (page = 0, size = 20) =>
  api.get('/admin/orders', { params: { page, size } }).then((r) => r.data);

export const adminUpdateOrderStatus = (id, status) =>
  api.put(`/admin/orders/${id}/status`, { status }).then((r) => r.data);

export const adminGetUsers = (page = 0, size = 20) =>
  api.get('/admin/users', { params: { page, size } }).then((r) => r.data);

export const adminUpdateUserRole = (id, role) =>
  api.put(`/admin/users/${id}/role`, { role }).then((r) => r.data);
