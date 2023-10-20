import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Animatable from 'react-native-animatable';

const SplashScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Login');
    }, 2000);
  }, []);

  return (
    <LinearGradient colors={['#8C52FF', '#8f94fb']} style={styles.container}>
      <View style={styles.logoContainer}>
        <Animatable.Image
          animation="bounceIn" // Puedes usar diferentes animaciones aquí
          duration={2000}
          source={require('../../assets/logo.png')}
          style={styles.logo}
        />
        <Animatable.Text animation="slideInDown" style={styles.text}>Luna Milagros 4°A</Animatable.Text>
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
    color: '#fff',
    fontSize: 30,
  },
});

export default SplashScreen;
