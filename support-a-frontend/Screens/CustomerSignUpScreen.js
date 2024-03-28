//CustomerSignUpScreen
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text,
    Image, KeyboardAvoidingView, Button, StyleSheet } from 'react-native';
import { firestore } from '../firebase';
import { doc, setDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { collection, addDoc } from "firebase/firestore";
import {db} from "../firebase"

const CustomerSignUpScreen = ({ navigation }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

//---------------------------------------------------------------
    const handleSignUp = async () => {
        // You would typically pass in an object containing the new user's data
        // Example userData object: { firstName: 'John', lastName: 'Doe', ... }

        const userData = {
            FirstName: firstName,
            LastName: lastName,
            UserName: username,
            Password: password,
            ConfirmPassword: confirmPassword
        }
        try {
            // Add a new document in collection "users" with the data from userData
            const docRef = await addDoc(collection(db, "User"), userData);
            console.log("User added with ID: ", docRef.id);

            //DO NEXT
            // Navigate to login screen after successful sign up
            // Make sure you have navigation set up and available in your component
            navigation.navigate('Login');
        } catch (error) {
            console.error("Error adding user: ", error);
        }
    };
//---------------------------------------------------------------------------
    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <Text style={styles.header}>Customer Sign Up</Text>
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

export default CustomerSignUpScreen;