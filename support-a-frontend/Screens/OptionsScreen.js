// OptionsScreen.js
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Animated } from 'react-native';

const OptionsScreen = ({ navigation }) => { // Ensuring navigation prop is received
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
            <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
                <TouchableOpacity {...touchProps('AdminLogin')}>
                    <Text style={styles.title}>Admin</Text>
                </TouchableOpacity>
            </Animated.View>
            <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
                <TouchableOpacity {...touchProps('EntrepreneurLogin')}>
                    <Text style={styles.title}>Entrepreneur</Text>
                </TouchableOpacity>
            </Animated.View>
            <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
                <TouchableOpacity {...touchProps('CustomerLogin')}>
                    <Text style={styles.title}>Customer</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

export default OptionsScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DFF2E3', // This color is similar to the background of the images provided
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 250, // Adjust according to your logo's dimensions
        height: 250,
        marginBottom: 30,
        resizeMode: 'contain',
    },
    card: {
        backgroundColor: 'white', // You can adjust this to a specific off-white if needed
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
        shadowRadius: 5,
        shadowOpacity: 0.25,
        elevation: 7,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#4C6854', // This color is similar to the text color on the images provided
    },
});

