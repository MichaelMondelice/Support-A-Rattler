import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Dummy data for users
const users = [
    { id: '1', name: 'John Doe', status: 'Active' },
    { id: '2', name: 'Jane Smith', status: 'Inactive' },
    { id: '3', name: 'Michael Johnson', status: 'Active' },
    { id: '4', name: 'Emily Davis', status: 'Inactive' },
    { id: '5', name: 'David Wilson', status: 'Active' },
];

const AdminHomeScreen = () => {
    const [userList, setUserList] = useState(users);

    // Function to toggle user status (activate/deactivate)
    const toggleUserStatus = (id) => {
        setUserList(userList.map(user => {
            if (user.id === id) {
                // Toggle status and update button text
                const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
                return { ...user, status: newStatus };
            }
            return user;
        }));
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Image source={require('../images/logo.png')} style={styles.logo} />
                <Text style={styles.title}>Admin User Activation Page</Text>
            </View>
            <View style={styles.userList}>
                {userList.map((user) => (
                    <View key={user.id} style={styles.userItem}>
                        <Text style={styles.userName}>{user.name}</Text>
                        <Text style={styles.userStatus}>{user.status}</Text>
                        <TouchableOpacity
                            onPress={() => toggleUserStatus(user.id)}
                            style={[
                                styles.toggleButton,
                                { backgroundColor: user.status === 'Active' ? '#4CAF50' : '#F44336' }
                            ]}
                        >
                            <Text style={styles.buttonText}>{user.status === 'Active' ? 'Deactivate' : 'Activate'}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#DFF2E3',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4CAF50',
        paddingVertical: 20,
    },
    logo: {
        width: 150, // Adjusted width to be slightly bigger
        height: 200, // Adjusted height to be slightly bigger
        resizeMode: 'contain',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginLeft: 10,
    },
    userList: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        elevation: 2,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    userStatus: {
        fontSize: 14,
        color: '#666',
    },
    toggleButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFF',
    },
});

export default AdminHomeScreen;
