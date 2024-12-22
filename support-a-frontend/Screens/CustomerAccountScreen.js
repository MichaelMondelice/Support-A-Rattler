import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import { getAuth, deleteUser } from "firebase/auth";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

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
                    navigation.replace('OptionsScreen'); // Assuming 'LoginScreen' is the route name of your login screen
                })
                .catch(error => {
                    console.error("Error deleting account: ", error);
                    Alert.alert("Error", "Failed to delete account");
                });
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
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
            </ScrollView>
            <View style={styles.tabBarContainer}>
                <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('CustomerHome')}>
                    <MaterialCommunityIcons name="home" size={24} color="#4CAF50" />
                    <Text style={styles.tabTitle}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('CustomerMessages')}>
                    <MaterialCommunityIcons name="message" size={24} color="#4CAF50" />
                    <Text style={styles.tabTitle}>Messages</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('CustomerSearchScreen')}>
                    <MaterialCommunityIcons name="magnify" size={24} color="#4CAF50" />
                    <Text style={styles.tabTitle}>Search</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('CustomerOrdersScreen')}>
                    <MaterialCommunityIcons name="format-list-bulleted" size={24} color="#4CAF50" />
                    <Text style={styles.tabTitle}>Orders</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('CustomerAppointmentScreen')}>
                    <MaterialCommunityIcons name="calendar" size={24} color="#4CAF50" />
                    <Text style={styles.tabTitle}>Appointments</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('CustomerAccountScreen')}>
                    <MaterialCommunityIcons name="account" size={24} color="#4CAF50" />
                    <Text style={styles.tabTitle}>Account</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DFF2E3',
    },
    contentContainer: {
        flexGrow: 1, // Ensures the content uses the space and allows the tab bar to sit at the bottom
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
    },
    tabBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        paddingBottom: 10,
        paddingTop: 5,
    },
    tabItem: {
        alignItems: 'center',
    },
    tabTitle: {
        fontSize: 12,
        color: '#757575',
        paddingTop: 4,
    }
});

export default CustomerAccountScreen;
