import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EditProfileScreen from '../EditProfileScreen';
import { useNavigation } from '@react-navigation/native';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthContext } from '../AuthContext';
import api from '../axiosInstance';

// Mock the navigation hook
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
}));

// Mock the API
jest.mock('../axiosInstance');

describe('EditProfileScreen', () => {
  const mockUser = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    first_name: 'Test',
    last_name: 'User',
    bio: 'This is a test bio',
  };

  const mockUpdateUser = jest.fn();
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigation.mockReturnValue(mockNavigation);
    api.put.mockResolvedValue({ data: mockUser });
  });

  it('renders user information and input fields', () => {
    const { getByDisplayValue } = render(
      <ThemeProvider>
        <AuthContext.Provider value={{ user: mockUser, updateUser: mockUpdateUser }}>
          <EditProfileScreen />
        </AuthContext.Provider>
      </ThemeProvider>
    );
    
    expect(getByDisplayValue('testuser')).toBeTruthy();
    expect(getByDisplayValue('test@example.com')).toBeTruthy();
    expect(getByDisplayValue('Test')).toBeTruthy();
    expect(getByDisplayValue('User')).toBeTruthy();
    expect(getByDisplayValue('This is a test bio')).toBeTruthy();
  });

  it('updates state on input change', () => {
    const { getByDisplayValue } = render(
      <ThemeProvider>
        <AuthContext.Provider value={{ user: mockUser, updateUser: mockUpdateUser }}>
          <EditProfileScreen />
        </AuthContext.Provider>
      </ThemeProvider>
    );
    
    const usernameInput = getByDisplayValue('testuser');
    fireEvent.changeText(usernameInput, 'newusername');
    expect(getByDisplayValue('newusername')).toBeTruthy();
  });

  it('calls update user function on save button press', async () => {
    const { getByText } = render(
      <ThemeProvider>
        <AuthContext.Provider value={{ user: mockUser, updateUser: mockUpdateUser }}>
          <EditProfileScreen />
        </AuthContext.Provider>
      </ThemeProvider>
    );
    
    fireEvent.press(getByText('Save'));
    
    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/api/users/1/', mockUser);
      expect(mockUpdateUser).toHaveBeenCalledWith(mockUser);
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });

  it('navigates back on cancel button press', () => {
    const { getByText } = render(
      <ThemeProvider>
        <AuthContext.Provider value={{ user: mockUser, updateUser: mockUpdateUser }}>
          <EditProfileScreen />
        </AuthContext.Provider>
      </ThemeProvider>
    );
    
    fireEvent.press(getByText('Cancel'));
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});
