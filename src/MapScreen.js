import React, { useState, useEffect, useRef } from 'react';
import Map, { Marker, Popup, NavigationControl, GeolocateControl } from 'react-map-gl';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Linking, Modal } from 'react-native';
import { getDistance } from 'geolib';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import { useTheme } from '../src/context/ThemeContext';
import MeetupPingDialog from '../src/components/MeetupPingDialog';
import RatingDialog from './components/RatingDialog';
import { AuthContext } from './AuthContext';
import { useContext } from 'react';
import { Skeleton } from '../src/components/Skeleton';
import Animated from '../src/components/Animated';

import api from './axiosInstance';

const MapScreen = () => {
  const { colors, isDark } = useTheme();
    const [viewport, setViewport] = useState({
        latitude: 40.7128,
        longitude: -74.0060,
        zoom: 13
    });
    const [venues, setVenues] = useState([]);
    const [friends, setFriends] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
    const [showMeetupDialog, setShowMeetupDialog] = useState(false);
    const [meetupVenue, setMeetupVenue] = useState(null);
    const [showRatingDialog, setShowRatingDialog] = useState(false);
    const [ratingVenue, setRatingVenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const mapRef = useRef(null);
    const navigation = useNavigation();
    const { user } = useContext(AuthContext);
    const [isAnimating, setIsAnimating] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null); // Add selectedFriend state
    const [showFriendList, setShowFriendList] = useState(false); // Add showFriendList state


    const styles = getStyles({ colors, isDark });

    const mapStyle = isDark ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11';

    useEffect(() => {
        checkLocationPermission();
    }, []);

    useEffect(() => {
        if (locationPermissionGranted) {
            getCurrentLocation();
        }
    }, [locationPermissionGranted]);

    useEffect(() => {
        const loadData = async() => {
            try {
                setLoading(true);
                const [venuesData, friendsData] = await Promise.all([
                    api.get('/api/venues/'),
                    api.get('/api/friends/')
                ]);
                setVenues(venuesData.data);
                setFriends(friendsData.data);
            }
            catch (error) {
                console.error("Error loading data:", error);
                Alert.alert("Error", "Failed to load data. Please check your connection and try again.");
            }
            finally {
                setLoading(false);
            }
        }
        loadData();
    }, [userLocation]);

    useEffect(() => {
        const fetchFriendLocations = async () => {
            if (!userLocation) return;
            try {
                const response = await api.get(`/api/friends/nearby/?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}&radius=5000`);
                // Update only existing friends
                setFriends(prevFriends => {
                    const newFriends = [...prevFriends];
                    response.data.nearby_friends.forEach(nearbyFriend => {
                        const index = newFriends.findIndex(f => f.id === nearbyFriend.id);
                        if (index !== -1) {
                            newFriends[index] = nearbyFriend;
                        }
                    });
                    return newFriends;
                });

            } catch (error) {
                console.error("Error fetching friend locations:", error);
            }
        };

        const intervalId = setInterval(fetchFriendLocations, 10000); // Fetch every 10 seconds

        return () => clearInterval(intervalId); // Clear interval on unmount
    }, [userLocation]);

    const checkLocationPermission = async () => {
        const permissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

        if (permissionStatus === RESULTS.GRANTED) {
            setLocationPermissionGranted(true);
        } else {
            requestLocationPermission();
        }
    };

    const requestLocationPermission = async () => {
        try {
            const granted = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            if (granted === RESULTS.GRANTED) {
                setLocationPermissionGranted(true);
                getCurrentLocation();
            } else {
                Alert.alert(
                    "Location Permission Required",
                    "Please enable location permissions in settings to use this feature.",
                    [
                        {
                            text: "Open Settings",
                            onPress: () => Linking.openSettings(),
                        },
                        {
                            text: "Cancel",
                            style: "cancel",
                        },
                    ]
                );
                console.log('Location permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ latitude, longitude });
                setViewport(prevViewport => ({
                    ...prevViewport,
                    latitude,
                    longitude
                }));
            },
            error => {
                console.log(error);
                Alert.alert("Error", "Failed to get current location.");
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    };

    const onMarkerClick = (item, type) => {
        setSelectedItem({ type, data: item });
    };

    const calculateDistance = (venue) => {
        if (!userLocation) return 'Loading...';
        const distance = getDistance(
            { latitude: userLocation.latitude, longitude: userLocation.longitude },
            { latitude: venue.location.coordinates[1], longitude: venue.location.coordinates[0] }
        );
        return (distance / 1609.344).toFixed(2); // Convert meters to miles
    };

    const filteredVenues = venues.filter(venue =>
        venue.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleGeolocateClick = () => {
        setIsAnimating(true);
        getCurrentLocation();
        setTimeout(() => {
            setIsAnimating(false);
        }, 3000);
    };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Explore</Text>
            <TouchableOpacity
              style={styles.filterButton}
              aria-label="Filter"
              onPress={() => navigation.navigate('VenueListScreen')}
            >
              <Text style={styles.filterButtonText}>Filter</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search venues..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              testID="search-input"
            />
          </View>
        </View>
      </View>
      <View style={styles.mapContainer}>
        {userLocation ? (
          <Map
            ref={mapRef}
            {...viewport}
            style={{ width: '100%', height: '100%' }}
            mapStyle={mapStyle}
            mapboxAccessToken="pk.eyJ1IjoiYXJ2ZWFuIiwiYSI6ImNtN2I3eTExZjAzeW4yaXBzaW9kY2ZpbGsifQ.2rpkCcwdHS3pUVo-Ey4zSA"
            onMove={evt => setViewport(evt.viewState)}
            latitude={userLocation?.latitude}
            longitude={userLocation?.longitude}
            zoom={13}
            testID="map-container"
          >
            {filteredVenues.map(venue => (
              <Marker
                key={venue.id}
                latitude={venue.location.coordinates[1]}
                longitude={venue.location.coordinates[0]}
                onClick={e => {
                  e.preventDefault();
                  onMarkerClick(venue, 'venue');
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.venueMarker,
                    { backgroundColor: colors.markerVenue }
                  ]}
                  testID={`venue-marker-${venue.id}`}
                />
              </Marker>
            ))}
            {friends.map(friend => (
              <Marker
                key={friend.id}
                latitude={friend.location.coordinates[1]}
                longitude={friend.location.coordinates[0]}
                onClick={e => {
                  if (e.originalEvent) {
                    e.originalEvent.stopPropagation();
                  }
                  setSelectedItem({ type: 'friend', data: friend });
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.friendMarker,
                    { backgroundColor: colors.markerFriend }
                  ]}
                  testID={`friend-marker-${friend.id}`}
                />
              </Marker>
            ))}
            {userLocation && (
                <Marker
                    latitude={userLocation.latitude}
                    longitude={userLocation.longitude}
                >
                    <View style={styles.currentLocation}>
                        <View style={styles.pulse}/>
                    </View>
                </Marker>
            )}
            <NavigationControl style={styles.navigationControl} />
            <GeolocateControl
                style={styles.geolocateControl}
                positionOptions={{ enableHighAccuracy: true }}
                trackUserLocation={false}
                showUserHeading={false}
                onGeolocate={handleGeolocateClick}
            />
          </Map>
        ) : (
          <View style={styles.loadingContainer}>
            <Skeleton width={200} height={20} style={styles.skeletonText} />
            <Skeleton width={150} height={20} style={styles.skeletonText} />
            <Skeleton width={100} height={20} style={styles.skeletonText} />
          </View>
        )}
      </View>

      {selectedItem && (
        <Popup
          latitude={selectedItem.data.location.coordinates[1]}
          longitude={selectedItem.data.location.coordinates[0]}
          onClose={() => setSelectedItem(null)}
          style={styles.popup}
          anchor="bottom"
        >
          <View>
            <Text style={styles.popupTitle}>
              {selectedItem.type === 'venue' ? selectedItem.data.name : selectedItem.data.username}
            </Text>
            {selectedItem.type === 'venue' && (
              <>
                <Text style={styles.popupDescription}>
                  Distance: {calculateDistance(selectedItem.data)} miles
                </Text>
                <Text style={styles.popupDescription}>
                  Category: {selectedItem.data.category}
                </Text>
                <Text style={styles.popupDescription}>
                    Vibe: {selectedItem.data.current_vibe ? selectedItem.data.current_vibe : 'Unknown'}
                </Text>
                <TouchableOpacity
                    style={styles.checkInButton}
                    onPress={() => handleCheckIn(selectedItem.data.id)}
                >
                  <Text style={styles.checkInButtonText}>Check In</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.meetupButton}
                  onPress={() => {
                    setMeetupVenue(selectedItem.data);
                    setShowMeetupDialog(true);
                  }}
                >
                  <Text style={styles.checkInButtonText}>Meetup Here</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.rateButton}
                    onPress={() => {
                        setRatingVenue(selectedItem.data);
                        setShowRatingDialog(true);
                    }}
                >
                    <Text style={styles.rateButtonText}>Rate Venue</Text>
                </TouchableOpacity>
              </>
            )}
            {selectedItem.type === 'friend' && (
              <TouchableOpacity
                style={styles.friendActivityButton}
                onPress={() => {
                  navigation.navigate('FriendActivityScreen', { friendId: selectedItem.data.id });
                }}
              >
                <Text style={styles.friendActivityButtonText}>View Activity</Text>
              </TouchableOpacity>
            )}
          </View>
        </Popup>
      )}
      <MeetupPingDialog
        isVisible={showMeetupDialog}
        onClose={() => setShowMeetupDialog(false)}
        venue={meetupVenue}
        onSendPing={handleSendMeetupPing}
        onSelectFriend={() => setShowFriendList(true)}
      />
      <RatingDialog
        isVisible={showRatingDialog}
        onClose={() => setShowRatingDialog(false)}
        venue={ratingVenue}
        onRateVenue={handleRateVenue}
      />
        {/* MODAL FOR FRIEND LIST */}
        <Modal
            animationType="slide"
            transparent={true}
            visible={showFriendList}
            onRequestClose={() => {
                setShowFriendList(!showFriendList);
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Select a Friend</Text>
                    {friends.map((friend) => (
                        <TouchableOpacity
                            key={friend.id}
                            style={styles.friendItem}
                            onPress={() => {
                                setSelectedFriend(friend.id);
                                setShowFriendList(false);
                            }}
                        >
                            <Text style={styles.friendName}>{friend.username}</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                        style={{ ...styles.modalButton, backgroundColor: colors.secondary }}
                        onPress={() => setShowFriendList(false)}
                    >
                        <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    </View>
  );

    function handleMeetupClick() {
        setShowFriendList(true);
    }


  async function handleSendMeetupPing(venueId, message) {
    if (!user) {
      Alert.alert("Error", "You must be logged in to send a meetup ping.");
      return;
    }
    if (!selectedFriend) {
        Alert.alert("Error", "Please select a friend to send a meetup ping.");
        return;
    }

    try {
      const response = await api.post('/api/pings/', {
        sender: user.id,
        receiver: selectedFriend,
        venue: venueId,
        message: message,
      });

      if (response.status === 201) {
        Alert.alert("Success", "Meetup ping sent!");
        // Optionally refresh data or update UI, and reset selectedFriend
        setSelectedFriend(null);
      } else {
        Alert.alert("Error", "Failed to send meetup ping. Please try again.");
      }
    } catch (error) {
      console.error("Meetup ping error:", error);
      Alert.alert("Error", "Failed to send meetup ping. Please try again.");
    }
  }

  async function handleRateVenue(venueId, rating) {
    if (!user) {
      Alert.alert("Error", "You must be logged in to rate a venue.");
      return;
    }
    try {
      console.log("Rating", venueId, rating);
      const response = await api.post('/api/ratings/', {
        user: user.id,
        venue: venueId,
        rating: rating,
      });

      if (response.status === 201 || response.status === 200) {
        Alert.alert("Success", "Venue rated successfully!");
      } else {
        Alert.alert("Error", "Failed to rate venue. Please try again.");
      }
    } catch (error) {
      console.error("Rating error:", error);
      Alert.alert("Error", "Failed to rate venue. Please try again.");
    }
  }

    async function handleCheckIn(venueId) {
        if (!user) {
            Alert.alert("Error", "You must be logged in to check in.");
            return;
        }
        try {
            const response = await api.post('/api/checkins/', {
                user: user.id,
                venue: venueId,
                vibe_rating: 'Lively', // Default value for now
                visibility: 'public',  // Default value for now
            });

            if (response.status === 201) {
                Alert.alert("Success", "Checked in successfully!");
                // Optionally refresh data or update UI
            } else {
                Alert.alert("Error", "Failed to check in. Please try again.");
            }
        } catch (error) {
            console.error("Check-in error:", error);
            Alert.alert("Error", "Failed to check in. Please try again.");
        }
    }
};

const getStyles = ({ colors, isDark }) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.headerBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    padding: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  filterButton: {
    padding: 8,
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  filterButtonText: {
    color: colors.buttonText,
  },
  searchContainer: {
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: colors.inputBackground,
    color: colors.text,
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 10,
    borderColor: colors.border,
    borderWidth: 1,
  },
  mapContainer: {
    flex: 1,
  },
  venueMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    cursor: 'pointer',
  },
  friendMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    cursor: 'pointer',
  },
  currentLocation: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(100, 149, 237, 0.5)',
    borderWidth: 3,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(100, 149, 237, 0.3)',
    position: 'absolute',
    animationName: 'pulse',
    animationDuration: '3s',
    animationTimingFunction: 'ease-out',
    animationIterationCount: 'infinite',
  },
  navigationControl: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  geolocateControl: {
    position: 'absolute',
    top: 50,
    left: 10,
  },
  popup: {
    backgroundColor: colors.popupBackground,
    color: colors.text,
  },
  popupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  popupDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  checkInButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  checkInButtonText: {
    color: colors.buttonText,
    textAlign: 'center',
  },
    rateButton: {
        backgroundColor: colors.secondary,
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
    },
    rateButtonText: {
        color: colors.buttonText,
        textAlign: 'center',
    },
  friendActivityButton: {
    backgroundColor: colors.accent,
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  friendActivityButtonText: {
    color: colors.buttonText,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  skeletonText: {
    marginBottom: 10,
    borderRadius: 5,
  },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    friendItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: '100%',
    },
    friendName: {
        fontSize: 16,
    },
    modalButton: {
        backgroundColor: '#2196F3',
        borderRadius: 5,
        padding: 10,
        elevation: 2,
        marginTop: 15,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default MapScreen;
