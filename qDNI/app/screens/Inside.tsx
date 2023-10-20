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
import QRCodeScanner from 'react-native-qrcode-scanner';
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
import {launchImageLibrary} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import qs from 'qs';

export default function InsideLayout() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(true); // Estado para mostrar/ocultar el spinner

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
        <Text style={{color: '#fff'}}>
          {Firebase_AUTH?.currentUser?.email?.toUpperCase()}
        </Text>
      ),
      headerTintColor: '#fff',
      headerTitleAlign: 'center',
      headerBackButtonMenuEnabled: false,
      headerStyle: {
        backgroundColor: '#6B090C',
      },
      headerTitleStyle: {
        color: '#fff',
      },
    });
  }, [navigation]);
  const [userScannedData, setUserScannedData] = useState({
    dni: '',
    nombre: '',
    apellido: '',
    correo: '',
    foto: '',
    clave: '',

    clave2: '',
  });
  const [userImage, setUserImage] = useState<any>(null);
  const [scanning, setScanning] = useState(false);

  // Función para manejar el escaneo de QR
  function handleQRRead(data: any) {
    // Procesa la información del código QR y actualiza el estado
    const qrdata = data.data;
    console.log(qrdata);
    const qrFields = qrdata.split('@');

    if (qrFields.length >= 12) {
      // Suponemos que es un DNI viejo
      const dni = qrFields[1].replace(/\s/g, '');
      const scannedData = {
        dni: dni,
        nombre: qrFields[5],
        apellido: qrFields[4], 
        correo: '',
        foto: '',
        clave: '',   
        clave2: '',  
      };
      setUserScannedData(scannedData);
    } else if (qrFields.length >= 6) {
      // Suponemos que es un DNI nuevo
      const scannedData = {
        dni: qrFields[4],
        nombre: qrFields[2],
        apellido: qrFields[1], 
        correo: '',
        foto: '',
        clave: '',   
        clave2: '',          
      };
      setUserScannedData(scannedData);
    } else {
      console.error('Los datos del código QR no tienen la estructura esperada');
    }


    console.log(userScannedData);
    // if (qrFields.length >= 8) {
    //   const scannedData = {
    //     dni: qrFields[4],
    //     nombre: qrFields[2],
    //     apellido: qrFields[1],
    //     correo: '',
    //     foto: '',
    //     clave: '',

    //     clave2: '',
    //   };
    //   setUserScannedData(scannedData);
    // } else {
    //   console.error('Los datos del código QR no tienen la estructura esperada');
    // }
    setScanning(false);
  }

  const pickPicture = async () => {
    const response = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    });

    if (response && response.assets && response.assets.length > 0) {
      const selectedImageUri = response.assets[0].uri;
      setUserImage(selectedImageUri);
    }
  };

  const validateDNI = (dni: string) => {
    // Valida que el DNI sea un número de 8 dígitos
    const dniRegex = /^\d{8}$/;
    return dniRegex.test(dni);
  };

  const validateEmail = (email: string) => {
    // Valida que el correo electrónico tenga el formato correcto
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const validateClave = (clave: string, clave2: string) => {
    //valida las contraseñas
    return clave == clave2;
  };

  const addUser = async () => {
    const {dni, nombre, apellido, correo, clave, clave2} = userScannedData;

    // Valida que todos los campos estén completos
    if (
      !dni ||
      !nombre ||
      !apellido ||
      !correo ||
      !userImage ||
      !clave ||
      !clave2
    ) {
      if (Platform.OS === 'android') {
        ToastAndroid.show(
          'Por favor complete todos los campos',
          ToastAndroid.LONG,
        );
      }
      return;
    }

    // Valida el formato del DNI y del correo
    if (!validateDNI(dni)) {
      if (Platform.OS === 'android') {
        ToastAndroid.show('El DNI debe tener 8 dígitos', ToastAndroid.LONG);
      }
      return;
    }

    if (!validateEmail(correo)) {
      if (Platform.OS === 'android') {
        ToastAndroid.show(
          'El correo electrónico no tiene un formato válido',
          ToastAndroid.LONG,
        );
      }
      return;
    }

    if (!validateClave(clave, clave2)) {
      if (Platform.OS === 'android') {
        ToastAndroid.show('Las contraseñas deben coincidir', ToastAndroid.LONG);
      }
      return;
    }

    // Realizar una consulta para verificar si el correo ya existe en la base
    const querySnapshot = await getDocs(
      query(
        collection(Firestore_DB, 'usuarios'),
        where('correo', '==', correo),
      ),
    );

    if (querySnapshot.size > 0) {
      if (Platform.OS === 'android') {
        ToastAndroid.show(
          'El Usuario ya existe en la base!!!',
          ToastAndroid.LONG,
        );
      }
      return;
    }

    const base64Image = await convertImageToBase64(userImage);

    try {
      const batch = writeBatch(Firestore_DB);

      const docRef = doc(collection(Firestore_DB, 'usuarios'));
      batch.set(docRef, {
        foto: base64Image,
        dni: dni,
        nombre: nombre,
        apellido: apellido,
        correo: correo,
        clave: clave,
      });

      await batch.commit();

      if (Platform.OS === 'android') {
        ToastAndroid.show('Usuario agregado,Revise su mail! :D', ToastAndroid.SHORT);
      }
      setUserScannedData({
        dni: '',
        nombre: '',
        apellido: '',
        correo: '',
        foto: '',
        clave: '',
        clave2: '',
      });
      setUserImage(null);
    } catch (e) {
      console.error('Error al agregar el documento: ', e);
    }
  };

  const convertImageToBase64 = async (imageUri: any) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const base64 = await blobToBase64(blob);
      return base64;
    } catch (error) {
      console.error('Error convirtiendo la imagen a base64: ', error);
      return null;
    }
  };

  const blobToBase64 = (blob: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const base64 = reader.result;
        resolve(base64);
      };
      reader.readAsDataURL(blob);
    });
  };
 
  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        {userImage && (
          <Image source={{uri: userImage}} style={styles.userImage} />
        )}

        <Text style={styles.formLabel}>DNI:</Text>
        <TextInput
          style={styles.formInput}
          value={userScannedData.dni}
          onChangeText={text =>
            setUserScannedData({...userScannedData, dni: text})
          }
        />

        <Text style={styles.formLabel}>Nombre:</Text>
        <TextInput
          style={styles.formInput}
          value={userScannedData.nombre}
          onChangeText={text =>
            setUserScannedData({...userScannedData, nombre: text})
          }
        />

        <Text style={styles.formLabel}>Apellido:</Text>
        <TextInput
          style={styles.formInput}
          value={userScannedData.apellido}
          onChangeText={text =>
            setUserScannedData({...userScannedData, apellido: text})
          }
        />

        <Text style={styles.formLabel}>Correo:</Text>
        <TextInput
          style={styles.formInput}
          value={userScannedData.correo}
          onChangeText={text =>
            setUserScannedData({...userScannedData, correo: text})
          }
        />

        <Text style={styles.formLabel}>Clave:</Text>
        <TextInput
          secureTextEntry={true}
          style={styles.formInput}
          value={userScannedData.clave}
          onChangeText={text =>
            setUserScannedData({...userScannedData, clave: text})
          }
        />
        <Text style={styles.formLabel}>Confirmar clave:</Text>
        <TextInput
          secureTextEntry={true}
          style={styles.formInput}
          value={userScannedData.clave2}
          onChangeText={text =>
            setUserScannedData({...userScannedData, clave2: text})
          }
        />

        <TouchableOpacity style={styles.formInput} onPress={pickPicture}>
          <Icon name="photo" size={24} color="black">
            <Text style={styles.formLabela}> Seleccionar imagen</Text>
          </Icon>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => setScanning(true)}>
            <Text style={styles.buttons}>Escanear Datos</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={addUser}>
            <Text style={styles.buttons}>Registrar Usuario</Text>
          </TouchableOpacity>
        </View>
      </View>
      {scanning && (
        <QRCodeScanner
          onRead={handleQRRead}
          reactivate={true}
          reactivateTimeout={3000}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Color de fondo
  },
  formContainer: {
    width: '90%',
    marginBottom: 20, // Separación entre el formulario y el escáner
  },
  buttonLogout: {
    fontSize: 21,
    padding: 5,
    margin: 5,
    borderRadius: 10,
    color: '#fff',
    backgroundColor: '#FD151B',
  },
  buttons: {
    fontSize: 21,
    padding: 5,
    borderRadius: 10,
    color: '#fff',
    backgroundColor: '#E61319',
  },
  formLabel: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
  },
  formLabela: {fontSize: 16, color: 'blue', marginBottom: 5},
  formInput: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    color: '#000',
    padding: 8,
    fontSize: 16,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  buttonContainer: {
    flexDirection: 'row', // Mostrar los botones en una fila
    justifyContent: 'space-around', // Espaciado uniforme entre los botones
  },
});
