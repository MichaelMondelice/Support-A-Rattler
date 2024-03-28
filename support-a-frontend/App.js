//App.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';
import OptionsScreen from './Screens/OptionsScreen';
import AdminHomeScreen from './Screens/AdminHomeScreen';
import AdminLoginScreen from './Screens/AdminLoginScreen';
import CustomerLoginScreen from './Screens/CustomerLoginScreen';
import CustomerHomeScreen from './Screens/CustomerHomeScreen';
import CustomerSignUpScreen from './Screens/CustomerSignUpScreen';
import EntrepreneurLoginScreen from './Screens/EntrepreneurLoginScreen';
import EntrepreneurHomeScreen from './Screens/EntrepreneurHomeScreen';
import EntrepreneurSignUpScreen from './Screens/EntrepreneurSignUpScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator>

          <Stack.Screen name="User Options" component={OptionsScreen} />
          <Stack.Screen name="AdminLogin" component={AdminLoginScreen} options={{ title: 'Admin Login' }} />
          <Stack.Screen name="AdminHome" component={AdminHomeScreen} options={{ title: 'Admin Home' }} />
          <Stack.Screen name="CustomerLogin" component={CustomerLoginScreen} options={{ title: 'Customer Login' }} />
          <Stack.Screen name="CustomerHome" component={CustomerHomeScreen} options={{ title: 'Customer Home' }} />
          <Stack.Screen name="CustomerSignUp" component={CustomerSignUpScreen} options={{ title: 'Customer Sign Up' }} />
          <Stack.Screen name="EntrepreneurLogin" component={EntrepreneurLoginScreen} options={{ title: 'Entrepreneur Login' }} />
          <Stack.Screen name="EntrepreneurHome" component={EntrepreneurHomeScreen} options={{ title: 'Entrepreneur Home' }} />
          <Stack.Screen name="EntrepreneurSignUp" component={EntrepreneurSignUpScreen} options={{ title: 'Entrepreneur Sign Up' }} />

        </Stack.Navigator>
      </NavigationContainer>

  );

}
