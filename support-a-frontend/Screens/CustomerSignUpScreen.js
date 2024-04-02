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
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const CustomerSignUpScreen = ({ navigation }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const [role, setRole] = useState('');

    const handleSignUp = async () => {
        if (!firstName || !lastName || !email || !password || password !== confirmPassword) {
            Alert.alert("Error", "All fields are required and passwords must match.");
            return;
        }

        try {
            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('User created:', userCredential.user);

            const userData = {
                name: `${firstName} ${lastName}`,
                email: email,
                dateOfBirth: dateOfBirth,
                gender: gender,
                isActive: true,
                role: role,
            };

            const docRef = await addDoc(collection(db, "User"), userData);
            console.log("User added to Firestore with ID: ", docRef.id);

            Alert.alert("Success", "User registered successfully");
            navigation.navigate('CustomerLogin');
        } catch (error) {
            console.error("Error adding user: ", error);
            Alert.alert("Error", "Failed to register user");
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <Text style={styles.header}>Customer Sign Up</Text>
            <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
            />
            <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
            />
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
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Date of Birth"
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
            />
            <TextInput
                style={styles.input}
                placeholder="Gender"
                value={gender}
                onChangeText={setGender}
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
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        width: '80%',
        marginVertical: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
    },
});

export default CustomerSignUpScreen;
