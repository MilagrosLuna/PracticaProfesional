import React, {useEffect} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
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
    <LinearGradient colors={['#3479bf', '#1863ad']} style={styles.container}>
      <View style={styles.logoContainer}>
        <Animatable.Text animation="rubberBand" style={styles.text}>
          4°A
        </Animatable.Text>
        <Animatable.Text animation="wobble" style={styles.text}>
          Luna Milagros
        </Animatable.Text>
        <Animatable.Image
          animation="flash" // Puedes usar diferentes animaciones aquí
          duration={2000}
          source={require('../assets/logo.png')}
          style={styles.logo}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 250, // Ajusta el tamaño del logo según tus necesidades
    height: 250,
  },
  text: {
    marginTop: 20,
    color: '#000',
    fontSize: 30,
  },
});

export default SplashScreen;
