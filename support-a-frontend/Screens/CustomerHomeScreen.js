import React, { useState } from 'react';
import {
    View, TextInput, TouchableOpacity, Text,
    Image, KeyboardAvoidingView, Button, StyleSheet, ScrollView
} from 'react-native';
import { firestore } from '../firebase';
import { doc, setDoc } from "firebase/firestore";
import { MaterialCommunityIcons, FontAwesome, Feather, Entypo } from '@expo/vector-icons';

const initialServices = [
    { id: '1', name: 'Styles By Sarah', category: 'Hair', priceRange: '$100-$200', rating: 4.8, liked: false, image: require('../images/img_1.png') },
    { id: '2', name: 'Marie’s Eatery', category: 'Food', priceRange: '$15-$25', rating: 4.5, liked: true, image: require('../images/img_2.png') },
    { id: '3', name: 'Nails by Ana', category: 'Nails', priceRange: '$50-$100', rating: 4.9, liked: false, image: require('../images/img_3.png') },
    { id: '4', name: 'Laura Tutoring', category: 'Tutoring', priceRange: '$10-$50', rating: 4.3, liked: false, image: require('../images/img_4.png') },
    { id: '5', name: 'Cuts By Camryn', category: 'Hair', priceRange: '$30-$70', rating: 4.8, liked: false, image: require('../images/img_5.png') }
    // Add more services
];

const categories = [
    { id: 'hair', title: 'Hair', icon: 'hair-dryer' },
    { id: 'makeup', title: 'Makeup', icon: 'palette' },
    { id: 'nails', title: 'Nails', icon: 'nail' },
    { id: 'food', title: 'Food', icon: 'food' },
    // Add more categories if needed
];

const CustomerHomeScreen = ({ navigation }) => {
    // Dummy data and rest of your component code ...

    // Function placeholders for onPress actions

    const [activeCategory, setActiveCategory] = useState(null);

    const handleSelectCategory = (id) => {
        setActiveCategory(id);
    };

    const handlePressHome = () => {
        console.log('Home Pressed');
        // navigation.navigate('HomeScreen'); // or whatever screen you want to navigate to
    };

    const handlePressSearch = () => {
        console.log('Search Pressed');
        // navigation.navigate('SearchScreen');
    };

    const handlePressMessages = () => {
        console.log('Messages Pressed');
        // navigation.navigate('MessagesScreen');
    };

    const handlePressMore = () => {
        console.log('More Pressed');
        // navigation.navigate('MoreScreen');
    };



    const [services, setServices] = useState(initialServices);

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
                <Text style={styles.welcome}>Welcome</Text>
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


            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={handlePressHome}>
                    <Feather name="home" size={24} color="#4C6854" />
                    <Text style={styles.navLabel}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={handlePressSearch}>
                    <Feather name="search" size={24} color="#4C6854" />
                    <Text style={styles.navLabel}>Search</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={handlePressMessages}>
                    <MaterialCommunityIcons name="message-text" size={24} color="#4C6854" />
                    <Text style={styles.navLabel}>Messages</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={handlePressMore}>
                    <Entypo name="dots-three-horizontal" size={24} color="#4C6854" />
                    <Text style={styles.navLabel}>More</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DFF2E3',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#DFF2E3', // Header background color
        paddingHorizontal: 10,
        paddingVertical: 15,
    },
    profilePic: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderColor: '#4C6854', // Border color from the image
        borderWidth: 2,
    },
    welcome: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    recommended: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    searchSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0', // Slightly off-white background for search
        borderRadius: 20,
        flex: 1,
        paddingHorizontal: 10,
        height: 40, // Adjust the height as needed
        marginLeft: 10,
    },
    searchIcon: {
        marginRight: 5,
        padding: 10,
        color: 'grey',
    },
    input: {
        flex: 1,
        paddingVertical: 5,
        color: '#4C6854', // Text color from the image
    },
    bellIcon: {
        marginLeft: 10,
        padding: 10,
        color: 'grey',
    },
    categoryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
    },
    card: {
        backgroundColor: '#ffffff', // Assuming cards are white
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
        marginHorizontal: 20, // Side margins for card spacing from screen edges
    },
    cardImage: {
        width: 50, // Small logo size, adjust as needed
        height: 50,
        borderRadius: 25, // Fully rounded corners for a circular image
    },
    cardTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
    },
    cardSubtitle: {
        fontSize: 14,
        color: 'grey',
    },
    cardPrice: {
        fontSize: 14,
        color: '#333',
    },
    cardRating: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingIcon: {
        color: 'gold', // Assuming a gold color for rating stars
        marginRight: 5, // Space between star icon and rating number
    },
    ratingText: {
        fontSize: 14,
        color: '#333',
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start', // Align content to the start of the card (left)
        marginLeft: 12, // Spacing between image and content
    },
    cardSubTitle: {
        fontSize: 14,
        color: '#A5A5A5', // A softer color for the subtitle
        marginTop: 4, // Spacing between title and subtitle
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        backgroundColor: '#FFFFFF',
        paddingBottom: 10, // safe area for iPhone without home button
    },
    navItem: {
        alignItems: 'center', // Center the icon and text
        padding: 5,
    },
    navLabel: {
        color: '#4C6854', // Color for the text label
        fontSize: 12, // Smaller font size for the label
    },

    categoryIcon: {
        alignItems: 'center',
        // Style your category icon container here
    },
    activeCategory: {
        // Styles for the active category
        borderBottomWidth: 2,
        borderBottomColor: '#4C6854',
    },
    // Add any additional styles you need here

});

export default CustomerHomeScreen;