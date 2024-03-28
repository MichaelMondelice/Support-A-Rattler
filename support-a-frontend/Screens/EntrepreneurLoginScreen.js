// EntrepreneurLoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text,
    Image, KeyboardAvoidingView, Button, StyleSheet } from 'react-native';
import { firestore } from '../firebase';
import { doc, setDoc } from "firebase/firestore";


const EntrepreneurLoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

//----------------edit THIS------------------------------
    // Implement your login logic here
    const handleLogin = async () => {
        try {
            // Authentication logic...
            navigation.navigate('EntrepreneurHome'); // Navigate on successful login
        } catch (error) {
            // Handle errors
        }
    };
    //----------------edit THIS------------------------------

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <Image source={require('../images/logo.png')} style={styles.logo} />
            <Text style={styles.header}>Entrepreneur Sign in</Text>
            <TextInput
                style={styles.input}
                placeholder="email"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="password"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('EntrepreneurSignUp')}>
                <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
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
    logo: {
        width: 200, // Adjust to your logo's dimensions
        height: 200,
        marginBottom: 30,
        resizeMode: 'contain',
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
    signUpText: {
        marginTop: 20,
        color: '#4C6854',
    },
});

export default EntrepreneurLoginScreen;
