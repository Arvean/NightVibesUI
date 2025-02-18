const mockVenues = [];
const mockFriends = { nearby_friends: [] };

const fetchVenues = async () => {
  return new Promise((resolve) => {
    resolve({
      ok: true,
      json: () => Promise.resolve(mockVenues),
    });
  });
};

const fetchFriends = async () => {
  return new Promise((resolve) => {
    resolve({
      ok: true,
      json: () => Promise.resolve(mockFriends),
    });
  });
};

export { fetchVenues, fetchFriends };
