import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Make sure you have this package installed
import { BarChart, LineChart, ProgressChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook

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
    labels: ["Swim", "Bike", "Run"], // optional
    data: [0.4, 0.6, 0.8]
};

const AdminHomeScreen = () => {
    const navigation = useNavigation(); // Get the navigation object

    const handleUsersSearch = async () => {
        try {
            navigation.navigate('AdminSearch'); // Use the name you registered in App.js
        } catch (error) {
            // Handle navigation error
            console.error(error);
        }
    };

    const handleUsersStatus = async () => {
        try {
            navigation.navigate('AdminUStatus'); // Use the name you registered in App.js
        } catch (error) {
            // Handle navigation error
            console.error(error);
        }
    };

    const handleAdminReport = async () => {
        try {
            navigation.navigate('AdminReport'); // Use the name you registered in App.js
        } catch (error) {
            // Handle navigation error
            console.error(error);
        }
    };

    const handleAdminMessages = async () => {
        try {
            navigation.navigate('AdminMessages'); // Use the name you registered in App.js
        } catch (error) {
            // Handle navigation error
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.sidebar}>
                <Image source={require('../images/logo.png')} style={styles.logo} />
                <TouchableOpacity onPress={handleUsersSearch} style={styles.sidebarItem}> {/* Use onPress with the handleUsersSearch function */}
                    <Text style={styles.sidebarText}>Search Users</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleUsersStatus} style={styles.sidebarItem}>
                    <Text style={styles.sidebarText}>Activate/Deactivate Users</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAdminReport} style={styles.sidebarItem}>
                    <Text style={styles.sidebarText}>Reports</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAdminMessages} style={styles.sidebarItem}>
                    <Text style={styles.sidebarText}>Message User</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.mainContent}>
                <TextInput style={styles.searchBar} placeholder="Search...." placeholderTextColor="#666" />
                <Text style={styles.header}>Support - A - Rattler Dashboard</Text>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>NEW ORDERS</Text>
                    <Text style={styles.cardValue}>35673</Text>
                    {/* ... Other card details */}
                </View>
                {/* ... Other cards */}
                <BarChart
                    style={styles.chart}
                    data={data}
                    width={screenWidth * 0.7} // 70% of the screen width
                    height={220}
                    chartConfig={chartConfig}
                />

                <LineChart
                    data={data}
                    width={screenWidth * 0.7}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                />

                {/* Progress Chart for New Users */}
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
        borderBottomColor: '#A5D6A7',
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
    // Add additional styles for dashboard content as needed
});

export default AdminHomeScreen;
