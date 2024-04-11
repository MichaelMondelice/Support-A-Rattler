import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Alert } from 'react-native';
import { db, auth } from "../firebase";
import { doc, getDoc, addDoc, collection, serverTimestamp, updateDoc } from "firebase/firestore";

const ProductDetailsScreen = ({ route }) => {
    const { product } = route.params;
    const [quantity, setQuantity] = useState(1);
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);

    const handleOrder = async () => {
        const user = auth.currentUser;
        if (!user) {
            Alert.alert("Error", "You must be signed in to place an order.");
            return;
        }

        try {
            const totalPrice = quantity * product.price;
            await addDoc(collection(db, "Order"), {
                CustomerID: user.uid,
                OrderDate: serverTimestamp(),
                ProdServID: product.id,
                ProductName: product.productName, // Added productName to be saved with each order
                Quantity: quantity,
                Status: "Payment Received", // Assuming payment is handled separately
                TotalPrice: totalPrice
            });
            Alert.alert("Success", "Your order has been placed.");
        } catch (error) {
            Alert.alert("Error", "Failed to place order.");
        }
    };

    const handleReviewSubmit = async () => {
        // Example function to add a review, adjust based on your database schema
        try {
            await addDoc(collection(db, "Review"), {
                ProductID: product.id,
                CustomerID: auth.currentUser.uid,
                Rating: rating,
                Comment: review,
                Timestamp: serverTimestamp()
            });
            setReview('');
            setRating(0);
            Alert.alert("Success", "Review submitted successfully.");
        } catch (error) {
            Alert.alert("Error", "Failed to submit review.");
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{product.productName}</Text>
            <Text style={styles.description}>Description: {product.description}</Text>
            <Text style={styles.price}>Price: ${product.price.toFixed(2)}</Text> {/* Added .toFixed(2) for price formatting */}
            <Text style={styles.shipping}>Shipping Available: {product.shippingAvailable ? 'Yes' : 'No'}</Text>

            <View style={styles.orderSection}>
                <TextInput
                    style={styles.quantityInput}
                    value={quantity.toString()}
                    onChangeText={text => setQuantity(Number(text))}
                    keyboardType="numeric"
                />
                <View style={styles.orderButton}>
                    <Button title="Place Order" onPress={handleOrder} color="#4CAF50" /> {/* Changed button color */}
                </View>
            </View>

            <View style={styles.reviewSection}>
                <TextInput
                    style={styles.reviewInput}
                    value={review}
                    onChangeText={setReview}
                    placeholder="Leave a review"
                    multiline
                />
                <TextInput
                    style={styles.ratingInput}
                    value={rating.toString()}
                    onChangeText={text => setRating(Number(text))}
                    placeholder="Rating (1-5)"
                    keyboardType="numeric"
                />
                <View style={styles.reviewButton}>
                    <Button title="Submit Review" onPress={handleReviewSubmit} color="#4CAF50" /> {/* Changed button color */}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#DFF2E3', // Changed background color to match the scheme
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333', // Changed text color for better readability
    },
    description: {
        fontSize: 16,
        marginBottom: 10,
        color: '#555', // Added text color
    },
    price: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 10,
        color: '#333', // Added text color
    },
    shipping: {
        fontSize: 16,
        marginBottom: 20,
        color: '#555', // Added text color
    },
    orderSection: {
        marginBottom: 20,
    },
    quantityInput: {
        borderWidth: 1,
        borderColor: '#4C6854', // Changed border color to match the scheme
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: '#C8E6C9', // Changed background color to match the scheme
    },
    orderButton: {
        marginBottom: 20,
    },
    reviewSection: {},
    reviewInput: {
        borderWidth: 1,
        borderColor: '#4C6854', // Changed border color to match the scheme
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        minHeight: 100,
        textAlignVertical: 'top',
        backgroundColor: '#C8E6C9', // Changed background color to match the scheme
    },
    ratingInput: {
        borderWidth: 1,
        borderColor: '#4C6854', // Changed border color to match the scheme
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: '#C8E6C9', // Changed background color to match the scheme
    },
    reviewButton: {
        marginBottom: 20,
    },
});

export default ProductDetailsScreen;
