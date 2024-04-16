import React, { useState } from 'react';
import {
    TextInput,
    TouchableOpacity,
    Text,
    KeyboardAvoidingView,
    StyleSheet,
    Alert,
    View // Import View for displaying error message
} from 'react-native';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // Use the imported db directly

const CustomerLoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // Initialize errorMessage state

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter both email and password");
            return;
        }

        const auth = getAuth();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userRef = doc(db, "User", user.uid); // Ensure the collection name matches the one used in the Firestore
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                if (userData.role !== 'Customer') {
                    setErrorMessage("You are not authorized to access this page");
                    return;
                }
                if (userData.isActive) {
                    navigation.navigate('CustomerHome', { userData });
                } else {
                    setErrorMessage("Locked account, contact admin @ FAMU@famu.edu ");
                }
            } else {
                Alert.alert("Error", "No user data found");
            }
        } catch (error) {
            console.error("Login error: ", error);
            Alert.alert("Login Error", error.message);

            // Set the error message state to display on the screen
            setErrorMessage(error.message);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <Text style={styles.header}>Customer Sign In</Text>
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            {errorMessage ? ( // Conditionally render error message
                <View style={styles.errorMessageContainer}>
                    <Text style={styles.errorMessage}>{errorMessage}</Text>
                </View>
            ) : null}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('CustomerSignUp')}>
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
    errorMessageContainer: {
        marginTop: 10,
    },
    errorMessage: {
        color: 'red',
    },
});

export default CustomerLoginScreen;
