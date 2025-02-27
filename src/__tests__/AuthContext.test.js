import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { AuthContext, AuthProvider } from '../AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../axiosInstance';

// Mock necessary dependencies
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('../axiosInstance');

// Mock jwt-decode
jest.mock('jwt-decode', () => ({
  __esModule: true, 
  default: jest.fn()
}));

// Import the mocked jwt-decode
import jwtDecode from 'jwt-decode';

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set up jwt-decode mock
    jwtDecode.mockImplementation(() => ({
      user_id: '1',
      username: 'testuser',
      email: 'test@example.com',
      exp: Date.now() / 1000 + 3600, // Valid for 1 hour
    }));
  });

  it('initializes with no user if no token is found', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);
    
    let contextValue;
    await act(async () => {
      const { getByText } = render(
        <AuthProvider>
          <AuthContext.Consumer>
            {value => {
              contextValue = value;
              return <>{JSON.stringify(value.user)}</>;
            }}
          </AuthContext.Consumer>
        </AuthProvider>
      );
    });
    
    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('access_token');
      expect(contextValue.user).toBeNull();
      expect(contextValue.isLoading).toBe(false);
    }, { timeout: 5000 });
  });

  it('initializes with user if a valid token is found', async () => {
    AsyncStorage.getItem.mockResolvedValue('valid_token');
    api.get.mockResolvedValue({ 
      data: { 
        id: '1', 
        username: 'testuser', 
        email: 'test@example.com' 
      }
    });
    
    let contextValue;
    await act(async () => {
      const { getByText } = render(
        <AuthProvider>
          <AuthContext.Consumer>
            {value => {
              contextValue = value;
              return <>{JSON.stringify(value.user)}</>;
            }}
          </AuthContext.Consumer>
        </AuthProvider>
      );
    });
    
    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('access_token');
      expect(contextValue.user).not.toBeNull();
      expect(contextValue.user.username).toBe('testuser');
      expect(contextValue.isLoading).toBe(false);
    }, { timeout: 5000 });
  });

  it('logs in successfully', async () => {
    const mockLoginResponse = {
      data: {
        access: 'new_access_token',
        refresh: 'new_refresh_token',
      }
    };
    
    const mockUserResponse = {
      data: {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
      }
    };
    
    api.post.mockResolvedValueOnce(mockLoginResponse);
    api.get.mockResolvedValueOnce(mockUserResponse);
    
    let contextValue;
    await act(async () => {
      const { getByText } = render(
        <AuthProvider>
          <AuthContext.Consumer>
            {value => {
              contextValue = value;
              return <>{JSON.stringify(value.user)}</>;
            }}
          </AuthContext.Consumer>
        </AuthProvider>
      );
    });
    
    let loginSuccess;
    await act(async () => {
      loginSuccess = await contextValue.login('testuser', 'password');
    });
    
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/token/', {
        username: 'testuser',
        password: 'password',
      });
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('access_token', 'new_access_token');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('refresh_token', 'new_refresh_token');
      expect(contextValue.user).not.toBeNull();
      expect(loginSuccess).toBe(true);
    }, { timeout: 5000 });
  });

  it('handles login failure', async () => {
    const errorMessage = 'Invalid credentials';
    api.post.mockRejectedValue(new Error(errorMessage));
    
    let contextValue;
    await act(async () => {
      const { getByText } = render(
        <AuthProvider>
          <AuthContext.Consumer>
            {value => {
              contextValue = value;
              return <>{JSON.stringify(value.user)}</>;
            }}
          </AuthContext.Consumer>
        </AuthProvider>
      );
    });
    
    let loginFailure;
    await act(async () => {
      loginFailure = await contextValue.login('testuser', 'wrongpassword');
    });
    
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/token/', {
        username: 'testuser',
        password: 'wrongpassword',
      });
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('access_token');
      expect(contextValue.user).toBeNull();
      expect(loginFailure).toBe(false);
    }, { timeout: 5000 });
  });

  it('registers successfully', async () => {
    const mockTokens = {
      access: 'mock_access_token',
      refresh: 'mock_refresh_token',
    };

    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
    };

    api.post.mockResolvedValue({ data: { ...mockTokens, user: mockUser } });
    
    let contextValue;
    await act(async () => {
      const { getByText } = render(
        <AuthProvider>
          <AuthContext.Consumer>
            {value => {
              contextValue = value;
              return <>{JSON.stringify(value.user)}</>;
            }}
          </AuthContext.Consumer>
        </AuthProvider>
      );
    });
    
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/users/', {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
      });
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('access_token', 'mock_access_token');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('refresh_token', 'mock_refresh_token');
      expect(contextValue.user).not.toBeNull();
    }, { timeout: 5000 });
  });

  it('handles registration failure', async () => {
    const errorMessage = 'Registration failed';
    api.post.mockRejectedValue(new Error(errorMessage));
    
    let contextValue;
    await act(async () => {
      const { getByText } = render(
        <AuthProvider>
          <AuthContext.Consumer>
            {value => {
              contextValue = value;
              return <>{JSON.stringify(value.user)}</>;
            }}
          </AuthContext.Consumer>
        </AuthProvider>
      );
    });
    
    let registerFailure;
    await act(async () => {
      registerFailure = await contextValue.register('testuser', 'test@example.com', 'password');
    });
    
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/users/', {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
      });
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('access_token');
      expect(contextValue.user).toBeNull();
      expect(registerFailure).toBe(false);
    }, { timeout: 5000 });
  });

  it('logs out successfully', async () => {
    const mockTokens = {
      access: 'mock_access_token',
      refresh: 'mock_refresh_token',
    };

    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
    };

    api.get.mockResolvedValue({ data: mockUser });
    
    let contextValue;
    await act(async () => {
      const { getByText } = render(
        <AuthProvider>
          <AuthContext.Consumer>
            {value => {
              contextValue = value;
              return <>{JSON.stringify(value.user)}</>;
            }}
          </AuthContext.Consumer>
        </AuthProvider>
      );
    });
    
    let logoutSuccess;
    await act(async () => {
      logoutSuccess = await contextValue.logout();
    });
    
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/api/users/1/');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('access_token');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('refresh_token');
      expect(contextValue.user).toBeNull();
      expect(logoutSuccess).toBe(true);
    }, { timeout: 5000 });
  });

  it('refreshes token on 401 error', async () => {
    // Mock initial token
    await act(async () => {
      AsyncStorage.getItem.mockResolvedValueOnce('valid_token');
      api.get.mockResolvedValueOnce({ data: { id: '1', username: 'testuser', email: 'test@example.com' } });
    });

    // Mock a 401 error with a refresh token response
    const newTokens = { access: 'new_access_token', refresh: 'new_refresh_token' };
    api.post.mockRejectedValueOnce({
      response: {
        status: 401,
        data: { message: 'Unauthorized' },
      },
    }).mockResolvedValueOnce({ data: newTokens }); // Resolve for the refresh token call

    // Mock successful API call after refresh
    api.get.mockResolvedValueOnce({ data: { message: 'Success' } });

    // Trigger a request that will cause a 401 error
    let contextValue;
    await act(async () => {
      const { getByText } = render(
        <AuthProvider>
          <AuthContext.Consumer>
            {value => {
              contextValue = value;
              return <>{JSON.stringify(value.user)}</>;
            }}
          </AuthContext.Consumer>
        </AuthProvider>
      );
    });

    let refreshSuccess;
    await act(async () => {
      refreshSuccess = await contextValue.refreshToken();
    });

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/token/refresh/', {
        refresh: 'mock_refresh_token',
      });
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('access_token', 'new_access_token');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('refresh_token', 'new_refresh_token');
      expect(contextValue.user).not.toBeNull();
      expect(refreshSuccess).toBe(true);
    }, { timeout: 5000 });
  });

  it('logs out if token refresh fails', async () => {
    // Mock initial token
    await act(async () => {
      AsyncStorage.getItem.mockResolvedValueOnce('valid_token');
      api.get.mockResolvedValueOnce({ data: { id: '1', username: 'testuser', email: 'test@example.com' } });
    });

    // Mock a 401 error followed by a failed refresh token attempt
    api.post.mockRejectedValueOnce({
      response: {
        status: 401,
        data: { message: 'Unauthorized' },
      },
    }).mockRejectedValueOnce(new Error('Refresh token failed'));

    // Trigger a request that will cause a 401 error
    let contextValue;
    await act(async () => {
      const { getByText } = render(
        <AuthProvider>
          <AuthContext.Consumer>
            {value => {
              contextValue = value;
              return <>{JSON.stringify(value.user)}</>;
            }}
          </AuthContext.Consumer>
        </AuthProvider>
      );
    });

    let refreshFailure;
    await act(async () => {
      refreshFailure = await contextValue.refreshToken();
    });

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/token/refresh/', {
        refresh: 'mock_refresh_token',
      });
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('access_token');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('refresh_token');
      expect(contextValue.user).toBeNull();
      expect(refreshFailure).toBe(false);
    }, { timeout: 5000 });
  });
});
