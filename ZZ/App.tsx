import {NavigationContainer} from '@react-navigation/native';
import React, {useState} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import Like from './app/screens/Like';
import Login from './app/screens/Login';
import SplashScreen from './app/screens/SplashScreen';
import Dislike from './app/screens/Dislike';
import Graficos from './app/screens/Graficos';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InsideLayout from './app/screens/Inside';
export type RootStackParamList = {
  Inicio: any;
  Index: any;
  Inside: any;
  Login: any;
  Like: any;
  Dislike: any;
  Graficos:any
};
const Stack = createNativeStackNavigator<RootStackParamList>();
function App(): JSX.Element { 

  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen
          name="Index"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name="Inside"
          component={InsideLayout}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name="Like"
          component={Like}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name="Dislike"
          component={Dislike}
          options={{headerShown: true}}
        />
         <Stack.Screen
          name="Graficos"
          component={Graficos}
          options={{headerShown: true}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
