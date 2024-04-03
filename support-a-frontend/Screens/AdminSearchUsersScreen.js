import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Import your Firestore instance

const AdminSearchUsersScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        // Function to fetch users from Firebase Cloud Firestore
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'User'));
                const fetchedUsers = [];
                querySnapshot.forEach((doc) => {
                    fetchedUsers.push({ id: doc.id, ...doc.data() });
                });
                setSearchResults(fetchedUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        // Call fetchUsers when the component mounts
        fetchUsers();
    }, []); // Empty dependency array to ensure this effect runs only once

    // Function to handle search action
    const handleSearch = () => {
        // Filter search results based on the searchQuery
        const filteredResults = searchResults.filter(user =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filteredResults);
    };

    // Function to handle user selection
    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setModalVisible(true);
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
                    <TouchableOpacity onPress={() => handleUserSelect(item)}>
                        <View style={styles.card}>
                            <Image source={item.image} style={styles.cardImage} />
                            <View style={styles.cardContent}>
                                <Text style={styles.cardTitle}>{item.name}</Text>
                                <Text style={styles.cardSubTitle}>{item.email}</Text>
                                {/* Additional user details */}
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                style={styles.userList}
            />

            {/* User Details Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modal}>
                    <Text>User Details</Text>
                    {selectedUser && Object.entries(selectedUser).map(([key, value]) => (
                        <Text key={key}>{key}: {value}</Text>
                    ))}
                    <Button title="Close" onPress={() => setModalVisible(false)} />
                </View>
            </Modal>
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
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    cardImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginLeft: 12,
    },
    cardTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
    },
    cardSubTitle: {
        fontSize: 14,
        color: 'grey',
    },
    userList: {
        marginTop: 20,
    },
    modal: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
        zIndex: 999,
    },
});

export default AdminSearchUsersScreen;
