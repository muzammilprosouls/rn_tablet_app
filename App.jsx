import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { AuthProvider } from './app/context/auth.js';
import { TasksProvider } from './app/context/Task.js';
import MainNavigation from './app/Navigation/index.js';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView, gestureHandlerRootHOC } from 'react-native-gesture-handler';
// import Login from './app/screens/Login.js';

function App() {

  return (
    <>
      <StatusBar barStyle="light-content" hidden={false} backgroundColor="black" translucent={true} />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <TasksProvider>
            <MainNavigation style={{ backgroundColor: "black" }} />
          </TasksProvider>
        </AuthProvider>
      </GestureHandlerRootView>
      {/* <Login /> */}
    </>
  );
}

export default App;