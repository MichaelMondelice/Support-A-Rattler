import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';

const OrdersScreen = () => {
    const [orders, setOrders] = useState([
        // Example orders
        { id: '1', name: 'Order 1', status: 'Received order' },
        { id: '2', name: 'Order 2', status: 'Received payment' },
    ]);

    const updateOrderStatus = (id, newStatus) => {
        const updatedOrders = orders.map(order => {
            if (order.id === id) {
                return { ...order, status: newStatus };
            }
            return order;
        });
        setOrders(updatedOrders);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={orders}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.orderItem}>
                        <Text>{item.name}</Text>
                        <Text>Status: {item.status}</Text>
                        <TouchableOpacity onPress={() => updateOrderStatus(item.id, 'Shipped order')}>
                            <Text>Mark as Shipped</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => updateOrderStatus(item.id, 'Picked up')}>
                            <Text>Mark as Picked Up</Text>
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
    },
    orderItem: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
    },
});

export default OrdersScreen;
