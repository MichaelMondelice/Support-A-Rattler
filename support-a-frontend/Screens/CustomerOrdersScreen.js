import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Alert, ScrollView } from 'react-native';
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

const CustomerOrdersScreen = ({ navigation }) => {
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
            <ScrollView style={styles.scrollView}>
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
            </ScrollView>
            <View style={styles.tabBarContainer}>
                <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('CustomerHome')}>
                    <MaterialCommunityIcons name="home" size={24} color="#4CAF50" />
                    <Text style={styles.tabTitle}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('CustomerMessages')}>
                    <MaterialCommunityIcons name="message" size={24} color="#4CAF50" />
                    <Text style={styles.tabTitle}>Messages</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('CustomerSearchScreen')}>
                    <MaterialCommunityIcons name="magnify" size={24} color="#4CAF50" />
                    <Text style={styles.tabTitle}>Search</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('CustomerOrdersScreen')}>
                    <MaterialCommunityIcons name="format-list-bulleted" size={24} color="#4CAF50" />
                    <Text style={styles.tabTitle}>Orders</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('CustomerAppointmentScreen')}>
                    <MaterialCommunityIcons name="calendar" size={24} color="#4CAF50" />
                    <Text style={styles.tabTitle}>Appointments</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('CustomerAccountScreen')}>
                    <MaterialCommunityIcons name="account" size={24} color="#4CAF50" />
                    <Text style={styles.tabTitle}>Account</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DFF2E3',
    },
    scrollView: {
        flex: 1,
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
    },
    orderText: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333', // Dark text color for better readability
    },
    tabBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        paddingBottom: 10,
        paddingTop: 5,
    },
    tabItem: {
        alignItems: 'center',
    },
    tabTitle: {
        fontSize: 12,
        color: '#757575',
        paddingTop: 4,
    }
});

export default CustomerOrdersScreen;
