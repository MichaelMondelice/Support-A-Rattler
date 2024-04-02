import React, { useState, useEffect } from 'react';
import {
    View, TextInput, TouchableOpacity, Text,
    Image, StyleSheet, ScrollView, Alert
} from 'react-native';
import { MaterialCommunityIcons, FontAwesome, wFeather, Entypo } from '@expo/vector-icons';
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";

const initialServices = [
    { id: '1', name: 'Styles By Sarah', category: 'Hair', priceRange: '$100-$200', rating: 4.8, liked: false, image: require('../images/img_1.png') },
    { id: '2', name: 'Marie’s Eatery', category: 'Food', priceRange: '$15-$25', rating: 4.5, liked: true, image: require('../images/img_2.png') },
    { id: '3', name: 'Nails by Ana', category: 'Nails', priceRange: '$50-$100', rating: 4.9, liked: false, image: require('../images/img_3.png') },
    { id: '4', name: 'Laura Tutoring', category: 'Tutoring', priceRange: '$10-$50', rating: 4.3, liked: false, image: require('../images/img_4.png') },
    { id: '5', name: 'Cuts By Camryn', category: 'Hair', priceRange: '$30-$70', rating: 4.8, liked: false, image: require('../images/img_5.png') }
];

const categories = [
    { id: 'hair', title: 'Hair', icon: 'hair-dryer' },
    { id: 'makeup', title: 'Makeup', icon: 'palette' },
    { id: 'nails', title: 'Nails', icon: 'nail' },
    { id: 'food', title: 'Food', icon: 'food' }
];

const CustomerHomeScreen = ({ navigation }) => {
    const [userData, setUserData] = useState(null);
    const [services, setServices] = useState(initialServices);
    const [activeCategory, setActiveCategory] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                const userRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(userRef);
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                } else {
                    Alert.alert("Error", "No user data found");
                }
            }
        };

        fetchUserData();
    }, []);

    const toggleLike = (id) => {
        setServices(services.map(service => {
            if (service.id === id) {
                return { ...service, liked: !service.liked };
            }
            return service;
        }));
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Image source={require('../images/img.png')} style={styles.profilePic} />
                <Text style={styles.welcome}>Welcome, {userData ? userData.name : 'Guest'}</Text>
                <View style={styles.searchSection}>
                    <TextInput
                        style={styles.input}
                        placeholder="Search"
                        placeholderTextColor="#666"
                    />
                    <MaterialCommunityIcons name="magnify" size={24} color="#4C6854" style={styles.searchIcon} />
                    <FontAwesome name="bell-o" size={24} color="black" style={styles.bellIcon} />
                </View>
            </View>
            {/* Category Section */}
            <View style={styles.categoryContainer}>
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={[
                            styles.categoryIcon,
                            activeCategory === category.id && styles.activeCategory
                        ]}
                        onPress={() => handleSelectCategory(category.id)}
                    >
                        <MaterialCommunityIcons name={category.icon} size={24} color="#4C6854" />
                        <Text>{category.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.recommended}>Recommended</Text>
            {services.map((service) => (
                <View key={service.id} style={styles.card}>
                    <Image source={service.image} style={styles.cardImage} />
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>{service.name}</Text>
                        <Text style={styles.cardSubTitle}>{service.category}</Text>
                        <Text style={styles.cardPrice}>{service.priceRange}</Text>
                        <View style={styles.cardRating}>
                            <FontAwesome name="star" size={16} color="#FFD700" />
                            <Text style={styles.ratingText}>{service.rating}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => toggleLike(service.id)}>
                        <FontAwesome name={service.liked ? "heart" : "heart-o"} size={24} color="red" />
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    activeCategory: {
        borderBottomWidth: 2,
        borderBottomColor: '#4C6854',
    },
    bellIcon: {
        marginLeft: 10,
        padding: 10,
        color: 'grey',
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        backgroundColor: '#FFFFFF',
        paddingBottom: 10,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        marginHorizontal: 20,
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginLeft: 12,
    },
    cardImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    cardPrice: {
        fontSize: 14,
        color: '#333',
    },
    cardRating: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardSubTitle: {
        fontSize: 14,
        color: 'grey',
    },
    cardTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
    },
    categoryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
    },
    categoryIcon: {
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#DFF2E3',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#DFF2E3',
        paddingHorizontal: 10,
        paddingVertical: 15,
    },
    input: {
        flex: 1,
        paddingVertical: 5,
        color: '#4C6854',
    },
    navItem: {
        alignItems: 'center',
        padding: 5,
    },
    navLabel: {
        color: '#4C6854',
        fontSize: 12,
    },
    profilePic: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderColor: '#4C6854',
        borderWidth: 2,
    },
    ratingText: {
        fontSize: 14,
        color: '#333',
    },
    recommended: undefined,
    searchIcon: {
        marginRight: 5,
        padding: 10,
        color: 'grey',
    },
    searchSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        flex: 1,
        paddingHorizontal: 10,
        height: 40,
        marginLeft: 10,
    }, welcome: {
        fontSize: 18,
        fontWeight: 'bold',
    }

});

export default CustomerHomeScreen;
