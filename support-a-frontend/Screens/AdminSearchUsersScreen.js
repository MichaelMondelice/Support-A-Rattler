// AdminSearchUsersScreen.js
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
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <Button title="Search" onPress={handleSearch} />

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
    },
    searchInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    userItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    userEmail: {
        fontSize: 16,
        color: 'gray',
    },
    userList: {
        marginTop: 20,
    },
});

export default AdminSearchUsersScreen;
