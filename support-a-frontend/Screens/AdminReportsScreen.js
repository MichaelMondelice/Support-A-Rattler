import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';

// Dummy data for users
const users = [
    { id: '1', name: 'John Doe', orders: 10, deliveries: 5, type: 'product' },
    { id: '2', name: 'Jane Smith', orders: 15, deliveries: 8, type: 'service' },
    { id: '3', name: 'Michael Johnson', orders: 20, deliveries: 12, type: 'product' },
    { id: '4', name: 'Emily Davis', orders: 8, deliveries: 3, type: 'service' },
    { id: '5', name: 'David Wilson', orders: 12, deliveries: 7, type: 'product' },
];

const AdminReportsScreen = () => {
    const [userList, setUserList] = useState(users);
    const [filter, setFilter] = useState('all'); // Default filter option

    // Function to handle applying filter
    const applyFilter = (type) => {
        setFilter(type);
        if (type === 'all') {
            setUserList(users); // Reset to all users
        } else {
            const filteredUsers = users.filter(user => user.type === type);
            setUserList(filteredUsers);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Image source={require('../images/logo.png')} style={styles.logo} />
                <Text style={styles.title}>Admin Reports</Text>
            </View>
            <View style={styles.filterContainer}>
                <TouchableOpacity onPress={() => applyFilter('product')} style={styles.filterButton}>
                    <Text style={styles.filterButtonText}>Product</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => applyFilter('service')} style={styles.filterButton}>
                    <Text style={styles.filterButtonText}>Service</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => applyFilter('all')} style={styles.filterButton}>
                    <Text style={styles.filterButtonText}>All</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.userList}>
                {userList.map((user) => (
                    <View key={user.id} style={styles.userItem}>
                        <Text style={styles.userName}>{user.name}</Text>
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>{user.orders} Orders</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>{user.deliveries} Deliveries</Text>
                            </TouchableOpacity>
                        </View>
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
        width: 150,
        height: 200,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginLeft: 10,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    filterButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        backgroundColor: '#4CAF50',
    },
    filterButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
    },
    userList: {
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
    buttonsContainer: {
        flexDirection: 'row',
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        backgroundColor: '#4CAF50',
        marginLeft: 10,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFF',
    },
});

export default AdminReportsScreen;
