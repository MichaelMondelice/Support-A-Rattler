import React, { useState } from 'react';
import {
    TextInput,
    TouchableOpacity,
    Text,
    KeyboardAvoidingView,
    StyleSheet,
    Alert
} from 'react-native';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

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
            const auth = getAuth();
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userRef = doc(db, "User", user.uid); // Ensure the collection name matches the one used in Firestore
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                if (userData.role !== 'Entrepreneur') {
                    setErrorMessage("You are not authorized to access this page");
                    return;
                }
                if (userData.isActive) {

                    navigation.navigate('EntrepreneurHome', { userData });
                } else {
                    setErrorMessage("Account is inactive, please contact support.");
                }
            } else {
                setErrorMessage("No user data found");
            }
        } catch (error) {
            console.error("Login error: ", error);
            setErrorMessage(error.message);
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
