import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ScrollView, FlatList } from 'react-native';
import { db, auth } from "../firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

const ServicesScreen = () => {
    const [selectedTab, setSelectedTab] = useState('CreateWorkSchedule');
    const [services, setServices] = useState([]);
    const [editingId, setEditingId] = useState(null); // To track which service is being edited
    const [editableService, setEditableService] = useState({}); // To temporarily store editable service data
    const [businessName, setBusinessName] = useState('');
    const [workingDays, setWorkingDays] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "Services"));
                const servicesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setServices(servicesList);
            } catch (error) {
                console.error("Error fetching services: ", error);
                Alert.alert("Error", "Failed to fetch services.");
            }
        };

        fetchServices();
    }, []);

    const validateInputs = () => {
        if (!businessName.trim()) {
            Alert.alert("Validation Error", "Business name cannot be empty.");
            return false;
        }

        const validDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => day.toLowerCase());
        const inputDays = workingDays.split(',').map(day => day.trim().toLowerCase());
        for (const day of inputDays) {
            if (!validDays.includes(day)) {
                Alert.alert("Validation Error", "Please enter valid working days (e.g., Mon, Wed, Fri).");
                return false;
            }
        }

        const timeRegex = /^([1-9]|0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i;
        if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
            Alert.alert("Validation Error", "Time must be in the format HH:MM AM/PM.");
            return false;
        }

        return true;
    };

    const handleAddService = async () => {
        if (!validateInputs()) {
            return;
        }

        const user = auth.currentUser;
        if (!user) {
            Alert.alert("Error", "You must be signed in to add a service.");
            return;
        }

        try {
            const docRef = await addDoc(collection(db, "Services"), {
                userId: user.uid, // Ensure you include the user ID in your service documents
                businessName,
                workingDays,
                startTime,
                endTime,
            });
            console.log("Document written with ID: ", docRef.id);
            Alert.alert("Success", "Service added successfully!");
            setBusinessName('');
            setWorkingDays('');
            setStartTime('');
            setEndTime('');
        } catch (error) {
            console.error("Error adding service: ", error);
            Alert.alert("Error", "Failed to add service.");
        }

    };

    const handleUpdateService = async (id) => {
        try {
            const serviceRef = doc(db, "Services", id);
            await updateDoc(serviceRef, { ...editableService });
            Alert.alert("Success", "Service updated successfully!");
            setEditableService({});
            setEditingId(null);
            // Refresh the services list to reflect the update
            const updatedServices = services.map(service => service.id === id ? { ...service, ...editableService } : service);
            setServices(updatedServices);
        } catch (error) {
            console.error("Error updating service: ", error);
            Alert.alert("Error", "Failed to update service.");
        }
    };

    const handleDeleteService = async (id) => {
        try {
            await deleteDoc(doc(db, "Services", id));
            Alert.alert("Success", "Service deleted successfully!");
            // Remove the service from the list
            const filteredServices = services.filter(service => service.id !== id);
            setServices(filteredServices);
        } catch (error) {
            console.error("Error deleting service: ", error);
            Alert.alert("Error", "Failed to delete service.");
        }
    };

    const startEditing = (service) => {
        setEditingId(service.id);
        setEditableService({ ...service });
    };

    const handleEditChange = (name, value) => {
        setEditableService(prev => ({ ...prev, [name]: value }));
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.tabsContainer}>
                <TouchableOpacity onPress={() => setSelectedTab('CreateWorkSchedule')} style={[styles.tab, selectedTab === 'CreateWorkSchedule' && styles.activeTab]}>
                    <Text style={styles.tabText}>Create Work Schedule</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedTab('AllServices')} style={[styles.tab, selectedTab === 'AllServices' && styles.activeTab]}>
                    <Text style={styles.tabText}>All Services</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedTab('AllAppointments')} style={[styles.tab, selectedTab === 'AllAppointments' && styles.activeTab]}>
                    <Text style={styles.tabText}>All Appointments</Text>
                </TouchableOpacity>
            </View>

            {selectedTab === 'CreateWorkSchedule' && (
                <View>
                    <TextInput placeholder="Business Name" value={businessName} onChangeText={setBusinessName} style={styles.input} />
                    <TextInput placeholder="Working Days (e.g., Mon, Wed, Fri)" value={workingDays} onChangeText={setWorkingDays} style={styles.input} />
                    <TextInput placeholder="Start Time (e.g., 8:00 AM)" value={startTime} onChangeText={setStartTime} style={styles.input} />
                    <TextInput placeholder="End Time (e.g., 5:00 PM)" value={endTime} onChangeText={setEndTime} style={styles.input} />
                    <TouchableOpacity onPress={handleAddService} style={styles.button}>
                        <Text style={styles.buttonText}>Add Service</Text>
                    </TouchableOpacity>
                </View>
            )}

            {selectedTab === 'AllServices' && (
                <FlatList
                    data={services}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.serviceItem}>
                            {editingId === item.id ? (
                                <>
                                    <TextInput value={editableService.businessName} onChangeText={(text) => handleEditChange('businessName', text)} style={styles.input} />
                                    <TextInput value={editableService.workingDays} onChangeText={(text) => handleEditChange('workingDays', text)} style={styles.input} />
                                    <TextInput value={editableService.startTime} onChangeText={(text) => handleEditChange('startTime', text)} style={styles.input} />
                                    <TextInput value={editableService.endTime} onChangeText={(text) => handleEditChange('endTime', text)} style={styles.input} />
                                    <TouchableOpacity onPress={() => handleUpdateService(item.id)} style={styles.button}>
                                        <Text style={styles.buttonText}>Save</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.serviceText}>Name: {item.businessName}</Text>
                                    <Text style={styles.serviceText}>Working Days: {item.workingDays}</Text>
                                    <Text style={styles.serviceText}>Start Time: {item.startTime}</Text>
                                    <Text style={styles.serviceText}>End Time: {item.endTime}</Text>
                                    <View style={styles.actionButtons}>
                                        <TouchableOpacity onPress={() => startEditing(item)} style={[styles.button, styles.editButton]}>
                                            <Text style={styles.buttonText}>Update</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleDeleteService(item.id)} style={[styles.button, styles.deleteButton]}>
                                            <Text style={styles.buttonText}>Delete</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </View>
                    )}
                />
            )}
            {selectedTab === 'AllAppointments' && (
                <View>
                    <Text style={styles.placeholderText}>All Appointments content goes here.</Text>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    tabsContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#A5D6A7',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#4C6854',
    },
    tabText: {
        fontWeight: 'bold',
        color: '#4C6854',
    },
    input: {
        marginBottom: 10,
        backgroundColor: '#C8E6C9',
        borderWidth: 1,
        borderColor: '#A5D6A7',
        padding: 10,
        borderRadius: 20,
        color: '#4C6854',
    },
    button: {
        backgroundColor: '#4C6854',
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    serviceItem: {
        backgroundColor: '#C8E6C9',
        padding: 15,
        borderRadius: 6,
        marginVertical: 5,
    },
    serviceText: {
        fontSize: 16,
        color: '#333',
    },
    placeholderText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#4C6854',
    },

    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    editButton: {
        backgroundColor: '#4CAF50', // Vibrant green color for the edit button
        padding: 10,
        borderRadius: 20, // Rounded corners for a modern look
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4, // Subtle shadow for depth
    },

    deleteButton: {
        backgroundColor: '#4CAF50', // Using the same vibrant green for consistency
        padding: 10,
        borderRadius: 20, // Matching rounded corners
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4, // Matching subtle shadow
    },
});

export default ServicesScreen;