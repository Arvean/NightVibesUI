import axiosInstance from '../axiosInstance';

// Auth API endpoints
export const authAPI = {
  login: (credentials) => axiosInstance.post('/api/auth/login/', credentials),
  register: (userData) => axiosInstance.post('/api/auth/register/', userData),
  getProfile: () => axiosInstance.get('/api/profile/'),
  updateProfile: (userData) => axiosInstance.put('/api/profile/', userData),
  refreshToken: (refresh) => axiosInstance.post('/api/auth/token/refresh/', { refresh }),
};

// Venues API endpoints
export const venuesAPI = {
  getAll: (params) => axiosInstance.get('/api/venues/', { params }),
  getById: (id) => axiosInstance.get(`/api/venues/${id}/`),
  getCurrentVibe: (id) => axiosInstance.get(`/api/venues/${id}/current_vibe/`),
  getCheckIns: (id) => axiosInstance.get(`/api/venues/${id}/checkins/`),
  getRatings: (id) => axiosInstance.get(`/api/venues/${id}/ratings/`),
  create: (venueData) => axiosInstance.post('/api/venues/', venueData),
};

// User Check-ins API endpoints
export const checkInsAPI = {
  getAll: () => axiosInstance.get('/api/checkins/'),
  create: (checkInData) => axiosInstance.post('/api/checkins/', checkInData),
  getById: (id) => axiosInstance.get(`/api/checkins/${id}/`),
  delete: (id) => axiosInstance.delete(`/api/checkins/${id}/`),
};

// Ratings API endpoints
export const ratingsAPI = {
  getAll: () => axiosInstance.get('/api/ratings/'),
  create: (ratingData) => axiosInstance.post('/api/ratings/', ratingData),
  getById: (id) => axiosInstance.get(`/api/ratings/${id}/`),
  update: (id, ratingData) => axiosInstance.put(`/api/ratings/${id}/`, ratingData),
};

// Friends API endpoints
export const friendsAPI = {
  getAll: () => axiosInstance.get('/api/friends/'),
  getNearby: () => axiosInstance.get('/api/friends/nearby/'),
  getFriendRequests: () => axiosInstance.get('/api/friend-requests/'),
  sendFriendRequest: (userId) => axiosInstance.post('/api/friend-requests/', { user_id: userId }),
  acceptFriendRequest: (requestId) => axiosInstance.post(`/api/friend-requests/${requestId}/accept/`),
  rejectFriendRequest: (requestId) => axiosInstance.post(`/api/friend-requests/${requestId}/reject/`),
};

// Meetup Pings API endpoints
export const pingsAPI = {
  getAll: () => axiosInstance.get('/api/pings/'),
  create: (pingData) => axiosInstance.post('/api/pings/', pingData),
  accept: (id) => axiosInstance.post(`/api/pings/${id}/accept/`),
  decline: (id) => axiosInstance.post(`/api/pings/${id}/decline/`),
};

// Notifications API endpoints
export const notificationsAPI = {
  getAll: () => axiosInstance.get('/api/notifications/'),
  markAllAsRead: () => axiosInstance.post('/api/notifications/mark_all_read/'),
  markAsRead: (id) => axiosInstance.post(`/api/notifications/${id}/mark_read/`),
};

export default {
  auth: authAPI,
  venues: venuesAPI,
  checkIns: checkInsAPI,
  ratings: ratingsAPI,
  friends: friendsAPI,
  pings: pingsAPI,
  notifications: notificationsAPI,
};