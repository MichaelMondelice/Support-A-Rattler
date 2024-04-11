import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { getAuth, deleteUser } from "firebase/auth";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

const CustomerAccountScreen = ({ navigation }) => {
    const auth = getAuth();
    const user = auth.currentUser;
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');

    useEffect(() => {
        if (user) {
            const userRef = doc(db, "User", user.uid);
            getDoc(userRef).then(docSnap => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setFirstName(userData.firstName);
                    setLastName(userData.lastName);
                    setEmail(userData.email);
                    setDateOfBirth(userData.dateOfBirth);
                    setGender(userData.gender);
                }
            });
        }
    }, [user]);

    const handleUpdateAccount = () => {
        if (user) {
            const userRef = doc(db, "User", user.uid);
            updateDoc(userRef, {
                firstName,
                lastName,
                email,
                dateOfBirth,
                gender
            })
                .then(() => {
                    Alert.alert("Success", "Account updated successfully");
                })
                .catch(error => {
                    console.error("Error updating account: ", error);
                    Alert.alert("Error", "Failed to update account");
                });
        }
    };

    const handleDeleteAccount = () => {
        if (user) {
            deleteDoc(doc(db, "User", user.uid))
                .then(() => deleteUser(user))
                .then(() => {
                    Alert.alert("Success", "Account deleted successfully");
                    navigation.replace('LoginScreen'); // Assuming 'LoginScreen' is the route name of your login screen
                })
                .catch(error => {
                    console.error("Error deleting account: ", error);
                    Alert.alert("Error", "Failed to delete account");
                });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Customer Account</Text>
            <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First Name"
            />
            <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last Name"
            />
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
                placeholder="Date of Birth"
            />
            <TextInput
                style={styles.input}
                value={gender}
                onChangeText={setGender}
                placeholder="Gender"
            />
            <Button title="Update Account" onPress={handleUpdateAccount} />
            <Button title="Delete Account" onPress={handleDeleteAccount} color="red" />
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    }
});

export default CustomerAccountScreen;
