// ConfirmationScreen.js
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const ConfirmationScreen = ({ route, navigation }) => {
    const { message } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.message}>{message}</Text>
            <Button
                title="Ok"
                onPress={() => navigation.navigate('CustomerHome')}
                color="#4CAF50" // Same green shade used in other screens for buttons
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#DFF2E3', // Background color matching the ProductDetailsScreen
    },
    message: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
        color: '#4C6854', // Text color similar to other texts in ProductDetailsScreen
    },
    button: {
        backgroundColor: '#C8E6C9', // Button background color similar to the input fields in ProductDetailsScreen
        borderRadius: 5,
        padding: 10,
        minWidth: 200, // Ensures the button is wide enough
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: 'white', // Text color inside the button
        fontSize: 16
    }
});

export default ConfirmationScreen;
