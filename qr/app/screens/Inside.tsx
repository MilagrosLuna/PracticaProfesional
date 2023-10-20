import React, {useEffect, useLayoutEffect, useState} from 'react';
import {Text, TouchableOpacity, View, StyleSheet, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {RootStackParamList} from '../../App';
import {Firebase_AUTH, Firestore_DB} from '../../FirebaseConfig';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import Toast from 'react-native-simple-toast';

type QRDatabase = {
  [key: string]: number;
};
const qrCodesDatabase: QRDatabase = {
  '8c95def646b6127282ed50454b73240300dccabc': 10,
  'ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172 ': 50,
  '2786f4877b9091dcad7f35751bfcf5d5ea712b2f': 100,
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    width: '100%',
  },
  headerText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0, 122, 255)',
  },
  buttonLogout: {
    fontSize: 21,
    padding: 5,
    borderRadius: 10,
    color: '#000',
    backgroundColor: '#D2FFFA',
  },
  centerText: {
    fontSize: 18,
    padding: 32,
    color: '#000',
  },
  buttonContainer: {
    marginTop: 20,
  },
  text: {
    color: '#000',
  },
  scannedCodesContainer: {
    margin: 5,
  },
  scannedCode: {
    fontSize: 18,
    color: '#000',
    marginBottom: 5,
  },
});
export default function InsideLayout() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [userCredits, setUserCredits] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userScannedCodes, setUserScannedCodes] = useState<any>([]);

  const handleScanQRCode = async (scannedQRCode: any) => {
    console.log(scannedQRCode);
    console.log(qrCodesDatabase[scannedQRCode.data]);
    if (qrCodesDatabase[scannedQRCode.data]) {
      const creditsToAdd = qrCodesDatabase[scannedQRCode.data];
      const user = Firebase_AUTH.currentUser;
      if (!user) {
        console.log('Usuario no autenticado.');
        return;
      }
      const userId = user.uid;
      const userDocRef = doc(collection(Firestore_DB, 'users'), userId);
      try {
        const userSnapshot = await getDoc(userDocRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          const userPerfil = userData?.perfil;
          const userScannedCodes = userData?.qrScaneados || [];

          if (userPerfil === 'admin') {
            if (userScannedCodes.length < 6) {
              userScannedCodes.push(scannedQRCode.data);
              await updateDoc(userDocRef, {
                qrScaneados: userScannedCodes,
              });

              setUserCredits(userCredits + creditsToAdd);
              setUserScannedCodes(userScannedCodes);
              Toast.show(
                'Código QR agregado con éxito para el admin.',
                Toast.SHORT,
              );

              console.log('Código QR agregado con éxito para el admin.',userScannedCodes);
            } else {
              Toast.show(
                'Has alcanzado el límite de intentos de acumulación para el admin.',
                Toast.SHORT,
              );
              console.log(
                'Has alcanzado el límite de intentos de acumulación para el admin.',
              );
            }
          } else {
            if (userScannedCodes.length < 3) {
              if (!userScannedCodes.includes(scannedQRCode.data)) {
                userScannedCodes.push(scannedQRCode.data);
                await updateDoc(userDocRef, {
                  qrScaneados: userScannedCodes,
                });

                setUserCredits(userCredits + creditsToAdd);
                setUserScannedCodes(userScannedCodes);

                Toast.show('Código QR agregado con éxito.', Toast.SHORT);
                console.log('Código QR agregado con éxito.');
              } else {
                Toast.show(
                  'Este código QR ya ha sido escaneado por ti.',
                  Toast.SHORT,
                );
                console.log('Este código QR ya ha sido escaneado por ti.');
              }
            } else {
              Toast.show(
                'Has alcanzado el límite de intentos de acumulación.',
                Toast.SHORT,
              );
              console.log(
                'Has alcanzado el límite de intentos de acumulación.',
              );
            }
          }
        } else {
          Toast.show('El usuario no existe en la base de datos.', Toast.SHORT);
          console.log('El usuario no existe en la base de datos.');
        }
      } catch (error) {
        Toast.show('Error al agregar el código QR: ' + error, Toast.SHORT);
        console.error('Error al agregar el código QR:', error);
      }
    } else {
      Toast.show('Código QR no válido.', Toast.SHORT);
      console.log('Código QR no válido.');
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View>
          <TouchableOpacity onPress={handlerSingOut}>
            <Text style={styles.buttonLogout}>Salir</Text>
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
        backgroundColor: '#07BEB8',
      },
      headerTitleStyle: {
        color: '#fff',
      },
    });
  }, [navigation]);

  const handleResetCredits = async () => {
    setUserCredits(0);
    setUserScannedCodes([]);

    const user = Firebase_AUTH.currentUser;
    if (user) {
      const userId = user.uid;
      const userDocRef = doc(collection(Firestore_DB, 'users'), userId);

      try {
        await updateDoc(userDocRef, {
          qrScaneados: [],
        });

        Toast.show(
          'Códigos QR del usuario reiniciados y actualizados.',
          Toast.SHORT,
        );
        console.log(
          'Códigos QR del usuario reiniciados y actualizados.',
        );
      } catch (error) {
        Toast.show(
          'Error al reiniciar los códigos QR en la base de datos: ' + error,
          Toast.SHORT,
        );
        console.error(
          'Error al reiniciar los códigos QR en la base de datos:',
          error,
        );
      }
    }
  };

  async function handlerSingOut() {
    await Firebase_AUTH.signOut()
      .then(() => {
        navigation.replace('Login');
      })
      .catch((error: any) => console.log(error));
  }

  useEffect(() => {
    const fetchUserData = async () => {
      const user = Firebase_AUTH.currentUser;

      if (user) {
        const userId = user.uid;

        const usersCollection = collection(Firestore_DB, 'users');
        const userQuery = query(usersCollection, where('uid', '==', userId));

        try {
          const querySnapshot = await getDocs(userQuery);

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            const userPerfil = userData.perfil;

            if (userPerfil === 'admin') {
              setIsAdmin(true);
            }
          }
        } catch (error) {
          Toast.show(
            'Error al obtener datos del usuario: ' + error,
            Toast.SHORT,
          );
          console.error('Error al obtener datos del usuario:', error);
        }
      }
    };

    fetchUserData();

    const loadUserScannedCodes = async () => {
      const user = Firebase_AUTH.currentUser;
      if (user) {
        const userId = user.uid;
        const userDocRef = doc(collection(Firestore_DB, 'users'), userId);
        try {
          const userSnapshot = await getDoc(userDocRef);
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            const userScannedCodes = userData?.qrScaneados || [];
            let totalCredits = 0;
            userScannedCodes.forEach((code: any) => {
              if (qrCodesDatabase[code]) {
                totalCredits += qrCodesDatabase[code];
              }
            });
            setUserScannedCodes(userScannedCodes);

            setUserCredits(totalCredits);
          }
        } catch (error) {
          Toast.show(
            'Error al obtener los códigos QR escaneados por el usuario: ' +
              error,
            Toast.SHORT,
          );
          console.error(
            'Error al obtener los códigos QR escaneados por el usuario:',
            error,
          );
        }
      }
    };

    loadUserScannedCodes();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Saldo de Créditos: {userCredits}</Text>
        <Button title="Reiniciar Créditos" onPress={handleResetCredits} />
      </View>

      {userScannedCodes.length > 0 && (
        <View style={styles.scannedCodesContainer}>
          <Text style={styles.headerText}>Códigos QR escaneados:</Text>
          {userScannedCodes.map((code: string, index: number) => (
            <Text style={styles.scannedCode} key={index}>
              {code}
            </Text>
          ))}
        </View>
      )}

      <QRCodeScanner
        onRead={handleScanQRCode}
        flashMode={'off'}
        reactivate={true}
        reactivateTimeout={3000}       
      />
    </View>
  );
}
