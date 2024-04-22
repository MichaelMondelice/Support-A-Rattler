import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ProgressChart } from 'react-native-chart-kit';
import { getAuth } from "firebase/auth";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const screenWidth = Dimensions.get('window').width;

const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [{
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2
    }]
};

const chartConfig = {
    backgroundGradientFrom: '#DFF2E3',
    backgroundGradientTo: '#DFF2E3',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
};

const progressChartData = {
    labels: ["Sales", "Expenses", "Profit"],
    data: [0.6, 0.3, 0.8]
};

const EntrepreneurHomeScreen = ({ navigation }) => {
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        const fetchRecentOrders = async () => {
            try {
                const ordersRef = collection(db, 'Order');
                const q = query(ordersRef, orderBy("OrderDate", "desc"), limit(3));
                const querySnapshot = await getDocs(q);
                const ordersList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setRecentOrders(ordersList);
            } catch (error) {
                console.error('Error fetching recent orders:', error);
            }
        };

        fetchRecentOrders();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.sidebar}>
                <Image source={require('../images/logo.png')} style={styles.logo} />
                <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.sidebarText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('OrdersScreen')}>
                    <Text style={styles.sidebarText}>Orders</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('ServicesProducts')}>
                    <Text style={styles.sidebarText}>Services/Products</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('Analytics')}>
                    <Text style={styles.sidebarText}>Analytics</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('Messages')}>
                    <Text style={styles.sidebarText}>Messages</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('SettingsScreen')}>
                    <Text style={styles.sidebarText}>Account</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.mainContent}>
                <TextInput style={styles.searchBar} placeholder="Search...." placeholderTextColor="#666" />
                <Text style={styles.header}>Welcome, Entrepreneur</Text>
                <ProgressChart
                    data={progressChartData}
                    width={screenWidth * 0.9}
                    height={220}
                    strokeWidth={16}
                    radius={32}
                    chartConfig={chartConfig}
                    hideLegend={false}
                />
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Orders</Text>
                    {recentOrders.map(order => (
                        <View key={order.id} style={styles.orderItem}>
                            <Text>Product: {order.id}</Text>
                            <Text>Quantity: {order.Quantity}</Text>
                            <Text>Total: ${order.TotalPrice}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    sidebar: {
        width: '25%',
        backgroundColor: '#DFF2E3',
    },
    logo: {
        width: 100,
        height: 100,
        margin: 20,
        borderRadius: 50,
        borderColor: '#4C6854',
    },
    sidebarItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingLeft: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#A5D6A7',
    },
    sidebarText: {
        fontSize: 18,
        color: '#4C6854',
        marginLeft: 10,
    },
    mainContent: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    searchBar: {
        height: 40,
        backgroundColor: '#C8E6C9',
        borderRadius: 20,
        paddingHorizontal: 10,
        marginBottom: 20,
        color: '#4C6854',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4C6854',
        marginBottom: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    orderItem: {
        backgroundColor: '#C8E6C9',
        borderRadius: 6,
        padding: 10,
        marginTop: 10,
    },
});

export default EntrepreneurHomeScreen;
