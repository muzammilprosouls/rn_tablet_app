import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import Register from '../screens/Register';
import ForgotPassword from '../screens/ForgotPassword';
import UserNav from './UserNav';


const Stack = createNativeStackNavigator();

const AuthNavigation = () => {
    return (
        <Stack.Navigator initialRouteName='Login' style={{ backgroundColor: "#ffffff" }}>
            {/* <Stack.Screen name="Calender" component={CalenderScreen} /> */}
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen
                name="Root"
                component={UserNav}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
}

export default AuthNavigation