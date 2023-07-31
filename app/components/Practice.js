// // // import React, { useRef, useState, useEffect } from 'react';
// // // import * as ImagePicker from 'expo-image-picker';
// // // import {
// // //     StyleSheet,
// // //     View,
// // //     ImageBackground,
// // //     Dimensions,
// // //     Animated,
// // //     TouchableOpacity,
// // //     Text,
// // //     Alert,
// // //     Image,
// // //     PanResponder,
// // // } from 'react-native';
// // // import { Entypo, AntDesign, Fontisto, MaterialIcons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';

// // // const Practice = () => {
// // //     const [images, setImages] = useState([]);
// // //     const movePans = useRef(new Animated.ValueXY()).current;

// // //     const movePanResponders = images.map(() => {
// // //         const movePan = new Animated.ValueXY();

// // //         const movePanResponder = PanResponder.create({
// // //             onStartShouldSetPanResponder: () => true,
// // //             onPanResponderMove: Animated.event([
// // //                 null,
// // //                 { dx: movePan.x, dy: movePan.y }
// // //             ],
// // //                 { useNativeDriver: false }),
// // //             onPanResponderRelease: () => {
// // //                 movePan.flattenOffset();
// // //             },
// // //             onPanResponderGrant: () => {
// // //                 movePan.setOffset({
// // //                     x: movePan.x._value,
// // //                     y: movePan.y._value
// // //                 });
// // //             }
// // //         });

// // //         return { movePan, movePanResponder }; // Return an object containing movePan and movePanResponder
// // //     });

// // //     const resizeButtonResponders = images.map(() =>
// // //         PanResponder.create({
// // //             onStartShouldSetPanResponder: () => true,
// // //             onPanResponderMove: (event, gesture) => {
// // //                 // Calculate the new width and height based on the gesture
// // //                 const newWidth = gesture.moveX;
// // //                 const newHeight = gesture.moveY;

// // //                 // Update the image's width and height in the state
// // //                 setImages(prevImages => {
// // //                     const updatedImages = [...prevImages];
// // //                     updatedImages[index] = {
// // //                         ...updatedImages[index],
// // //                         width: newWidth,
// // //                         height: newHeight,
// // //                     };
// // //                     return updatedImages;
// // //                 });
// // //             },
// // //             onPanResponderRelease: () => { },
// // //             onPanResponderGrant: () => { }
// // //         })
// // //     );

// // //     const pickImage = async () => {
// // //         let result;
// // //         // Ask the user if they want to take a photo or choose from their library
// // //         const option = await new Promise((resolve) => {
// // //             Alert.alert(
// // //                 'Choose an option',
// // //                 'Would you like to take a photo or choose from your library?',
// // //                 [
// // //                     { text: 'Take Photo', onPress: () => resolve('takePhoto') },
// // //                     { text: 'Choose from Library', onPress: () => resolve('chooseFromLibrary') },
// // //                     { text: 'Cancel', onPress: () => resolve(null), style: 'cancel' },
// // //                 ],
// // //                 { cancelable: false }
// // //             );
// // //         });

// // //         if (option === 'takePhoto') {
// // //             const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
// // //             if (permissionResult.granted === false) {
// // //                 alert("You've refused to allow this app to access your photos!");
// // //             }
// // //         }

// // //         if (option === 'takePhoto') {
// // //             result = await ImagePicker.launchCameraAsync({
// // //                 allowsEditing: true,
// // //                 allowsMultipleSelection: true,
// // //                 aspect: [4, 3],
// // //                 quality: 1,
// // //             });
// // //         } else if (option === 'chooseFromLibrary') {
// // //             result = await ImagePicker.launchImageLibraryAsync({
// // //                 mediaTypes: ImagePicker.MediaTypeOptions.All,
// // //                 allowsEditing: true,
// // //                 aspect: [4, 3],
// // //                 quality: 1,
// // //             });
// // //         }

// // //         if (result && !result.canceled) {
// // //             setImages((prevImages) => {
// // //                 const newImages = [...prevImages];
// // //                 const newImage = {
// // //                     image:
// // //                         result.assets[0].uri,
// // //                     width: 200,
// // //                     height: 200,
// // //                 };
// // //                 newImages.push(newImage);
// // //                 return newImages;
// // //             });
// // //         }
// // //     };

// // //     const removeImage = (index) => {
// // //         // Remove the image at the specified index from the images array
// // //         setImages((prevImages) => {
// // //             const updatedImages = [...prevImages];
// // //             updatedImages.splice(index, 1);
// // //             return updatedImages;
// // //         });
// // //     };

// // //     return (
// // //         <View style={styles.container}>
// // //             <TouchableOpacity style={styles.button} onPress={pickImage}>
// // //                 <Text style={{ color: 'white' }}>Attachment</Text>
// // //             </TouchableOpacity>
// // //             <View style={[styles.btncontainer]}>
// // //                 {images && images.length > 0 ? (
// // //                     <>
// // //                         {images.map((data, index) => (
// // //                             <View key={index}>
// // //                                 <Animated.View
// // //                                     style={[
// // //                                         styles.imageWrapper,
// // //                                         {
// // //                                             width: images[index].width,
// // //                                             height: images[index].height,
// // //                                             transform: [
// // //                                                 { translateX: movePans.x },
// // //                                                 { translateY: movePans.y },
// // //                                             ],
// // //                                         },
// // //                                         movePanResponders[index].movePan.getLayout()
// // //                                     ]}
// // //                                     {...movePanResponders[index].movePanResponder.panHandlers}
// // //                                 >
// // //                                     <Image source={{ uri: data.image }} style={styles.image} />
// // //                                     <TouchableOpacity onPress={() => removeImage(index)} style={styles.removeButton}>
// // //                                         <FontAwesome name="remove" size={30} color="#B9D5FF" />
// // //                                     </TouchableOpacity>
// // //                                     <TouchableOpacity style={styles.resizeButton} {...resizeButtonResponders[index].panHandlers}
// // //                                     >
// // //                                         <Fontisto name="arrow-resize" size={24} color="white" />
// // //                                     </TouchableOpacity>
// // //                                 </Animated.View>
// // //                             </View>
// // //                         ))}
// // //                     </>
// // //                 ) : null}
// // //             </View>
// // //         </View>
// // //     );
// // // };

// // // const styles = StyleSheet.create({
// // //     container: {
// // //         flex: 1,
// // //         backgroundColor: 'white',
// // //     },
// // //     button: {
// // //         backgroundColor: 'blue',
// // //         padding: 10,
// // //         elevation: 2,
// // //     },
// // //     btncontainer: {
// // //         position: 'absolute',
// // //         flexDirection: 'row',
// // //         marginTop: '10%',
// // //     },
// // //     removeButton: {
// // //         position: 'absolute',
// // //         top: -15,
// // //         right: -15,
// // //     },
// // //     imageWrapper: {
// // //         position: 'relative',
// // //         width: '100%',
// // //         height: '100%',
// // //     },
// // //     image: {
// // //         width: '100%',
// // //         height: '100%',
// // //         resizeMode: 'cover',
// // //     },
// // //     resizeButton: {
// // //         position: 'absolute',
// // //         bottom: -15,
// // //         right: -15,
// // //         width: 30,
// // //         height: 30,
// // //         borderRadius: 15,
// // //         backgroundColor: '#B9D5FF',
// // //         alignItems: 'center',
// // //         justifyContent: 'center',
// // //     },
// // // });

// // // export default Practice;


// // import React, { useState, useRef } from 'react';
// // import { StyleSheet, Text, View, Button, Image, Alert, Animated, TouchableOpacity, PanResponder } from 'react-native';

// // const Practice = () => {
// //     const [images, setImages] = useState([]);
// //     const [activeIndex, setActiveIndex] = useState(null);
// //     const pan = useRef(new Animated.ValueXY()).current;
// //     const buttonPan = useRef(new Animated.ValueXY()).current;
// //     const [imageWidth, setImageWidth] = useState(200);
// //     const [imageHeight, setImageHeight] = useState(200);

// //     const pickImages = async () => {
// //         // Ask the user if they want to take a photo or choose from their library
// //         const option = await new Promise((resolve) => {
// //             Alert.alert(
// //                 'Choose an option',
// //                 'Would you like to take a photo or choose from your library?',
// //                 [
// //                     { text: 'Take Photo', onPress: () => resolve('takePhoto') },
// //                     { text: 'Choose from Library', onPress: () => resolve('chooseFromLibrary') },
// //                     { text: 'Cancel', onPress: () => resolve(null), style: 'cancel' },
// //                 ],
// //                 { cancelable: false },
// //             );
// //         });

// //         let result;
// //         if (option === 'takePhoto') {
// //             const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
// //             if (permissionResult.granted === false) {
// //                 alert("You've refused to allow this app to access your photos!");
// //                 return;
// //             }
// //         }

// //         if (option === 'takePhoto') {
// //             result = await ImagePicker.launchCameraAsync({
// //                 allowsEditing: true,
// //                 allowsMultipleSelection: true,
// //                 aspect: [4, 3],
// //                 quality: 1,
// //             });
// //         } else if (option === 'chooseFromLibrary') {
// //             result = await ImagePicker.launchImageLibraryAsync({
// //                 mediaTypes: ImagePicker.MediaTypeOptions.All,
// //                 allowsEditing: true,
// //                 aspect: [4, 3],
// //                 quality: 1,
// //             });
// //         }

// //         if (result && !result.cancelled) {
// //             setImages((prevImages) => [
// //                 ...prevImages,
// //                 { image: result.assets[0].uri },
// //             ]);
// //         }
// //     };

// //     const removeImage = (index) => {
// //         setImages((prevImages) => {
// //             const updatedImages = [...prevImages];
// //             updatedImages.splice(index, 1);
// //             return updatedImages;
// //         });
// //     };

// //     const panResponder = useRef(
// //         PanResponder.create({
// //             onStartShouldSetPanResponder: () => true,
// //             onPanResponderGrant: (_, gestureState) => {
// //                 pan.setOffset({
// //                     x: pan.x._value,
// //                     y: pan.y._value,
// //                 });
// //                 pan.setValue({ x: 0, y: 0 });
// //                 setActiveIndex(gestureState.index);
// //             },
// //             onPanResponderMove: Animated.event([
// //                 null,
// //                 {
// //                     dx: pan.x,
// //                     dy: pan.y,
// //                 },
// //             ]),
// //             onPanResponderRelease: () => {
// //                 pan.flattenOffset();
// //                 setActiveIndex(null);
// //             },
// //         })
// //     ).current;

// //     const buttonPanResponder = useRef(
// //         PanResponder.create({
// //             onStartShouldSetPanResponder: () => true,
// //             onPanResponderGrant: () => {
// //                 buttonPan.setOffset({
// //                     x: buttonPan.x._value,
// //                     y: buttonPan.y._value,
// //                 });
// //                 buttonPan.setValue({ x: 0, y: 0 });
// //             },
// //             onPanResponderMove: Animated.event([
// //                 null,
// //                 {
// //                     dx: buttonPan.x,
// //                     dy: buttonPan.y,
// //                 },
// //             ]),
// //             onPanResponderRelease: () => {
// //                 buttonPan.flattenOffset();
// //             },
// //         })
// //     ).current;

// //     const onButtonMove = () => {
// //         const dx = buttonPan.x._value;
// //         const dy = buttonPan.y._value;
// //         const newWidth = imageWidth + dx;
// //         const newHeight = imageHeight + dy;

// //         setImageWidth(newWidth);
// //         setImageHeight(newHeight);
// //     };

// //     return (
// //         <View style={styles.container}>
// //             <Button title="Pick images from camera roll" onPress={pickImages} />
// //             <View style={styles.imagesContainer}>
// //                 {images.map((data, index) => {
// //                     const { image } = data;
// //                     const animatedStyle = {
// //                         transform: [
// //                             { translateX: pan.x },
// //                             { translateY: pan.y },
// //                         ],
// //                     };

// //                     return (
// //                         <View key={index} style={styles.imageContainer}>
// //                             <Animated.View
// //                                 style={[
// //                                     styles.imageWrapper,
// //                                     animatedStyle,
// //                                     { width: imageWidth, height: imageHeight },
// //                                 ]}
// //                                 {...panResponder.panHandlers}
// //                             >
// //                                 <Image source={{ uri: image }} style={styles.image} />
// //                                 <TouchableOpacity
// //                                     style={styles.resizeButton}
// //                                     {...buttonPanResponder.panHandlers}
// //                                 >
// //                                     <Text style={styles.buttonText}>Resize</Text>
// //                                 </TouchableOpacity>
// //                                 <TouchableOpacity
// //                                     onPress={() => removeImage(index)}
// //                                     style={styles.removeButton}
// //                                 >
// //                                     <Text style={styles.buttonText}>Remove</Text>
// //                                 </TouchableOpacity>
// //                             </Animated.View>
// //                         </View>
// //                     );
// //                 })}
// //             </View>
// //         </View>
// //     );
// // };

// // export default Practice;

// // const styles = StyleSheet.create({
// //     container: {
// //         flex: 1,
// //         alignItems: 'center',
// //         justifyContent: 'center',
// //     },
// //     imagesContainer: {
// //         flexDirection: 'column',
// //         alignItems: 'center',
// //     },
// //     imageContainer: {
// //         marginVertical: 10,
// //     },
// //     imageWrapper: {
// //         position: 'relative',
// //     },
// //     image: {
// //         width: '100%',
// //         height: '100%',
// //         resizeMode: 'cover',
// //     },
// //     removeButton: {
// //         position: 'absolute',
// //         top: 10,
// //         right: 10,
// //         backgroundColor: '#FF0000',
// //         padding: 5,
// //         borderRadius: 5,
// //     },
// //     resizeButton: {
// //         position: 'absolute',
// //         bottom: 10,
// //         right: 10,
// //         backgroundColor: '#00FF00',
// //         padding: 5,
// //         borderRadius: 5,
// //     },
// //     buttonText: {
// //         color: '#FFFFFF',
// //         fontSize: 16,
// //     },
// // });

// import { View, ImageBackground, TextInput, Text, TouchableOpacity, PanResponder, Animated, StyleSheet, Modal, Alert, ToastAndroid, Button, Dimensions, Image, KeyboardAvoidingView, Settings } from 'react-native'
// import React, { useRef, useEffect, useState } from 'react'
// import { useAuth } from "../context/auth";
// import clientApi from '../api/clientApi';
// import { useTasks } from '../context/Task';
// import * as ImagePicker from 'expo-image-picker';
// import { Audio } from 'expo-av';
// import { PinchGestureHandler, State, ScrollView, PanGestureHandler } from 'react-native-gesture-handler';
// import * as MediaLibrary from 'expo-media-library';
// import * as Sharing from 'expo-sharing';
// import { Entypo, AntDesign, MaterialIcons, FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
// import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';
// import Svg, { Path } from 'react-native-svg';
// import * as FileSystem from 'expo-file-system';

// const Practice = () => {
//     const [currentPath, setCurrentPath] = useState([]);
//     const [paths, setPaths] = useState([]);
//     const [zoomScale, setZoomScale] = useState(1);
//     const [text, setText] = useState('');
//     const [test, setTest] = useState([]);
//     const [modalVisible, setModalVisible] = useState(false);
//     const [showModal, setShowModal] = useState(false);
//     const [title, setTitle] = useState('');
//     const [category, setCategory] = useState('DailyTasks');
//     const [recording, setRecording] = useState();
//     const [recordings, setRecordings] = useState([]);
//     const [message, setMessage] = useState("");
//     const [isTextInputEnabled, setIsTextInputEnabled] = useState(false);
//     const [image, setImage] = useState([]);
//     const movePans = useRef(new Animated.ValueXY()).current;
//     const resizePan = useRef(new Animated.ValueXY()).current;
//     const windowWidth = Dimensions.get('window').width;
//     const windowHeight = Dimensions.get('window').height;
//     const { height, width } = Dimensions.get('window');
//     const scale = React.useRef(new Animated.Value(1)).current;
//     const [selectedColor, setSelectedColor] = useState('#000000'); // Default color is black
//     console.log(paths)

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
//         const newPath = {
//             path: [...currentPath],
//             color: selectedColor,
//         };

//         currentPaths.push(newPath);
//         setPaths(currentPaths);
//         setCurrentPath([]);
//     };
//     const onSelectColor = ({ hex }) => {
//         // do something with the selected color.
//         setSelectedColor(hex);
//     };
//     console.log("selectedColor", selectedColor)
//     return (
//         <KeyboardAvoidingView style={{
//             flex: 1,
//             backgroundColor: 'white',
//             height: "100%"
//         }}>
//             <PinchGestureHandler
//             // onGestureEvent={handlePinch}
//             // onHandlerStateChange={handlePinchEnd}
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

//                         <ImageBackground source={require('../../assets/Note1.jpg')} style={{
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
//                                                     stroke={selectedColor}
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
//                                             {currentPath.length > 0 && (
//                                                 <Path
//                                                     d={currentPath.join('')}
//                                                     stroke={selectedColor}
//                                                     fill={'transparent'}
//                                                     strokeWidth={5}
//                                                     strokeLinejoin={'round'}
//                                                     strokeLinecap={'round'}
//                                                 />
//                                             )}

//                                             {paths.length > 0 &&
//                                                 paths.map((item, index) => (
//                                                     <Path
//                                                         key={`path-${index}`}
//                                                         d={item.path.join('')}
//                                                         stroke={item.color}
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
//                                                                 { translateX: movePans.x },
//                                                                 { translateY: movePans.y },
//                                                             ],
//                                                         },
//                                                         // movePanResponders[index].movePan.getLayout()
//                                                     ]}
//                                                 // {...movePanResponders[index].movePanResponder.panHandlers}
//                                                 >
//                                                     <View
//                                                         style={styles.resizeHandle}
//                                                     // {...resizeHandleResponders[index].panHandlers} // Use the appropriate panHandlers for each image
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
//                                     {/* {getRecordingLines()} */}
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
//                                             // onPress={handleSave}
//                                             >
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

//                     <TouchableOpacity style={styles.Touchablebutton} onPress={{}}>
//                         {isTextInputEnabled ? <FontAwesome5 name="pen" size={24} color="#B9D5FF" /> : <MaterialIcons name="text-fields" size={24} color="#B9D5FF" />}
//                     </TouchableOpacity>

//                     <TouchableOpacity style={styles.Touchablebutton} onPress={{}}>
//                         {recording ? <FontAwesome5 name="stop" size={24} color="#B9D5FF" /> : <MaterialIcons name="multitrack-audio" size={24} color="#B9D5FF" />}
//                     </TouchableOpacity>
//                     {!isTextInputEnabled && (
//                         <>
//                             <TouchableOpacity style={styles.Touchablebutton} onPress={() => setShowModal(true)}>
//                                 <Ionicons name="color-fill" size={24} color="#B9D5FF" />
//                             </TouchableOpacity>
//                             <Modal visible={showModal} animationType='slide'>
//                                 <ColorPicker style={{ width: '70%' }} value='red' onComplete={onSelectColor}>
//                                     <Preview />
//                                     <Panel1 />
//                                     <HueSlider />
//                                     <OpacitySlider />
//                                     <Swatches />
//                                 </ColorPicker>

//                                 <Button title='Ok' onPress={() => setShowModal(false)} />
//                             </Modal>
//                         </>
//                     )}
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
//                     <TouchableOpacity onPress={{}} style={styles.Touchablebutton} >
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

// export default Practice

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
//         width: Dimensions.get('window').width / 12,
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
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Practice = () => {
    return (
        <View>
            <Text>Practice</Text>
        </View>
    )
}

export default Practice

const styles = StyleSheet.create({})