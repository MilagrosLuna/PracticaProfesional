import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {collection, query, getDocs} from 'firebase/firestore';
import {Firebase_AUTH, Firestore_DB} from '../../FirebaseConfig';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';

export default function Listado() {
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
    const currentUser = Firebase_AUTH.currentUser;
    const userId = currentUser ? currentUser.uid : null; // Supongamos que el ID del usuario se encuentra en la propiedad 'uid'

    navigation.setOptions({
      headerRight: () => (
        <View>
          <TouchableOpacity onPress={handlerSingOut}>
            <Text style={styles.buttonLogout}>Salir</Text>
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => {
        if (userId === 'uwttfcghS6bXAqSsVlRrnAZf1Fp2') {
          // Mostrar el botón "Alta" solo si el ID del usuario es igual a '3'
          return (
            <View>
              <TouchableOpacity
                onPress={() => {
                  navigation.replace('Inside');
                }}>
                <Text style={styles.buttonLogout}>Alta</Text>
              </TouchableOpacity>
            </View>
          );
        } else {
          return null; // No mostrar el botón "Alta" si el ID del usuario no es igual a '3'
        }
      },
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

  const [usuarios, setUsuarios] = useState<any>([]);

  const getAllUsers = async () => {
    const postQuery = query(collection(Firestore_DB, 'usuarios'));

    const querySnapshot = await getDocs(postQuery);
    const posts = [];

    for (const docSnapshot of querySnapshot.docs) {
      const postData = docSnapshot.data();
      const imagen = convertBase64ToImageURL(postData.foto);
      posts.push({id: docSnapshot.id, ...postData, imagen});
    }
    setUsuarios(posts);
    setLoading(false);
  };
  useEffect(() => {
    getAllUsers();
  }, []);

  function convertBase64ToImageURL(base64: any) {
    if (base64) {
      const base64Content = base64.replace(/^data:image\/jpeg;base64,/, '');
      return `data:image/jpeg;base64,${base64Content}`;
    }
    return '';
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={usuarios}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={styles.card}>
              <View style={styles.imageContainer}>
                <Image style={styles.image} source={{uri: item.imagen}} />
              </View>
              <Text style={styles.text}>DNI: {item.dni}</Text>
              <Text style={styles.text}>Nombre: {item.nombre}</Text>
              <Text style={styles.text}>Apellido: {item.apellido}</Text>
              <Text style={styles.text}>Correo: {item.correo}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    backgroundColor: '#fccccf',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  buttonLogout: {
    fontSize: 21,
    padding: 5,
    borderRadius: 10,
    color: '#fff',
    backgroundColor: '#FD151B',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  text: {
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
});
