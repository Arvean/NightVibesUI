import axiosInstance from '../../axiosInstance';
import {
  authAPI,
  venuesAPI,
  checkInsAPI,
  ratingsAPI,
  friendsAPI,
  pingsAPI,
  notificationsAPI
} from '../index';

// Mock the axios instance
jest.mock('../../axiosInstance', () => ({
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  patch: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
  setAuthToken: jest.fn(),
  clearAuthToken: jest.fn(),
}));

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authAPI', () => {
    it('should call login endpoint with correct parameters', async () => {
      const credentials = { email: 'test@example.com', password: 'password123' };
      await authAPI.login(credentials);
      expect(axiosInstance.post).toHaveBeenCalledWith('/api/auth/login/', credentials);
    });

    it('should call register endpoint with correct parameters', async () => {
      const userData = { 
        email: 'test@example.com', 
        password: 'password123',
        username: 'testuser'
      };
      await authAPI.register(userData);
      expect(axiosInstance.post).toHaveBeenCalledWith('/api/auth/register/', userData);
    });

    it('should call get profile endpoint', async () => {
      await authAPI.getProfile();
      expect(axiosInstance.get).toHaveBeenCalledWith('/api/profile/');
    });

    it('should call update profile endpoint with correct parameters', async () => {
      const userData = { name: 'New Name', bio: 'New bio' };
      await authAPI.updateProfile(userData);
      expect(axiosInstance.put).toHaveBeenCalledWith('/api/profile/', userData);
    });

    it('should call refresh token endpoint with correct parameters', async () => {
      const refresh = 'refresh-token';
      await authAPI.refreshToken(refresh);
      expect(axiosInstance.post).toHaveBeenCalledWith('/api/auth/token/refresh/', { refresh });
    });
  });

  describe('venuesAPI', () => {
    it('should call getAll with correct parameters', async () => {
      const params = { category: 'bar', sort: 'distance' };
      await venuesAPI.getAll(params);
      expect(axiosInstance.get).toHaveBeenCalledWith('/api/venues/', { params });
    });

    it('should call getById with correct id', async () => {
      await venuesAPI.getById(123);
      expect(axiosInstance.get).toHaveBeenCalledWith('/api/venues/123/');
    });

    it('should call getCurrentVibe with correct id', async () => {
      await venuesAPI.getCurrentVibe(123);
      expect(axiosInstance.get).toHaveBeenCalledWith('/api/venues/123/current_vibe/');
    });
  });

  describe('checkInsAPI', () => {
    it('should call create with correct parameters', async () => {
      const checkInData = { venue_id: 123, message: 'Having a great time!' };
      await checkInsAPI.create(checkInData);
      expect(axiosInstance.post).toHaveBeenCalledWith('/api/checkins/', checkInData);
    });

    it('should call delete with correct id', async () => {
      await checkInsAPI.delete(123);
      expect(axiosInstance.delete).toHaveBeenCalledWith('/api/checkins/123/');
    });
  });

  describe('ratingsAPI', () => {
    it('should call create with correct parameters', async () => {
      const ratingData = { venue_id: 123, score: 4, comment: 'Great place!' };
      await ratingsAPI.create(ratingData);
      expect(axiosInstance.post).toHaveBeenCalledWith('/api/ratings/', ratingData);
    });

    it('should call update with correct parameters', async () => {
      const ratingData = { score: 5, comment: 'Improved service!' };
      await ratingsAPI.update(123, ratingData);
      expect(axiosInstance.put).toHaveBeenCalledWith('/api/ratings/123/', ratingData);
    });
  });

  describe('friendsAPI', () => {
    it('should call getNearby', async () => {
      await friendsAPI.getNearby();
      expect(axiosInstance.get).toHaveBeenCalledWith('/api/friends/nearby/');
    });

    it('should call sendFriendRequest with correct parameters', async () => {
      await friendsAPI.sendFriendRequest(123);
      expect(axiosInstance.post).toHaveBeenCalledWith('/api/friend-requests/', { user_id: 123 });
    });

    it('should call acceptFriendRequest with correct id', async () => {
      await friendsAPI.acceptFriendRequest(123);
      expect(axiosInstance.post).toHaveBeenCalledWith('/api/friend-requests/123/accept/');
    });
  });

  describe('pingsAPI', () => {
    it('should call create with correct parameters', async () => {
      const pingData = { 
        friend_id: 123, 
        venue_id: 456, 
        message: 'Join me for drinks!' 
      };
      await pingsAPI.create(pingData);
      expect(axiosInstance.post).toHaveBeenCalledWith('/api/pings/', pingData);
    });

    it('should call accept with correct id', async () => {
      await pingsAPI.accept(123);
      expect(axiosInstance.post).toHaveBeenCalledWith('/api/pings/123/accept/');
    });

    it('should call decline with correct id', async () => {
      await pingsAPI.decline(123);
      expect(axiosInstance.post).toHaveBeenCalledWith('/api/pings/123/decline/');
    });
  });

  describe('notificationsAPI', () => {
    it('should call getAll', async () => {
      await notificationsAPI.getAll();
      expect(axiosInstance.get).toHaveBeenCalledWith('/api/notifications/');
    });

    it('should call markAllAsRead', async () => {
      await notificationsAPI.markAllAsRead();
      expect(axiosInstance.post).toHaveBeenCalledWith('/api/notifications/mark_all_read/');
    });

    it('should call markAsRead with correct id', async () => {
      await notificationsAPI.markAsRead(123);
      expect(axiosInstance.post).toHaveBeenCalledWith('/api/notifications/123/mark_read/');
    });
  });
});