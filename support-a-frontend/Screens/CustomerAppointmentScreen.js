import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { collection, query, where, getDocs, deleteDoc, doc, getDoc } from "firebase/firestore";

const CustomerAppointmentScreen = () => {
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
                            time: appointmentData.time
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

    const handleDeleteAppointment = async (appointmentId) => {
        try {
            await deleteDoc(doc(db, "AppointmentsBooked", appointmentId));
            setAppointments(appointments.filter(appointment => appointment.id !== appointmentId));
            Alert.alert("Success", "Appointment deleted successfully.");
        } catch (error) {
            console.error("Error deleting appointment: ", error);
            Alert.alert("Error", "Failed to delete appointment.");
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={appointments}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.appointmentItem}>
                        <Text style={styles.appointmentText}>Business Name: {item.businessName}</Text>
                        <Text style={styles.appointmentText}>Category: {item.category}</Text>
                        <Text style={styles.appointmentText}>Time: {item.time}</Text>
                        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteAppointment(item.id)}>
                            <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DFF2E3',
        padding: 20,
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
        backgroundColor: '#FF6347', // Tomato color for the delete button
        padding: 10,
        borderRadius: 6,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

export default CustomerAppointmentScreen;
