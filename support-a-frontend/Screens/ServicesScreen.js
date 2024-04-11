import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ScrollView, FlatList } from 'react-native';
import { db, auth } from "../firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

const ServicesScreen = () => {
    const [selectedTab, setSelectedTab] = useState('CreateWorkSchedule');
    const [services, setServices] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editableService, setEditableService] = useState({});
    const [businessName, setBusinessName] = useState('');
    const [category, setCategory] = useState(''); // New state for category
    const [workingDays, setWorkingDays] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [interval, setInterval] = useState('');
    const [appointments, setAppointments] = useState([]); // New state to store appointments



    useEffect(() => {
        const fetchServicesAndAppointments = async () => {
            const user = auth.currentUser;
            if (!user) {
                Alert.alert("Error", "You must be signed in to view services.");
                return;
            }

            // Fetch services created by the logged-in entrepreneur
            const servicesQuery = query(collection(db, "Services"), where("userId", "==", user.uid));
            const servicesSnapshot = await getDocs(servicesQuery);
            const servicesList = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setServices(servicesList);

            // For each service, fetch appointments booked for that service
            let allAppointments = [];
            for (const service of servicesList) {
                const appointmentsQuery = query(collection(db, "AppointmentsBooked"), where("serviceId", "==", service.id));
                const appointmentsSnapshot = await getDocs(appointmentsQuery);
                const appointmentsForService = appointmentsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    serviceName: service.businessName // Include the service name in the appointment data
                }));
                allAppointments = [...allAppointments, ...appointmentsForService];
            }
            setAppointments(allAppointments);
        };

        fetchServicesAndAppointments();
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

        // Validate Appointment Interval
        const intervalOptions = [30, 60, 90, 120]; // Allowed intervals in minutes
        const parsedInterval = parseInt(interval, 10); // Parse the interval to a number
        if (!intervalOptions.includes(parsedInterval)) {
            Alert.alert("Validation Error", "Appointment interval must be 30, 60, 90, or 120 minutes.");
            return false;
        }

        return true;
    };


    const handleAddService = async () => {
        const user = auth.currentUser;
        if (!user) {
            Alert.alert("Error", "You must be signed in to add a service.");
            return;
        }
        try {
            const docRef = await addDoc(collection(db, "Services"), {
                userId: user.uid,
                businessName,
                category, // Include category in the added service
                workingDays,
                startTime,
                endTime,
                interval,

            });
            console.log("Document written with ID: ", docRef.id);
            Alert.alert("Success", "Service added successfully!");
            // Clear all fields after successful addition
            setBusinessName('');
            setCategory('');
            setWorkingDays('');
            setStartTime('');
            setEndTime('');
            setInterval('');

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
                    <TextInput placeholder="Category (e.g., Hair, Nails, Barber)" value={category} onChangeText={setCategory} style={styles.input} />
                    <TextInput placeholder="Working Days (e.g., Mon, Wed, Fri)" value={workingDays} onChangeText={setWorkingDays} style={styles.input} />
                    <TextInput placeholder="Start Time (e.g., 8:00 AM)" value={startTime} onChangeText={setStartTime} style={styles.input} />
                    <TextInput placeholder="End Time (e.g., 5:00 PM)" value={endTime} onChangeText={setEndTime} style={styles.input} />
                    <TextInput placeholder="Appointment Interval in Mins (e.g., 30, 60)" value={interval} onChangeText={setInterval} style={styles.input} keyboardType="numeric" />
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
                                    <TextInput value={editableService.category} onChangeText={(text) => handleEditChange('category', text)} style={styles.input} />
                                    <TextInput value={editableService.workingDays} onChangeText={(text) => handleEditChange('workingDays', text)} style={styles.input} />
                                    <TextInput value={editableService.startTime} onChangeText={(text) => handleEditChange('startTime', text)} style={styles.input} />
                                    <TextInput value={editableService.endTime} onChangeText={(text) => handleEditChange('endTime', text)} style={styles.input} />
                                    <TextInput value={editableService.interval} onChangeText={(text) => handleEditChange('interval', text)} style={styles.input} keyboardType="numeric" />
                                    <TouchableOpacity onPress={() => handleUpdateService(item.id)} style={styles.button}>
                                        <Text style={styles.buttonText}>Save</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.serviceText}>Name: {item.businessName}</Text>
                                    <Text style={styles.serviceText}>Category: {item.category}</Text>
                                    <Text style={styles.serviceText}>Working Days: {item.workingDays}</Text>
                                    <Text style={styles.serviceText}>Start Time: {item.startTime}</Text>
                                    <Text style={styles.serviceText}>End Time: {item.endTime}</Text>
                                    <Text style={styles.serviceText}>Interval: {item.interval} min</Text>
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
                <FlatList
                    data={appointments}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.appointmentItem}>
                            <Text style={styles.appointmentText}>Customer Email: {item.customerEmail}</Text>
                            <Text style={styles.appointmentText}>Service Name: {item.serviceName}</Text>
                            <Text style={styles.appointmentText}>Appointment Time: {item.time}</Text>
                            <TouchableOpacity style={styles.deleteButton} onPress={() => {/* Delete appointment logic here */}}>
                                <Text style={styles.deleteButtonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
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
    appointmentItem: {
        backgroundColor: '#C8E6C9', // Light green background
        padding: 15, // Padding inside each appointment item
        borderRadius: 6, // Rounded corners for a softer look
        marginBottom: 10, // Space between each appointment item
        borderWidth: 1, // Thin border for delineation
        borderColor: '#4C6854', // Dark green border to match the theme
        marginTop: 10, // Space above each appointment item
        marginHorizontal: 5, // Space on the sides for wider appearance
    },
    appointmentText: {
        fontSize: 16, // Text size for readability
        color: '#333', // Dark text for contrast against the light background
        marginBottom: 5, // Space between lines of text within an appointment item
    },

    deleteButtonText: {
        color: '#FFFFFF', // White text for visibility against the red button
        fontWeight: 'bold', // Bold text to emphasize the action
    },
});

export default ServicesScreen;
