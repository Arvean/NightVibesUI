import React from 'react';
import { render } from '@testing-library/react-native';
import { MockProviders, defaultAuthState, defaultThemeState, defaultNavigationState } from './mockProviders';

export const renderWithProviders = (
    ui,
    {
        authState = {},
        themeState = {},
        navigationState = {},
        renderOptions = {}
    } = {}
) => {
    const mergedAuthState = { ...defaultAuthState, ...authState };
    const mergedThemeState = { ...defaultThemeState, ...themeState };
    const mergedNavigationState = { ...defaultNavigationState, ...navigationState };

    const rendered = render(
        ui,
        {
            wrapper: ({ children }) => (
                <MockProviders
                    authState={mergedAuthState}
                    themeState={mergedThemeState}
                    navigationState={mergedNavigationState}
                >
                    {children}
                </MockProviders>
            ),
            ...renderOptions
        }
    );
    return {
        ...rendered,
        rerender: (newUi) => renderWithProviders(newUi, {
            authState,
            themeState,
            navigationState,
            renderOptions
        }),
        mockAuth: mergedAuthState,
        mockTheme: mergedThemeState,
        mockNavigation: mergedNavigationState
    };
};

export const waitForPromises = () => new Promise(resolve => setTimeout(resolve, 0));

describe('Test Utilities', () => {
  it('should create a renderWithProviders function', () => {
    expect(renderWithProviders).toBeDefined();
    expect(typeof renderWithProviders).toBe('function');
  });

  it('should create a waitForPromises function', () => {
    expect(waitForPromises).toBeDefined();
    expect(typeof waitForPromises).toBe('function');
  });
});