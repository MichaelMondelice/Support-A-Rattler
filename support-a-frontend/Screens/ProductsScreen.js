import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ScrollView, FlatList, Switch } from 'react-native';
import { db, auth } from "../firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

const ProductScreen = () => {
    const [selectedTab, setSelectedTab] = useState('CreateProduct');
    const [products, setProducts] = useState([]);
    const [editingProductId, setEditingProductId] = useState(null); // New state to track the product being edited
    const [businessName, setBusinessName] = useState('');
    const [productName, setProductName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [shippingAvailable, setShippingAvailable] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const user = auth.currentUser;
        if (!user) {
            Alert.alert("Error", "You must be signed in to view products.");
            return;
        }

        const querySnapshot = await getDocs(collection(db, "ProductService"));
        const fetchedProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(fetchedProducts.filter(product => product.userId === user.uid));
    };

    const handleAddOrUpdateProduct = async () => {
        if (!businessName || !productName || !category || !description || !price) {
            Alert.alert("Error", "All fields are required.");
            return;
        }

        const user = auth.currentUser;
        if (!user) {
            Alert.alert("Error", "You must be signed in to add or update a product.");
            return;
        }

        const productData = {
            userId: user.uid,
            businessName,
            productName,
            category,
            description,
            price: parseFloat(price),
            shippingAvailable,
            type: "Product"
        };

        try {
            if (editingProductId) {
                await updateDoc(doc(db, "ProductService", editingProductId), productData);
                Alert.alert("Success", "Product updated successfully!");
            } else {
                await addDoc(collection(db, "ProductService"), productData);
                Alert.alert("Success", "Product added successfully!");
            }
            clearForm();
            fetchProducts(); // Refresh the list of products
            setSelectedTab('AllProducts'); // Switch to 'AllProducts' tab
        } catch (error) {
            console.error("Error adding/updating product: ", error);
            Alert.alert("Error", "Failed to add/update product.");
        }
    };

    const handleEditProduct = (product) => {
        setEditingProductId(product.id);
        setBusinessName(product.businessName);
        setProductName(product.productName);
        setCategory(product.category);
        setDescription(product.description);
        setPrice(product.price.toString());
        setShippingAvailable(product.shippingAvailable);
        setSelectedTab('CreateProduct'); // Switch to 'CreateProduct' tab for editing
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await deleteDoc(doc(db, "ProductService", productId));
            Alert.alert("Success", "Product deleted successfully!");
            fetchProducts(); // Refresh the list of products
        } catch (error) {
            console.error("Error deleting product: ", error);
            Alert.alert("Error", "Failed to delete product.");
        }
    };

    const clearForm = () => {
        setEditingProductId(null);
        setBusinessName('');
        setProductName('');
        setCategory('');
        setDescription('');
        setPrice('');
        setShippingAvailable(false);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.tabsContainer}>
                <TouchableOpacity onPress={() => { setSelectedTab('CreateProduct'); clearForm(); }} style={[styles.tab, selectedTab === 'CreateProduct' && styles.activeTab]}>
                    <Text style={styles.tabText}>{editingProductId ? 'Edit Product' : 'Create Product'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedTab('AllProducts')} style={[styles.tab, selectedTab === 'AllProducts' && styles.activeTab]}>
                    <Text style={styles.tabText}>All Products</Text>
                </TouchableOpacity>
            </View>

            {selectedTab === 'CreateProduct' && (
                <View>
                    <TextInput placeholder="Business Name" value={businessName} onChangeText={setBusinessName} style={styles.input} />
                    <TextInput placeholder="Product Name" value={productName} onChangeText={setProductName} style={styles.input} />
                    <TextInput placeholder="Category" value={category} onChangeText={setCategory} style={styles.input} />
                    <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} multiline />
                    <TextInput placeholder="Price" value={price} onChangeText={setPrice} style={styles.input} keyboardType="numeric" />
                    <View style={styles.switchContainer}>
                        <Text>Shipping Available:</Text>
                        <Switch value={shippingAvailable} onValueChange={setShippingAvailable} />
                    </View>
                    <TouchableOpacity onPress={handleAddOrUpdateProduct} style={styles.button}>
                        <Text style={styles.buttonText}>{editingProductId ? 'Update Product' : 'Add Product'}</Text>
                    </TouchableOpacity>
                </View>
            )}

            {selectedTab === 'AllProducts' && (
                <FlatList
                    data={products}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.productItem}>
                            <Text style={styles.productText}>Name: {item.productName}</Text>
                            <Text style={styles.productText}>Category: {item.category}</Text>
                            <Text style={styles.productText}>Price: ${item.price}</Text>
                            <Text style={styles.productText}>Shipping: {item.shippingAvailable ? 'Available' : 'Not Available'}</Text>
                            <View style={styles.actionButtons}>
                                <TouchableOpacity onPress={() => handleEditProduct(item)} style={styles.editButton}>
                                    <Text style={styles.buttonText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDeleteProduct(item.id)} style={styles.deleteButton}>
                                    <Text style={styles.buttonText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
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
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#4C6854',
    },
    tabText: {
        fontWeight: 'bold',
        color: '#4C6854',
    },
    input: {
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 6,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#4C6854',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    productItem: {
        backgroundColor: '#C8E6C9',
        padding: 15,
        borderRadius: 6,
        marginBottom: 10,
    },
    productText: {
        fontSize: 16,
        color: '#333',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    editButton: {
        backgroundColor: '#FFA500', // Orange color for the edit button
        padding: 10,
        borderRadius: 5,
    },
    deleteButton: {
        backgroundColor: '#FF6347', // Tomato color for the delete button
        padding: 10,
        borderRadius: 5,
    },
});

export default ProductScreen;
