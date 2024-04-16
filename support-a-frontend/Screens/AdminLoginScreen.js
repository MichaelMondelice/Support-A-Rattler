import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, KeyboardAvoidingView, Button, StyleSheet, Alert } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // Use the imported db directly

const AdminLoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        try {
            const auth = getAuth();
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            console.log("User UID from userCredential:", user.uid); // Log user UID from userCredential for debugging

            // Fetch user data from Firestore based on the authenticated user's UID
            const userDocRef = doc(db, 'User', user.uid);
            const userDocSnapshot = await getDoc(userDocRef);

            if (!userDocSnapshot.exists()) {
                setErrorMessage("You are not authorized to access this page");
                return;
            }

            const userData = userDocSnapshot.data();
            const userRole = userData.role;

            if (userRole !== 'Admin') {
                setErrorMessage("You are not authorized to access this page");
                return;
            }

            navigation.navigate('AdminHome');
        } catch (error) {
            console.error("Login error: ", error);
            setErrorMessage("An error occurred during login");
        }
    };




    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <Image source={require('../images/logo.png')} style={styles.logo} />
            <Text style={styles.header}>Admin Sign in</Text>
            {errorMessage ? (
                <Text style={styles.errorMessage}>{errorMessage}</Text>
            ) : null}
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Sign In</Text>
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
        width: 200,
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
    errorMessage: {
        color: 'red',
        marginBottom: 10,
    },
});

export default AdminLoginScreen;
