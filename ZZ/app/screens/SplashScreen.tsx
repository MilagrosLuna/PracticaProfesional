import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import * as Animatable from 'react-native-animatable';

const SplashScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Login');
    }, 2000);
  }, []);
  return (
    <View style={styles.logoContainer}>
      <Animatable.Text animation="rubberBand" style={styles.text}>
        4°A
      </Animatable.Text>
      <Animatable.Image
        animation="flash" // Puedes usar diferentes animaciones aquí
        duration={1500}
        source={require('../assets/logo.png')}
        style={styles.logo}
      />
      <Animatable.Text animation="wobble" style={styles.text}>
        Luna Milagros
      </Animatable.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'purple',
  },
  logo: {
    width: 250, // Ajusta el tamaño del logo según tus necesidades
    height: 250,
  },
  text: {
    marginTop: 20,
    color: '#fff',
    fontSize: 30,
  },
});

export default SplashScreen;
