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
    <LinearGradient colors={['#6B090C', '#8F0C0F']} style={styles.container}>
      <View style={styles.logoContainer}>
       
        <Animatable.Text animation="rubberBand" style={styles.text}>
          4°A
        </Animatable.Text>
        <Animatable.Image
          animation="flash" // Puedes usar diferentes animaciones aquí
          duration={2000}
          source={require('../assets/logo.png')}
          style={styles.logo}
        />
        <Animatable.Text animation="wobble" style={styles.text}>
          Luna Milagros
        </Animatable.Text>
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
    width: 160,
    height: 200,
  },
  text: {
    marginTop: 20,
    color: '#fff',
    fontSize: 30,
  },
});

export default SplashScreen;
