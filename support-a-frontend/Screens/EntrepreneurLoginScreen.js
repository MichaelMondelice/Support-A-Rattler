import React, { useState } from 'react';
import { TextInput, TouchableOpacity, Text, KeyboardAvoidingView, StyleSheet, Alert } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const EntrepreneurLoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            setErrorMessage("Please enter both email and password");
            return;
        }

        try {
            // Check if the email exists in the database
            const usersRef = collection(db, 'User');
            const q = query(usersRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Email exists, check password and isActive status
                const userData = querySnapshot.docs[0].data();
                if (userData.password === password) {
                    if (userData.isActive) {
                        // Password matches and account is active, proceed with login
                        const auth = getAuth();
                        const userCredential = await signInWithEmailAndPassword(auth, email, password);
                        navigation.navigate('EntrepreneurHome', { userData: userCredential.user });
                    } else {
                        // Account is inactive, display error message
                        setErrorMessage("Locked account, contact admin @ FAMU@famu.edu");
                    }
                } else {
                    setErrorMessage("Incorrect password");
                }
            } else {
                setErrorMessage("Invalid email");
            }
        } catch (error) {
            console.error("Login error: ", error);
            setErrorMessage("Error logging in");
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <Text style={styles.header}>Entrepreneur Sign In</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
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
            <TouchableOpacity onPress={() => navigation.navigate('EntrepreneurSignUp')}>
                <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
            {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
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
        marginBottom: 20,
        color: '#4C6854',
    },
    input: {
        width: '80%',
        marginVertical: 10,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#4C6854',
    },
    button: {
        backgroundColor: '#CDEACE',
        padding: 12,
        borderRadius: 20,
        marginTop: 10,
    },
    buttonText: {
        color: '#4C6854',
        fontSize: 18,
    },
    signUpText: {
        marginTop: 20,
        color: '#4C6854',
    },
    errorMessage: {
        color: 'red',
        marginTop: 10,
    },
});

export default EntrepreneurLoginScreen;
