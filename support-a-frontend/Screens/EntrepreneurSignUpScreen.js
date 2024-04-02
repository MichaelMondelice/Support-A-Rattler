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
import { doc, setDoc } from "firebase/firestore";  // Use setDoc for specifying the document ID
import { db } from "../firebase";

const EntrepreneurSignUpScreen = ({ navigation }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const [role, setRole] = useState('Entrepreneur');  // Assuming role is set here


    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // User is created in Firebase Authentication
            console.log("Account created in Firebase Auth:", userCredential.user);
            // You can then navigate or perform other actions
        })
        .catch((error) => {
            console.error("Error creating user in Firebase Auth:", error);
        });

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
                name: `${firstName} ${lastName}`,
                email: email,
                dateOfBirth: dateOfBirth,
                gender: gender,
                isActive: true,
                role: role,
            };

            await setDoc(doc(db, "User" , user.uid), userData);
            console.log("Entrepreneur added to Firestore with ID: ", user.uid);

            Alert.alert("Success", "Entrepreneur registered successfully");
            navigation.navigate('EntrepreneurLogin');
        } catch (error) {
            console.error("Error adding entrepreneur: ", error);
            Alert.alert("Error", "Failed to register entrepreneur");
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <Text style={styles.header}>Entrepreneur Sign Up</Text>
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

export default EntrepreneurSignUpScreen;

