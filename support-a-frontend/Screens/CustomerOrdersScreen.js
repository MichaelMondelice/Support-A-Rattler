import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
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
                        <Text style={styles.orderText}>Status: {item.Status}</Text>  {/* Displaying the current status of the order */}
                        {/* Add more details as needed */}
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
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    orderItem: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
    },
    orderText: {
        fontSize: 16,
        marginBottom: 5,
    },
});

export default CustomerOrdersScreen;
