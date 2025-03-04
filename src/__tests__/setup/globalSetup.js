// Define global variables needed for React Native testing
global.__DEV__ = true;

describe('Global Setup', () => {
  it('should define __DEV__ variable', () => {
    expect(global.__DEV__).toBe(true);
  });
});