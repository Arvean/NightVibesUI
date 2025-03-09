// Import the configured axios instance for making API requests.
import axiosInstance from '../axiosInstance';

// Auth API endpoints
export const authAPI = {
  // Login user with provided credentials.
  login: (credentials) => axiosInstance.post('/api/auth/login/', credentials),
  // Register a new user.
  register: (userData) => axiosInstance.post('/api/auth/register/', userData),
  // Get the current user's profile.
  getProfile: () => axiosInstance.get('/api/profile/'),
  // Update the current user's profile.
  updateProfile: (userData) => axiosInstance.put('/api/profile/', userData),
  // Refresh the access token using a refresh token.
  refreshToken: (refresh) => axiosInstance.post('/api/auth/token/refresh/', { refresh }),
};

// Venues API endpoints
export const venuesAPI = {
  // Get all venues with optional query parameters.
  getAll: (params) => axiosInstance.get('/api/venues/', { params }),
  // Get a specific venue by ID.
  getById: (id) => axiosInstance.get(`/api/venues/${id}/`),
  // Get the current vibe for a specific venue.
  getCurrentVibe: (id) => axiosInstance.get(`/api/venues/${id}/current_vibe/`),
  // Get check-ins for a specific venue.
  getCheckIns: (id) => axiosInstance.get(`/api/venues/${id}/checkins/`),
  // Get ratings for a specific venue.
  getRatings: (id) => axiosInstance.get(`/api/venues/${id}/ratings/`),
  // Create a new venue.
  create: (venueData) => axiosInstance.post('/api/venues/', venueData),
};

// User Check-ins API endpoints
export const checkInsAPI = {
  // Get all user check-ins.
  getAll: () => axiosInstance.get('/api/checkins/'),
  // Create a new check-in.
  create: (checkInData) => axiosInstance.post('/api/checkins/', checkInData),
  // Get a specific check-in by ID.
  getById: (id) => axiosInstance.get(`/api/checkins/${id}/`),
  // Delete a specific check-in by ID.
  delete: (id) => axiosInstance.delete(`/api/checkins/${id}/`),
};

// Ratings API endpoints
export const ratingsAPI = {
  // Get all user ratings.
  getAll: () => axiosInstance.get('/api/ratings/'),
  // Create a new rating.
  create: (ratingData) => axiosInstance.post('/api/ratings/', ratingData),
  // Get a specific rating by ID.
  getById: (id) => axiosInstance.get(`/api/ratings/${id}/`),
  // Update a specific rating by ID.
  update: (id, ratingData) => axiosInstance.put(`/api/ratings/${id}/`, ratingData),
};

// Friends API endpoints
export const friendsAPI = {
  // Get all friends for the current user.
  getAll: () => axiosInstance.get('/api/friends/'),
  // Get nearby friends.
  getNearby: () => axiosInstance.get('/api/friends/nearby/'),
  // Get pending friend requests.
  getFriendRequests: () => axiosInstance.get('/api/friend-requests/'),
  // Send a friend request to a user.
  sendFriendRequest: (userId) => axiosInstance.post('/api/friend-requests/', { user_id: userId }),
  // Accept a friend request.
  acceptFriendRequest: (requestId) => axiosInstance.post(`/api/friend-requests/${requestId}/accept/`),
  // Reject a friend request.
  rejectFriendRequest: (requestId) => axiosInstance.post(`/api/friend-requests/${requestId}/reject/`),
};

// Meetup Pings API endpoints
export const pingsAPI = {
  // Get all meetup pings.
  getAll: () => axiosInstance.get('/api/pings/'),
  // Create a new meetup ping.
  create: (pingData) => axiosInstance.post('/api/pings/', pingData),
  // Accept a meetup ping.
  accept: (id) => axiosInstance.post(`/api/pings/${id}/accept/`),
  // Decline a meetup ping.
  decline: (id) => axiosInstance.post(`/api/pings/${id}/decline/`),
};

// Notifications API endpoints
export const notificationsAPI = {
  // Get all notifications for the current user.
  getAll: () => axiosInstance.get('/api/notifications/'),
  // Mark all notifications as read.
  markAllAsRead: () => axiosInstance.post('/api/notifications/mark_all_read/'),
  // Mark a specific notification as read.
  markAsRead: (id) => axiosInstance.post(`/api/notifications/${id}/mark_read/`),
};

// Export all API objects as a single default export.
export default {
  auth: authAPI,
  venues: venuesAPI,
  checkIns: checkInsAPI,
  ratings: ratingsAPI,
  friends: friendsAPI,
  pings: pingsAPI,
  notifications: notificationsAPI,
};
