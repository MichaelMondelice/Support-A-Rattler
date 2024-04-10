import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const BookingScreen = ({ route, navigation }) => {
    const { service } = route.params;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);

    useEffect(() => {
        const calculateTimeSlots = () => {
            let slots = [];
            let startTime = new Date(`01/01/2020 ${service.startTime}`);
            const endTime = new Date(`01/01/2020 ${service.endTime}`);
            while (startTime < endTime) {
                slots.push(startTime.toTimeString().substring(0, 5));
                startTime = new Date(startTime.getTime() + service.interval * 60000);
            }
            return slots;
        };

        const fetchBookedSlots = async () => {
            const bookedSlotsQuery = query(collection(db, "AppointmentsBooked"), where("serviceId", "==", service.id));
            const querySnapshot = await getDocs(bookedSlotsQuery);
            const bookedSlots = querySnapshot.docs.map(doc => doc.data().time);
            return bookedSlots;
        };

        const initializeSlots = async () => {
            const slots = calculateTimeSlots();
            const bookedSlots = await fetchBookedSlots();
            const filteredSlots = slots.filter(slot => !bookedSlots.includes(slot));
            setAvailableSlots(filteredSlots);
        };

        initializeSlots();
    }, [service]);

    const handleBooking = async (timeSlot) => {
        try {
            await addDoc(collection(db, "AppointmentsBooked"), {
                customerName: name,
                customerEmail: email,
                serviceId: service.id,
                time: timeSlot,
            });
            navigation.navigate('BookingConfirmationScreen');
        } catch (error) {
            console.error("Error booking appointment: ", error);
            Alert.alert("Error", "Failed to book appointment.");
        }
    };



    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Book an Appointment for {service.businessName}</Text>
            <TextInput placeholder="Your Name" value={name} onChangeText={setName} style={styles.input} />
            <TextInput placeholder="Your Email" value={email} onChangeText={setEmail} style={styles.input} />
            <Text style={styles.subtitle}>Select a Time Slot:</Text>
            <View style={styles.slotContainer}>
                {availableSlots.map((slot, index) => (
                    <TouchableOpacity key={index} style={styles.slot} onPress={() => handleBooking(slot)}>
                        <Text style={styles.slotText}>{slot}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DFF2E3',
        paddingHorizontal: 10,
        paddingVertical: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#4C6854',
    },
    input: {
        borderWidth: 1,
        borderColor: '#4C6854',
        padding: 10,
        marginBottom: 20,
        borderRadius: 6,
        backgroundColor: '#C8E6C9',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#4C6854',
    },
    slotContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    slot: {
        backgroundColor: '#C8E6C9',
        padding: 10,
        borderRadius: 6,
        margin: 5,
    },
    slotText: {
        fontSize: 16,
        color: '#333',
    },
});

export default BookingScreen;
