import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Import your Firestore instance

const AdminSearchUsersScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        // Function to fetch users from Firebase Cloud Firestore
        const fetchUser = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'User'));
                const fetchedUser = [];
                querySnapshot.forEach((doc) => {
                    fetchedUser.push({ id: doc.id, ...doc.data() });
                });
                setSearchResults(fetchedUser);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        // Call fetchUsers when the component mounts
        fetchUser();
    }, []); // Empty dependency array to ensure this effect runs only once

    // Function to handle search action
    const handleSearch = () => {
        // Filter search results based on the searchQuery
        const filteredResults = searchResults.filter(user =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filteredResults);
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
                keyExtractor={(item) => item.id}
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
