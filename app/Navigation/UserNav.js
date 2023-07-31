import { View, Text, ToastAndroid, Alert, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
} from '@react-navigation/drawer';
import Hindex from '../screens/index'
// import CalenderScreen from '../screens/CalenderScreen';
import Setting from '../screens/Setting';
import { AuthProvider, useAuth } from '../context/auth';
import { useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Entypo, Feather, MaterialCommunityIcons, SimpleLineIcons, AntDesign } from '@expo/vector-icons';
import { CalendarDateProvider } from '../context/calendarDate';
// import Agenda from '../screens/Agenda';
// import CalenderListScreen from '../screens/CalenderListScreen';



const Drawer = createDrawerNavigator();

const UserNav = () => {
    const [auth, setAuth] = useAuth();
    const navigation = useNavigation();
    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('auth');
            setAuth({
                ...auth,
                user: null,
                userId: "",
                token: ''

            });
            if (Platform.OS === 'android') {
                ToastAndroid.show('Logout successfully', ToastAndroid.SHORT);
            } else {
                Alert.alert('Logout successfully');
            }
        } catch (error) {
            console.log('Error during logout:', error);
        }
    };
    return (
        <AuthProvider>
            <CalendarDateProvider>
                <Drawer.Navigator
                    initialRouteName="Home"
                    // useLegacyImplementation
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: '#B9D5FF'
                        },
                        drawerStyle: {
                            backgroundColor: '#B9D5FF',
                            width: 240,
                        },
                    }}

                    drawerContent={props => {
                        return (
                            <DrawerContentScrollView {...props}>
                                <View style={styles.userContainer}>
                                    {/* Render user details */}
                                    <Text style={styles.userName}>{auth.user ? auth.user.name : ''}</Text>
                                    <Text style={styles.userEmail}>{auth.user ? auth.user.email : ''}</Text>
                                </View>
                                <DrawerItem
                                    label="Home"
                                    onPress={() => navigation.navigate('Home')}
                                // icon={({ size, color }) => <Entypo name="home" size={24} color="black" />}
                                />
                                <DrawerItem
                                    label="Calendar"
                                    onPress={() => navigation.navigate('Calender')}
                                // icon={({ color, size }) => <Entypo name="calendar" size={24} color="black" />}
                                />
                                <DrawerItem
                                    label="General"
                                    onPress={() => navigation.navigate('General')}
                                // icon={({ color, size }) => <Feather name="settings" size={24} color="black" />}
                                />
                                <DrawerItem
                                    label="Agenda"
                                    onPress={() => navigation.navigate('Agenda')}
                                // icon={({ color, size }) => <MaterialCommunityIcons name="professional-hexagon" size={24} color="black" />}
                                />
                                <DrawerItem
                                    label="CalenderListScreen"
                                    onPress={() => navigation.navigate('CalenderListScreen')}
                                // icon={({ color, size }) => <MaterialCommunityIcons name="weather-cloudy" size={24} color="black" />}
                                />
                                <DrawerItem
                                    label="Categories"
                                    onPress={() => navigation.navigate('General')}
                                // icon={({ color, size }) => <AntDesign name="folder1" size={24} color="black" />}
                                />
                                <DrawerItem
                                    label="Logout"
                                    onPress={handleLogout}
                                // icon={({ color, size }) => <SimpleLineIcons name="logout" size={24} color="black" />}
                                />
                            </DrawerContentScrollView>
                        )
                    }}
                >
                    <Drawer.Screen name="Home" component={Hindex} />
                    <Drawer.Screen name="Calender" component={Setting} />
                    <Drawer.Screen name="General" component={Setting} />
                    <Drawer.Screen name="Agenda" component={Setting} />
                    <Drawer.Screen name="CalenderListScreen" component={Setting} />
                    <Drawer.Screen name="Categories" component={Setting} />
                </Drawer.Navigator>
            </CalendarDateProvider>
        </AuthProvider>
    )
}

export default UserNav;
const styles = StyleSheet.create({
    userContainer: {
        padding: 16,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    userEmail: {
        fontSize: 16,
        color: '#888',
    },
});