import React, { useState } from 'react';
import {
    TextInput,
    TouchableOpacity,
    Text,
    KeyboardAvoidingView,
    StyleSheet,
    Alert
} from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase"; // Use the imported db

const CustomerSignUpScreen = ({ navigation }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');

    const handleSignUp = async () => {
        if (!firstName || !lastName || !email || !password || password !== confirmPassword) {
            Alert.alert("Error", "All fields are required and passwords must match.");
            return;
        }

        const auth = getAuth();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userData = {
                firstName,
                lastName,
                email,
                dateOfBirth,
                gender,
                role: 'Customer',
                isActive: true // Set isActive to true by default
            };

            await setDoc(doc(db, "User", user.uid), userData);

            Alert.alert("Success", "User registered successfully");
            navigation.navigate('CustomerLogin');
        } catch (error) {
            console.error("Error adding user: ", error);
            Alert.alert("Error", error.message);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <Text style={styles.header}>Customer Sign Up</Text>
            <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
            <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <TextInput style={styles.input} placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
            <TextInput style={styles.input} placeholder="Date of Birth" value={dateOfBirth} onChangeText={setDateOfBirth} />
            <TextInput style={styles.input} placeholder="Gender" value={gender} onChangeText={setGender} />
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

