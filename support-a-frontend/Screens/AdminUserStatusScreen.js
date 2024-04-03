import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { auth } from '../firebase'; // Import Firebase Authentication
import { db } from '../firebase';

const AdminUserStatusScreen = () => {
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'User'));
                const fetchedUsers = [];
                querySnapshot.forEach((doc) => {
                    fetchedUsers.push({ id: doc.id, ...doc.data() });
                });
                setUserList(fetchedUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const toggleUserStatus = async (id, isActive) => {
        try {
            // Update Firestore document
            const userRef = doc(db, 'User', id);
            await updateDoc(userRef, { isActive: !isActive });

            // Update local state to reflect the change immediately
            setUserList(prevUserList =>
                prevUserList.map(user => {
                    if (user.id === id) {
                        return { ...user, isActive: !isActive };
                    } else {
                        return user;
                    }
                })
            );

            // Update Firebase Authentication
            // (Add your authentication logic here if needed)

        } catch (error) {
            console.error('Error toggling user status:', error);
        }
    };


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Image source={require('../images/logo.png')} style={styles.logo} />
                <Text style={styles.title}>Admin User Activation Page</Text>
            </View>
            <View style={styles.userList}>
                {userList.map((user) => (
                    <View key={user.id} style={styles.userItem}>
                        <Text style={styles.userName}>{user.name}</Text>
                        <Text style={styles.userStatus}>{user.isActive ? 'Active' : 'Inactive'}</Text>
                        <TouchableOpacity
                            onPress={() => toggleUserStatus(user.id, user.isActive)}
                            style={[
                                styles.toggleButton,
                                { backgroundColor: user.isActive ? '#4CAF50' : '#F44336' }
                            ]}
                        >
                            <Text style={styles.buttonText}>{user.isActive ? 'Deactivate' : 'Activate'}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#DFF2E3',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4CAF50',
        paddingVertical: 20,
    },
    logo: {
        width: 150, // Adjusted width to be slightly bigger
        height: 200, // Adjusted height to be slightly bigger
        resizeMode: 'contain',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginLeft: 10,
    },
    userList: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        elevation: 2,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    userStatus: {
        fontSize: 14,
        color: '#666',
    },
    toggleButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFF',
    },
});

export default AdminUserStatusScreen;
