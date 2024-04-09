import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { db, auth } from "../firebase"; // Ensure this points to your firebase configuration file
import { collection, addDoc } from "firebase/firestore";

const ProductsScreen = () => {
    const [productName, setProductName] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [price, setPrice] = useState('');
    const [stockQuantity, setStockQuantity] = useState('');

    const validateInputs = () => {
        if (!productName.trim()) {
            Alert.alert("Validation Error", "Product name cannot be empty.");
            return false;
        }

        if (!productCategory.trim()) {
            Alert.alert("Validation Error", "Product category cannot be empty.");
            return false;
        }

        if (!price.trim() || isNaN(price) || Number(price) <= 0) {
            Alert.alert("Validation Error", "Please enter a valid price.");
            return false;
        }

        if (!stockQuantity.trim() || isNaN(stockQuantity) || Number(stockQuantity) < 0) {
            Alert.alert("Validation Error", "Stock quantity must be a non-negative number.");
            return false;
        }

        return true;
    };

    const handleAddProduct = async () => {
        if (!validateInputs()) {
            return;
        }

        const user = auth.currentUser;
        if (!user) {
            Alert.alert("Error", "You must be signed in to add a product.");
            return;
        }

        try {
            const docRef = await addDoc(collection(db, "Products"), {
                productName,
                productCategory,
                price: Number(price),
                stockQuantity: Number(stockQuantity),
            });
            console.log("Document written with ID: ", docRef.id); // Correctly log the document ID
            Alert.alert("Success", "Product added successfully!");
            setProductName('');
            setProductCategory('');
            setPrice('');
            setStockQuantity('');
        } catch (error) {
            console.error("Error adding product: ", error);
            Alert.alert("Error", "Failed to add product.");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput placeholder="Product Name" value={productName} onChangeText={setProductName} style={styles.input} />
            <TextInput placeholder="Product Category" value={productCategory} onChangeText={setProductCategory} style={styles.input} />
            <TextInput placeholder="Price" value={price} onChangeText={setPrice} style={styles.input} keyboardType="numeric" />
            <TextInput placeholder="Stock Quantity" value={stockQuantity} onChangeText={setStockQuantity} style={styles.input} keyboardType="numeric" />
            <TouchableOpacity onPress={handleAddProduct} style={styles.button}>
                <Text style={styles.buttonText}>Add Product</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 6,
    },
    button: {
        backgroundColor: 'green', // Changed to differentiate from the ServicesScreen
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ProductsScreen;
