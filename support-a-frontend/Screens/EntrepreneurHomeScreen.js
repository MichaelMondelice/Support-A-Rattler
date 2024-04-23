import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";

const screenWidth = Dimensions.get('window').width;

const EntrepreneurHomeScreen = ({ navigation }) => {
    const [recentOrders, setRecentOrders] = useState([]);
    const [progressChartData, setProgressChartData] = useState({
        labels: ["Order Received", "Payment Received", "Order Confirmed", "Order Shipped", "Order Complete"],
        data: [0, 0, 0, 0, 0] // Initialize quantities to 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch recent orders
                const ordersRef = collection(db, 'Order');
                const q = query(ordersRef, orderBy("OrderDate", "desc"), limit(3));
                const querySnapshot = await getDocs(q);
                const ordersList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setRecentOrders(ordersList);

                // Fetch orders status and update progress chart data
                const allOrdersSnapshot = await getDocs(ordersRef);
                const allOrdersList = allOrdersSnapshot.docs.map(doc => doc.data());
                const statusCounts = {
                    "Order Received": 0,
                    "Payment Received": 0,
                    "Order Confirmed": 0,
                    "Order Shipped": 0,
                    "Order Complete": 0
                };
                allOrdersList.forEach(order => {
                    statusCounts[order.Status]++;
                });
                const updatedChartData = {
                    ...progressChartData,
                    data: Object.values(statusCounts)
                };
                setProgressChartData(updatedChartData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
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
                <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('EntrepreneurAnalytics')}>
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
                <Text style={styles.header}>Welcome, Entrepreneur</Text>
                <View style={styles.progressTableContainer}>
                    <Image source={require('../images/logo.png')} style={styles.logoBackground} />
                    <View style={styles.progressTable}>
                        <View style={styles.tableHeaderRow}>
                            <Text style={[styles.tableHeader, styles.headerText]}>Status</Text>
                            <Text style={[styles.tableHeader, styles.headerText]}>Quantity</Text>
                        </View>
                        {progressChartData.labels.map((label, index) => (
                            <View key={index} style={styles.tableRow}>
                                <Text style={styles.statusText}>{label}</Text>
                                <Text style={styles.quantityText}>{progressChartData.data[index]}</Text>
                            </View>
                        ))}
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Orders</Text>
                    {recentOrders.map(order => (
                        <View key={order.id} style={styles.orderItem}>
                            <Text>Product: {order.id}</Text>
                            <Text>Quantity: {order.Quantity}</Text>
                            <Text>Total: ${order.TotalPrice}</Text>
                            <Text>Status: {order.Status}</Text>
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
    progressTableContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        opacity: 0.2, // Adjust opacity as needed
    },
    progressTable: {
        backgroundColor: '#C8E6C9',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
        width: '80%', // Set width to 80% of parent container
    },
    tableHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    tableHeader: {
        fontWeight: 'bold',
    },
    headerText: {
        flex: 1,
        textAlign: 'left',
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#fff', // Adjusted to match the background color
        paddingVertical: 8,
    },
    statusText: {
        flex: 1,
        textAlign: 'left',
        color: '#333', // Adjusted to match the page style
    },
    quantityText: {
        flex: 1,
        textAlign: 'right',
        color: '#333', // Adjusted to match the page style
    },
});

export default EntrepreneurHomeScreen;
