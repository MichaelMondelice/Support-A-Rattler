// EntrepreneurSignUpScreen.js
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text,
    Image, KeyboardAvoidingView, Button, StyleSheet } from 'react-native';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { firestore } from '../firebase';
import { doc, setDoc } from "firebase/firestore";

const EntrepreneurSignUpScreen = ({ navigation }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

//---------------------------------------------------------------
    // Implement your sign-up logic here
    const handleSignUp = async () => {
        // Sign-up logic, including validation that the passwords match, etc.
        if (password !== confirmPassword) {
            alert("Passwords don't match.");
            return;
        }
        try {
            // Assuming you have a method to create users, e.g., createCustomer(...)
            // await createCustomer(firstName, lastName, username, password);
            console.log('Customer created!'); // Placeholder for success
        } catch (error) {
            console.error(error); // Placeholder for error handling
        }
    };
//---------------------------------------------------------------------------

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <Text style={styles.header}>Entrepreneur Sign Up</Text>
            <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor="#666"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
            />
            <TextInput
                style={styles.input}
                placeholder="Last Name"
                placeholderTextColor="#666"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
            />
            <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#666"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#666"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DFF2E3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#4C6854',
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#4C6854',
        fontSize: 16,
        height: 40,
        marginTop: 10,
        marginBottom: 20,
        color: '#4C6854',
        width: '80%',
    },
    button: {
        backgroundColor: '#CDEACE',
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 30,
        marginTop: 10,
    },
    buttonText: {
        color: '#4C6854',
        fontWeight: 'bold',
        fontSize: 18,
    },
    // Add any additional styles you need here
});

export default EntrepreneurSignUpScreen;
