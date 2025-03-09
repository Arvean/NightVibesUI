import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Text, TextInput } from 'react-native';
import { Button } from './components/ui/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, MessageCircle, Clock, MapPin } from 'lucide-react-native';
import { useTheme } from './context/ThemeContext';

// FriendActivityScreen component displays a list of friends' activities.
const FriendActivityScreen = () => {
    // Access theme context for colors and dark mode status.
    const { colors, isDark } = useTheme();
    // Generate styles based on the current theme.
    const styles = getStyles({ colors, isDark });

    // State for controlling the refresh indicator.
    const [refreshing, setRefreshing] = React.useState(false);

    // Callback function for handling the refresh action.
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        // Simulate a 2-second delay before stopping the refresh indicator.
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    // Sample data for friend activities.  Replace with data from API.
    const data = [
        { id: '1', user: 'Friend 1', action: 'checked in at', venue: 'Venue A', time: '2h ago' },
        { id: '2', user: 'Friend 2', action: 'is going to', venue: 'Venue B', time: '3h ago' },
        { id: '3', user: 'Friend 3', action: 'rated', venue: 'Venue C', rating: 4, time: '5h ago' },
        { id: '4', user: 'Friend 4', action: 'added a new photo at', venue: 'Venue D', time: '1d ago' },
        { id: '5', user: 'Friend 5', action: 'is now friends with', newFriend: 'Friend 6', time: '2d ago' },
    ];

    // Function to render each activity item in the list.
    const renderItem = ({ item }) => (
        <View style={styles.activityItem}>
            <View style={styles.activityHeader}>
                <Text style={styles.user}>{item.user}</Text>
                <Text style={styles.time}>{item.time}</Text>
            </View>
            <Text style={styles.action}>
                {item.action} {item.venue && <Text style={styles.venue}>{item.venue}</Text>}
                {item.rating && <Text style={styles.rating}> {item.rating}/5</Text>}
                {item.newFriend && <Text style={styles.newFriend}> {item.newFriend}</Text>}
            </Text>
        </View>
    );

    // Render the FriendActivityScreen UI.
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Friend Activity</Text>
            </View>
            {/* FlatList to display the friend activity data. */}
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                refreshControl={
                    // Add a RefreshControl for pull-to-refresh functionality.
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                    />
                }
            />
        </SafeAreaView>
    );
};

// StyleSheet for the FriendActivityScreen component.
const getStyles = ({ colors, isDark }) => StyleSheet.create({
    // Main container style.
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    // Header style.
    header: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        alignItems: 'center',
    },
    // Style for the title.
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
    },
    // Style for each activity item.
    activityItem: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    // Style for the activity header (user and time).
    activityHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    // Style for the user's name.
    user: {
        fontWeight: 'bold',
        color: colors.text,
    },
    // Style for the time.
    time: {
        color: colors.textSecondary,
    },
    // Style for the action text.
    action: {
        color: colors.text,
    },
    // Style for the venue name.
    venue: {
        fontWeight: 'bold',
    },
    // Style for the rating.
    rating: {
        color: colors.primary,
    },
    // Style for a new friend's name.
    newFriend: {
        fontWeight: 'bold',
    },
});

// Export the FriendActivityScreen component.
export default FriendActivityScreen;
