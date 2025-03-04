export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  username: 'testuser',
  email: 'test@example.com',
  profile_image: null,
  ...overrides
});

export const createMockVenue = (overrides = {}) => ({
  id: 'test-venue-id',
  name: 'Test Venue',
  description: 'A test venue',
  address: '123 Test St',
  latitude: 37.7749,
  longitude: -122.4194,
  category: 'bar',
  rating: 4.5,
  current_vibe: 'Lively',
  check_ins_count: 10,
  ...overrides
});

export const createMockCheckin = (overrides = {}) => ({
  id: 'test-checkin-id',
  user: createMockUser(),
  venue: createMockVenue(),
  vibe_rating: 'Lively',
  comment: 'Great place!',
  created_at: new Date().toISOString(),
  visibility: 'public',
  ...overrides
});

export const createMockApiResponse = (data, status = 200) => ({
  data,
  status,
  ok: status >= 200 && status < 300,
});

export const createMockApiError = (message = 'Error', status = 400) => ({
  response: {
    data: { message },
    status,
  },
});

export const createMockRating = (overrides = {}) => ({
    id: 'test-rating-id',
    user: createMockUser(),
    venue: createMockVenue(),
    rating: 4,
    comment: 'Good experience',
    created_at: new Date().toISOString(),
    ...overrides
});

describe('Mock Factories', () => {
  it('should create a mock user', () => {
    const user = createMockUser();
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('username');
    expect(user).toHaveProperty('email');
  });

  it('should create a mock venue', () => {
    const venue = createMockVenue();
    expect(venue).toHaveProperty('id');
    expect(venue).toHaveProperty('name');
    expect(venue).toHaveProperty('latitude');
    expect(venue).toHaveProperty('longitude');
  });

  it('should create a mock checkin', () => {
    const checkin = createMockCheckin();
    expect(checkin).toHaveProperty('id');
    expect(checkin).toHaveProperty('user');
    expect(checkin).toHaveProperty('venue');
    expect(checkin).toHaveProperty('created_at');
  });
});