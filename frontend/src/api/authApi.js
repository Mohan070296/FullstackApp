import api from './client';

export const fetchMe = () => api.get('/auth/me').then((r) => r.data);

export const logout = () => api.post('/auth/logout');

export const getOAuthUrl = () => import.meta.env.VITE_OAUTH_URL;
