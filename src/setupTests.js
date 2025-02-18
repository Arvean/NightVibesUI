import '@testing-library/jest-dom';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
}
window.IntersectionObserver = MockIntersectionObserver;

// Mock ResizeObserver
class MockResizeObserver {
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
}
window.ResizeObserver = MockResizeObserver;

// Mock Mapbox GL
jest.mock('mapbox-gl', () => ({
  Map: jest.fn(),
  Marker: jest.fn(),
  NavigationControl: jest.fn(),
}));

// Mock window.URL.createObjectURL
window.URL.createObjectURL = jest.fn();

// Mock window.fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
  })
);

// Mock React Native
jest.mock('react-native', () => ({
  Platform: {
    OS: 'web',
    select: (config) => config.web,
  },
}));

// Add custom test utilities
global.mockAxiosResponse = (data) => ({ data, status: 200, statusText: 'OK' });

global.mockAxiosError = (message, status = 400) => ({
  response: {
    data: { message },
    status,
  },
});

// Helper to wait for promises to resolve
global.flushPromises = () => new Promise(resolve => setImmediate(resolve));
