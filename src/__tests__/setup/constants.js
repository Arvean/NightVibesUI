// Test constants to be shared across all tests

export const TEST_USER = {
  id: 'test-user-id',
  username: 'testuser',
  email: 'test@example.com'
};

export const TEST_VENUE = {
  id: 'test-venue-id',
  name: 'Test Venue',
  description: 'A test venue description',
  address: '123 Test Street'
};

export const TEST_CHECKIN = {
  id: 'test-checkin-id',
  venue: TEST_VENUE,
  timestamp: new Date().toISOString()
};

describe('Test Constants', () => {
  it('should export test constants', () => {
    expect(TEST_USER).toBeDefined();
    expect(TEST_VENUE).toBeDefined();
    expect(TEST_CHECKIN).toBeDefined();
  });
});