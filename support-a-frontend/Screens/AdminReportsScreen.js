import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import { db } from '../firebase'; // Import your Firestore instance
import { collection, getDocs, query, where } from 'firebase/firestore';

const AdminReportsScreen = () => {
    const [activeTab, setActiveTab] = useState('Entrepreneurs');
    const [entrepreneurs, setEntrepreneurs] = useState([]);
    const [products, setProducts] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        fetchEntrepreneurs();
        fetchProducts();
        fetchServices();
    }, []);

    const fetchEntrepreneurs = async () => {
        const usersQuery = query(collection(db, 'User'));
        const usersData = await getDocs(usersQuery);
        const users = usersData.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const productServicesData = await getDocs(collection(db, 'ProductService'));
        const servicesData = await getDocs(collection(db, 'Services'));

        const entrepreneursMap = new Map();
        [...productServicesData.docs, ...servicesData.docs].forEach(doc => {
            const data = doc.data();
            if (entrepreneursMap.has(data.userId)) {
                entrepreneursMap.get(data.userId).products.push(data);
            } else {
                const user = users.find(u => u.id === data.userId);
                if (user) {
                    entrepreneursMap.set(data.userId, { firstName: user.firstName, email: user.email, products: [], services: [] });
                    entrepreneursMap.get(data.userId).products.push(data);
                }
            }
        });

        setEntrepreneurs(Array.from(entrepreneursMap.values()));
    };

    const fetchProducts = async () => {
        const querySnapshot = await getDocs(collection(db, 'ProductService'));
        const products = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
            orders: [] // This will be populated on button click
        }));
        setProducts(products);
    };

    const fetchServices = async () => {
        const querySnapshot = await getDocs(collection(db, 'Services'));
        const services = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
            appointments: [] // This will be populated on button click
        }));
        setServices(services);
    };

    const handleProductClick = async (product) => {
        const orderQuery = query(collection(db, 'Order'), where('ProdServID', '==', product.id));
        const orderData = await getDocs(orderQuery);
        const orders = orderData.docs.map(doc => ({
            productName: doc.data().ProductName,
            quantity: doc.data().Quantity,
            status: doc.data().Status
        }));
        setSelectedItem({ ...product, orders });
    };

    const handleServiceClick = async (service) => {
        const appointmentsQuery = query(collection(db, 'AppointmentsBooked'), where('serviceId', '==', service.id));
        const appointmentsData = await getDocs(appointmentsQuery);
        const appointments = appointmentsData.docs.map(doc => ({
            customerEmail: doc.data().customerEmail,
            customerName: doc.data().customerName,
            time: doc.data().time
        }));
        setSelectedItem({ ...service, appointments });
    };

    const changeTab = (tab) => {
        setActiveTab(tab);
        setSelectedItem(null); // Reset selected item when changing tabs
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Entrepreneurs':
                return entrepreneurs.map((entrepreneur, index) => (
                    <TouchableOpacity key={index} style={styles.button} onPress={() => setSelectedItem(entrepreneur)}>
                        <Text style={styles.buttonText}>{entrepreneur.firstName} / {entrepreneur.email}</Text>
                    </TouchableOpacity>
                ));
            case 'Products':
                return products.map((product, index) => (
                    <TouchableOpacity key={index} style={styles.button} onPress={() => handleProductClick(product)}>
                        <Text style={styles.buttonText}>{product.businessName} / {product.productName}</Text>
                    </TouchableOpacity>
                ));
            case 'Services':
                return services.map((service, index) => (
                    <TouchableOpacity key={index} style={styles.button} onPress={() => handleServiceClick(service)}>
                        <Text style={styles.buttonText}>{service.businessName} / {service.category}</Text>
                    </TouchableOpacity>
                ));
            default:
                return <View />;
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.tabs}>
                <TouchableOpacity onPress={() => changeTab('Entrepreneurs')} style={styles.tabButton}>
                    <Text style={styles.tabButtonText}>Entrepreneurs</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changeTab('Products')} style={styles.tabButton}>
                    <Text style={styles.tabButtonText}>Products</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changeTab('Services')} style={styles.tabButton}>
                    <Text style={styles.tabButtonText}>Services</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={selectedItem ? (activeTab === 'Products' ? selectedItem.orders : (activeTab === 'Services' ? selectedItem.appointments : [...selectedItem.products, ...selectedItem.services])) : []}
                renderItem={({ item }) => (
                    <View style={styles.detailContainer}>
                        <Text style={styles.detailHeader}>{item.productName || item.customerName || item.serviceName}</Text>
                        {item.quantity && <Text style={styles.detailText}>Quantity: {item.quantity}</Text>}
                        {item.status && <Text style={styles.detailText}>Status: {item.status}</Text>}
                        {item.customerEmail && <Text style={styles.detailText}>Customer Email: {item.customerEmail}</Text>}
                        {item.time && <Text style={styles.detailText}>Time: {item.time}</Text>}
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
            <View style={styles.content}>
                {renderTabContent()}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 10,
        backgroundColor: '#DFF2E3',
    },
    tabs: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    tabButton: {
        padding: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
    },
    tabButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    content: {
        marginTop: 20,
    },
    button: {
        padding: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonText: {
        color: '#FFF',
        textAlign: 'center',
    },
    detailContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 15,
        marginVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    detailHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    detailText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
});

export default AdminReportsScreen;
