// CustomerHomeScreen.js
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text,
    Image, KeyboardAvoidingView, Button, StyleSheet } from 'react-native';
import { firestore } from '../firebase';
import { doc, setDoc } from "firebase/firestore";

const CustomerHomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Customer Home Page</Text>
            {/* Add more UI components as needed */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DFF2E3', // or any other color according to your design
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#4C6854', // adjust the color to fit your theme
    },
    // ... any other styles you need
});

export default CustomerHomeScreen;