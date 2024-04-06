import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Import your Firestore instance

const AdminReportsScreen = () => {
    const [productsServicesList, setProductsServicesList] = useState([]);
    const [filteredProductsServicesList, setFilteredProductsServicesList] = useState([]);
    const [filter, setFilter] = useState('all'); // Default filter option

    useEffect(() => {
        const fetchProductsServices = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'ProductService'));
                const data = [];
                querySnapshot.forEach((doc) => {
                    data.push({ id: doc.id, ...doc.data() });
                });
                setProductsServicesList(data);
                setFilteredProductsServicesList(data);
            } catch (error) {
                console.error('Error fetching products and services:', error);
            }
        };

        fetchProductsServices();
    }, []);

    // Function to handle applying filter
    const applyFilter = (type) => {
        setFilter(type);
        if (type === 'Product') {
            const filteredList = productsServicesList.filter(item => item.type === 'Product');
            setFilteredProductsServicesList(filteredList);
        } else if (type === 'Service') {
            const filteredList = productsServicesList.filter(item => item.type === 'Service');
            setFilteredProductsServicesList(filteredList);
        } else { // If type is 'all' or any other unexpected value
            setFilteredProductsServicesList(productsServicesList); // Reset to all products and services
        }
    };


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Image source={require('../images/logo.png')} style={styles.logo} />
                <Text style={styles.title}>Admin Reports</Text>
            </View>
            <View style={styles.filterContainer}>
                <TouchableOpacity onPress={() => applyFilter('Product')} style={styles.filterButton}>
                    <Text style={styles.filterButtonText}>Product</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => applyFilter('Service')} style={styles.filterButton}>
                    <Text style={styles.filterButtonText}>Service</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => applyFilter('all')} style={styles.filterButton}>
                    <Text style={styles.filterButtonText}>All</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.userList}>
                {filteredProductsServicesList.map((item) => (
                    <View key={item.id} style={styles.userItem}>
                        <Text style={styles.userName}>{item.name}</Text>
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>{item.orders} Orders</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>{item.deliveries} Deliveries</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#DFF2E3',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4CAF50',
        paddingVertical: 20,
    },
    logo: {
        width: 150,
        height: 200,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginLeft: 10,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    filterButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        backgroundColor: '#4CAF50',
    },
    filterButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
    },
    userList: {
        paddingHorizontal: 20,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        elevation: 2,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    buttonsContainer: {
        flexDirection: 'row',
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        backgroundColor: '#4CAF50',
        marginLeft: 10,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFF',
    },
});

export default AdminReportsScreen;
