import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ToastAndroid,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import {Firebase_AUTH, Firestore_DB} from '../../FirebaseConfig';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export default function InsideLayout() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  // const [buttonImages, setButtonImages] = useState<any>({
  //   image1: require('../../assets/animales/uni.png'),
  //   image2: require('../../assets/animales/dino.png'),
  //   image3: require('../../assets/animales/panda.png'),
  // });
  async function handlerSingOut() {
    await Firebase_AUTH.signOut()
      .then(() => {
        navigation.replace('Login');
      })
      .catch((error: any) => console.log(error));
  }
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View>
          <TouchableOpacity onPress={handlerSingOut}>
            <Text style={styles.buttonLogout}>Salir</Text>
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <View>
          <TouchableOpacity
            onPress={() => {
              navigation.replace('Listado');
            }}>
            <Text style={styles.buttonLogout}>Listado</Text>
          </TouchableOpacity>
        </View>
      ),
      headerTitle: () => (
        <Text style={{color: '#000'}}>
          {Firebase_AUTH?.currentUser?.email?.toUpperCase()}
        </Text>
      ),
      headerTintColor: '#000',
      headerTitleAlign: 'center',
      headerBackButtonMenuEnabled: false,
      headerStyle: {
        backgroundColor: '#A9DEF9',
      },
      headerTitleStyle: {
        color: '#000',
      },
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.buttons, {flex: 1}]}
          onPress={() => {
            navigation.replace('Facil');
          }}>
          <Text style={styles.Text}>Nivel Fácil</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttons, {flex: 1}]}
          onPress={() => {
            navigation.replace('Medio');
          }}>
          <Text style={styles.Text}>Nivel Medio</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttons, {flex: 1}]}
          onPress={() => {
            navigation.replace('Dificil');
          }}>
          <Text style={styles.Text}>Nivel Difícil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLogout: {
    fontSize: 21,
    padding: 5,
    margin: 5,
    borderRadius: 10,
    color: '#000',
    backgroundColor: '#E4C1F9',
  },
  buttons: {
    fontSize: 21,
    padding: 5,
    margin: 5,
    borderRadius: 10,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#000',
    backgroundColor: '#FF99C8',
  },
  Text: {
    fontSize: 38,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'column',
    width: 400,
    textAlign: 'center',
    height: 760,
    justifyContent: 'space-around',
  },
});
