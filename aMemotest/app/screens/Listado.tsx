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
import {collection, query, getDocs, orderBy, limit} from 'firebase/firestore';
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
        <TouchableOpacity
          onPress={() => {
            navigation.replace('Inside');
          }}>
          <Text style={styles.buttonLogout}>Volver</Text>
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
        backgroundColor: '#A9DEF9',
      },
      headerTitleStyle: {
        color: '#fff',
      },
    });
  }, [navigation]);

  const [usuarios, setUsuarios] = useState<any>([]);

  const getAllUsers = async () => {
    const postQuery = query(
      collection(Firestore_DB, 'tiempos'),
      orderBy('tiempo'),
      limit(5),
    );

    const querySnapshot = await getDocs(postQuery);
    const posts = [];

    for (const docSnapshot of querySnapshot.docs) {
      const postData = docSnapshot.data();
      posts.push({id: docSnapshot.id, ...postData});
    }
    setUsuarios(posts);
    setLoading(false);
  };
  useEffect(() => {
    getAllUsers();
  }, []);

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
              <Text style={styles.text}>Nombre: {item.nombre}</Text>
              <Text style={styles.text}>Tiempo: {item.tiempo}</Text>
              <Text style={styles.text}>Fecha: {item.fecha}</Text>
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
    backgroundColor: '#D0F4DE',
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
    backgroundColor: '#FF99C8',
  },
  text: {
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
    fontSize:18
  },
});
