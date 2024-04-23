import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Button } from 'react-native';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase'; // Ensure this includes the auth module for current user

const OrdersScreen = () => {
    const [orders, setOrders] = useState([]);
    const [displayedOrders, setDisplayedOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const currentUser = auth.currentUser; // Assumes you have authentication setup

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // First, get all ProductService entries for the logged-in user
                const productServiceRef = collection(db, 'ProductService');
                const prodQuery = query(productServiceRef, where("userId", "==", currentUser.uid));
                const prodSnapshot = await getDocs(prodQuery);
                const userProductIds = prodSnapshot.docs.map(doc => doc.id);

                // Then, get all Orders that match the ProductService IDs created by the user
                const ordersRef = collection(db, 'Order');
                const orderQuery = query(ordersRef, where("ProdServID", "in", userProductIds));
                const orderSnapshot = await getDocs(orderQuery);
                const fetchedOrders = orderSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setOrders(fetchedOrders);
                setDisplayedOrders(fetchedOrders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        if (currentUser) {
            fetchOrders();
        }
    }, [currentUser]);

    const handleSearch = () => {
        const query = searchQuery.trim().toLowerCase();
        const filtered = orders.filter(order =>
            (order.id.toLowerCase().includes(query)) ||
            (order.Status.toLowerCase().includes(query)) ||
            order.Quantity.toString().includes(searchQuery)  // Correct way to include numeric search
        );
        setDisplayedOrders(filtered);
    };

    const updateOrderStatus = async (id, newStatus) => {
        const orderRef = doc(db, "Order", id);
        try {
            await updateDoc(orderRef, {
                Status: newStatus
            });
            const updatedOrders = orders.map(order => {
                if (order.id === id) {
                    return { ...order, Status: newStatus };
                }
                return order;
            });
            setOrders(updatedOrders);
            setDisplayedOrders(updatedOrders);
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchBar}
                placeholder="Search..."
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <Button title="Search" onPress={handleSearch} color="#4CAF50" />
            <FlatList
                data={displayedOrders}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.cardDetail}>Order ID: {item.id}</Text>
                        <Text style={styles.cardDetail}>Quantity: {item.Quantity}</Text>
                        <Text style={styles.cardDetail}>Status: {item.Status}</Text>
                        <Text style={styles.cardDetail}>Total Price: ${item.TotalPrice}</Text>
                        <TouchableOpacity onPress={() => updateOrderStatus(item.id, 'Order Received')} style={styles.button}>
                            <Text>Mark as Order Received</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => updateOrderStatus(item.id, 'Payment Received')} style={styles.button}>
                            <Text>Mark as Payment Received</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => updateOrderStatus(item.id, 'Order Confirmed')} style={styles.button}>
                            <Text>Mark as Order Confirmed</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => updateOrderStatus(item.id, 'Order Shipped')} style={styles.button}>
                            <Text>Mark as Order Shipped</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => updateOrderStatus(item.id, 'Order Complete')} style={styles.button}>
                            <Text>Mark as Order Complete</Text>
                        </TouchableOpacity>
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
    button: {
        marginTop: 5,
        backgroundColor: '#E0E0E0',
        padding: 8,
        borderRadius: 5,
    },
});

export default OrdersScreen;
