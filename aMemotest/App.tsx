import {NavigationContainer} from '@react-navigation/native';
import React, {useState} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import Login from './app/screens/Login';
import SplashScreen from './app/screens/SplashScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import InsideLayout from './app/screens/Inside';
import Facil from './app/screens/Facil';
import Medio from './app/screens/Medio';
import Dificil from './app/screens/Dificil';
import Listado from './app/screens/Listado';
export type RootStackParamList = {
  Facil: any;
  Index: any;
  Inside: any;
  Login: any;
  Medio: any;
  Dificil: any;
  Listado: any;
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
          name="Facil"
          component={Facil}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name="Medio"
          component={Medio}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name="Dificil"
          component={Dificil}
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
