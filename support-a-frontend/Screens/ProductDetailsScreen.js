import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Alert, FlatList } from 'react-native';
import { db, auth } from "../firebase";
import { doc, getDoc, addDoc, collection, serverTimestamp, query, where, getDocs } from "firebase/firestore";

const ProductDetailsScreen = ({ navigation, route }) => {
    const { product } = route.params;
    const [quantity, setQuantity] = useState(1);
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        const fetchReviews = async () => {
            const reviewsQuery = query(collection(db, "Review"), where("ProductID", "==", product.id));
            const querySnapshot = await getDocs(reviewsQuery);
            let allReviews = [];
            for (const reviewDoc of querySnapshot.docs) {
                const reviewData = reviewDoc.data();
                const userRef = doc(db, "User", reviewData.CustomerID);
                const userSnap = await getDoc(userRef);
                const fullName = userSnap.exists() ? `${userSnap.data().firstName} ${userSnap.data().lastName}` : "Unnamed User";
                allReviews.push({
                    id: reviewDoc.id,
                    comment: reviewData.Comment,
                    rating: reviewData.Rating,
                    customerName: fullName,
                    displayStars: getStars(reviewData.Rating)
                });
            }
            setReviews(allReviews);
            updateAverageRating(allReviews);
        };

        fetchReviews().catch(error => {
            console.error("Error fetching reviews:", error);
            Alert.alert("Error", "Failed to fetch reviews.");
        });
    }, [product.id]);

    const updateAverageRating = (reviews) => {
        const totalRating = reviews.reduce((acc, cur) => acc + cur.rating, 0);
        const average = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;
        setAverageRating(average);
    };

    const getStars = (rating) => (
        <Text style={{ color: '#FFD700', fontSize: 18 }}>
            {'★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating))}
        </Text>
    );

    const handleOrder = async () => {
        if (!auth.currentUser) {
            Alert.alert("Error", "You must be signed in to place an order.");
            return;
        }
        try {
            const totalPrice = quantity * product.price;
            await addDoc(collection(db, "Order"), {
                CustomerID: auth.currentUser.uid,
                OrderDate: serverTimestamp(),
                ProdServID: product.id,
                ProductName: product.productName,
                Quantity: quantity,
                Status: "Order Received",
                TotalPrice: totalPrice
            });
            navigation.navigate('Confirmation', { message: "Your order has been placed.\nThank you for shopping with Support - A - Rattler!!" });
        } catch (error) {
            console.error("Order Error:", error);
            Alert.alert("Error", "Failed to place order.");
        }
    };

    const handleReviewSubmit = async () => {
        if (rating < 1 || rating > 5) {
            Alert.alert("Invalid Rating", "Please enter a rating between 1 and 5.");
            return;
        }
        try {
            const newDocRef = await addDoc(collection(db, "Review"), {
                ProductID: product.id,
                CustomerID: auth.currentUser.uid,
                Rating: parseInt(rating, 10),
                Comment: review,
                Timestamp: serverTimestamp()
            });
            const newReview = {
                id: newDocRef.id,
                rating: parseInt(rating, 10),
                comment: review,
                customerName: "You",
                displayStars: getStars(rating)
            };
            setReviews([...reviews, newReview]);
            updateAverageRating([...reviews, newReview]);
            setReview('');
            setRating(0);
            navigation.navigate('Confirmation', { message: "Your review has been submitted.\nSupport-A-Rattler appreciates your feedback!!" });
        } catch ( error ) {
            console.error("Review Submission Error:", error);
            Alert.alert("Error", "Failed to submit review.");
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{product.productName}</Text>
            <Text style={styles.description}>Description: {product.description}</Text>
            <Text style={styles.price}>Price: ${product.price.toFixed(2)}</Text>
            <Text style={styles.shipping}>Shipping Available: {product.shippingAvailable ? 'Yes' : 'No'}</Text>

            <View style={styles.orderSection}>
                <TextInput
                    style={styles.quantityInput}
                    value={quantity.toString()}
                    onChangeText={text => setQuantity(Number(text))}
                    placeholder="0"
                    keyboardType="numeric"
                />
                <Button title="Place Order" onPress={handleOrder} color="#4CAF50" />
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
                    onChangeText={text => setRating(Math.max(1, Math.min(5, Number(text))))}
                    placeholder="Rating (1-5)"
                    keyboardType="numeric"
                />
                <Button title="Submit Review" onPress={handleReviewSubmit} color="#4CAF50" />
                <Text style={styles.reviewsHeader}>Reviews - Average Rating: {averageRating}</Text>
                {reviews.length > 0 ? (
                    <FlatList
                        data={reviews}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.reviewItem}>
                                <Text style={styles.reviewText}>Rating: {item.displayStars}</Text>
                                <Text style={styles.reviewText}>Comment: {item.comment}</Text>
                                <Text style={styles.reviewText}>By: {item.customerName}</Text>
                            </View>
                        )}
                    />
                ) : (
                    <Text style={styles.reviewText}>No reviews yet.</Text>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#DFF2E3',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        marginBottom: 10,
    },
    price: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 10,
    },
    shipping: {
        fontSize: 16,
        marginBottom: 20,
    },
    orderSection: {
        marginBottom: 20,
    },
    quantityInput: {
        borderWidth: 1,
        borderColor: '#4C6854',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: '#C8E6C9',
    },
    reviewSection: {},
    reviewInput: {
        borderWidth: 1,
        borderColor: '#4C6854',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        minHeight: 100,
        textAlignVertical: 'top',
        backgroundColor: '#C8E6C9',
    },
    ratingInput: {
        borderWidth: 1,
        borderColor: '#4C6854',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: '#C8E6C9',
    },
    reviewsHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 5,
    },
    reviewItem: {
        backgroundColor: '#E8F5E9',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    reviewText: {
        fontSize: 14,
    },
});

export default ProductDetailsScreen;
