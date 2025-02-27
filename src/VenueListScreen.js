import React, { useState, useEffect, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
// Importing various UI components from 'lucide-react'
import { Search, Filter, MapPin, Star, Activity, Loader, Map, List,
         Clock, Users, TrendingUp } from 'lucide-react';
import { ScrollView, View, StyleSheet, Text, ActivityIndicator } from 'react-native'; // Use ScrollView and View from react-native
import { Button } from './components/ui/Button'; // Corrected import paths
// TODO: uncomment these when we know where these components are
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card'; // Corrected import paths
// import { Input } from '@/components/Input'; // Corrected import paths
// import { Badge } from '@/components/Badge'; // Corrected import paths
// import { Alert, AlertDescription } from '@/components/Alert';
// import { Tabs, TabsList, TabsTrigger } from '@/components/Tabs';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/Select';
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
//   SheetFooter,
//   SheetClose,
// } from '@/components/Sheet';
import { useTheme } from './context/ThemeContext'; // Import useTheme
import api from './axiosInstance';

/**
 * VenuePreview Component:
 * - Displays a quick preview of a venue using a View (instead of HoverCard).
 * - Shows venue name, category, address, capacity, and rating.
 */
const VenuePreview = ({ venue }) => {
    const { colors } = useTheme();
    return (
    <View style={styles.venuePreview}>
        <View style={styles.venuePreviewHeader}>
        <Text style={styles.venuePreviewName}>{venue.name}</Text>
        {/*<Badge style={styles.badge} variant="outline">{venue.category}</Badge>*/}
        </View>
        <View style={[styles.venuePreviewDetail, { color: colors.textSecondary }]}>
        <MapPin style={styles.venuePreviewIcon} />
        <Text>{venue.address}</Text>
        </View>
        <View style={styles.venuePreviewFooter}>
        <View style={styles.venuePreviewFooterItem}>
            <Users style={styles.venuePreviewIcon} />
            <Text>{venue.current_capacity || 'Not busy'}</Text>
        </View>
        <View style={styles.venuePreviewFooterItem}>
            <Star style={[styles.venuePreviewIcon, { color: 'yellow' }]} />
            <Text>{venue.rating?.toFixed(1) || 'New'}</Text>
        </View>
        </View>
    </View>
    )
};

/**
 * MapView Component:
 * - Displays venues on a simple map.
 * - Allows selecting a venue, which triggers the onVenueSelect callback.
 */
const MapView = ({ venues, onVenueSelect }) => {
  const [selectedVenue, setSelectedVenue] = useState(null);
    const { colors } = useTheme();

  return (
    <View style={styles.mapContainer}>
      <View // Simulate map with a View
        style={styles.mapBackground}
      >
        {/* Venue Markers (Simplified) */}
        {venues.map((venue, index) => (
          <View
            key={venue.id}
            style={[
              styles.mapMarker,
              {
                left: 100 + (index * 50) % (styles.mapBackground.width - 50), // Basic positioning within bounds
                top: 50 + (index * 70) % (styles.mapBackground.height - 100),  // Basic positioning
              },
            ]}
            onTouchEnd={() => { // Use onTouchEnd for touch events
              setSelectedVenue(venue);
              onVenueSelect(venue);
            }}
          >
            <View style={[styles.mapMarkerInner, { backgroundColor: colors.primary }]} />
            <View style={[styles.mapMarkerOuter, { backgroundColor: colors.primary }]} />
          </View>
        ))}

        {/* Current Location (Simplified) */}
        <View style={[styles.mapCurrentLocation, { backgroundColor: colors.green }]} />
      </View>

      {/* Map Controls */}
      <View style={styles.mapControls}>
        <Button variant="secondary" size="icon" style={styles.mapControlButton}>
          <MapPin style={styles.mapControlIcon} />
        </Button>
      </View>

      {/* Selected Venue Preview */}
      {selectedVenue && (
        /*<Card style={styles.selectedVenueCard}>
          <CardContent style={styles.cardContent}>
            <VenuePreview venue={selectedVenue} />
          </CardContent>
        </Card>*/
        <View>
            <VenuePreview venue={selectedVenue} />
        </View>
      )}
    </View>
  );
};

/**
 * VenueCard Component:
 * - Displays a summary card for a venue.
 * - Clicking the card navigates to the venue's detail page.
 */
const VenueCard = ({ venue, navigation }) => { // Receive navigation prop
    const { colors } = useTheme();
    return (
        // TODO: replace with actual card
  <View
    style={styles.card}
    onTouchEnd={() => navigation.navigate('VenueDetail', { venueId: venue.id })} // Use navigation.navigate and pass venueId
  >
    <View style={styles.cardContent}>
      <View style={styles.cardRow}>
        <View style={styles.cardColumn}>
          <Text style={styles.venueName}>{venue.name}</Text>
          <View style={styles.venueDetailRow}>
            <MapPin style={[styles.cardIcon, { color: colors.textSecondary }]} />
            <Text style={[styles.venueDetailText, { color: colors.textSecondary }]}>
                {venue.distance ? `${venue.distance} away` : venue.address}
            </Text>
          </View>
          <View style={styles.badgeContainer}>
            {/*<Badge style={styles.badge} variant="secondary">{venue.category}</Badge>*/}
            {venue.current_vibe && (
              /*<Badge style={[styles.badge, styles.trendingBadge]}>
                {venue.current_vibe}
              </Badge>*/
              <Text>{venue.current_vibe}</Text>
            )}
            {venue.is_trending && (
              /*<Badge style={[styles.badge, styles.trendingBadge]}>
                Trending
              </Badge>*/
              <Text>Trending</Text>
            )}
          </View>
        </View>
        <View style={styles.cardColumn}>
          <View style={styles.venueDetailRow}>
            <Star style={[styles.cardIcon, { color: 'yellow' }]} />
            <Text style={styles.venueDetailText}>{venue.rating?.toFixed(1) || 'New'}</Text>
          </View>
          <View style={styles.venueDetailRow}>
            <Activity style={styles.cardIcon} />
            <Text style={[styles.venueDetailText, { color: colors.textSecondary }]}>
                {venue.check_ins_count || 0} here
            </Text>
          </View>
          {venue.opening_hours && (
            <View style={styles.venueDetailRow}>
              <Clock style={[styles.cardIcon, { color: colors.textSecondary }]} />
              <Text style={[styles.venueDetailText, { color: colors.textSecondary }]}>{venue.opening_hours}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  </View>
)};

/**
 * FilterSheet Component:
 * - Provides a sheet (modal) for filtering venues based on category, sort order, and vibe.
 * - Allows resetting filters to default values.
 */
const FilterSheet = ({
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  vibeFilter,
  setVibeFilter
}) => {
  const { colors } = useTheme();
  const categories = [
    { value: 'all', label: 'All Venues' },
    { value: 'bar', label: 'Bars' },
    { value: 'club', label: 'Clubs' },
    { value: 'lounge', label: 'Lounges' },
    { value: 'pub', label: 'Pubs' }
  ];

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'distance', label: 'Nearest' },
    { value: 'trending', label: 'Trending' }
  ];

  const vibeOptions = [
    { value: 'all', label: 'All Vibes' },
    { value: 'Lively', label: 'Lively' },
    { value: 'Chill', label: 'Chill' },
    { value: 'Crowded', label: 'Crowded' },
    { value: 'Empty', label: 'Empty' }
  ];

  return (
    /*<Sheet>
      <SheetTrigger asChild>*/
        <Button variant="outline" size="icon" style={styles.filterButton}>
          <Filter style={styles.filterIcon} />
        </Button>
      /*</SheetTrigger>
      <SheetContent style={[styles.sheetContent, { backgroundColor: colors.background }]}>
        <SheetHeader>
          <SheetTitle style={{ color: colors.text }}>Filter Venues</SheetTitle>
          <SheetDescription style={{ color: colors.textSecondary }}>
            Adjust filters to find the perfect spot
          </SheetDescription>
        </SheetHeader>
        <View style={styles.sheetSection}>
          <Text style={[styles.sheetLabel, { color: colors.text }]}>Category</Text>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger style={[styles.selectTrigger, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <SelectValue placeholder="Select category" style={{ color: colors.text }}/>
            </SelectTrigger>
            <SelectContent style={{ backgroundColor: colors.card }}>
              {categories.map(category => (
                <SelectItem key={category.value} value={category.value} style={{ color: colors.text }}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </View>
        <View style={styles.sheetSection}>
          <Text style={[styles.sheetLabel, { color: colors.text }]}>Sort By</Text>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger style={[styles.selectTrigger, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <SelectValue placeholder="Sort by" style={{ color: colors.text }}/>
            </SelectTrigger>
            <SelectContent style={{ backgroundColor: colors.card }}>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value} style={{ color: colors.text }}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </View>
        <View style={styles.sheetSection}>
          <Text style={[styles.sheetLabel, { color: colors.text }]}>Current Vibe</Text>
          <Select value={vibeFilter} onValueChange={setVibeFilter}>
            <SelectTrigger style={[styles.selectTrigger, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <SelectValue placeholder="Select vibe" style={{ color: colors.text }}/>
            </SelectTrigger>
            <SelectContent style={{ backgroundColor: colors.card }}>
              {vibeOptions.map(option => (
                <SelectItem key={option.value} value={option.value} style={{ color: colors.text }}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </View>
        <SheetFooter>
          <SheetClose asChild>
            <Button
              variant="outline"
              style={styles.resetButton}
              onPress={() => {
                setSelectedCategory('all');
                setSortBy('popular');
                setVibeFilter('all');
              }}
            >
              Reset Filters
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>*/
  );
};

/**
 * VenueListScreen Component:
 * - Main screen for displaying a list or map of venues.
 * - Fetches venue data from an API and applies filtering and sorting.
 * - Allows searching for venues by name or address.
 * - Provides tabs to switch between list and map views.
 */
const VenueListScreen = () => {
    const { colors } = useTheme();
    const navigation = useNavigation();
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  // State to manage the view mode: 'list' or 'map'
  const [viewMode, setViewMode] = useState('list');
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [vibeFilter, setVibeFilter] = useState('all');

  // useEffect hook to fetch venues data when the component mounts
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/api/venues/'); // Use the 'api' instance
        if (!response.ok) throw new Error('Failed to fetch venues');
        const data = await response.data;
        setVenues(data);
        setFilteredVenues(data);
      } catch (err) {
        setError('Failed to load venues. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenues();
  }, []);

  // useEffect hook to filter and sort venues based on selected criteria
  useEffect(() => {
    let result = [...venues];

    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(venue => venue.category === selectedCategory);
    }

    // Apply vibe filter
    if (vibeFilter !== 'all') {
      result = result.filter(venue => venue.current_vibe === vibeFilter);
    }

    // Apply search
    if (searchQuery) {
      result = result.filter(venue =>
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'distance':
        result.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        break;
      case 'trending':
        result.sort((a, b) => (b.check_ins_count || 0) - (a.check_ins_count || 0));
        break;
      default:
        result.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }

    setFilteredVenues(result);
  }, [venues, selectedCategory, sortBy, vibeFilter, searchQuery]);

  // Conditional rendering based on loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator testID="loading-indicator" size="large" color={colors.primary} />
      </View>
    );
  }

  // Conditional rendering based on error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Main return statement for rendering the VenueListScreen component
  return (
    <View style={styles.container}>
      {/* Header */}
      {/*<Card style={styles.headerCard}>
        <CardHeader style={styles.cardHeader}>*/}
        <View>
        <View>
          {/*<CardTitle style={styles.cardTitle}>Find Venues</CardTitle>*/}
          <Text>Find Venues</Text>
            {/* Tabs to switch between list and map views */}
            {/*<Tabs value={viewMode} onValueChange={setViewMode}>
              <TabsList style={styles.tabsList}>
                <TabsTrigger value="list" style={styles.tabsTrigger} testID="list-tab">
                  <List style={styles.tabIcon} />
                </TabsTrigger>
                <TabsTrigger value="map" style={styles.tabsTrigger} testID="map-tab">
                  <Map style={styles.tabIcon} />
                </TabsTrigger>
              </TabsList>
            </Tabs>*/}
          </View>
            
          <View style={styles.inputContainer}>
            <View style={styles.searchContainer}>
              <Search style={styles.searchIcon} />
              <Input
                placeholder="Search venues..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
              />
            </View>
            {/* FilterSheet component for filtering options */}
            <FilterSheet
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              sortBy={sortBy}
              setSortBy={setSortBy}
              vibeFilter={vibeFilter}
              setVibeFilter={setVibeFilter}
              testID="filter-button"
            />
          </View>

          {/* Active Filters Display */}
          {(selectedCategory !== 'all' || vibeFilter !== 'all') && (
            <View style={styles.activeFiltersContainer}>
              {selectedCategory !== 'all' && (
                /*<Badge style={styles.badge} variant="secondary">
                  {selectedCategory}
                  <Button
                    variant="ghost"
                    size="sm"
                    style={styles.filterCloseButton}
                    onPress={() => setSelectedCategory('all')}
                  >
                    ×
                  </Button>
                </Badge>*/
                <Text>{selectedCategory}</Text>
              )}
              {vibeFilter !== 'all' && (
                /*<Badge style={styles.badge} variant="secondary">
                  {vibeFilter}
                  <Button
                    variant="ghost"
                    size="sm"
                    style={styles.filterCloseButton}
                    onPress={() => setVibeFilter('all')}
                  >
                    ×
                  </Button>
                </Badge>*/
                <Text>{vibeFilter}</Text>
              )}
            </View>
          )}
        {/*</CardHeader>
      </Card>*/}
        </View>

      {/* Conditional rendering for list or map view */}
      {viewMode === 'list' ? (
        <ScrollView style={styles.scrollView}>
          <View style={styles.contentContainer}>
            {filteredVenues.length === 0 ? (
              /*<Card style={styles.noVenuesCard}>
                <View style={styles.noVenuesContent}>
                  <Text style={styles.noVenuesTitle}>No venues found</Text>
                  <Text style={styles.noVenuesText}>
                    Try adjusting your filters or search terms
                  </Text>
                  <Button
                    variant="outline"
                    style={styles.resetButton}
                    onPress={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setVibeFilter('all');
                      setSortBy('popular');
                    }}
                  >
                    Reset All Filters
                  </Button>
                </View>
              </Card>*/
              <View>
                <Text>No venues found</Text>
              </View>
            ) : (
              <View style={styles.venuesContainer}>
                {filteredVenues.map(venue => (
                  <VenueCard key={venue.id} venue={venue} navigation={navigation} />
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      ) : (
        <MapView 
          venues={filteredVenues} 
          onVenueSelect={(venue) => navigation.navigate('VenueDetail', { venueId: venue.id })}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    },
    headerCard: {
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    cardHeader: {
        paddingVertical: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    tabsList: {
        flexDirection: 'row',
    },
    tabsTrigger: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabIcon: {
        width: 20,
        height: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    searchContainer: {
        flex: 1,
        position: 'relative',
    },
    searchIcon: {
        position: 'absolute',
        left: 8,
        top: 12,
        width: 20,
        height: 20,
    },
    searchInput: {
        paddingLeft: 36,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
    },
    filterButton: {
        paddingHorizontal: 12,
    },
    filterIcon: {
        width: 20,
        height: 20,
    },
    activeFiltersContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    badge: {
        marginRight: 4,
    },
    filterCloseButton: {
        padding: 0,
        width: 16,
        height: 16,
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
    },
    noVenuesCard: {
        padding: 32,
        alignItems: 'center',
    },
    noVenuesContent: {
        alignItems: 'center',
    },
    noVenuesTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    noVenuesText: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 16,
    },
    resetButton: {
        marginTop: 16,
    },
    venuesContainer: {
        gap: 16,
    },
    card: {
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 16,
    },
    cardContent: {
        padding: 16,
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardColumn: {
        flex: 1,
    },
    venueName: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    venueDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    cardIcon: {
        width: 16,
        height: 16,
        marginRight: 4,
    },
    venueDetailText: {
        fontSize: 14,
    },
    badgeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    trendingBadge: {
        backgroundColor: 'orange',
        color: 'white'
    },
    mapContainer: {
        flex: 1,
        position: 'relative'
    },
    mapBackground: {
        flex: 1,
        backgroundColor: 'lightgray',
        width: '100%', // Add width
        height: 300, // Add a specific height for the map
    },
    mapMarker: {
        position: 'absolute',
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapMarkerInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        position: 'absolute',
        top: 6,
        left: 6,
    },
    mapMarkerOuter: {
        width: 24,
        height: 24,
        borderRadius: 12,
        opacity: 0.2
    },
    mapCurrentLocation: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -12,
        marginTop: -12,
        width: 24,
        height: 24,
        borderRadius: 12,
    },
    mapControls: {
        position: 'absolute',
        bottom: 16,
        right: 16,
    },
    mapControlButton: {
        width: 40,
        height: 40,
    },
    mapControlIcon: {
        width: 20,
        height: 20,
    },
    selectedVenueCard: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        width: '80%',
        zIndex: 10
    },
    venuePreview: {
        padding: 12,
        borderWidth: 1,
        borderRadius: 8
    },
    venuePreviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4
    },
    venuePreviewName: {
        fontSize: 16,
        fontWeight: '600'
    },
    venuePreviewDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4
    },
    venuePreviewIcon: {
        width: 16,
        height: 16,
        marginRight: 4
    },
    venuePreviewFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    venuePreviewFooterItem: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    sheetContent: {
        padding: 16
    },
    sheetSection: {
        marginBottom: 16
    },
    sheetLabel: {
        marginBottom: 8,
        fontWeight: '600'
    },
    selectTrigger: {
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    resetButton: {
        marginTop: 16
    }
});

export default VenueListScreen;
