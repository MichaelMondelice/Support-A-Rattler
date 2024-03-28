// EntrepreneurHomeScreen.js
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text,
    Image, KeyboardAvoidingView, Button, StyleSheet } from 'react-native';
import { firestore } from '../firebase';
import { doc, setDoc } from "firebase/firestore";

const EntrepreneurHomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Entrepreneur Home Page</Text>
            {/* You can add more UI components here as needed */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DFF2E3', // Adjust the background color as needed
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#4C6854', // Adjust the text color as needed
    },
    // Add any additional styles you might need
});

export default EntrepreneurHomeScreen;
