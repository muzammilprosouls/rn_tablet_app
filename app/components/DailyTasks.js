import { View, ImageBackground, TextInput, Text, TouchableOpacity, PanResponder, Animated, StyleSheet, Modal, Alert, ToastAndroid, Button, Dimensions, Image, KeyboardAvoidingView, Settings } from 'react-native'
import React, { useRef, useEffect, useState } from 'react'
import { useAuth } from "../context/auth";
import { useNavigation } from '@react-navigation/native';
import clientApi from '../api/clientApi';
import { useTasks } from '../context/Task';
// import * as ImagePicker from 'expo-image-picker';
// import { Audio } from 'expo-av';
import { PinchGestureHandler, State, ScrollView, PanGestureHandler } from 'react-native-gesture-handler';
// import * as MediaLibrary from 'expo-media-library';
// import * as Sharing from 'expo-sharing';
// import { Entypo, AntDesign, MaterialIcons, FontAwesome, FontAwesome5, Ionicons, Feather } from '@expo/vector-icons';
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';
import Svg, { Path } from 'react-native-svg';
import { useDate } from '../context/calendarDate';



const DailyTasks = ({ route }) => {
    const Data = route.params;
    const [currentPath, setCurrentPath] = useState([]);
    const [paths, setPaths] = useState([]);
    const [zoomScale, setZoomScale] = useState(1);
    const [text, setText] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('DailyTasks');
    const [auth, setAuth] = useAuth();
    const { userId, token } = auth;
    const [recording, setRecording] = useState();
    const [recordings, setRecordings] = useState([]);
    const [message, setMessage] = useState("");
    const [isTextInputEnabled, setIsTextInputEnabled] = useState(false);
    const [image, setImage] = useState([]);
    const movePans = useRef(new Animated.ValueXY()).current;
    const resizePan = useRef(new Animated.ValueXY()).current;
    const { updateTasks } = useTasks();
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const { height, width } = Dimensions.get('window');
    const scale = React.useRef(new Animated.Value(1)).current;
    const [selectedColor, setSelectedColor] = useState('#000000');
    const navigation = useNavigation();
    const [taskId, setTaskId] = useState("");
    const [date, setDate] = useState('')
    const [SelectedDate, setSelectedDate] = useDate();
    const [dropdown, setDropDown] = useState(false);
    const [priority, setPriority] = useState("Low")
    const handleSave = () => {
        if (taskId == "") {
            handleNewSave();
        } else {
            handleUpdate();
        }
    }
    const handleNewSave = async () => {
        try {
            if (!userId) {
                console.log('userId is null', userId);
                setModalVisible(false)
                alert("User ID is missing");
                console.log(auth)
                return;
            } else {
                const headers = {
                    Authorization: token
                };
                const res = await clientApi.post('/api/v1/tasks/create',
                    { title, category, text, userId, paths, recordings, image, SelectedDate, priority },
                    { headers }
                );
                setModalVisible(!modalVisible)
                if (res && res.data.success) {
                    const updatedRes = await clientApi.get(`/api/v1/tasks/user-tasks/${userId}`);
                    const updatedTasks = updatedRes.data;
                    ToastAndroid.show(res.data.message, ToastAndroid.SHORT);
                    updateTasks(updatedTasks);
                } else {
                    ToastAndroid.show(res.data.message, ToastAndroid.SHORT);
                }
            }
            setModalVisible(false)
        } catch (error) {
            setModalVisible(!modalVisible)
            console.log(error.message);
            ToastAndroid.show("Something went wrong");
            setModalVisible(false)

        }
    }
    const handleUpdate = async () => {
        try {
            const headers = {
                Authorization: token
            };
            const res = await clientApi.put(
                `/api/v1/tasks/update-task/${taskId}`,
                { title, category, text, userId, paths, recordings, SelectedDate, image, priority }, { headers }
            );
            setModalVisible(!modalVisible)
            if (res && res.data.success) {
                const updatedRes = await clientApi.get(`/api/v1/tasks/user-tasks/${userId}`);
                const updatedTasks = updatedRes.data;
                ToastAndroid.show(res.data.message, ToastAndroid.SHORT);
                updateTasks(updatedTasks);
            } else {
                ToastAndroid.show(res.data.message, ToastAndroid.SHORT);
            }
        } catch (error) {
            setModalVisible(!modalVisible)
            console.log(error.message);
            ToastAndroid.show("Something went wrong");
            setModalVisible(false)
        }
    };
    const handlePinch = React.useCallback(
        Animated.event([{ nativeEvent: { scale: scale } }], {
            useNativeDriver: false,
        }),
        []
    );
    const handleToggleInput = () => {
        setIsTextInputEnabled((prevIsTextInputEnabled) => !prevIsTextInputEnabled);
    };
    const pickImage = async () => {
        let result;
        // Ask the user if they want to take a photo or choose from their library
        const option = await new Promise((resolve) => {
            Alert.alert(
                'Choose an option',
                'Would you like to take a photo or choose from your library?',
                [
                    { text: 'Take Photo', onPress: () => resolve('takePhoto') },
                    { text: 'Choose from Library', onPress: () => resolve('chooseFromLibrary') },
                    { text: 'Cancel', onPress: () => resolve(null), style: 'cancel' },
                ],
                { cancelable: false },
            );
        });

        if (option === 'takePhoto') {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            if (permissionResult.granted === false) {
                alert("You've refused to allow this app to access your photos!");
            }
        }

        if (option === 'takePhoto') {
            result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                allowsMultipleSelection: true,
                aspect: [4, 3],
                quality: 1,
            });
        } else if (option === 'chooseFromLibrary') {
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
        }

        if (result && !result.canceled) {
            setImage((prevImages) => {
                const newImages = [...prevImages];
                newImages.push({ image: result.assets[0].uri, width: 200, height: 200 });
                return newImages;
            });
        }
    };
    const removeImage = (index) => {
        // Remove the image at the specified index from the images array
        setImage((prevImages) => {
            const updatedImages = [...prevImages];
            updatedImages.splice(index, 1);
            return updatedImages;
        });
    };

    async function startRecording() {
        try {
            const permission = await Audio.requestPermissionsAsync();

            if (permission.status === "granted") {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true
                });

                const { recording } = await Audio.Recording.createAsync(
                    Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
                );

                setRecording(recording);
            } else {
                setMessage("Please grant permission to app to access microphone");
            }
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }
    async function stopRecording() {
        setRecording(null);
        await recording.stopAndUnloadAsync();

        let updatedRecordings = [...recordings];
        const { sound, status } = await recording.createNewLoadedSoundAsync();
        updatedRecordings.push({
            sound: sound,
            duration: getDurationFormatted(status.durationMillis),
            file: recording.getURI()
        });

        setRecordings(updatedRecordings);
    }

    function getDurationFormatted(millis) {
        const minutes = millis / 1000 / 60;
        const minutesDisplay = Math.floor(minutes);
        const seconds = Math.round((minutes - minutesDisplay) * 60);
        const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
        return `${minutesDisplay}:${secondsDisplay}`;
    }
    function RecordingLine({ recordingLine, index, onRemove }) {
        const [isPlaying, setIsPlaying] = useState(false);
        const sound = recordingLine.sound;

        const handlePlaybackToggle = async () => {
            if (isPlaying) {
                // Pause the playback
                await sound.pauseAsync();
            } else {
                // Start or resume the playback
                await sound.playAsync();
            }
            setIsPlaying(!isPlaying);
        };

        // Add this useEffect hook to reset the playback when it reaches the end
        useEffect(() => {
            const updatePlaybackStatus = async (status) => {
                if (status.didJustFinish) {
                    setIsPlaying(false);
                    await sound.setPositionAsync(0);
                }
            };

            const subscription = sound.setOnPlaybackStatusUpdate(updatePlaybackStatus);

            return () => {
                if (subscription) {
                    subscription.remove();
                }
            };
        }, [sound]);
        const handleRemove = () => {
            onRemove(index);
        };
        return (
            <View style={styles.row}>
                <Text style={{ fontWeight: 'bold' }}>Recording {index + 1} - {recordingLine.duration}</Text>
                <TouchableOpacity style={styles.button} onPress={handlePlaybackToggle} >{isPlaying ? <AntDesign name="pausecircle" size={30} color="black" /> : <AntDesign name="play" size={30} color="black" />}</TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => Sharing.shareAsync(recordingLine.file)}><Entypo name="share" size={30} color="black" /></TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleRemove} ><MaterialIcons name="remove-circle" size={30} color="black" /></TouchableOpacity>
            </View>
        );
    }
    const RemoveRecording = (index) => {
        const updatedRecordings = [...recordings];
        updatedRecordings.splice(index, 1);
        setRecordings(updatedRecordings);
    };
    function getRecordingLines() {
        const handleRemoveRecording = (index) => {
            const updatedRecordings = [...recordings];
            updatedRecordings.splice(index, 1);
            setRecordings(updatedRecordings);
        };
        return recordings.map((recordingLine, index) => {
            return <RecordingLine
                key={index}
                recordingLine={recordingLine}
                index={index}
                sound={recordingLine.sound}
                onRemove={handleRemoveRecording}
            />;
        });
    }
    useEffect(() => {
        if (route.params) {
            setTaskId(route.params.id)
            setText(route.params.text);
            setTitle(route.params.title);
            setPaths(route.params.paths);
            const dateStringFromParams = route.params.date;
            const year = dateStringFromParams.slice(0, 4);
            const month = dateStringFromParams.slice(5, 7);
            const day = dateStringFromParams.slice(8, 10);
            const formattedDate = `${year}-${month}-${day}`;
            setSelectedDate(formattedDate)
            // const playing = JSON.parse(route.params.recordings[0].sound._lastStatusUpdate)
            // setTest(route.params.recordings)
            // setRecordings(route.params.recordings)
            // console.log(JSON.stringify(route.params.recordings));
            setImage(route.params.image);
        }
    }, [route.params]);
    const movePanResponders = image.map(() => {
        const movePan = new Animated.ValueXY();

        const movePanResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([
                null,
                { dx: movePan.x, dy: movePan.y }
            ],
                { useNativeDriver: false }),
            onPanResponderRelease: () => {
                movePan.flattenOffset();
            },
            onPanResponderGrant: () => {
                movePan.setOffset({
                    x: movePan.x._value,
                    y: movePan.y._value
                });
            }
        });

        return { movePan, movePanResponder }; // Return an object containing movePan and movePanResponder
    });
    const resizeHandleResponders = image.map((size, index) => {
        return PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gesture) => {
                const { dx, dy } = gesture;
                const newWidth = size.width + dx;
                const newHeight = size.height + dy;

                setImage((prevSizes) => {
                    const newSizes = [...prevSizes];
                    newSizes[index] = {
                        width: newWidth > 50 ? newWidth : prevSizes[index].width,
                        height: newHeight > 50 ? newHeight : prevSizes[index].height,
                    };
                    return newSizes;
                });
            },
        });
    });
    const reverseLastPath = () => {
        if (paths.length > 0) {
            const updatedPaths = [...paths];
            updatedPaths.pop(); // Remove the last path from the array
            setPaths(updatedPaths);
        }
    };
    const onTouchMove = (event) => {
        if (event.nativeEvent.touches.length === 1) {
            const newPath = [...currentPath];

            // get current user touches position
            const locationX = event.nativeEvent.locationX;
            const locationY = event.nativeEvent.locationY;

            // create new point
            const newPoint = `${newPath.length === 0 ? 'M' : ''}${locationX.toFixed(0)},${locationY.toFixed(0)} `;

            // add the point to older points
            newPath.push(newPoint);
            setCurrentPath(newPath);
        }
    };

    const onTouchEnd = () => {
        const currentPaths = [...paths];
        const newPath = {
            path: [...currentPath],
            color: selectedColor,
        };

        currentPaths.push(newPath);
        setPaths(currentPaths);
        setCurrentPath([]);
    };
    const onSelectColor = ({ hex }) => {
        // do something with the selected color.
        setSelectedColor(hex);

    };
    const handleDateChange = (inputDate) => {
        // Remove any non-numeric characters from the input
        const numericDate = inputDate.replace(/\D/g, '');

        // Format the date as 'yyyy-mm-dd'
        if (numericDate.length >= 5) {
            const year = numericDate.slice(0, 4);
            let month = numericDate.slice(4, 6);
            let day = numericDate.slice(6, 8);

            // Ensure two digits for month and day
            if (month.length === 1) {
                month = `0${month}`;
            }
            if (day.length === 1) {
                day = `0${day}`;
            }

            // Combine parts with hyphens
            const formattedDate = `${year}-${month}-${day}`;
            setDate(formattedDate);
        } else {
            setDate(numericDate);
        }
    };
    const toggleDropdown = () => {
        setDropDown(!dropdown);
    };
    const handleStatusSelection = (status) => {
        setPriority(status);
        setDropDown(false);
    };
    const renderDropdown = () => {
        if (dropdown) {
            return (
                <View style={styles.dropdownContainer}>
                    <TouchableOpacity onPress={() => handleStatusSelection('High')} style={styles.prioritiesTO}>
                        <Text style={styles.dropdown}>
                            High
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleStatusSelection('Medium')} style={styles.prioritiesTO}>
                        <Text style={styles.dropdown}>
                            Medium
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleStatusSelection('Low')} style={styles.prioritiesTO}>
                        <Text style={styles.dropdown}>
                            Low
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        }
    };
    // const onPinchGestureEvent = (event) => {
    //     setZoomScale(event.nativeEvent.scale);
    // };

    // const onPinchHandlerStateChange = (event) => {
    //     if (event.nativeEvent.state === State.END) {
    //         if (zoomScale < 1) {
    //             setZoomScale(1);
    //         }
    //     }
    // };
    return (
        <KeyboardAvoidingView style={{
            flex: 1,
            backgroundColor: 'white',
            height: "100%"
        }}>
            { }

            <PinchGestureHandler
                onGestureEvent={handlePinch}
            // onHandlerStateChange={handlePinchEnd}
            >
                <Animated.View style={{
                    flex: 1,
                    transform: [{ scale: scale }]
                }}>
                    <ScrollView
                        contentContainerStyle={styles.scrollViewContentContainer}
                        maximumZoomScale={2}
                        minimumZoomScale={1}
                        scrollEnabled={false}
                        style={{ overflow: 'hidden' }}
                        nestedScrollEnabled={true}
                    >

                        <ImageBackground source={require('../../assets/Note1.jpg')} style={{
                            width: '100%',
                            height: windowHeight / 1.3,
                            zIndex: 99999999999
                        }}
                            resizeMode="stretch" >

                            {isTextInputEnabled ? (
                                <>
                                    <TextInput
                                        value={text}
                                        onChangeText={(newtext) => setText(newtext)}
                                        autoFocus
                                        multiline
                                        editable
                                        style={styles.textInputcontainer} />
                                    <Svg height={height} width={width}>
                                        {paths.length > 0 &&
                                            paths.map((item, index) => (
                                                <Path
                                                    key={`path-${index}`}
                                                    d={item.path.join('')}
                                                    stroke={item.color}
                                                    fill={'transparent'}
                                                    strokeWidth={5}
                                                    strokeLinejoin={'round'}
                                                    strokeLinecap={'round'}
                                                />
                                            ))}
                                    </Svg>
                                </>) : (
                                <View style={{ width: "100%", height: "100%" }}>
                                    <Text style={styles.textCont}>{text} </Text>
                                    <View style={styles.svgContainer} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
                                        <Svg height={height} width={width}>
                                            {currentPath.length > 0 && (
                                                <Path
                                                    d={currentPath.join('')}
                                                    stroke={selectedColor}
                                                    fill={'transparent'}
                                                    strokeWidth={5}
                                                    strokeLinejoin={'round'}
                                                    strokeLinecap={'round'}
                                                />
                                            )}

                                            {paths.length > 0 &&
                                                paths.map((item, index) => (
                                                    <Path
                                                        key={`path-${index}`}
                                                        d={item.path.join('')}
                                                        stroke={item.color}
                                                        fill={'transparent'}
                                                        strokeWidth={5}
                                                        strokeLinejoin={'round'}
                                                        strokeLinecap={'round'}
                                                    />
                                                ))}
                                        </Svg>
                                    </View>

                                </View>)}
                            <View style={[styles.btncontainer]}>

                                {image && image.length > 0 ? (
                                    <>
                                        {image.map((data, index) => (
                                            <View key={index}>
                                                <Animated.View
                                                    style={[
                                                        styles.imageWrapper,
                                                        {
                                                            width: image[index].width,
                                                            height: image[index].height,
                                                            transform: [
                                                                { translateX: movePans.x },
                                                                { translateY: movePans.y },
                                                            ],
                                                        },
                                                        movePanResponders[index].movePan.getLayout()
                                                    ]}
                                                    {...movePanResponders[index].movePanResponder.panHandlers}
                                                >
                                                    <View
                                                        style={styles.resizeHandle}
                                                        {...resizeHandleResponders[index].panHandlers} // Use the appropriate panHandlers for each image
                                                    />
                                                    <Image source={{ uri: data.image }} style={styles.image} />
                                                    <TouchableOpacity onPress={() => removeImage(index)} style={styles.removeButton}>
                                                        <FontAwesome name="remove" size={30} color="#B9D5FF" />
                                                    </TouchableOpacity>
                                                </Animated.View>
                                            </View>
                                        ))}
                                    </>
                                ) : null}

                            </View>
                            <View
                                style={[
                                    styles.btncontainer,
                                    {
                                        marginLeft: "70%"
                                    },
                                ]}
                            >

                                <View style={{ flexDirection: 'column', justifyContent: 'flex-end', padding: 5, }}>
                                    {getRecordingLines()}
                                </View>
                            </View>
                            <View>
                                <Modal
                                    animationType="slide"
                                    transparent={true}
                                    visible={modalVisible}
                                    onRequestClose={() => {
                                        Alert.alert('Modal has been closed.');
                                        setModalVisible(!modalVisible);
                                    }}>
                                    <View style={styles.centeredView} onTouchEnd={() => setModalVisible(false)}>
                                        <View style={styles.modalView}>
                                            <View style={styles.modalheading}>
                                                <Text style={{ textAlign: 'right', fontSize: 18, fontWeight: 500 }}>Save</Text>
                                                <TouchableOpacity
                                                    style={styles.closeButton}
                                                    onPress={() => setModalVisible(!modalVisible)}
                                                >
                                                    <AntDesign name="close" size={24} color="black" />
                                                </TouchableOpacity>
                                            </View>
                                            <TextInput
                                                style={styles.modalText}
                                                placeholder='Enter Your Title'
                                                placeholderTextColor={"grey"}
                                                onChangeText={(title) => setTitle(title)}
                                                value={title}

                                            />
                                            <TextInput
                                                editable={false}
                                                style={styles.modalText}
                                                placeholder='Date'
                                                placeholderTextColor={'grey'}
                                                onChangeText={(SelectedDate) => setSelectedDate(SelectedDate)}
                                                value={SelectedDate}
                                                maxLength={10} // Limit the input to 10 characters (yyyy-mm-dd)
                                                keyboardType='numeric' // Only allow numeric keyboard input
                                            />
                                            <View style={styles.prioritydropdown}>
                                                <TouchableOpacity
                                                    style={styles.DropDownbtn}
                                                    onPress={toggleDropdown}
                                                >
                                                    <Text style={styles.buttonText}>{priority}</Text>
                                                    <MaterialIcons name="arrow-drop-down" size={24} color="black" />
                                                </TouchableOpacity>
                                            </View>
                                            {renderDropdown()}

                                            <TouchableOpacity
                                                style={[styles.button, styles.buttonClose]}
                                                onPress={handleSave}>
                                                <Text style={styles.textStyle}>
                                                    {taskId === "" ? "Save" : "Update"}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </Modal>
                            </View>
                            <View style={{}}>
                                <Modal
                                    animationType="slide"
                                    transparent={true}
                                    visible={showModal}
                                >
                                    <View style={styles.centeredView} onTouchEnd={() => setShowModal(false)}>
                                        <View style={styles.modalView}>
                                            <ColorPicker style={{ width: '80%' }} value={selectedColor} onComplete={onSelectColor}>
                                                <Preview />
                                                <Panel1 />
                                                <HueSlider />
                                                <OpacitySlider />
                                            </ColorPicker>

                                            <Button title='Ok' onPress={() => setShowModal(false)} />
                                        </View>
                                    </View>
                                </Modal>
                            </View>
                        </ImageBackground>
                    </ScrollView>
                </Animated.View>
            </PinchGestureHandler>
            <TouchableOpacity
                style={{
                    borderWidth: 1,
                    borderColor: 'red',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 50,
                    position: 'absolute',
                    zIndex: 99999999,
                    bottom: 60,
                    // top: windowHeight / 1.29,
                    left: 10,
                    height: 50,
                    backgroundColor: '#B9D5FF',
                    borderRadius: 100,
                }}
                onPress={() => {
                    setDate('')
                    setTaskId("");
                    setPaths([]);
                    setText('');
                    setTitle('');
                    setImage([]);
                    setRecordings([]);
                }}
            >
                <Ionicons name="add" size={30} color="black" />
            </TouchableOpacity>
            <View style={{ alignItems: 'center' }}>

                <View style={styles.buttonview}>

                    <TouchableOpacity style={styles.Touchablebutton} onPress={handleToggleInput}>
                        {isTextInputEnabled ? <FontAwesome5 name="pen" size={30} color="#B9D5FF" /> : <MaterialIcons name="text-fields" size={24} color="#B9D5FF" />}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.Touchablebutton} onPress={recording ? stopRecording : startRecording}>
                        {recording ? <FontAwesome5 name="stop" size={30} color="#B9D5FF" /> : <MaterialIcons name="multitrack-audio" size={24} color="#B9D5FF" />}
                    </TouchableOpacity>
                    {!isTextInputEnabled && (
                        <>
                            <TouchableOpacity style={styles.Touchablebutton} onPress={() => setShowModal(true)}>
                                <Ionicons name="color-fill" size={30} color="#B9D5FF" />
                            </TouchableOpacity>
                        </>
                    )}
                    {paths.length > 0 && (
                        <TouchableOpacity onPress={reverseLastPath} style={styles.Touchablebutton}>
                            <Entypo name="back-in-time" size={30} color="#B9D5FF" />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => {
                        setPaths([]);
                        setText('');
                        setTitle('');
                        setImage([]);
                        setRecordings([]);
                    }} style={styles.Touchablebutton}>
                        <MaterialIcons name="cleaning-services" size={30} color="#B9D5FF" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={pickImage} style={styles.Touchablebutton} >
                        {/* <Text style={{ fontSize: 15, marginRight: 10, color: 'white' }}>Attachment</Text> */}
                        <Feather name="image" size={30} color="#B9D5FF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.Touchablebutton} onPress={() => setModalVisible(true)} >
                        {/* <Text style={{ fontSize: 20, marginRight: 10, color: 'white' }}>Save</Text> */}
                        <FontAwesome name="save" size={30} color="#B9D5FF" />
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView >
    )
}

export default DailyTasks

const styles = StyleSheet.create({
    buttonview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginBottom: '1%',
        backgroundColor: 'black',
        alignItems: 'center',
        // borderRadius: 10,
        borderBottomLeftRadius: 20,
        width: "100%",
        height: Dimensions.get('window').width / 28
    },
    Touchablebutton: {
        width: Dimensions.get('window').width / 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'white',
        borderRadius: 10,
        height: 30
    },
    removeButton: {
        position: 'absolute',
        top: -15,
        right: -15,
    },
    btncontainer: {
        position: 'absolute',
        flexDirection: 'row',
        marginTop: '10%',
    },
    imageContainer: {
        width: 200,
        height: 200,
        // borderWidth: 2,
        // borderColor: 'black',
    },
    imageWrapper: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    resizeHandle: {
        position: 'absolute',
        bottom: -14,
        right: -13,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        borderRadius: 10,
    },
    resizeHandleInner: {
        width: 10,
        height: 10,
        backgroundColor: '#B9D5FF',
        borderRadius: 1,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        // marginTop: 22,
        marginRight: "8%",
        // backgroundColor: 'red'
    },
    modalView: {
        // backgroundColor: 'red',
        alignItems: 'center',
        // margin: 20,
        width: "50%",
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
        // position: 'absolute',
        borderTopRightRadius: 20,
        padding: 20,
        paddingVertical: 10,
        borderTopLeftRadius: 20,
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

    button: {
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

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        zIndex: 999999,
    },
    buttonnote: {
        zIndex: 9999999,
        width: '10%',
    },
    textInputcontainer: {
        height: '100%',
        width: '100%',
        fontSize: 15,
        position: 'absolute',
        marginTop: 152,
        marginLeft: "9%",
        lineHeight: 24
    },
    textCont: {
        height: '100%',
        width: '100%',
        fontSize: 15,
        position: 'absolute',
        marginTop: 158,
        marginLeft: "9%",
        lineHeight: 24
    },
    prioritydropdown: {
        paddingBottom: 20
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

})