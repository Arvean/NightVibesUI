import React, { useState, useEffect } from 'react';
import { Map, Marker, Popup } from 'react-map-gl';
import { fetchVenues, fetchFriends } from './__mocks__/api';

const MapScreen = () => {
  const [viewport, setViewport] = useState({
    latitude: 40.7128,
    longitude: -74.0060,
    zoom: 13
  });
  const [venues, setVenues] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setViewport(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
          fetchData();
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your location. Please enable location services.');
          setIsLoading(false);
        }
      );
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (viewport.latitude && viewport.longitude) {
        fetchData();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [viewport]);

  const fetchData = async () => {
    try {
      const [venuesRes, friendsRes] = await Promise.all([
        fetchVenues(),
        fetchFriends()
      ]);

      if (!venuesRes.ok || !friendsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [venuesData, friendsData] = await Promise.all([
        venuesRes.json(),
        friendsRes.json()
      ]);

      setVenues(venuesData);
      setFriends(friendsData.nearby_friends);
    } catch (err) {
      setError('Failed to load map data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div role="alert" className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 border-b">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Explore</h1>
            <button 
              className="px-3 py-2 border rounded"
              aria-label="Filter"
            >
              Filter
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search venues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-8 py-2 border rounded"
              data-testid="search-input"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        <Map
          {...viewport}
          onMove={evt => setViewport(evt.viewport)}
          mapStyle="mapbox://styles/mapbox/light-v11"
          mapboxAccessToken="YOUR_MAPBOX_TOKEN"
          style={{ width: '100%', height: '100%' }}
          data-testid="map-container"
        >
          {venues.map(venue => (
            <Marker
              key={venue.id}
              latitude={venue.location.coordinates[1]}
              longitude={venue.location.coordinates[0]}
              onClick={e => {
                e.originalEvent.stopPropagation();
                setSelectedItem({ type: 'venue', data: venue });
              }}
            >
              <div 
                className="bg-blue-500 w-4 h-4 rounded-full border-2 border-white cursor-pointer"
                data-testid={`venue-marker-${venue.id}`}
              />
            </Marker>
          ))}

          {friends.map(friend => (
            <Marker
              key={friend.id}
              latitude={friend.location.coordinates[1]}
              longitude={friend.location.coordinates[0]}
              onClick={e => {
                e.originalEvent.stopPropagation();
                setSelectedItem({ type: 'friend', data: friend });
              }}
            >
              <div 
                className="bg-green-500 w-4 h-4 rounded-full border-2 border-white cursor-pointer"
                data-testid={`friend-marker-${friend.id}`}
              />
            </Marker>
          ))}

          <Marker
            latitude={viewport.latitude}
            longitude={viewport.longitude}
          >
            <div className="bg-purple-500 w-5 h-5 rounded-full border-2 border-white">
              <div className="animate-ping absolute w-full h-full rounded-full bg-purple-500 opacity-75" />
            </div>
          </Marker>
        </Map>

        {selectedItem && (
          <div className="absolute bottom-4 left-4 w-80 p-4 bg-white rounded shadow-lg" data-testid="selected-item-info">
            {selectedItem.type === 'venue' ? (
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{selectedItem.data.name}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedItem.data.category}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                    {selectedItem.data.current_vibe || 'Lively'}
                  </span>
                </div>
                <button 
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={() => window.location.href = `/venues/${selectedItem.data.id}`}
                >
                  View Details
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{selectedItem.data.username}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedItem.data.last_seen || 'Recently active'}
                    </p>
                  </div>
                  <button className="px-3 py-1 border rounded text-sm">
                    Send Ping
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapScreen;
