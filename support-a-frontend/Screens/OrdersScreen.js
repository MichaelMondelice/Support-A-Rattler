import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Button } from 'react-native';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure this is the correct path to your Firebase configuration

const OrdersScreen = () => {
    const [orders, setOrders] = useState([]);
    const [displayedOrders, setDisplayedOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const currentUserID = 'dN55dlhpGTdFE6e3vfBRDA0Np4k2'; // Example userID

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Fetch the entrepreneur's product IDs
                const productServiceQuery = query(collection(db, 'ProductService'), where('userId', '==', currentUserID));
                const productServiceSnapshot = await getDocs(productServiceQuery);
                const productServiceIds = productServiceSnapshot.docs.map(doc => doc.id);

                // Fetch orders that are related to the entrepreneur's products
                const orderQuery = query(collection(db, 'Order'), where('ProdServID', 'in', productServiceIds));
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

        fetchOrders();
    }, []);

    const handleSearch = () => {
        const query = searchQuery.trim().toLowerCase();
        const filtered = orders.filter(order =>
            (order.id.toLowerCase().includes(query)) ||
            (order.Status.toLowerCase().includes(query)) ||
            order.Quantity.toString().includes(searchQuery)
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
    cardDetail: {
        fontSize: 14,
        marginBottom: 5,
    },
    button: {
        marginTop: 5,
        backgroundColor: '#E0E0E0',
        padding: 8,
        borderRadius: 5,
    },
});

export default OrdersScreen;
