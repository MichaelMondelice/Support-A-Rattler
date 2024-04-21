import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDoc, doc, getDocs, query, where, addDoc, orderBy, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const MessagingScreen = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [showChat, setShowChat] = useState(false);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("Current User UID:", user.uid); // Verify the current user's UID
                fetchUsersBasedOnRole(user.uid);
            } else {
                console.log("No user is signed in.");
            }
        });
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
            const fetchedUsers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(fetchedUsers.filter(u => u.id !== userId)); // Exclude the current user from the list
        } else {
            console.log('User document not found with the ID:', userId);
        }
    };

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

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setShowChat(true);
    };

    const handleMessageChange = (event) => setNewMessage(event.target.value);

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

    const toggleChat = () => setShowChat(!showChat);

    return (
        <div style={styles.container}>
            <div style={styles.userList}>
                <h3 style={styles.heading}>Users</h3>
                {users.map((user) => (
                    <div key={user.id} style={styles.userBox} onClick={() => handleUserSelect(user)}>
                        <span>{user.firstName} {user.lastName} ({user.role})</span>
                    </div>
                ))}
            </div>
            {selectedUser && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <button style={styles.closeButton} onClick={() => setSelectedUser(null)}>Close</button>
                        <h3 style={styles.chatTitle}>Chat with {selectedUser.firstName} {selectedUser.lastName}</h3>
                        <ul style={styles.messageList}>
                            {messages.map((message) => {
                                console.log("Message Sender:", message.sender, "Current User UID:", auth.currentUser.uid); // Debug message sender ID
                                return (
                                    <li key={message.id} style={message.sender === auth.currentUser.uid ? styles.userMessage : styles.receiverMessage}>
                                        <div style={styles.messageContent}>{message.text}</div>
                                        <div style={styles.messageHeader}>
                                            {message.sender === auth.currentUser.uid ? 'You' : `${selectedUser.firstName} ${selectedUser.lastName}`} - {message.timestamp.toDate().toLocaleTimeString()}
                                        </div>
                                    </li>
                                );
                            })}
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
};

// Add your CSS styles as needed
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
        color: "#000"
    },
    userBox: {
        padding: '10px',
        margin: '5px',
        backgroundColor: '#FFF',
        borderRadius: '5px',
        cursor: 'pointer',
        color: "#000"
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#FFF',
        borderRadius: '10px',
        padding: '10px',
        position: 'relative',
    },
    messageInput: {
        height: '40px',
        width: 'calc(100% - 90px)',
        marginRight: '10px',
        marginBottom: '10px',
        padding: '10px',
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
        padding: '10px 0',
    },
    messageList: {
        listStyle: 'none',
        padding: '0',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
    },
    userMessage: {
        backgroundColor: '#FFA500',
        color: '#FFF',
        padding: '10px 15px',
        borderRadius: '10px',
        alignSelf: 'flex-end',
        maxWidth: '80%',
        marginBottom: '5px',
    },
    receiverMessage: {
        backgroundColor: '#4CAF50',
        color: '#FFF',
        padding: '10px 15px',
        borderRadius: '10px',
        alignSelf: 'flex-start',
        maxWidth: '80%',
        marginBottom: '5px',
    },
};

export default MessagingScreen;
