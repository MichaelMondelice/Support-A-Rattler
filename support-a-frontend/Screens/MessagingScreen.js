import { useState, useEffect } from 'react';
import { db, auth } from '../firebase'; // Import Firestore and auth instances
import { collection, addDoc, query, orderBy, onSnapshot, getDocs, where } from 'firebase/firestore';

const MessagingScreen = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [showChat, setShowChat] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'User'));
                const userList = [];
                querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    userList.push({ id: doc.id, firstName: userData.firstName, lastName: userData.lastName });
                });
                setUsers(userList);
            } catch (error) {
                console.error('Error fetching users:', error);
                // Handle error if needed
            }
        };

        fetchUsers(); // Fetch users on component mount

        return () => {
            // Cleanup function
        };
    }, []);

    useEffect(() => {
        if (selectedUser) {
            const q = query(
                collection(db, 'Messages'),
                orderBy('timestamp', 'asc'),
                where('sender', 'in', [auth.currentUser.uid, selectedUser.id]),
                where('receiver', 'in', [auth.currentUser.uid, selectedUser.id])
            );

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const updatedMessages = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setMessages(updatedMessages);
            });

            return () => unsubscribe();
        }
    }, [selectedUser]);

    const handleMessageChange = (event) => {
        setNewMessage(event.target.value);
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() !== '' && selectedUser) {
            try {
                const user = auth.currentUser; // Get the currently authenticated user
                if (!user) {
                    console.error('No authenticated user found');
                    return;
                }

                await addDoc(collection(db, 'Messages'), {
                    text: newMessage,
                    sender: user.uid, // Use the authenticated user's ID as the sender
                    receiver: selectedUser.id,
                    timestamp: new Date()
                });
                setNewMessage('');
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        toggleChat();
    };

    const toggleChat = () => {
        setShowChat(!showChat);
    };

    return (
        <div style={styles.container}>
            <div style={styles.userList}>
                <h3 style={styles.heading}>Users</h3>
                {users.map((user) => (
                    <div key={user.id} style={styles.userBox} onClick={() => handleUserSelect(user)}>
                        <span style={{ color: '#000' }}>{user.firstName} {user.lastName}</span>
                    </div>
                ))}
            </div>
            {selectedUser && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <button style={styles.closeButton} onClick={() => setSelectedUser(null)}>Close</button>
                        <h3 style={styles.chatTitle}>Chat with {selectedUser.firstName} {selectedUser.lastName}</h3>
                        <ul style={styles.messageList}>
                            {messages.map((message) => (
                                <li key={message.id} style={message.sender === auth.currentUser.uid ? styles.userMessage : styles.receiverMessage}>
                                    <div style={styles.messageContent}>
                                        {message.text}
                                    </div>
                                    <div style={styles.messageHeader}>
                                        {message.sender === auth.currentUser.uid ? 'You' : selectedUser.firstName} - {message.timestamp.toDate().toLocaleTimeString()}
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={handleMessageChange}
                            style={styles.messageInput}
                        />
                        <button onClick={handleSendMessage} style={styles.sendButton}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '20px',
        backgroundColor: '#4CAF50',
        color: '#FFF',
    },
    userList: {
        flex: '1',
    },
    heading: {
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    userBox: {
        padding: '10px',
        margin: '5px',
        backgroundColor: '#FFF',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    modal: {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '999',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#FFF',
        borderRadius: '10px',
        padding: '20px',
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: '#4CAF50',
        fontSize: '16px',
    },
    chatTitle: {
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    messageList: {
        listStyle: 'none',
        padding: '0',
    },
    userMessage: {
        backgroundColor: '#FFA500',
        color: '#FFF',
        padding: '10px',
        marginBottom: '5px',
        borderRadius: '10px',
    },
    receiverMessage: {
        backgroundColor: '#4CAF50',
        color: '#FFF',
        padding: '10px',
        marginBottom: '5px',
        borderRadius: '10px',
    },
    messageContent: {
        fontSize: '16px',
    },
    messageHeader: {
        fontSize: '12px',
        color: '#666',
    },
    messageInput: {
        height: '40px',
        width: 'calc(100% - 80px)', // Adjust width according to button width
        marginRight: '10px',
        marginBottom: '10px',
        padding: '5px',
        borderRadius: '5px',
        border: '1px solid #4CAF50',
    },
    sendButton: {
        height: '40px',
        width: '80px',
        backgroundColor: '#4CAF50',
        color: '#FFF',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default MessagingScreen;
