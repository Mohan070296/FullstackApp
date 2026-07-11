import api from './api';

export const authService = {
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    this.setAuthData(response.data);
    return response.data;
  },
  
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    this.setAuthData(response.data);
    return response.data;
  },
  
  async logout() {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      await api.post('/auth/logout', {}, {
        headers: { 'Refresh-Token': refreshToken }
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    this.clearAuthData();
  },
  
  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await api.post('/auth/refresh-token', { refreshToken });
    this.setAuthData(response.data);
    return response.data;
  },
  
  setAuthData(data) {
    localStorage.setItem('accessToken', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('userId', data.userId);
    localStorage.setItem('userEmail', data.email);
    localStorage.setItem('userName', data.name);
    localStorage.setItem('userRole', data.role);
    if (data.profilePhoto) {
      localStorage.setItem('userProfilePhoto', data.profilePhoto);
    }
  },
  
  clearAuthData() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userProfilePhoto');
  },
  
  getCurrentUser() {
    return {
      id: localStorage.getItem('userId'),
      email: localStorage.getItem('userEmail'),
      name: localStorage.getItem('userName'),
      role: localStorage.getItem('userRole'),
      profilePhoto: localStorage.getItem('userProfilePhoto'),
    };
  },
  
  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  },
  
  isAdmin() {
    return localStorage.getItem('userRole') === 'ROLE_ADMIN';
  },
};