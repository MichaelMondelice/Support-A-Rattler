import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Modal, TextInput } from 'react-native';

// Dummy data for users
const users = [
    { id: '1', name: 'John Doe', type: 'seller' },
    { id: '2', name: 'Jane Smith', type: 'customer' },
    { id: '3', name: 'Michael Johnson', type: 'seller' },
    { id: '4', name: 'Emily Davis', type: 'customer' },
    { id: '5', name: 'David Wilson', type: 'seller' },
];

const AdminMessagesScreen = () => {
    const [userList, setUserList] = useState(users);
    const [showRequests, setShowRequests] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messageInput, setMessageInput] = useState('');

    // Function to handle toggling between users and requests
    const toggleRequests = () => {
        setShowRequests(!showRequests);
    };

    // Function to handle sending a message to a user
    const sendMessage = () => {
        console.log('Message sent:', messageInput);
        // Here you can add logic to send the message
        // Clear message input after sending
        setMessageInput('');
    };

    // Function to handle selecting a user and displaying the chat window
    const selectUser = (user) => {
        setSelectedUser(user);
    };

    // Function to close the chat window
    const closeChat = () => {
        setSelectedUser(null);
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
                            <Text style={styles.userName}>{user.name}</Text>
                            <Text style={styles.userType}>{user.type}</Text>
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
                            <Text style={styles.chatTitle}>Chat with {selectedUser?.name}</Text>
                            <ScrollView style={styles.chatMessages}>
                                {/* Display chat messages here */}
                            </ScrollView>
                            <View style={styles.messageInputContainer}>
                                <TextInput
                                    style={styles.messageInput}
                                    placeholder="Type your message..."
                                    value={messageInput}
                                    onChangeText={setMessageInput}
                                />
                                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                                    <Text style={styles.sendButtonText}>Send</Text>
                                </TouchableOpacity>
                            </View>
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
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 20,
        width: '80%',
    },
    closeButton: {
        alignSelf: 'flex-end',
        marginBottom: 10,
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
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
    chatMessages: {
        flex: 1,
    },
    messageInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    messageInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    sendButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
    },
});

export default AdminMessagesScreen;
