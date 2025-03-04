import React, { useContext } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { MockProviders } from '../setup/mockProviders';
import { ThemeContext } from '../../context/ThemeContext';

// This is a template test for contexts
describe('Context Test Template', () => {
  const wrapper = ({ children }) => (
    <MockProviders>{children}</MockProviders>
  );

  describe('Provider Example', () => {
    it('provides context values', () => {
      const { result } = renderHook(() => useContext(ThemeContext), { wrapper });
      expect(result.current).toBeDefined();
      expect(result.current.theme).toBe('light');
    });
  });
});