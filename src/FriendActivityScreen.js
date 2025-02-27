import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Text, TextInput } from 'react-native';
import { Button } from './components/ui/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, MessageCircle, Clock, MapPin } from 'lucide-react-native';
import { useTheme } from './context/ThemeContext';

const FriendActivityScreen = () => {
    const { colors, isDark } = useTheme();
    const styles = getStyles({ colors, isDark });

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const data = [
        { id: '1', user: 'Friend 1', action: 'checked in at', venue: 'Venue A', time: '2h ago' },
        { id: '2', user: 'Friend 2', action: 'is going to', venue: 'Venue B', time: '3h ago' },
        { id: '3', user: 'Friend 3', action: 'rated', venue: 'Venue C', rating: 4, time: '5h ago' },
        { id: '4', user: 'Friend 4', action: 'added a new photo at', venue: 'Venue D', time: '1d ago' },
        { id: '5', user: 'Friend 5', action: 'is now friends with', newFriend: 'Friend 6', time: '2d ago' },
    ];

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

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Friend Activity</Text>
            </View>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                refreshControl={
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

const getStyles = ({ colors, isDark }) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
    },
    activityItem: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    activityHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    user: {
        fontWeight: 'bold',
        color: colors.text,
    },
    time: {
        color: colors.textSecondary,
    },
    action: {
        color: colors.text,
    },
    venue: {
        fontWeight: 'bold',
    },
    rating: {
        color: colors.primary,
    },
    newFriend: {
        fontWeight: 'bold',
    },
});

export default FriendActivityScreen;
