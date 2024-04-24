import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Alert } from 'react-native';
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const CustomerOrdersScreen = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                Alert.alert("Error", "You must be logged in to view your orders.");
                return;
            }

            const ordersRef = collection(db, "Order");
            const q = query(ordersRef, where("CustomerID", "==", user.uid));

            try {
                const querySnapshot = await getDocs(q);
                const ordersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setOrders(ordersList);
            } catch (error) {
                console.error("Error fetching orders: ", error);
                Alert.alert("Error", "Failed to fetch orders.");
            }
        };

        fetchOrders();
    }, []);

    const handleCancelOrder = async (orderId) => {
        const orderRef = doc(db, "Order", orderId);

        try {
            await deleteDoc(orderRef);
            setOrders(orders => orders.filter(order => order.id !== orderId));
            Alert.alert("Success", "Order has been canceled successfully.");
        } catch (error) {
            console.error("Error canceling order: ", error);
            Alert.alert("Error", "Failed to cancel order.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Orders</Text>
            <FlatList
                data={orders}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.orderItem}>
                        <Text style={styles.orderText}>Order ID: {item.id}</Text>
                        <Text style={styles.orderText}>Product Name: {item.ProductName}</Text>
                        <Text style={styles.orderText}>Quantity: {item.Quantity}</Text>
                        <Text style={styles.orderText}>Status: {item.Status}</Text>
                        {item.Status === "Order Confirmed" || item.Status === "Order Received" ? (
                            <Button
                                title="Cancel Order"
                                onPress={() => handleCancelOrder(item.id)}
                                color="#FF6347"
                            />
                        ) : null}
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#DFF2E3', // Light green background color matching other screens
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 10,
        color: '#4C6854', // Dark green color for text
    },
    orderItem: {
        backgroundColor: '#f9f9f9', // Soft grey for the item background
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 1.41,
        elevation: 2,
    },
    orderText: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333', // Dark text color for better readability
    },
});

export default CustomerOrdersScreen;
