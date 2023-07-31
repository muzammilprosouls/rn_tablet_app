import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react'
import { View, Text, Button, TouchableOpacity, TouchableHighlight, ToastAndroid, Alert, StyleSheet, Modal, Dimensions } from 'react-native'
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ScrollView, gestureHandlerRootHOC } from 'react-native-gesture-handler';
// import DailyTasks from '../components/DailyTasks';
// import MasterTasks from '../components/MasterTasks';
// import Notes from '../components/Notes';
// import { Ionicons, Entypo, AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/auth';
import clientApi from '../api/clientApi';
import { useTasks } from '../context/Task';
// import Goals from '../components/Goals';
// import Milage from '../components/Milage';
// import ToDoList from '../components/ToDoList';
import Swipeable from 'react-native-swipeable';
import { useDate } from '../context/calendarDate';

const Hindex = () => {
    const currentDate = new Date();
    const [SelectedDate, setSelectedDate] = useDate()
    // console.log("selected", SelectedDate)
    const navigation = useNavigation();
    const [auth] = useAuth();
    const { userId } = auth;
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const [loading, setLoading] = useState(true);
    const currentWeekday = currentDate.getDay();
    const daysArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = daysArray[currentWeekday];
    const currentDay = currentDate.getDate();
    const { tasks, updateTasks } = useTasks();
    const [fullscreen, setFullscreen] = useState({ status: false, width: '50%', display: 'flex' })
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const [appointmentModal, setAppointmentModal] = useState(false);
    const [dropdown, setDropDown] = useState(false);
    const [priority, setPriority] = useState("Low")
    const Tab = createMaterialTopTabNavigator();
    // const toggleDropdown = () => {
    //     setDropDown(!dropdown);
    // };
    // const renderDropdown = () => {
    //     if (dropdown) {
    //         return (
    //             <View style={styles.dropdownContainer}>
    //                 <TouchableOpacity onPress={() => handleStatusSelection('High')} style={styles.prioritiesTO}>
    //                     <Text style={styles.dropdown}>
    //                         High
    //                     </Text>
    //                 </TouchableOpacity>
    //                 <TouchableOpacity onPress={() => handleStatusSelection('Medium')} style={styles.prioritiesTO}>
    //                     <Text style={styles.dropdown}>
    //                         Medium
    //                     </Text>
    //                 </TouchableOpacity>
    //                 <TouchableOpacity onPress={() => handleStatusSelection('Low')} style={styles.prioritiesTO}>
    //                     <Text style={styles.dropdown}>
    //                         Low
    //                     </Text>
    //                 </TouchableOpacity>
    //             </View>
    //         );
    //     }
    // };
    // const CustomTabBar = ({ state, descriptors, navigation }) => {
    //     return (
    //         <ScrollView
    //             horizontal
    //             showsHorizontalScrollIndicator={false}
    //             style={{ flexDirection: 'row', flexGrow: 0.001, backgroundColor: 'white', borderTopLeftRadius: 20, borderTopWidth: 1, borderTopColor: 'black' }}>
    //             {state.routes.map((route, index) => {
    //                 const { options } = descriptors[route.key];
    //                 const label = options.tabBarLabel || route.name;

    //                 let tabColor;
    //                 if (index === state.index) {
    //                     // Active tab color
    //                     tabColor = options.activeBackgroundColor || 'blue';
    //                 } else {
    //                     // Inactive tab color
    //                     tabColor = options.inactiveBackgroundColor || 'red';
    //                 }

    //                 return (
    //                     <TouchableOpacity
    //                         key={route.key}
    //                         onPress={() => navigation.navigate(route.name)}
    //                         style={{ flex: 1, paddingVertical: 16, alignItems: 'center', backgroundColor: tabColor, width: 145 }}
    //                     >
    //                         <Text style={{ fontSize: 15, fontWeight: '700', color: 'white' }}>{label}</Text>
    //                     </TouchableOpacity>
    //                 );
    //             })}
    //         </ScrollView>
    //     );
    // };
    // const calendarScreen = () => {

    //     navigation.navigate('Calender');
    // };
    const windowH = Dimensions.get('window').height;

    useEffect(() => {
        const fetchUserTasks = async () => {
            try {
                const userId = auth.user?._id;
                if (!userId) {
                    setLoading(false);
                    return;
                }

                const res = await clientApi.get(
                    `/api/v1/tasks/user-tasks/${userId}`
                );

                updateTasks(res.data);
                // const dateStringFromParams = res.data[0].date
                // const year = dateStringFromParams.slice(0, 4);
                // const month = dateStringFromParams.slice(5, 7);
                // const day = dateStringFromParams.slice(8, 10);
                // const formattedDate = `${year}-${month}-${day}`;

                // console.log("ddddd", formattedDate)
                setLoading(false);
            } catch (error) {
                console.log('Error fetching user Tasks:', error);
                setLoading(false);
                ToastAndroid.show("Error fetching user Tasks");
            }
        };

        fetchUserTasks();
    }, [auth]);

    // const Low = { color: 'green' };
    // const medium = { color: 'orange' };
    // const high = { color: 'red' };

    // const marked = {
    //     [SelectedDate]: {
    //         selected: true,
    //         disableTouchEvent: true,
    //         selectedColor: '#B9D5FF',
    //         selectedTextColor: 'black',
    //     },
    // };

    // for (let i = 0; i < tasks.length; i++) {
    //     const { date, priority } = tasks[i];
    //     const dateStringFromParams = date;
    //     const year = dateStringFromParams.slice(0, 4);
    //     const month = dateStringFromParams.slice(5, 7);
    //     const day = dateStringFromParams.slice(8, 10);
    //     const formattedDate = `${year}-${month}-${day}`;
    //     const priorityDot = priority === 'Low' ? Low : priority === 'Medium' ? medium : high;

    //     if (marked[formattedDate]) {
    //         // Date already exists in 'marked' object
    //         if (marked[formattedDate].dots) {
    //             // 'dots' array already exists, push the new dot
    //             marked[formattedDate].dots.push(priorityDot);
    //         } else {
    //             // 'dots' array doesn't exist, create it and add the new dot
    //             marked[formattedDate].dots = [priorityDot];
    //         }
    //     } else {
    //         // Date doesn't exist in 'marked' object, create a new entry with the dot
    //         marked[formattedDate] = {
    //             dots: [priorityDot],
    //         };
    //     }
    // }




    const handleDelete = async (taskId) => {
        try {
            const res = await clientApi.delete(
                `/api/v1/tasks/remove-task/${taskId}`,
            );
            if (res && res.data.success) {
                const updatedRes = await clientApi.get(`/api/v1/tasks/user-tasks/${userId}`);
                const updatedTasks = updatedRes.data;
                // ToastAndroid.show(res.data.message, ToastAndroid.SHORT);
                if (Platform.OS === 'android') {
                    ToastAndroid.show('Task Deleted successfully', ToastAndroid.SHORT);
                } else {
                    Alert.alert('Task Deleted successfully');
                }
                updateTasks(updatedTasks);
            } else {
                if (Platform.OS === 'android') {
                    ToastAndroid.show(res.data.message, ToastAndroid.SHORT);
                } else {
                    Alert.alert(res.data.message);
                }
            }
        } catch (error) {
            console.log(error.message);
            if (Platform.OS === 'android') {
                ToastAndroid.show("Something Went Wrong", ToastAndroid.SHORT);
            } else {
                Alert.alert("Something Went Wrong");
            }
        }
    }
    // const openTabBasedOnCategory = ({ category, _id, text, title, paths, recordings, image, date, priority }) => {
    //     let tabName = '';


    //     switch (category) {
    //         case 'DailyTasks':
    //             tabName = 'DailyTasks';
    //             break;
    //         case 'MasterTasks':
    //             tabName = 'MasterTasks';
    //             break;
    //         case 'Notes':
    //             tabName = 'Notes';
    //             break;
    //         case 'Goals':
    //             tabName = 'Goals';
    //             break;
    //         case 'Milage':
    //             tabName = 'Milage';
    //             break;
    //         case 'ToDoList':
    //             tabName = 'ToDoList';
    //             break;
    //     }
    //     navigation.navigate(tabName, { id: _id, text: text, title: title, paths: paths, recordings: recordings, image: image, date: date, priority: priority });
    // }
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High':
                return 'red';
            case 'Medium':
                return 'orange';
            case 'Low':
                return 'green';
            default:
                return 'grey'; // default to grey for unknown priorities
        }
    };
    const EmptyScreen = () => {
        return (
            <View>
                <Text>Hello World</Text>
            </View>
        )
    }
    // const leftContent = <Text>Pull to activate</Text>;

    // const rightButtons = [
    //     <TouchableHighlight onPress={{}} style={{ height: 40, backgroundColor: "red", justifyContent: 'center', alignContent: 'center', textAlign: 'center', borderTopRightRadius: 5, borderRadius: 5 }}><Text style={{ color: 'white', textAlign: 'justify', marginLeft: 10 }}>Delete</Text></TouchableHighlight>,

    // ];
    return (
        <View style={{ flexDirection: "row", width: "100%", height: '100%' }}>


            <View style={{ flexDirection: 'column', height: "100%", width: "50%", backgroundColor: 'white', display: fullscreen.display }}>
                <ScrollView>
                    <View style={{ flexDirection: "row", justifyContent: 'space-evenly' }}>
                        <View style={{ marginLeft: windowH / 108 }}>
                            <Text style={{ fontSize: windowH / 7.2, textAlign: 'center', fontWeight: '700' }}>{currentDay}</Text>
                            <Text style={{ fontSize: windowH / 35, fontWeight: '700', textAlign: 'center' }}>
                                {dayName}
                            </Text>
                            <Text style={{ fontSize: windowH / 28, fontWeight: '700', textAlign: 'center' }}>{currentMonth} {currentDate.getFullYear()}</Text>
                        </View>
                        <View style={{ height: '25%', flexDirection: 'row' }}>
                            <View style={{ flexDirection: "column", height: 320, justifyContent: 'flex-end' }}>
                                <TouchableOpacity style={{ justifyContent: 'flex-end', paddingBottom: 10 }}
                                // onPress={calendarScreen}
                                >
                                    {/* <Ionicons name="add-circle-outline" size={40} color="red" /> */}
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: "column", height: 250, justifyContent: 'center' }}>
                                <Calendar
                                    theme={{
                                        calendarBackground: '#ffffff',
                                        todayTextColor: '#00adf5',
                                        dayTextColor: '#2d4150',
                                        textDisabledColor: '#d9e1e8',
                                        monthTextColor: '#2d4150',
                                        textDayFontSize: 12,
                                        textMonthFontSize: 12,
                                        textDayHeaderFontSize: 10,
                                        rowGap: 2,

                                    }}
                                    hideExtraDays

                                    onDayPress={day => {
                                        setSelectedDate(day.dateString);
                                    }}
                                    headerStyle={{
                                        height: '25%',
                                        rowGap: 0,
                                        columnGap: 1,


                                    }}
                                    markingType='multi-dot'
                                    markedDates={{
                                        // marked
                                        [SelectedDate]: { selected: true, disableTouchEvent: true, selectedColor: '#B9D5FF', selectedTextColor: 'black' }
                                    }}
                                    style={{

                                        // borderColor: 'black',
                                        // borderWidth: 1,
                                        rowGap: 0,
                                        borderRadius: 15,
                                        paddingBottom: 1,
                                        height: '100%',
                                        width: 250,
                                        marginBottom: 10,


                                    }}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", height: "66.5%" }}>
                        <View style={{ flexDirection: "column", height: "100%", width: "100%" }}>
                            <SafeAreaView style={{ paddingLeft: 8, paddingRight: 10, height: '100%' }}>
                                <View style={[styles.cont, { height: "100%" }]}>
                                    <View style={styles.headingcontainer}>
                                        <View style={{ flex: 15, alignItems: 'center' }}>
                                            <Text style={styles.heading}>Appointments</Text>
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 5 }}>
                                            <TouchableOpacity onPress={() => setAppointmentModal(true)}>
                                                {/* <MaterialCommunityIcons name="dots-horizontal-circle-outline" size={35} color="white" /> */}
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <ScrollView style={styles.innerContainer}>
                                        {tasks.map((task) => (
                                            <Swipeable rightButtons={[
                                                <TouchableHighlight onPress={() => handleDelete(task._id)} style={{ height: 40, backgroundColor: "red", justifyContent: 'center', borderTopRightRadius: 5, borderRadius: 5 }}>
                                                    <View style={{ paddingLeft: "5%" }}>
                                                        {/* <AntDesign name="delete" size={24} color="white" /> */}
                                                        <Text>Delete</Text>
                                                    </View>
                                                </TouchableHighlight>,

                                            ]}
                                                useNativeDriver={true} >
                                                <View style={{ paddingBottom: 10 }} key={task._id}>
                                                    <TouchableOpacity style={styles.button} onPress={() => openTabBasedOnCategory(task)}>
                                                        <View style={styles.textContainer}>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                <View
                                                                    style={{
                                                                        width: 10,
                                                                        height: 10,
                                                                        borderRadius: 5,
                                                                        backgroundColor: getPriorityColor(task.priority),
                                                                        // marginRight: 10,
                                                                    }}
                                                                />
                                                                <Text style={styles.taskName}>{task.title}</Text>
                                                            </View>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                <Text style={styles.taskName}>{task.category}</Text>
                                                                <Text style={styles.time}>{new Date(task.date).toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' })} {new Date(task.updatedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</Text>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            </Swipeable>
                                        ))}
                                    </ScrollView>
                                </View>
                            </SafeAreaView>
                        </View>
                    </View >
                </ScrollView>
            </View >

            {fullscreen.status == false ? (
                <TouchableOpacity
                    style={{
                        borderWidth: 1,
                        borderColor: 'red',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 50,
                        position: 'absolute',
                        zIndex: 99999999,
                        // top: windowH / 1.22,
                        bottom: 60,
                        right: 20,
                        height: 50,
                        backgroundColor: '#B9D5FF',
                        borderRadius: 100,
                    }}
                    onPress={() => { setFullscreen({ status: true, width: '100%', display: 'none' }) }}
                >
                    {/* <Entypo name="resize-full-screen" size={30} color="black" /> */}
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    style={{
                        borderWidth: 1,
                        borderColor: 'red',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 50,
                        position: 'absolute',
                        zIndex: 99999999,
                        // top: windowH / 1.23,
                        bottom: 60,
                        right: 20,
                        height: 50,
                        backgroundColor: '#B9D5FF',
                        borderRadius: 100,
                    }}
                    onPress={() => { setFullscreen({ status: false, width: '60%', display: 'flex' }) }}
                >
                    {/* <Entypo name="resize-100" size={30} color="black" /> */}
                </TouchableOpacity>
            )
            }

            <View style={
                { flexDirection: 'column', width: fullscreen.width }
            }>
                <View>
                    <View style={styles.tabcont}>
                        <Tab.Navigator initialRouteName={"DailyTasks"}

                            screenOptions={{
                                tabBarScrollEnabled: true,
                                swipeEnabled: false,
                                tabBarActiveTintColor: 'white',
                                tabBarLabelStyle: { fontSize: 10 },
                                tabBarStyle: {
                                    backgroundColor: 'grey',
                                    // borderRadius: 2,
                                    borderTopLeftRadius: 10,
                                    borderTopRightRadius: 10,
                                    borderTopWidth: 1,
                                    borderTopColor: 'black',
                                },
                                tabBarItemStyle: {
                                    width: 200,

                                }
                            }}
                            style={styles.heading}

                        >
                            <Tab.Screen name="DailyTasks" component={EmptyScreen}
                            />
                            {/* <Tab.Screen name="MasterTasks" component={MasterTasks}
                            /> */}
                            {/* <Tab.Screen name="Practice" component={Practice} /> */}
                            {/* <Tab.Screen name="Notes" component={Notes} />

                            <Tab.Screen name="Goals" component={AttachmentBtn} />
                            <Tab.Screen name="Milage" component={Draw} />
                            <Tab.Screen name="ToDoList" component={Zoom} /> */}
                        </Tab.Navigator>
                    </View>
                </View>
            </View>
            <View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={appointmentModal}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setAppointmentModal(!appointmentModal);
                    }}>
                    <View style={styles.centeredView} onTouchEnd={() => setAppointmentModal(false)}>
                        <View style={styles.modalView}>
                            <View style={styles.modalheading}>
                                <Text style={{ textAlign: 'right', fontSize: 18, fontWeight: 500 }}>Filtering & Sorting</Text>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => setAppointmentModal(!appointmentModal)}
                                >
                                    {/* <AntDesign name="close" size={24} color="black" /> */}
                                </TouchableOpacity>
                            </View>
                            <View style={styles.prioritydropdown}>
                                <Text>Filter:</Text>
                                <TouchableOpacity
                                    style={styles.DropDownbtn}
                                // onPress={toggleDropdown}
                                >
                                    <Text style={styles.buttonText}>{priority}</Text>
                                    {/* <MaterialIcons name="arrow-drop-down" size={24} color="black" /> */}
                                </TouchableOpacity>
                            </View>
                            {/* {renderDropdown()} */}
                            <View style={styles.prioritydropdown}>
                                <Text>Filter:</Text>
                                <TouchableOpacity
                                    style={styles.DropDownbtn}
                                // onPress={toggleDropdown}
                                >
                                    <Text style={styles.buttonText}>{priority}</Text>
                                    {/* <MaterialIcons name="arrow-drop-down" size={24} color="black" /> */}
                                </TouchableOpacity>
                            </View>
                            {/* {renderDropdown()} */}

                            <TouchableOpacity
                                style={[styles.appointmentModalbutton, styles.buttonClose]}
                                onPress={{}}>
                                <Text style={styles.textStyle}>
                                    save
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </View >

    )
}

export default gestureHandlerRootHOC(Hindex)

const styles = {
    container: {
        flex: 2, // the number of columns you want to devide the screen into
        marginHorizontal: "auto",
        // width: '40%',
        backgroundColor: 'white'
    }, textContainer2: {
        opacity: 1,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingHorizontal: 20,
        paddingTop: 16,
        flex: 1,
    },
    container1: {
        flex: 1.2, // the number of columns you want to devide the screen into
        marginHorizontal: "auto",
        // width: '60%',
        backgroundColor: 'white',
        justifyContent: 'center'
    },
    containerrt: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: "auto",
        width: '100%',
        backgroundColor: 'white'
    },
    row: {
        flexDirection: "row"
    },
    "1col": {
        // backgroundColor: "red",
        // borderColor: "#fff",
        // borderWidth: 1,
        flex: 1,
    },
    "2col": {
        // borderColor: "black",
        // borderWidth: 1,
        flex: 2,
    },
    button: {
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
        borderRadius: 5,
    },
    textContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textContainer1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    taskName: {
        fontWeight: 'bold',
        // marginRight: 10, // Add some spacing between the texts
        paddingHorizontal: 10
    },
    time: {
        fontStyle: 'italic',
    },
    cont: {
        borderWidth: 1, // Set the border width
        borderColor: 'black', // Set the border color
        borderRadius: 5, // Set the border radius
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        // height: '79.5%'

    },
    tabcont: {
        borderWidth: 1, // Set the border width
        borderColor: 'black', // Set the border color
        // borderTopLeftRadius: 5, // Set the border radius
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20,
        // borderTopRightRadius: 20,
        height: '100%',
        width: "100%"

    },
    can: {
        borderWidth: 1, // Set the border width
        borderColor: 'black', // Set the border color
        borderRadius: 5, // Set the border radius
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 300
    },
    headingcontainer: {
        flexDirection: 'row',
        backgroundColor: 'grey',
        height: 40,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        textAlign: "center",

    },
    innerContainer: {
        paddingTop: 10,
        marginHorizontal: 10,
        color: 'black',
    },
    // containerright: {

    // },
    tabBarContainer: {
        flexDirection: 'row',
        backgroundColor: 'grey',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderTopWidth: 1,
        borderTopColor: 'black',
        height: 50
    },
    tabBarItem: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: 'center',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderTopWidth: 1,
        borderTopColor: 'black',

    },
    tabBarText: {
        fontSize: 15,
        fontWeight: '700',
    },
    centeredView: {
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'flex-start',
        paddingTop: 70,
        // paddingLeft: 10,
        // paddingRight: 10,
        // width: "78.3%"
    },
    modalView: {
        // backgroundColor: 'red',
        alignItems: 'center',
        // margin: 20,
        width: "50%",
        height: "100%",
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        paddingBottom: 10
    },
    modalheading: {
        flexDirection: 'row',
        // borderTopRightRadius: 20,
        padding: 20,
        // paddingVertical: 10,
        // borderTopLeftRadius: 20,
        backgroundColor: '#B9D5FF',
        width: "100%",
        justifyContent: 'center'
        // right: 52
    },
    closeButton: {
        // alignItems: 'flex-end',
        position: 'absolute',
        top: 10,
        right: 10,
        // backgroundColor: 'red',


    },

    appointmentModalbutton: {
        paddingVertical: 10,
        paddingHorizontal: '10%',
        elevation: 2,
        borderRadius: 10,
        // width: '30%'

    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#B9D5FF',
    },
    textStyle: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        borderRadius: 5,
        marginTop: 15,
        textAlign: 'center',
        borderWidth: 2,
        // borderBottomWidth: 2,
        borderColor: '#B9D5FF',
        width: "50%",
        padding: 5,
        fontSize: 20,

    },
    prioritydropdown: {
        padding: 20
    },
    DropDownbtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // height: 35,
        width: '50%',
        zIndex: 1,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#B9D5FF',
        padding: 5,
        fontSize: 20,
    },
    buttonText: {
        flex: 1,
        textAlign: 'center',
    },
    dropdownContainer: {
        position: 'absolute',
        top: 215, // Adjust this value to control the dropdown position relative to TouchableOpacity
        left: 157,
        right: 0,
        backgroundColor: '#B9D5FF',
        width: "50%",
        zIndex: 2,
    },
    prioritiesTO: {
        borderBottomWidth: 1,
    },
    dropdown: {
        alignItems: 'center',
        padding: 10,
        color: 'black',
        textAlign: 'center',
    },
};
const calendarStyles = StyleSheet.create({
    dayText: {
        fontSize: 18.2,
        marginTop: 0,
    },
})
// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const Hindex = () => {
//     return (
//         <View>
//             <Text>Home</Text>
//         </View>
//     )
// }

// export default Hindex

// const styles = StyleSheet.create({})