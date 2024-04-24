import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CustomerAppointmentScreen = ({ navigation }) => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                const appointmentsQuery = query(collection(db, "AppointmentsBooked"), where("customerEmail", "==", user.email));
                const querySnapshot = await getDocs(appointmentsQuery);

                const fetchedAppointments = [];
                for (const docSnapshot of querySnapshot.docs) {
                    const appointmentData = docSnapshot.data();
                    const serviceRef = doc(db, "Services", appointmentData.serviceId);
                    const serviceDoc = await getDoc(serviceRef);

                    if (serviceDoc.exists()) {
                        const serviceData = serviceDoc.data();
                        fetchedAppointments.push({
                            id: docSnapshot.id,
                            businessName: serviceData.businessName,
                            category: serviceData.category,
                            time: appointmentData.time,
                            status: appointmentData.status || 'Scheduled' // Ensure status is displayed
                        });
                    }
                }
                setAppointments(fetchedAppointments);
            } else {
                Alert.alert("Error", "You must be signed in to view your appointments.");
            }
        };

        fetchAppointments();
    }, []);

    const handleCancelAppointment = async (appointmentId) => {
        const appointmentRef = doc(db, "AppointmentsBooked", appointmentId);
        try {
            await updateDoc(appointmentRef, {
                status: "Canceled" // Adding a new status field to indicate cancellation
            });
            const updatedAppointments = appointments.map(appointment => {
                if (appointment.id === appointmentId) {
                    return { ...appointment, status: "Canceled" };
                }
                return appointment;
            });
            setAppointments(updatedAppointments);
        } catch (error) {
            console.error("Error canceling appointment: ", error);
            Alert.alert("Error", "Failed to cancel appointment.");
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <FlatList
                    data={appointments}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.appointmentItem}>
                            <Text style={styles.appointmentText}>Business Name: {item.businessName}</Text>
                            <Text style={styles.appointmentText}>Category: {item.category}</Text>
                            <Text style={styles.appointmentText}>Time: {item.time}</Text>
                            <Text style={styles.appointmentText}>Status: {item.status}</Text>
                            <TouchableOpacity style={styles.deleteButton} onPress={() => handleCancelAppointment(item.id)}>
                                <Text style={styles.deleteButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
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
    scrollView: {
        flex: 1,
    },
    appointmentItem: {
        backgroundColor: '#C8E6C9',
        padding: 15,
        borderRadius: 6,
        marginBottom: 10,
    },
    appointmentText: {
        fontSize: 16,
        color: '#333',
    },
    deleteButton: {
        marginTop: 10,
        backgroundColor: '#FF6347', // Tomato color for the cancel button
        padding: 10,
        borderRadius: 6,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
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

export default CustomerAppointmentScreen;
