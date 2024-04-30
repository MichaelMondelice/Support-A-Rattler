import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, TextInput, ScrollView, StyleSheet, FlatList, Button } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { db, auth } from '../firebase';
import { collection, getDoc, doc, getDocs, query, where, addDoc, orderBy, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const CustomerMessagesScreen = ({ navigation }) => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchUsersBasedOnRole(user.uid);
            } else {
                console.log("No user is signed in.");
            }
        });

        return unsubscribe;
    }, []);

    const fetchUsersBasedOnRole = async (userId) => {
        const userDocRef = doc(db, 'User', userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const currentUserRole = userDoc.data().role;
            let rolesToShow = [];
            switch (currentUserRole) {
                case 'Admin':
                    rolesToShow = ['Admin', 'Entrepreneur', 'Customer'];
                    break;
                case 'Entrepreneur':
                    rolesToShow = ['Customer', 'Admin'];
                    break;
                case 'Customer':
                    rolesToShow = ['Entrepreneur', 'Admin'];
                    break;
                default:
                    console.log('Unexpected role:', currentUserRole);
            }

            const usersQuery = query(collection(db, 'User'), where('role', 'in', rolesToShow));
            const querySnapshot = await getDocs(usersQuery);
            setUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(u => u.id !== userId));
        } else {
            console.log('User document not found with the ID:', userId);
        }
    };

    useEffect(() => {
        if (selectedUser) {
            const q = query(
                collection(db, 'Messages'),
                where('sender', 'in', [auth.currentUser.uid, selectedUser.id]),
                where('receiver', 'in', [auth.currentUser.uid, selectedUser.id]),
                orderBy('timestamp', 'asc')
            );

            const unsubscribe = onSnapshot(q, (snapshot) => {
                setMessages(snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    timestamp: doc.data().timestamp?.toDate().toLocaleTimeString()
                })));
            });

            return () => unsubscribe();
        }
    }, [selectedUser]);

    const handleUserSelect = (user) => {
        setSelectedUser(user);
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() !== '' && selectedUser) {
            try {
                await addDoc(collection(db, 'Messages'), {
                    text: newMessage,
                    sender: auth.currentUser.uid,
                    receiver: selectedUser.id,
                    timestamp: new Date()
                });
                setNewMessage('');
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <FlatList
                    data={users}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.userBox} onPress={() => handleUserSelect(item)}>
                            <Text>{item.firstName} {item.lastName} ({item.role})</Text>
                        </TouchableOpacity>
                    )}
                />
                {selectedUser && (
                    <View style={styles.chatContainer}>
                        <FlatList
                            data={messages}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <View style={[styles.messageBubble, item.sender === auth.currentUser.uid ? styles.userMessage : styles.receiverMessage]}>
                                    <Text style={styles.messageText}>{item.text}</Text>
                                    <Text style={styles.messageTime}>{item.timestamp}</Text>
                                </View>
                            )}
                        />
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.messageInput}
                                value={newMessage}
                                onChangeText={setNewMessage}
                                placeholder="Type a message..."
                            />
                            <Button title="Send" onPress={handleSendMessage} />
                        </View>
                    </View>
                )}
            </ScrollView>
            <View style={styles.tabBarContainer}>
                <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('CustomerHome')}>
                    <MaterialCommunityIcons name="home" size={24} color="#4CAF50" />
                    <Text style={styles.tabTitle}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Messages')}>
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
        scrollView: {
            flex: 1,
        },
        userBox: {
            padding: 12,
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',
            backgroundColor: '#4CAF50',  // Light green to match the theme
            borderRadius: 5,
            margin: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 1.5,
            elevation: 2,
        },
        userName: {
            fontSize: 16,
            color: '#333',
        },
    chatContainer: {
        padding: 10,
        backgroundColor: '#fff',
    },
    messageBubble: {
        padding: 10,
        borderRadius: 10,
        margin: 5,
    },
    userMessage: {
        backgroundColor: '#dcf8c6',
        alignSelf: 'flex-end',
    },
    receiverMessage: {
        backgroundColor: '#f0f0f0',
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 16,
    },
    messageTime: {
        fontSize: 12,
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
    },
    messageInput: {
        flex: 1,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 10,
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

export default CustomerMessagesScreen;
