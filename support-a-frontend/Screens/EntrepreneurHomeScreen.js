import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Make sure you have this package installed
import { BarChart, LineChart, ProgressChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [{
        data: [ 20, 45, 28, 80, 99, 43 ],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2
    }]
};

const chartConfig = {
    backgroundGradientFrom: '#DFF2E3',
    backgroundGradientTo: '#DFF2E3',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    // ...other chart configuration options
};

const progressChartData = {
    labels: ["Sales", "Expenses", "Profit"], // optional
    data: [0.6, 0.3, 0.8] // Example data, you should replace this with actual entrepreneur data
};

const EntrepreneurHomeScreen = () => {
    // Placeholder recent orders
    const [recentOrders, setRecentOrders] = useState([
        { id: '1', product: 'Product A', amount: 3, total: 150 },
        { id: '2', product: 'Product B', amount: 1, total: 50 },
        { id: '3', product: 'Product C', amount: 2, total: 100 },
    ]);

    // Placeholder for Firebase data fetching
    useEffect(() => {
        // Fetch data from Firebase and update state
        // Example:
        // const fetchData = async () => {
        //     const orders = await fetchOrdersFromFirebase();
        //     setRecentOrders(orders);
        // };
        // fetchData();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.sidebar}>
                <Image source={require('../images/logo.png')} style={styles.logo} />
                <TouchableOpacity style={styles.sidebarItem}>
                    <Text style={styles.sidebarText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sidebarItem}>
                    <Text style={styles.sidebarText}>Orders</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sidebarItem}>
                    <Text style={styles.sidebarText}>Analytics</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sidebarItem}>
                    <Text style={styles.sidebarText}>Messages</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.mainContent}>
                <TextInput style={styles.searchBar} placeholder="Search...." placeholderTextColor="#666" />
                <Text style={styles.header}>Entrepreneur Dashboard</Text>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>SALES</Text>
                    <Text style={styles.cardValue}>$50,000</Text>
                    {/* ... Other card details */}
                </View>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>EXPENSES</Text>
                    <Text style={styles.cardValue}>$20,000</Text>
                    {/* ... Other card details */}
                </View>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>PROFIT</Text>
                    <Text style={styles.cardValue}>$30,000</Text>
                    {/* ... Other card details */}
                </View>
                {/* Recent Orders Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Orders</Text>
                    {recentOrders.map(order => (
                        <View key={order.id} style={styles.orderItem}>
                            <Text>{order.product}</Text>
                            <Text>Quantity: {order.amount}</Text>
                            <Text>Total: ${order.total}</Text>
                        </View>
                    ))}
                </View>
                {/* Upcoming Events/ Tasks Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Upcoming Events / Tasks</Text>
                    {/* Add code to display upcoming events or tasks */}
                </View>
                <ProgressChart
                    data={progressChartData}
                    width={screenWidth * 0.7}
                    height={220}
                    strokeWidth={16}
                    radius={32}
                    chartConfig={chartConfig}
                    hideLegend={false}
                    style={styles.chart}
                />
                {/* Include LineChart or other charts as needed */}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    card: {
        backgroundColor: '#C8E6C9',
        borderRadius: 6,
        padding: 15,
        marginTop: 10,
        alignItems: 'center', // Center card items
        // ...other styles such as shadow
    },
    cardTitle: {
        fontSize: 18,
        color: '#333',
        // ...other styles
    },
    cardValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#4C6854',
        // ...other styles
    },
    chart: {
        marginTop: 20,
        borderRadius: 16,
    },
    sidebar: {
        width: '25%',
        backgroundColor: '#DFF2E3', // Adjust the color to match the provided image
    },
    logo: {
        width: 100,
        height: 100,
        margin: 20,
        borderRadius: 50, // Adjust to get the correct borderRadius
        borderColor: '#4C6854',
    },
    sidebarItem: {
        paddingVertical: 15,
        paddingLeft: 20,
        borderBottomWidth: 1,
        borderBottomColor: '##A5D6A7',
    },
    sidebarText: {
        fontSize: 18,
        color: '#4C6854', // Adjust the color to match the provided image
    },
    mainContent: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFFFFF', // Adjust the color to match the provided image
    },
    searchBar: {
        height: 40,
        backgroundColor: '#C8E6C9', // Light grey color, you can adjust as needed
        borderRadius: 20,
        paddingHorizontal: 10,
        marginBottom: 20,
        color: '#4C6854', // Color for the text inside the search bar
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4C6854', // Color for the dashboard header text
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
    // Add additional styles for dashboard content as needed
});

export default EntrepreneurHomeScreen;
