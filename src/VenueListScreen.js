import React, { useState, useEffect } from 'react';
// Importing various UI components from 'lucide-react' and '@/components/ui/*'
import { Search, Filter, MapPin, Star, Activity, Loader, Map, List, 
         Clock, Users, TrendingUp, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

/**
 * VenuePreview Component:
 * - Displays a quick preview of a venue using a HoverCard.
 * - Shows venue name, category, address, capacity, and rating.
 */
const VenuePreview = ({ venue }) => (
  <HoverCard>
    <HoverCardTrigger asChild>
      <div className="cursor-pointer">
        <Badge className="bg-blue-500">{venue.name}</Badge>
      </div>
    </HoverCardTrigger>
    <HoverCardContent className="w-80">
      <div className="space-y-2">
        <div className="flex justify-between">
          <h4 className="font-semibold">{venue.name}</h4>
          <Badge variant="outline">{venue.category}</Badge>
        </div>
        <div className="text-sm text-muted-foreground flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {venue.address}
        </div>
        <div className="flex justify-between text-sm">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{venue.current_capacity || 'Not busy'}</span>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1 text-yellow-500" />
            <span>{venue.rating?.toFixed(1) || 'New'}</span>
          </div>
        </div>
      </div>
    </HoverCardContent>
  </HoverCard>
);

/**
 * MapView Component:
 * - Displays venues on a simple SVG map.
 * - Allows selecting a venue, which triggers the onVenueSelect callback.
 */
const MapView = ({ venues, onVenueSelect }) => {
  const [selectedVenue, setSelectedVenue] = useState(null);

  return (
    <div className="relative w-full h-[calc(100vh-13rem)]">
      <svg 
        viewBox="0 0 800 600" 
        className="w-full h-full bg-accent/10"
      >
        {/* Map Background */}
        <rect width="800" height="600" fill="#f1f5f9" />
        
        {/* Grid Lines */}
        {Array.from({ length: 20 }).map((_, i) => (
          <React.Fragment key={i}>
            <line 
              x1={i * 40} y1="0" x2={i * 40} y2="600" 
              stroke="#e2e8f0" strokeWidth="1" 
            />
            <line 
              x1="0" y1={i * 40} x2="800" y2={i * 40} 
              stroke="#e2e8f0" strokeWidth="1" 
            />
          </React.Fragment>
        ))}

        {/* Venue Markers */}
        {venues.map((venue, index) => (
          <g 
            key={venue.id}
            transform={`translate(${100 + (index * 50) % 700}, ${150 + (index * 70) % 400})`}
            className="cursor-pointer"
            onClick={() => {
              setSelectedVenue(venue);
              onVenueSelect(venue);
            }}
          >
            <circle r="8" fill="#3b82f6" className="animate-pulse" />
            <circle r="16" fill="#3b82f6" fillOpacity="0.2" />
          </g>
        ))}

        {/* Current Location */}
        <g transform="translate(400, 300)">
          <circle r="8" fill="#10b981" />
          <circle r="16" fill="#10b981" fillOpacity="0.2" />
        </g>
      </svg>

      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 space-y-2">
        <Button variant="secondary" size="icon" className="h-8 w-8">
          <MapPin className="h-4 w-4" />
        </Button>
      </div>

      {/* Selected Venue Preview */}
      {selectedVenue && (
        <Card className="absolute bottom-4 left-4 w-80">
          <CardContent className="p-4">
            <VenuePreview venue={selectedVenue} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

/**
 * VenueCard Component:
 * - Displays a summary card for a venue.
 * - Clicking the card navigates to the venue's detail page.
 */
const VenueCard = ({ venue }) => (
  <Card 
    className="cursor-pointer hover:bg-accent/50 transition-colors"
    onClick={() => window.location.href = `/venues/${venue.id}`}
  >
    <CardContent className="p-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h3 className="font-semibold">{venue.name}</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{venue.distance ? `${venue.distance} away` : venue.address}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{venue.category}</Badge>
            {venue.current_vibe && (
              <Badge variant="outline" className="capitalize">
                {venue.current_vibe}
              </Badge>
            )}
            {venue.is_trending && (
              <Badge variant="default" className="bg-orange-500">
                Trending
              </Badge>
            )}
          </div>
        </div>
        <div className="text-right space-y-2">
          <div className="flex items-center justify-end">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="font-medium">{venue.rating?.toFixed(1) || 'New'}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Activity className="h-4 w-4 mr-1" />
            <span>{venue.check_ins_count || 0} here</span>
          </div>
          {venue.opening_hours && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>{venue.opening_hours}</span>
            </div>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

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
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Venues</SheetTitle>
          <SheetDescription>
            Adjust filters to find the perfect spot
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Sort By</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Vibe</label>
            <Select value={vibeFilter} onValueChange={setVibeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select vibe" />
              </SelectTrigger>
              <SelectContent>
                {vibeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button 
              variant="outline" 
              onClick={() => {
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
    </Sheet>
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
        const response = await fetch('/api/venues/');
        if (!response.ok) throw new Error('Failed to fetch venues');
        const data = await response.json();
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
      <div className="flex h-screen items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Conditional rendering based on error state
  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Main return statement for rendering the VenueListScreen component
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <Card className="rounded-none border-b">
        <CardHeader className="py-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Find Venues</CardTitle>
              {/* Tabs to switch between list and map views */}
              <Tabs value={viewMode} onValueChange={setViewMode}>
                <TabsList className="grid w-24 grid-cols-2">
                  <TabsTrigger value="list">
                    <List className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="map">
                    <Map className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search venues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              {/* FilterSheet component for filtering options */}
              <FilterSheet
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                sortBy={sortBy}
                setSortBy={setSortBy}
                vibeFilter={vibeFilter}
                setVibeFilter={setVibeFilter}
              />
            </div>

            {/* Active Filters Display */}
            {(selectedCategory !== 'all' || vibeFilter !== 'all') && (
              <div className="flex flex-wrap gap-2">
                {selectedCategory !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {selectedCategory}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => setSelectedCategory('all')}
                    >
                      ×
                    </Button>
                  </Badge>
                )}
                {vibeFilter !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {vibeFilter}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => setVibeFilter('all')}
                    >
                      ×
                    </Button>
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Conditional rendering for list or map view */}
      {viewMode === 'list' ? (
        <ScrollArea className="flex-1">
          <div className="container max-w-2xl mx-auto p-4">
            {filteredVenues.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="space-y-2">
                  <h3 className="font-semibold">No venues found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your filters or search terms
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setVibeFilter('all');
                      setSortBy('popular');
                    }}
                  >
                    Reset All Filters
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredVenues.map(venue => (
                  <VenueCard key={venue.id} venue={venue} />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      ) : (
        <MapView 
          venues={filteredVenues} 
          // Transition to VenueDetailScreen when a venue is selected on the map
          onVenueSelect={(venue) => window.location.href = `/venues/${venue.id}`}
        />
      )}
    </div>
  );
};

export default VenueListScreen;