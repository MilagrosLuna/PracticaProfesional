import {NavigationContainer} from '@react-navigation/native';
import React, {useState} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import Login from './app/screens/Login';
import SplashScreen from './app/screens/SplashScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InsideLayout from './app/screens/Inside';
import Listado from './app/screens/Lista';
export type RootStackParamList = {
  Inicio: any;
  Index: any;
  Inside: any;
  Login: any;
  Listado: any;
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
          name="Listado"
          component={Listado}
          options={{headerShown: true}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
