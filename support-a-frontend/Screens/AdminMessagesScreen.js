import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Modal, TextInput, Button } from 'react-native';
import { collection, getDocs, query, where, addDoc, serverTimestamp, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase'; // Import your Firestore instance

const AdminMessagesScreen = () => {
    const [userList, setUserList] = useState([]);
    const [showRequests, setShowRequests] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [chatMessages, setChatMessages] = useState([]);

    // Fetch users from Firestore based on their role
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const q = query(collection(db, 'User'), where('role', 'in', ['Entrepreneur', 'Customer']));
                const usersSnapshot = await getDocs(q);
                const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                console.log('Users data:', usersData); // Log users data
                setUserList(usersData);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    // Function to handle toggling between users and requests
    const toggleRequests = () => {
        setShowRequests(!showRequests);
    };

    // Function to handle selecting a user and displaying the chat window
    const selectUser = (user) => {
        setSelectedUser(user);
        // Fetch initial chat messages
        fetchChatMessages(user.id);
    };

    // Function to close the chat window
    const closeChat = () => {
        setSelectedUser(null);
    };

    // Function to fetch chat messages from Firestore
    const fetchChatMessages = async (userId) => {
        try {
            const q = query(collection(db, 'Message'), where('sentTo', '==', userId), orderBy('sentAt'));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const messagesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                console.log('Chat messages:', messagesData); // Log chat messages
                setChatMessages(messagesData);
            });
            return unsubscribe;
        } catch (error) {
            console.error('Error fetching chat messages:', error);
        }
    };

    // Function to handle sending a message
    const sendMessage = async () => {
        try {
            // Check if a message is not empty
            if (messageInput.trim() !== '') {
                const message = {
                    content: messageInput,
                    sentFrom: 'Admin', // Assuming the message is sent from the admin
                    sentTo: selectedUser.id, // Sending the message to the selected user
                    sentAt: serverTimestamp() // Adding the current timestamp
                };
                // Add the message to Firestore
                await addDoc(collection(db, 'Message'), message);
                // Clear the message input field
                setMessageInput('');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Image source={require('../images/logo.png')} style={styles.logo} />
                <Text style={styles.title}>Admin Messages</Text>
            </View>
            <View style={styles.tabs}>
                <TouchableOpacity onPress={() => toggleRequests()} style={[styles.tab, !showRequests && styles.activeTab]}>
                    <Text style={[styles.tabText, !showRequests && styles.activeTabText]}>Users</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleRequests()} style={[styles.tab, showRequests && styles.activeTab]}>
                    <Text style={[styles.tabText, showRequests && styles.activeTabText]}>Requests</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.userList}>
                {showRequests ? (
                    <View>
                        <Text style={styles.requestTitle}>Request Messages</Text>
                        {/* Display request messages here */}
                    </View>
                ) : (
                    userList.map((user) => (
                        <TouchableOpacity key={user.id} onPress={() => selectUser(user)} style={styles.userItem}>
                            <Text style={styles.userName}>{`${user.firstName} ${user.lastName}`}</Text>
                            <Text style={styles.userType}>{user.role}</Text>
                        </TouchableOpacity>
                    ))
                )}
            </View>
            {/* Modal for chat window */}
            <Modal
                visible={!!selectedUser}
                transparent
                animationType="slide"
                onRequestClose={closeChat}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity onPress={closeChat} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                        <View style={styles.chatContainer}>
                            <Text style={styles.chatTitle}>Chat with {selectedUser?.firstName} {selectedUser?.lastName}</Text>
                            {/* Display chat messages here */}
                            {chatMessages.map((message) => (
                                <View key={message.id} style={styles.messageItem}>
                                    <Text>{message.content}</Text>
                                </View>
                            ))}
                            <TextInput
                                style={styles.messageInput}
                                placeholder="Type a message..."
                                value={messageInput}
                                onChangeText={setMessageInput}
                            />
                            <Button title="Send" onPress={sendMessage} />
                        </View>
                    </View>
                </View>
            </Modal>
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
        width: 150,
        height: 200,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginLeft: 10,
    },
    tabs: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    tab: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        backgroundColor: '#FFF',
        marginHorizontal: 5,
    },
    activeTab: {
        backgroundColor: '#4CAF50',
    },
    tabText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    activeTabText: {
        color: '#FFF',
    },
    userList: {
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
    userType: {
        fontSize: 14,
        color: '#666',
    },
    requestTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 20,
    },
    closeButton: {
        alignSelf: 'flex-end',
    },
    closeButtonText: {
        color: '#4CAF50',
        fontSize: 16,
        fontWeight: 'bold',
    },
    chatContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    chatTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    messageItem: {
        backgroundColor: '#EEE',
        padding: 10,
        borderRadius: 10,
        marginBottom: 5,
    },
    messageInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});

export default AdminMessagesScreen;
