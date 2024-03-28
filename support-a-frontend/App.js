import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OptionsScreen from './Screens/OptionsScreen';
import AdminHomeScreen from './Screens/AdminHomeScreen';
import AdminLoginScreen from './Screens/AdminLoginScreen';
import CustomerLoginScreen from './Screens/CustomerLoginScreen';
import CustomerHomeScreen from './Screens/CustomerHomeScreen';
import CustomerSignUpScreen from './Screens/CustomerSignUpScreen';
import EntrepreneurLoginScreen from './Screens/EntrepreneurLoginScreen';
import EntrepreneurHomeScreen from './Screens/EntrepreneurHomeScreen';
import EntrepreneurSignUpScreen from './Screens/EntrepreneurSignUpScreen';
import AdminSearchUsersScreen from './Screens/AdminSearchUsersScreen';
import AdminUserStatusScreen from "./Screens/AdminUserStatusScreen"; // Import AdminSearchUsersScreen

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="UserOptions" component={OptionsScreen} />
                <Stack.Screen name="AdminLogin" component={AdminLoginScreen} options={{ title: 'Admin Login' }} />
                <Stack.Screen name="AdminHome" component={AdminHomeScreen} options={{ title: 'Admin Home' }} />
                <Stack.Screen name="AdminSearch" component={AdminSearchUsersScreen} options={{ title: 'Admin Search' }} />
                <Stack.Screen name="AdminUStatus" component={AdminUserStatusScreen} options={{title: 'Admin User Status'}} />
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
