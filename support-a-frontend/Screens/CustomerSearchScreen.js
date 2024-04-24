import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet, ScrollView, Alert, FlatList, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";

const CustomerSearchScreen = ({ navigation }) => {
    const [userData, setUserData] = useState(null);
    const [services, setServices] = useState([]);
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    const categoryIcons = {
        'Health': 'heart',
        'Education': 'book',
        'Technology': 'laptop',
        'Hair': 'hair-dryer',
        'Nails': 'nail',
        'Barber': 'barber',
        'Food': 'food',
        'Videography': 'camera',
        'Photography': 'camera',
        'Personal Trainer': 'run',
        'Fashion': 'clothing',
        'Tools': 'tools',
    };

    useEffect(() => {
        const fetchUserDataAndData = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                const userRef = doc(db, "User", user.uid);
                const docSnap = await getDoc(userRef);
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                } else {
                    Alert.alert("Error", "No user data found");
                }

                // Fetch services and products
                const servicesSnapshot = await getDocs(collection(db, "Services"));
                setServices(servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

                const productsSnapshot = await getDocs(collection(db, "ProductService"));
                setProducts(productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }
        };

        fetchUserDataAndData().catch(console.error);
    }, []);

    useEffect(() => {
        const queryLowerCase = searchQuery.toLowerCase();
        const filteredServices = services.filter(service => service.businessName.toLowerCase().includes(queryLowerCase) || service.category.toLowerCase().includes(queryLowerCase));
        const filteredProducts = products.filter(product => product.productName.toLowerCase().includes(queryLowerCase) || product.category.toLowerCase().includes(queryLowerCase));
        setFilteredData([...filteredServices, ...filteredProducts]);
    }, [searchQuery, services, products]);

    const handleItemClick = (item) => {
        // Check if the item has a productName to distinguish products from services
        if (item.productName) {
            navigation.navigate('ProductDetailsScreen', { product: item });
        } else {
            navigation.navigate('BookingScreen', { service: item });
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.header}>
                    <Image source={require('../images/img.png')} style={styles.profilePic} />
                    <Text style={styles.welcome}>Welcome, {userData ? userData.firstName : 'User'}</Text>
                </View>

                <TextInput
                    placeholder="Search services and products..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={styles.searchInput}
                />
                <FlatList
                    data={filteredData}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.serviceItem} onPress={() => handleItemClick(item)}>
                            <View style={styles.serviceContent}>
                                <MaterialCommunityIcons
                                    name={categoryIcons[item.category] || 'help-circle'}
                                    size={40}
                                    color="#4CAF50"
                                    style={styles.serviceIcon}
                                />
                                <View>
                                    <Text style={styles.serviceText}>{item.businessName || item.productName}</Text>
                                    <Text style={styles.serviceCategory}>{item.category}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 15,
    },
    profilePic: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderColor: '#4C6854',
        borderWidth: 2,
    },
    welcome: {
        fontSize: 18,
        fontWeight: 'bold',
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
    },
    recommendedTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        paddingHorizontal: 10,
        paddingVertical: 15,
    },
    serviceItem: {
        backgroundColor: '#C8E6C9',
        padding: 15,
        borderRadius: 6,
        marginHorizontal: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    serviceContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    serviceIcon: {
        marginRight: 15,
    },
    serviceText: {
        fontSize: 16,
        color: '#333',
    },
    serviceCategory: {
        fontSize: 14,
        color: '#555',
    },
    searchInput: {
        backgroundColor: '#C8E6C9',
        padding: 10,
        marginHorizontal: 10,
        marginTop: 10,
        marginBottom: 20,
        borderRadius: 6,
    },
});

export default CustomerSearchScreen;
