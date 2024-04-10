import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const BookingConfirmationScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.confirmationText}>Your appointment has been booked.</Text>
            <Text style={styles.thankYouText}>Thank you for booking with Support-A-Rattler.</Text>
            <Button
                title="Okay"
                onPress={() => navigation.navigate('CustomerHome')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DFF2E3',
        padding: 20,
    },
    confirmationText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#4C6854',
    },
    thankYouText: {
        fontSize: 18,
        marginBottom: 40,
        textAlign: 'center',
        color: '#4C6854',
    },
});

export default BookingConfirmationScreen;
