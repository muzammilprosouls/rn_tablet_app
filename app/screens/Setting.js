// import { View, ImageBackground, TextInput, Text, TouchableOpacity, PanResponder, Animated, StyleSheet, Modal, Alert, ToastAndroid, Button, Dimensions, Image, KeyboardAvoidingView, Settings } from 'react-native'
// import React, { useRef, useEffect, useState } from 'react'
// import { useAuth } from "../context/auth";
// import clientApi from '../api/clientApi';
// import { useTasks } from '../context/Task';
// import * as ImagePicker from 'expo-image-picker';
// import { Audio } from 'expo-av';
// import { Entypo } from '@expo/vector-icons';
// import { AntDesign } from '@expo/vector-icons';
// import { PinchGestureHandler, State, ScrollView, PanGestureHandler } from 'react-native-gesture-handler';
// import * as MediaLibrary from 'expo-media-library';
// import * as Sharing from 'expo-sharing';
// import { MaterialIcons } from '@expo/vector-icons';
// import { FontAwesome } from '@expo/vector-icons';
// import { FontAwesome5 } from '@expo/vector-icons';
// import Svg, { Path } from 'react-native-svg';
// import * as FileSystem from 'expo-file-system';

// const Setting = ({ route }) => {
//     const Data = route.params;
//     const [currentPath, setCurrentPath] = useState([]);
//     const [paths, setPaths] = useState([]);
//     const [zoomScale, setZoomScale] = useState(1);
//     const [text, setText] = useState('');
//     const [modalVisible, setModalVisible] = useState(false);
//     const [title, setTitle] = useState('');
//     const [category, setCategory] = useState('');
//     const [auth] = useAuth();
//     const { userId, token } = auth;
//     const [recording, setRecording] = useState();
//     const [recordings, setRecordings] = useState([]);
//     const [message, setMessage] = useState("");
//     const [isTextInputEnabled, setIsTextInputEnabled] = useState(false);
//     const [image, setImage] = useState([]);
//     // console.log(image)
//     const movePan = useRef(new Animated.ValueXY()).current;
//     const resizePan = useRef(new Animated.ValueXY()).current;
//     const { updateTasks } = useTasks();
//     const windowWidth = Dimensions.get('window').width;
//     const windowHeight = Dimensions.get('window').height;
//     const { height, width } = Dimensions.get('window');
//     const scale = React.useRef(new Animated.Value(1)).current;
//     const HandlePinch = new Animated.event(
//         [{ nativeEvent: { scale: scale } }]
//         ,
//         {
//             useNativeDriver: false
//         })
//     const handleSave = async () => {
//         try {
//             if (!userId) {
//                 console.log('userId is null', userId);
//                 setModalVisible(false)
//                 alert("User ID is missing");
//                 console.log(auth)
//                 return;
//             } else {
//                 const headers = {
//                     Authorization: token
//                 };
//                 const res = await clientApi.post('/api/v1/tasks/create',
//                     { title, category, text, userId, paths, recordings, image },
//                     { headers }
//                 );
//                 setModalVisible(!modalVisible)
//                 if (res && res.data.success) {
//                     const updatedRes = await clientApi.get(`/api/v1/tasks/user-tasks/${userId}`);
//                     const updatedTasks = updatedRes.data;
//                     ToastAndroid.show(res.data.message, ToastAndroid.SHORT);
//                     updateTasks(updatedTasks);
//                 } else {
//                     ToastAndroid.show(res.data.message, ToastAndroid.SHORT);
//                 }
//             }
//             setModalVisible(false)
//         } catch (error) {
//             setModalVisible(!modalVisible)
//             console.log(error.message);
//             ToastAndroid.show("Something went wrong");
//             setModalVisible(false)

//         }
//     }
//     const handleToggleInput = () => {
//         setIsTextInputEnabled((prevIsTextInputEnabled) => !prevIsTextInputEnabled);
//     };
//     const pickImage = async () => {
//         let result;
//         // Ask the user if they want to take a photo or choose from their library
//         const option = await new Promise((resolve) => {
//             Alert.alert(
//                 'Choose an option',
//                 'Would you like to take a photo or choose from your library?',
//                 [
//                     { text: 'Take Photo', onPress: () => resolve('takePhoto') },
//                     { text: 'Choose from Library', onPress: () => resolve('chooseFromLibrary') },
//                     { text: 'Cancel', onPress: () => resolve(null), style: 'cancel' },
//                 ],
//                 { cancelable: false },
//             );
//         });

//         if (option === 'takePhoto') {
//             const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
//             if (permissionResult.granted === false) {
//                 alert("You've refused to allow this app to access your photos!");
//             }
//         }

//         if (option === 'takePhoto') {
//             result = await ImagePicker.launchCameraAsync({
//                 allowsEditing: true,
//                 allowsMultipleSelection: true,
//                 aspect: [4, 3],
//                 quality: 1,
//             });
//         } else if (option === 'chooseFromLibrary') {
//             result = await ImagePicker.launchImageLibraryAsync({
//                 mediaTypes: ImagePicker.MediaTypeOptions.All,
//                 allowsEditing: true,
//                 aspect: [4, 3],
//                 quality: 1,
//             });
//         }

//         if (result && !result.canceled) {
//             setImage((prevImages) => {
//                 const newImages = [...prevImages];
//                 newImages.push({ image: result.assets[0].uri, width: 200, height: 200 });
//                 return newImages;
//             });
//         }
//     };
//     const removeImage = (index) => {
//         // Remove the image at the specified index from the images array
//         setImage((prevImages) => {
//             const updatedImages = [...prevImages];
//             updatedImages.splice(index, 1);
//             return updatedImages;
//         });
//     };

//     async function startRecording() {
//         try {
//             const permission = await Audio.requestPermissionsAsync();

//             if (permission.status === "granted") {
//                 await Audio.setAudioModeAsync({
//                     allowsRecordingIOS: true,
//                     playsInSilentModeIOS: true
//                 });

//                 const { recording } = await Audio.Recording.createAsync(
//                     Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
//                 );

//                 setRecording(recording);
//             } else {
//                 setMessage("Please grant permission to app to access microphone");
//             }
//         } catch (err) {
//             console.error('Failed to start recording', err);
//         }
//     }
//     async function stopRecording() {
//         setRecording(undefined);
//         await recording.stopAndUnloadAsync();

//         let updatedRecordings = [...recordings];
//         const { sound, status } = await recording.createNewLoadedSoundAsync();
//         updatedRecordings.push({
//             sound: sound,
//             duration: getDurationFormatted(status.durationMillis),
//             file: recording.getURI()
//         });

//         setRecordings(updatedRecordings);
//     }

//     function getDurationFormatted(millis) {
//         const minutes = millis / 1000 / 60;
//         const minutesDisplay = Math.floor(minutes);
//         const seconds = Math.round((minutes - minutesDisplay) * 60);
//         const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
//         return `${minutesDisplay}:${secondsDisplay}`;
//     }
//     function RecordingLine({ recordingLine, index, onRemove }) {
//         const [isPlaying, setIsPlaying] = useState(false);
//         const sound = recordingLine.sound;

//         const handlePlaybackToggle = async () => {
//             if (isPlaying) {
//                 // Pause the playback
//                 await sound.pauseAsync();
//             } else {
//                 // Start or resume the playback
//                 await sound.playAsync();
//             }
//             setIsPlaying(!isPlaying);
//         };

//         // Add this useEffect hook to reset the playback when it reaches the end
//         useEffect(() => {
//             const updatePlaybackStatus = async (status) => {
//                 if (status.didJustFinish) {
//                     setIsPlaying(false);
//                     await sound.setPositionAsync(0);
//                 }
//             };

//             const subscription = sound.setOnPlaybackStatusUpdate(updatePlaybackStatus);

//             return () => {
//                 if (subscription) {
//                     subscription.remove();
//                 }
//             };
//         }, [sound]);
//         const handleRemove = () => {
//             onRemove(index);
//         };
//         return (
//             <View style={styles.row}>
//                 <Text style={{ fontWeight: 'bold' }}>Recording {index + 1} - {recordingLine.duration}</Text>
//                 <TouchableOpacity style={styles.button} onPress={handlePlaybackToggle} >{isPlaying ? <AntDesign name="pausecircle" size={30} color="black" /> : <AntDesign name="play" size={30} color="black" />}</TouchableOpacity>
//                 <TouchableOpacity style={styles.button} onPress={() => Sharing.shareAsync(recordingLine.file)}><Entypo name="share" size={30} color="black" /></TouchableOpacity>
//                 <TouchableOpacity style={styles.button} onPress={handleRemove} ><MaterialIcons name="remove-circle" size={30} color="black" /></TouchableOpacity>
//             </View>
//         );
//     }
//     function getRecordingLines() {
//         const handleRemoveRecording = (index) => {
//             const updatedRecordings = [...recordings];
//             updatedRecordings.splice(index, 1);
//             setRecordings(updatedRecordings);
//         };
//         return recordings.map((recordingLine, index) => {
//             return <RecordingLine
//                 key={index}
//                 recordingLine={recordingLine}
//                 index={index}
//                 sound={recordingLine.sound}
//                 onRemove={handleRemoveRecording}
//             />;
//         });
//     }
//     useEffect(() => {
//         if (route.params && route.params.desc) {
//             setText(route.params.desc);
//             setTitle(route.params.head);
//             setPaths(route.params.paths);
//             setImage(route.params.image);

//         }
//     }, [route.params]);
//     const movePanResponders = image.map(() => {
//         const movePan = new Animated.ValueXY();

//         const movePanResponder = PanResponder.create({
//             onStartShouldSetPanResponder: () => true,
//             onPanResponderMove: Animated.event([
//                 null,
//                 { dx: movePan.x, dy: movePan.y }
//             ],
//                 { useNativeDriver: false }),
//             onPanResponderRelease: () => {
//                 movePan.flattenOffset();
//             },
//             onPanResponderGrant: () => {
//                 movePan.setOffset({
//                     x: movePan.x._value,
//                     y: movePan.y._value
//                 });
//             }
//         });

//         return { movePan, movePanResponder }; // Return an object containing movePan and movePanResponder
//     });
//     const resizeHandleResponders = image.map((size, index) => {
//         return PanResponder.create({
//             onStartShouldSetPanResponder: () => true,
//             onPanResponderMove: (_, gesture) => {
//                 const { dx, dy } = gesture;
//                 const newWidth = size.width + dx;
//                 const newHeight = size.height + dy;

//                 setImage((prevSizes) => {
//                     const newSizes = [...prevSizes];
//                     newSizes[index] = {
//                         width: newWidth > 50 ? newWidth : prevSizes[index].width,
//                         height: newHeight > 50 ? newHeight : prevSizes[index].height,
//                     };
//                     return newSizes;
//                 });
//             },
//         });
//     });
//     const reverseLastPath = () => {
//         if (paths.length > 0) {
//             const updatedPaths = [...paths];
//             updatedPaths.pop(); // Remove the last path from the array
//             setPaths(updatedPaths);
//         }
//     };
//     const onTouchMove = (event) => {
//         if (event.nativeEvent.touches.length === 1) {
//             const newPath = [...currentPath];

//             // get current user touches position
//             const locationX = event.nativeEvent.locationX;
//             const locationY = event.nativeEvent.locationY;

//             // create new point
//             const newPoint = `${newPath.length === 0 ? 'M' : ''}${locationX.toFixed(0)},${locationY.toFixed(0)} `;

//             // add the point to older points
//             newPath.push(newPoint);
//             setCurrentPath(newPath);
//         }
//     };

//     const onTouchEnd = () => {

//         const currentPaths = [...paths];
//         const newPath = [...currentPath];

//         // push new path with old path and clean current path state
//         currentPaths.push(newPath);
//         setPaths(currentPaths);
//         setCurrentPath([]);

//     };
//     // const onPinchGestureEvent = (event) => {
//     //     setZoomScale(event.nativeEvent.scale);
//     // };

//     // const onPinchHandlerStateChange = (event) => {
//     //     if (event.nativeEvent.state === State.END) {
//     //         if (zoomScale < 1) {
//     //             setZoomScale(1);
//     //         }
//     //     }
//     // };

//     return (
//         <KeyboardAvoidingView style={{
//             flex: 1,
//             backgroundColor: 'white',
//             height: "100%"
//         }}>
//             <PinchGestureHandler
//                 onGestureEvent={HandlePinch}
//             // onHandlerStateChange={onPinchHandlerStateChange}
//             >
//                 <Animated.View style={{
//                     flex: 1,
//                     transform: [{ scale: scale }]
//                 }}>
//                     <ScrollView
//                         contentContainerStyle={styles.scrollViewContentContainer}
//                         maximumZoomScale={2}
//                         minimumZoomScale={1}
//                         scrollEnabled={false}
//                         style={{ overflow: 'hidden' }}
//                         nestedScrollEnabled={true}
//                     >

//                         <ImageBackground source={require('../../assets/table1.png')} style={{
//                             width: '100%',
//                             height: windowHeight / 1.3,
//                             zIndex: 99999999999
//                         }}
//                             resizeMode="stretch" >

//                             {isTextInputEnabled ? (
//                                 <>
//                                     <TextInput
//                                         value={text}
//                                         onChangeText={(newtext) => setText(newtext)}
//                                         autoFocus
//                                         multiline
//                                         editable
//                                         style={styles.textcontainer} />
//                                     <Svg height={height} width={width}>
//                                         {paths.length > 0 &&
//                                             paths.map((item, index) => (
//                                                 <Path
//                                                     key={`path-${index}`}
//                                                     d={item.join('')}
//                                                     stroke={'black'}
//                                                     fill={'transparent'}
//                                                     strokeWidth={5}
//                                                     strokeLinejoin={'round'}
//                                                     strokeLinecap={'round'}
//                                                 />
//                                             ))}
//                                     </Svg>
//                                 </>) : (<View style={{ width: "100%", height: "100%" }}>
//                                     <Text style={styles.textcontainer}>{text} </Text>
//                                     <View style={styles.svgContainer} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
//                                         <Svg height={height} width={width}>
//                                             <Path
//                                                 d={currentPath.join('')}
//                                                 stroke={'black'}
//                                                 fill={'transparent'}
//                                                 strokeWidth={5}
//                                                 strokeLinejoin={'round'}
//                                                 strokeLinecap={'round'}
//                                             />

//                                             {paths.length > 0 &&
//                                                 paths.map((item, index) => (
//                                                     <Path
//                                                         key={`path-${index}`}
//                                                         d={item.join('')}
//                                                         stroke={'black'}
//                                                         fill={'transparent'}
//                                                         strokeWidth={5}
//                                                         strokeLinejoin={'round'}
//                                                         strokeLinecap={'round'}
//                                                     />
//                                                 ))}
//                                         </Svg>
//                                     </View>

//                                 </View>)}
//                             <View style={[styles.btncontainer]}>

//                                 {image && image.length > 0 ? (
//                                     <>
//                                         {image.map((data, index) => (
//                                             <View key={index}>
//                                                 <Animated.View
//                                                     style={[
//                                                         styles.imageWrapper,
//                                                         {
//                                                             width: image[index].width,
//                                                             height: image[index].height,
//                                                             transform: [
//                                                                 { translateX: movePan.x },
//                                                                 { translateY: movePan.y },
//                                                             ],
//                                                         },
//                                                         movePanResponders[index].movePan.getLayout()
//                                                     ]}
//                                                     {...movePanResponders[index].movePanResponder.panHandlers}
//                                                 >
//                                                     <View
//                                                         style={styles.resizeHandle}
//                                                         {...resizeHandleResponders[index].panHandlers} // Use the appropriate panHandlers for each image
//                                                     />
//                                                     <Image source={{ uri: data.image }} style={styles.image} />
//                                                     <TouchableOpacity onPress={() => removeImage(index)} style={styles.removeButton}>
//                                                         <FontAwesome name="remove" size={30} color="#B9D5FF" />
//                                                     </TouchableOpacity>
//                                                 </Animated.View>
//                                             </View>
//                                         ))}
//                                     </>
//                                 ) : null}

//                             </View>
//                             <View
//                                 style={[
//                                     styles.btncontainer,
//                                     {
//                                         marginLeft: "70%"
//                                     },
//                                 ]}
//                             >

//                                 <View style={{ flexDirection: 'column', justifyContent: 'flex-end', padding: 5, }}>
//                                     {getRecordingLines()}
//                                 </View>
//                             </View>
//                             <View>
//                                 <Modal
//                                     animationType="slide"
//                                     transparent={true}
//                                     visible={modalVisible}
//                                     onRequestClose={() => {
//                                         Alert.alert('Modal has been closed.');
//                                         setModalVisible(!modalVisible);
//                                     }}>
//                                     <View style={styles.centeredView}>
//                                         <View style={styles.modalView}>
//                                             <TextInput
//                                                 placeholder='Title'
//                                                 style={styles.modalText}
//                                                 onChangeText={(title) => setTitle(title)}
//                                                 value={title}

//                                             />

//                                             <TouchableOpacity
//                                                 style={[styles.button, styles.buttonClose]}
//                                                 onPress={handleSave}>
//                                                 <Text style={styles.textStyle}>Save</Text>
//                                             </TouchableOpacity>
//                                         </View>
//                                     </View>
//                                 </Modal>
//                             </View>
//                         </ImageBackground>
//                     </ScrollView>
//                 </Animated.View>
//             </PinchGestureHandler>
//             <View style={{ alignItems: 'center' }}>
//                 <View style={styles.buttonview}>

//                     <TouchableOpacity style={styles.Touchablebutton} onPress={handleToggleInput}>
//                         {/* <Text style={{ fontSize: 20, marginRight: 10, color: 'white' }}>{isTextInputEnabled ? 'Drawing' : 'Text'}</Text> */}
//                         {isTextInputEnabled ? <FontAwesome5 name="pen" size={24} color="#B9D5FF" /> : <MaterialIcons name="text-fields" size={24} color="#B9D5FF" />}
//                     </TouchableOpacity>

//                     <TouchableOpacity style={styles.Touchablebutton} onPress={recording ? stopRecording : startRecording}>
//                         {/* <Text style={{ fontSize: 15, marginRight: 10, color: 'white' }}>{recording ? 'Stop Recording' : 'Start Recording'}</Text> */}
//                         {recording ? <FontAwesome5 name="stop" size={24} color="#B9D5FF" /> : <MaterialIcons name="multitrack-audio" size={24} color="#B9D5FF" />}

//                     </TouchableOpacity>
//                     {paths.length > 0 && (
//                         <TouchableOpacity onPress={reverseLastPath} style={styles.Touchablebutton}>
//                             <Entypo name="back-in-time" size={24} color="#B9D5FF" />
//                         </TouchableOpacity>
//                     )}
//                     <TouchableOpacity onPress={() => {
//                         setPaths([]);
//                         setText('');
//                         setTitle('');
//                         setImage([]);
//                         setRecordings([]);
//                     }} style={styles.Touchablebutton}>
//                         <AntDesign name="delete" size={24} color="#B9D5FF" />
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={pickImage} style={styles.Touchablebutton} >
//                         {/* <Text style={{ fontSize: 15, marginRight: 10, color: 'white' }}>Attachment</Text> */}
//                         <MaterialIcons name="attachment" size={24} color="#B9D5FF" />
//                     </TouchableOpacity>
//                     <TouchableOpacity style={styles.Touchablebutton} onPress={() => setModalVisible(true)} >
//                         {/* <Text style={{ fontSize: 20, marginRight: 10, color: 'white' }}>Save</Text> */}
//                         <FontAwesome name="save" size={24} color="#B9D5FF" />
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         </KeyboardAvoidingView >
//     )
// }

// export default Setting

// const styles = StyleSheet.create({
//     buttonview: {
//         flexDirection: 'row',
//         justifyContent: 'center',
//         marginBottom: '1%',
//         backgroundColor: 'black',
//         borderRadius: 10,
//         width: Dimensions.get('window').width,
//     },
//     Touchablebutton: {
//         width: Dimensions.get('window').width / 10,
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderColor: 'white',
//         borderRadius: 10,
//         height: 30
//     },
//     removeButton: {
//         position: 'absolute',
//         top: -15,
//         right: -15,
//     },
//     btncontainer: {
//         position: 'absolute',
//         flexDirection: 'row',
//         marginTop: '10%',
//     },
//     imageContainer: {
//         width: 200,
//         height: 200,
//         // borderWidth: 2,
//         // borderColor: 'black',
//     },
//     imageWrapper: {
//         position: 'absolute',
//         width: '100%',
//         height: '100%',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     image: {
//         width: '100%',
//         height: '100%',
//         resizeMode: 'cover',
//     },
//     resizeHandle: {
//         position: 'absolute',
//         bottom: -14,
//         right: -13,
//         width: 20,
//         height: 20,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'black',
//         borderRadius: 10,
//     },
//     resizeHandleInner: {
//         width: 10,
//         height: 10,
//         backgroundColor: '#B9D5FF',
//         borderRadius: 1,
//     },
//     centeredView: {
//         flex: 1,
//         justifyContent: 'center',
//         marginTop: 22,
//     },
//     modalView: {
//         margin: 20,
//         backgroundColor: 'white',
//         borderRadius: 20,
//         padding: 35,
//         alignItems: 'center',
//         shadowColor: '#000',
//         shadowOffset: {
//             width: 0,
//             height: 2,
//         },
//         shadowOpacity: 0.25,
//         shadowRadius: 4,
//         elevation: 5,
//     },
//     button: {
//         padding: 10,
//         elevation: 2,
//     },
//     buttonOpen: {
//         backgroundColor: '#F194FF',
//     },
//     buttonClose: {
//         backgroundColor: '#2196F3',
//     },
//     textStyle: {
//         color: 'white',
//         fontWeight: 'bold',
//         textAlign: 'center',
//     },
//     modalText: {
//         marginBottom: 15,
//         textAlign: 'center',
//         borderWidth: 1,
//         width: "10%"
//     },

//     row: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'flex-end',
//         zIndex: 999999,
//     },
//     buttonnote: {
//         zIndex: 9999999,
//         width: '10%',
//     },
//     textcontainer: {
//         height: '100%',
//         width: '100%',
//         fontSize: 15,
//         position: 'absolute',
//         marginTop: "0%"
//     },

// })

// // import React from 'react'
// // import { ImageBackground } from 'react-native';
// // import { View, Image, Animated, Button, Dimensions } from 'react-native'
// // import { PinchGestureHandler } from 'react-native-gesture-handler'
// // export default function Setting() {
// //     const windowWidth = Dimensions.get('window').width;
// //     const windowHeight = Dimensions.get('window').height;
// //     const scale = React.useRef(new Animated.Value(1)).current;
// //     const HandlePinch = new Animated.event(
// //         [{ nativeEvent: { scale: scale } }]
// //         ,
// //         {
// //             useNativeDriver: false
// //         })
// //     const anime = new Animated.ValueXY(0, 0)
// //     return (
// //         <View style={{ flex: 1 }}>
// //             <PinchGestureHandler onGestureEvent={HandlePinch}>
// //                 <Animated.View style={{
// //                     flex: 1,
// //                     transform: [{ scale: scale }]
// //                 }}>
// //                     <ImageBackground source={require('../../assets/table1.png')}
// //                         style={{
// //                             width: '100%',
// //                             height: windowHeight / 1.3,
// //                             zIndex: 99999999999,

// //                         }} >

// //                     </ImageBackground>
// //                 </Animated.View>
// //             </PinchGestureHandler>

// //         </View>
// //     )

// // }
// import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
// import React, { FC, useState } from 'react'
// // import { MaterialIcons } from '@expo/vector-icons';

// const Setting = () => {
//     const [visible, setVisible] = useState(false);
//     const [selectedStatus, setSelectedStatus] = useState('Low');

//     const toggleDropdown = () => {
//         setVisible(!visible);
//     };

//     const handleStatusSelection = (status) => {
//         setSelectedStatus(status);
//         setVisible(false); // Hide the dropdown after selection
//     };

//     const renderDropdown = () => {
//         if (visible) {
//             return (
//                 <View style={styles.dropdownContainer}>
//                     <TouchableOpacity onPress={() => handleStatusSelection('High')}>
//                         <Text style={styles.dropdown}>
//                             High
//                         </Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={() => handleStatusSelection('Medium')}>
//                         <Text style={styles.dropdown}>
//                             Medium
//                         </Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={() => handleStatusSelection('Low')}>
//                         <Text style={styles.dropdown}>
//                             Low
//                         </Text>
//                     </TouchableOpacity>
//                 </View>
//             );
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <TouchableOpacity
//                 style={styles.button}
//                 onPress={toggleDropdown}
//             >
//                 <Text style={styles.buttonText}>{selectedStatus}</Text>
//                 <MaterialIcons name="arrow-drop-down" size={24} color="black" />
//             </TouchableOpacity>
//             {renderDropdown()}

//         </View>
//     );
// }

// export default Setting

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#fff',
//     },
//     button: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: '#efefef',
//         height: 50,
//         width: '50%',
//         paddingHorizontal: 10,
//         zIndex: 1,
//     },
//     buttonText: {
//         flex: 1,
//         textAlign: 'center',
//     },
//     dropdownContainer: {
//         position: 'absolute',
//         top: 500, // Adjust this value to control the dropdown position relative to TouchableOpacity
//         left: 341,
//         right: 0,
//         backgroundColor: 'black',
//         width: "50%",
//         zIndex: 2,
//     },
//     dropdown: {
//         alignItems: 'center',
//         padding: 10,
//         color: 'white',
//         textAlign: 'center',
//     },
// });
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Setting = () => {
    return (
        <View>
            <Text>Setting</Text>
        </View>
    )
}

export default Setting

const styles = StyleSheet.create({})