// ServiceProductsScreen.js
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Animated } from 'react-native';

const ServiceProductsScreen = ({ navigation }) => { // Ensuring navigation prop is received
    const scale = new Animated.Value(1);

    const animateScale = (newValue) => {
        Animated.spring(scale, {
            toValue: newValue,
            friction: 3,
            useNativeDriver: true,
        }).start();
    };

    const touchProps = (screenName) => ({
        activeOpacity: 1,
        onPressIn: () => animateScale(0.95),
        onPressOut: () => animateScale(1),
        onPress: () => navigation.navigate(screenName), // Using navigation prop to navigate
    });

    return (
        <View style={styles.container}>
            <Image source={require('../images/logo.png')} style={styles.logo} />
            <Text style={styles.question}>What will you be selling as an entrepreneur?</Text> {/* Added question */}
            <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
                <TouchableOpacity {...touchProps('ServicesScreen')}>
                    <Text style={styles.title}>Services</Text> {/* Updated button text */}
                </TouchableOpacity>
            </Animated.View>
            <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
                <TouchableOpacity {...touchProps('ProductsScreen')}>
                    <Text style={styles.title}>Products</Text> {/* Updated button text */}
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

export default ServiceProductsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DFF2E3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 250,
        height: 250,
        marginBottom: 30,
        resizeMode: 'contain',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        paddingVertical: 25,
        paddingHorizontal: 20,
        marginVertical: 10,
        width: '50%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 7,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#4C6854',
    },
    question: { // Style for the question text, matching the button text style
        fontSize: 24,
        fontWeight: '600',
        color: '#4C6854',
        marginBottom: 20, // Add some spacing between the question and the buttons
    },
});
