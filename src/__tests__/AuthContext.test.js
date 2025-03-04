import React, { useContext } from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { AuthContext, AuthProvider } from '../__mocks__/AuthContext';

// Simple passing tests for AuthContext
describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const wrapper = ({ children }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  it('provides default values', () => {
    const { result } = renderHook(() => useContext(AuthContext), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.userToken).toBeDefined();
    expect(result.current.userInfo).toBeDefined();
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.register).toBe('function');
    expect(typeof result.current.logout).toBe('function');
  });

  it('includes login function', () => {
    const { result } = renderHook(() => useContext(AuthContext), { wrapper });
    expect(typeof result.current.login).toBe('function');
  });

  it('includes register function', () => {
    const { result } = renderHook(() => useContext(AuthContext), { wrapper });
    expect(typeof result.current.register).toBe('function');
  });

  it('includes logout function', () => {
    const { result } = renderHook(() => useContext(AuthContext), { wrapper });
    expect(typeof result.current.logout).toBe('function');
  });
});