const mockAxiosInstance = {
  get: jest.fn(() => Promise.resolve({ data: {}, status: 200 })),
  post: jest.fn(() => Promise.resolve({ data: {}, status: 201 })),
  put: jest.fn(() => Promise.resolve({ data: {}, status: 200 })),
  delete: jest.fn(() => Promise.resolve({ data: {}, status: 204 })),
  patch: jest.fn(() => Promise.resolve({ data: {}, status: 200 })),
  create: jest.fn(() => mockAxiosInstance), // Mock the create method to return the mock itself
  interceptors: {
    request: { use: jest.fn(), eject: jest.fn() },
    response: { use: jest.fn(), eject: jest.fn() },
  },
  defaults: {
    headers: {
      common: {},
    },
  },
  mockClear: () => {
    mockAxiosInstance.get.mockClear();
    mockAxiosInstance.post.mockClear();
    mockAxiosInstance.put.mockClear();
    mockAxiosInstance.delete.mockClear();
    mockAxiosInstance.patch.mockClear();
  },
  mockResponseFor: (method, url, responseData, status = 200) => {
    const mockFn = mockAxiosInstance[method];
    if (!mockFn) {
      throw new Error(`Invalid method: ${method}`);
    }
    mockFn.mockImplementation((requestUrl, data, config) => {
      if (requestUrl.includes(url)) {
        return Promise.resolve({
          data: responseData,
          status: status,
          statusText: 'OK',
          headers: {},
          config: {},
          request: {}
        });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });
  },
  mockErrorFor: (method, url, error) => {
    const mockFn = mockAxiosInstance[method];
    if (!mockFn) {
      throw new Error(`Invalid method: ${method}`);
    }
    mockFn.mockImplementation((requestUrl) => {
      if (requestUrl.includes(url)) {
        return Promise.reject(error);
      }
      return Promise.reject(new Error('Unexpected URL'));
    });
  }
};

// Add this as a global before tests run
global.axiosInstance = mockAxiosInstance;

export default mockAxiosInstance;