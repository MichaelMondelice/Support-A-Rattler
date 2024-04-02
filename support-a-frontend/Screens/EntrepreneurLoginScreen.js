import React, { useState } from 'react';
import { TextInput, TouchableOpacity, Text, KeyboardAvoidingView, StyleSheet, Alert } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const EntrepreneurLoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter both email and password");
            return;
        }

        const auth = getAuth();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // If successful, navigate to EntrepreneurHome
            navigation.navigate('EntrepreneurHome', { userData: userCredential.user });
        } catch (error) {
            console.error("Login error: ", error);
            Alert.alert("Login Error", error.message);
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
});

export default EntrepreneurLoginScreen;

