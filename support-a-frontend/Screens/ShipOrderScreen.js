// ShipOrderScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ShipOrderScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Ship Order Screen</Text>
            {/* Implement your shipping order logic here */}
            <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        marginBottom: 20,
    },
});

export default ShipOrderScreen;

