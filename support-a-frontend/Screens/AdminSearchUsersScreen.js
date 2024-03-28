import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

const AdminSearchUsersScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    // Function to handle search action
    const handleSearch = () => {
        // Here you would implement the logic to search users based on the searchQuery
        // For demonstration, let's assume searchResults is fetched from Firebase
        const fetchedResults = []; // Fetch results from Firebase or any other source
        setSearchResults(fetchedResults);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search Users"
                placeholderTextColor="#000000"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <Button title="Search" onPress={handleSearch} color="#4CAF50" />

            <FlatList
                data={searchResults}
                renderItem={({ item }) => (
                    <View style={styles.userItem}>
                        <Text style={styles.userName}>{item.name}</Text>
                        <Text style={styles.userEmail}>{item.email}</Text>
                        {/* Additional user details */}
                    </View>
                )}
                keyExtractor={(item) => item.id.toString()} // Assuming each user has an ID
                style={styles.userList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#E8F5E9',
    },
    searchInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        color: '#000000',
    },
    userItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    userEmail: {
        fontSize: 16,
        color: '#4CAF50',
    },
    userList: {
        marginTop: 20,
    },
});

export default AdminSearchUsersScreen;
