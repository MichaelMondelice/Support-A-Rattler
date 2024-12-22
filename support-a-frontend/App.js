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
import AdminUserStatusScreen from "./Screens/AdminUserStatusScreen";
import AdminReportsScreen from "./Screens/AdminReportsScreen";
import MessagingScreen from "./Screens/MessagingScreen";
import ServicesProductsScreen from "./Screens/ServicesProductsScreen";
import OrdersScreen from './Screens/OrdersScreen';
import SettingsScreen from './Screens/SettingsScreen';
import ServicesScreen from "./Screens/ServicesScreen";
import ProductsScreen from "./Screens/ProductsScreen";
import CustomerSearchScreen from './Screens/CustomerSearchScreen';
import CustomerOrdersScreen from './Screens/CustomerOrdersScreen';
import CustomerAppointmentScreen from './Screens/CustomerAppointmentScreen';
import CustomerAccountScreen from './Screens/CustomerAccountScreen';
import BookingScreen from "./Screens/BookingScreen";
import BookingConfirmationScreen from './Screens/BookingConfirmationScreen';
import ProductDetailsScreen from './Screens/ProductDetailsScreen';
import EntrepreneurAnalyticsScreen from "./Screens/EntrepreneurAnalyticsScreen";
import ConfirmationScreen from './Screens/ConfirmationScreen';
import CustomerMessagesScreen from './Screens/CustomerMessagesScreen';



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
                <Stack.Screen name="AdminReport" component={AdminReportsScreen} options={{title: 'Admin Reports'}} />
                <Stack.Screen name="Messages" component={MessagingScreen} options={{title: 'Messages'}}/>
                <Stack.Screen name="CustomerLogin" component={CustomerLoginScreen} options={{ title: 'Customer Login' }} />
                <Stack.Screen name="CustomerHome" component={CustomerHomeScreen} options={{ title: 'Customer Home' }} />
                <Stack.Screen name="CustomerSignUp" component={CustomerSignUpScreen} options={{ title: 'Customer Sign Up' }} />
                <Stack.Screen name="EntrepreneurLogin" component={EntrepreneurLoginScreen} options={{ title: 'Entrepreneur Login' }} />
                <Stack.Screen name="EntrepreneurHome" component={EntrepreneurHomeScreen} options={{ title: 'Entrepreneur Home' }} />
                <Stack.Screen name="EntrepreneurSignUp" component={EntrepreneurSignUpScreen} options={{ title: 'Entrepreneur Sign Up' }} />
                <Stack.Screen name="EntrepreneurAnalytics" component={EntrepreneurAnalyticsScreen} options={{ title: 'Entrepreneur Analytics' }} />
                <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ title: 'Settings Screen' }} />
                <Stack.Screen name="OrdersScreen" component={OrdersScreen} options={{ title: 'Orders Screen' }} />
                <Stack.Screen name="ServicesProducts" component={ServicesProductsScreen} options={{ title: 'Services/Products' }} />
                <Stack.Screen name="ServicesScreen" component={ServicesScreen} options={{title: 'Services Screen'}} />
                <Stack.Screen name="ProductsScreen" component={ProductsScreen} options={{title: 'Products Screen'}} />
                <Stack.Screen name="CustomerSearchScreen" component={CustomerSearchScreen} options={{title: '  Screen'}}/>
                <Stack.Screen name="CustomerOrdersScreen" component={CustomerOrdersScreen} options={{title: 'Customer Orders Screen'}}/>
                <Stack.Screen name="CustomerAppointmentScreen" component={CustomerAppointmentScreen} options={{title: 'Customer Appointment Screen'}}/>
                <Stack.Screen name="CustomerAccountScreen" component={CustomerAccountScreen} options={{title: 'Customer Account Screen'}}/>
                <Stack.Screen name="BookingScreen" component={BookingScreen} options={{title: 'Booking Screen'}}/>
                <Stack.Screen name="BookingConfirmationScreen" component={BookingConfirmationScreen} options={{ title: 'Booking Confirmation' }}/>
                <Stack.Screen name="ProductDetailsScreen" component={ProductDetailsScreen} options={{title: 'Product Details Screen'}}/>
                <Stack.Screen name="Confirmation" component={ConfirmationScreen} options={{ title: 'Confirmation' }} />
                <Stack.Screen name="CustomerMessages" component={CustomerMessagesScreen} options={{ title: 'Customer Messages' }} />
                <Stack.Screen name="OptionsScreen" component={OptionsScreen} options={{ title: 'Options Screen' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
