import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure this is the correct path to your Firebase configuration

const OrdersScreen = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'Order')); // Check collection name
                const fetchedOrders = [];
                querySnapshot.forEach((doc) => {
                    console.log(doc.data()); // Debugging
                    fetchedOrders.push({ id: doc.id, ...doc.data() });
                });
                setOrders(fetchedOrders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <View style={styles.container}>
            <TextInput style={styles.searchBar} placeholder="Search...." placeholderTextColor="#666" />
            <Text style={styles.header}>Orders</Text>
            <FlatList
                data={orders}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        {/*<Text style={styles.cardDetail}>Customer ID: {item.customerID}</Text>
                        <Text style={styles.cardDetail}>Order Date: {item.orderDate}</Text>
                        <Text style={styles.cardDetail}>Product/Service ID: {item.productServiceID}</Text>*/}
                        <Text style={styles.cardDetail}>Quantity: {item.quantity}</Text>
                        <Text style={styles.cardDetail}>Status: {item.status}</Text>
                        <Text style={styles.cardDetail}>Total Price: ${item.totalPrice}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    searchBar: {
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    cardDetail: {
        fontSize: 14,
        marginBottom: 5,
    },
});

export default OrdersScreen;
