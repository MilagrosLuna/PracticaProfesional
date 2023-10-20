import React, {useLayoutEffect} from 'react';
import {Text, View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import {Firebase_AUTH} from '../../FirebaseConfig';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cards: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit:'cover'
  },
  button: {
    backgroundColor: '#20A4F3',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    color: 'white',
  },
});

export default function InsideLayout() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  async function handlerSingOut() {
    await Firebase_AUTH.signOut()
      .then(() => {
        navigation.replace('Login');
      })
      .catch((error: any) => console.log(error));
  }
  function volver() {
    navigation.replace('Inside');
  }
  const handlerCamera = (type: string) => {
    type == 'Like' ? navigation.replace('Like') : navigation.replace('Dislike');
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View>
          <TouchableOpacity onPress={handlerSingOut}>
            <Text style={styles.button}>Salir</Text>
          </TouchableOpacity>
        </View>
      ),
      headerTitle: () => (
        <Text style={{color: '#fff'}}>
          {Firebase_AUTH?.currentUser?.email?.toUpperCase()}
        </Text>
      ),
      headerTintColor: '#fff',
      headerTitleAlign: 'center',
      headerBackButtonMenuEnabled: false,
      headerStyle: {
        backgroundColor: '#6C0079',
      },
      headerTitleStyle: {
        color: '#fff',
      },
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.cards}
        onPress={() => handlerCamera('Like')}>
        <Image
          style={styles.image}
          source={require('../assets/lujo.jpg')}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.cards}
        onPress={() => handlerCamera('Dislike')}>
        <Image
          style={styles.image}
          source={require('../assets/ruina.jpeg')}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
}
