import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ScrollView, TouchableOpacity, Alert, FlatList } from 'react-native';
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const BookingScreen = ({ route, navigation }) => {
    const { service } = route.params;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);

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

        const fetchReviews = async () => {
            const reviewsQuery = query(collection(db, "Review"), where("ServiceID", "==", service.id));
            const querySnapshot = await getDocs(reviewsQuery);
            let allReviews = [];
            for (const reviewDoc of querySnapshot.docs) {
                const reviewData = reviewDoc.data();
                allReviews.push({
                    id: reviewDoc.id,
                    comment: reviewData.Comment,
                    rating: reviewData.Rating,
                });
            }
            setReviews(allReviews);
            updateAverageRating(allReviews);
        };

        initializeSlots();
        fetchReviews();
    }, [service]);

    const updateAverageRating = (reviews) => {
        const totalRating = reviews.reduce((acc, cur) => acc + cur.rating, 0);
        const average = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;
        setAverageRating(average);
    };

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

    const handleReviewSubmit = async () => {
        if (rating < 1 || rating > 5) {
            Alert.alert("Invalid Rating", "Please enter a rating between 1 and 5.");
            return;
        }
        try {
            // Add the review document to the Firestore collection
            const reviewDocRef = await addDoc(collection(db, "Review"), {
                ServiceID: service.id,
                Rating: parseInt(rating, 10),
                Comment: review,
            });

            // Check if the review document is successfully added to the Firestore database
            if (reviewDocRef.id) {
                setReview('');
                setRating(0);
                const newReview = { comment: review, rating: parseInt(rating, 10), customerName: name };
                setReviews([...reviews, newReview]);
                updateAverageRating([...reviews, newReview]);
                navigation.navigate('Confirmation', { message: "Your review has been submitted." });
            } else {
                throw new Error("Review document not added to Firestore.");
            }
        } catch (error) {
            console.error("Review Submission Error:", error);
            Alert.alert("Error", "Failed to submit review.");
        }
    };


    const renderStars = (rating) => {
        const filledStars = '★'.repeat(Math.floor(rating));
        const emptyStars = '☆'.repeat(5 - Math.floor(rating));
        return <Text style={{ color: '#FFD700' }}>{filledStars + emptyStars}</Text>;
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

            <Text style={styles.subtitle}>Leave a Review:</Text>
            <TextInput
                style={styles.reviewInput}
                value={review}
                onChangeText={setReview}
                placeholder="Write your review here..."
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
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.reviewItem}>
                            <Text style={styles.reviewText}>Rating: {renderStars(item.rating)}</Text>
                            <Text style={styles.reviewText}>Comment: {item.comment}</Text>
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.reviewText}>No reviews yet.</Text>
            )}
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
    reviewInput: {
        borderWidth: 1,
        borderColor: '#4C6854',
        padding: 10,
        borderRadius: 6,
        marginBottom: 10,
        minHeight: 100,
        backgroundColor: '#C8E6C9',
    },
    ratingInput: {
        borderWidth: 1,
        borderColor: '#4C6854',
        padding: 10,
        borderRadius: 6,
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
        borderRadius: 6,
        marginBottom: 10,
    },
    reviewText: {
        fontSize: 16,
    },
});

export default BookingScreen;