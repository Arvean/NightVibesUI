jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: jest.fn((selector) => selector.ios)
  }
}));

const mockAxios = {
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
  create: jest.fn(() => mockAxios),
  defaults: {
    baseURL: 'http://localhost:8000',
    headers: {
      common: {},
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  },
  interceptors: {
    request: { use: jest.fn(), eject: jest.fn() },
    response: { use: jest.fn(), eject: jest.fn() }
  },
  setAuthToken: jest.fn((token) => {
    if (token) {
      mockAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete mockAxios.defaults.headers.common['Authorization'];
    }
  }),
  clearAuthToken: jest.fn(() => {
    delete mockAxios.defaults.headers.common['Authorization'];
  })
};

export default mockAxios;
