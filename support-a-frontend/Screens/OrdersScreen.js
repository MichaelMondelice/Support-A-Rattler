import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, getDocs, doc, updateDoc, query, where, deleteDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const OrdersScreen = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Current Orders" component={CurrentOrders} />
            <Tab.Screen name="Past Orders" component={PastOrders} />
        </Tab.Navigator>
    );
};

const CurrentOrders = () => {
    const [orders, setOrders] = useState([]);
    const [displayedOrders, setDisplayedOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const currentUser = auth.currentUser;

    useEffect(() => {
        const fetchOrders = async () => {
            if (!currentUser) return;

            const productServiceRef = collection(db, 'ProductService');
            const prodQuery = query(productServiceRef, where("userId", "==", currentUser.uid));
            const prodSnapshot = await getDocs(prodQuery);
            const userProductIds = prodSnapshot.docs.map(doc => ({ id: doc.id, productName: doc.data().productName }));

            const ordersRef = collection(db, 'Order');
            const orderQuery = query(ordersRef, where("ProdServID", "in", userProductIds.map(p => p.id)));
            const orderSnapshot = await getDocs(orderQuery);
            const fetchedOrders = await Promise.all(orderSnapshot.docs.map(async orderDoc => {
                const orderData = orderDoc.data();
                const customerRef = doc(db, 'User', orderData.CustomerID);
                const customerDoc = await getDoc(customerRef);
                const customerData = customerDoc.exists() ? customerDoc.data() : { firstName: 'Unknown', lastName: 'Unknown' };

                return {
                    id: orderDoc.id,
                    ...orderData,
                    customerName: `${customerData.firstName} ${customerData.lastName}`,
                    productName: userProductIds.find(p => p.id === orderData.ProdServID)?.productName || 'Unknown',
                    statusSelection: orderData.Status || "Order Confirmed"
                };
            }));

            setOrders(fetchedOrders.filter(order => order.Status !== "Order Complete"));
            setDisplayedOrders(fetchedOrders.filter(order => order.Status !== "Order Complete"));
        };

        fetchOrders();
    }, [currentUser]);

    const handleSearch = () => {
        const query = searchQuery.trim().toLowerCase();
        const filtered = displayedOrders.filter(order =>
            order.id.toLowerCase().includes(query) ||
            order.Status.toLowerCase().includes(query) ||
            order.productName.toLowerCase().includes(query) ||
            order.Quantity.toString().includes(query) ||
            order.customerName.toLowerCase().includes(query)
        );
        setDisplayedOrders(filtered);
    };

    const updateOrderStatus = async (id, newStatus) => {
        const orderRef = doc(db, "Order", id);
        try {
            await updateDoc(orderRef, { Status: newStatus });
            const updatedOrders = orders.map(order => order.id === id ? { ...order, Status: newStatus, statusSelection: newStatus } : order);
            setOrders(updatedOrders.filter(order => order.Status !== "Order Complete"));
            setDisplayedOrders(updatedOrders.filter(order => order.Status !== "Order Complete"));
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    const handleCancelOrder = async (id) => {
        const orderRef = doc(db, "Order", id);
        try {
            await deleteDoc(orderRef);
            const updatedOrders = orders.filter(order => order.id !== id);
            setOrders(updatedOrders);
            setDisplayedOrders(updatedOrders);
            Alert.alert("Success", "Order has been canceled successfully.");
        } catch (error) {
            console.error("Error canceling order:", error);
            Alert.alert("Error", "Failed to cancel order.");
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
                        <Text style={styles.cardDetail}>Customer: {item.customerName}</Text>
                        <Text style={styles.cardDetail}>Order ID: {item.id}</Text>
                        <Text style={styles.cardDetail}>Product Name: {item.productName}</Text>
                        <Text style={styles.cardDetail}>Quantity: {item.Quantity}</Text>
                        <Text style={styles.cardDetail}>Status: {item.Status}</Text>
                        <Text style={styles.cardDetail}>Total Price: ${item.TotalPrice}</Text>
                        <Picker
                            selectedValue={item.statusSelection}
                            style={styles.picker}
                            onValueChange={(itemValue, itemIndex) => updateOrderStatus(item.id, itemValue)}
                        >
                            <Picker.Item label="Order Received" value="Order Received" />
                            <Picker.Item label="Payment Received" value="Payment Received" />
                            <Picker.Item label="Order Confirmed" value="Order Confirmed" />
                            <Picker.Item label="Order Shipped" value="Order Shipped" />
                            <Picker.Item label="Order Complete" value="Order Complete" />
                        </Picker>
                        {(item.Status === "Order Received" || item.Status === "Order Confirmed") && (
                            <Button
                                title="Cancel Order"
                                onPress={() => handleCancelOrder(item.id)}
                                color="#FF6347"
                            />
                        )}
                    </View>
                )}
            />
        </View>
    );
};

const PastOrders = () => {
    const [pastOrders, setPastOrders] = useState([]);
    const [displayedPastOrders, setDisplayedPastOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const currentUser = auth.currentUser;

    useEffect(() => {
        const fetchPastOrders = async () => {
            if (!currentUser) return;

            const ordersRef = collection(db, 'Order');
            const orderQuery = query(ordersRef, where("Status", "==", "Order Complete"));
            const orderSnapshot = await getDocs(orderQuery);
            const fetchedPastOrders = await Promise.all(orderSnapshot.docs.map(async orderDoc => {
                const orderData = orderDoc.data();
                const customerRef = doc(db, 'User', orderData.CustomerID);
                const customerDoc = await getDoc(customerRef);
                const customerData = customerDoc.exists() ? customerDoc.data() : { firstName: 'Unknown', lastName: 'Unknown' };

                // Fetch product name for past orders
                const productServiceRef = doc(db, 'ProductService', orderData.ProdServID);
                const productServiceDoc = await getDoc(productServiceRef);
                const productName = productServiceDoc.exists() ? productServiceDoc.data().productName : 'Unknown';

                return {
                    id: orderDoc.id,
                    ...orderData,
                    customerName: `${customerData.firstName} ${customerData.lastName}`,
                    productName: productName,
                    statusSelection: orderData.Status
                };
            }));
            setPastOrders(fetchedPastOrders);
            setDisplayedPastOrders(fetchedPastOrders); // Set displayed orders initially to all past orders
        };

        fetchPastOrders();
    }, [currentUser]);

    const handleSearch = () => {
        const query = searchQuery.trim().toLowerCase();
        const filtered = pastOrders.filter(order =>
            order.id.toLowerCase().includes(query) ||
            order.Status.toLowerCase().includes(query) ||
            order.productName.toLowerCase().includes(query) ||
            order.Quantity.toString().includes(query) ||
            order.customerName.toLowerCase().includes(query)
        );
        setDisplayedPastOrders(filtered);
    };

    const updateOrderStatus = async (id, newStatus) => {
        const orderRef = doc(db, "Order", id);
        try {
            await updateDoc(orderRef, { Status: newStatus });

            if (newStatus === "Order Complete") {
                // If the status is changed to "Order Complete", move the order to the Current Orders tab
                const movedOrder = displayedPastOrders.find(order => order.id === id);
                if (movedOrder) {
                    setDisplayedPastOrders(prevOrders => prevOrders.filter(order => order.id !== id));
                    setDisplayedPastOrders(prevOrders => [...prevOrders, movedOrder]);
                }
            } else {
                const updatedPastOrders = pastOrders.map(order => order.id === id ? { ...order, Status: newStatus, statusSelection: newStatus } : order);
                setPastOrders(updatedPastOrders);
                setDisplayedPastOrders(updatedPastOrders);
            }
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
                data={displayedPastOrders}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.cardDetail}>Customer: {item.customerName}</Text>
                        <Text style={styles.cardDetail}>Order ID: {item.id}</Text>
                        <Text style={styles.cardDetail}>Product Name: {item.productName}</Text>
                        <Text style={styles.cardDetail}>Quantity: {item.Quantity}</Text>
                        <Text style={styles.cardDetail}>Status: {item.Status}</Text>
                        <Text style={styles.cardDetail}>Total Price: ${item.TotalPrice}</Text>
                        <Picker
                            selectedValue={item.statusSelection}
                            style={styles.picker}
                            onValueChange={(itemValue, itemIndex) => updateOrderStatus(item.id, itemValue)}
                        >
                            <Picker.Item label="Order Received" value="Order Received" />
                            <Picker.Item label="Payment Received" value="Payment Received" />
                            <Picker.Item label="Order Confirmed" value="Order Confirmed" />
                            <Picker.Item label="Order Shipped" value="Order Shipped" />
                            <Picker.Item label="Order Complete" value="Order Complete" />
                        </Picker>
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
    picker: {
        width: '100%', // Adjust width as necessary
        backgroundColor: '#E0E0E0', // Light grey background for the dropdown
        color: '#4C6854', // Text color to match other input fields
    }
});

export default OrdersScreen;