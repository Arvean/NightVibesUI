const AsyncStorageMock = {
  getItem: jest.fn((key) => {
    return Promise.resolve(AsyncStorageMock.data[key] || null);
  }),
  setItem: jest.fn((key, value) => {
    return Promise.resolve().then(() => {
      AsyncStorageMock.data[key] = value;
    });
  }),
  removeItem: jest.fn((key) => {
    return Promise.resolve().then(() => {
      delete AsyncStorageMock.data[key];
    });
  }),
  multiGet: jest.fn((keys) => {
    return Promise.resolve(
      keys.map((key) => [key, AsyncStorageMock.data[key] || null])
    );
  }),
  multiSet: jest.fn((keyValuePairs) => {
    return Promise.resolve().then(() => {
      keyValuePairs.forEach(([key, value]) => {
        AsyncStorageMock.data[key] = value;
      });
    });
  }),
  multiRemove: jest.fn((keys) => {
    return Promise.resolve().then(() => {
      keys.forEach((key) => {
        delete AsyncStorageMock.data[key];
      });
    });
  }),
  clear: jest.fn(() => {
    return Promise.resolve().then(() => {
      AsyncStorageMock.data = {};
    });
  }),
  getAllKeys: jest.fn(() => {
    return Promise.resolve(Object.keys(AsyncStorageMock.data));
  }),
  data: {}, // Internal storage for the mock
};

export default AsyncStorageMock;
