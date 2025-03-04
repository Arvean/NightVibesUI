// Mock implementation of AsyncStorage
const mockAsyncStorage = {
  store: new Map(),
  setItem: jest.fn((key, value) => {
    mockAsyncStorage.store.set(key, value);
    return Promise.resolve();
  }),
  getItem: jest.fn((key) => {
    const value = mockAsyncStorage.store.get(key);
    return Promise.resolve(value);
  }),
  removeItem: jest.fn((key) => {
    mockAsyncStorage.store.delete(key);
    return Promise.resolve();
  }),
  clear: jest.fn(() => {
    mockAsyncStorage.store.clear();
    return Promise.resolve();
  }),
  getAllKeys: jest.fn(() => {
    return Promise.resolve(Array.from(mockAsyncStorage.store.keys()));
  }),
  multiGet: jest.fn((keys) => {
    const values = keys.map(key => [key, mockAsyncStorage.store.get(key)]);
    return Promise.resolve(values);
  }),
  multiSet: jest.fn((keyValuePairs) => {
    keyValuePairs.forEach(([key, value]) => {
      mockAsyncStorage.store.set(key, value);
    });
    return Promise.resolve();
  }),
  multiRemove: jest.fn((keys) => {
    keys.forEach(key => {
      mockAsyncStorage.store.delete(key);
    });
    return Promise.resolve();
  })
};

// Mock @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

export default mockAsyncStorage; 