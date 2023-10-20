import React, {useState, useLayoutEffect, useEffect} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Image,
  ToastAndroid,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  CameraOptions,
  ImageLibraryOptions,
  ImagePickerResponse,
} from 'react-native-image-picker';
import {RootStackParamList} from '../../App';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {Firebase_AUTH} from '../../FirebaseConfig';
import {Firebase_APP} from '../../FirebaseConfig';
import {Firestore_DB} from '../../FirebaseConfig';
import {initializeApp} from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
  writeBatch,
  getDoc,
  orderBy,
  runTransaction,
} from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

function Like(): JSX.Element {
  const [selectedImage, setSelectedImage] = useState<any>([]);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [totalPost, settotalPost] = useState<any>([]);
  const [newPost, setNewPost] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  const takePicture = () => {
    launchCamera({mediaType: 'photo', includeBase64: true}, async response => {
      if (response.assets && response.assets.length > 0) {
        //const imagen = response.assets[0].uri;
        const selectedImageUris = response.assets.map(asset => asset.base64);
        setSelectedImage(selectedImageUris);
        // console.log(selectedImageUris.toString());
        setNewPost(response.assets.length);

        await addPost(selectedImageUris);
      }
    });
  };
  const pickPicture = async () => {
    const response = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 0,
      includeBase64: true,
    });
    var validacion = false;
    var iamgen = null;
    if (response) {
      if (response.assets && response.assets.length > 0) {
        //const imagen = response.assets[0].uri;
        //  console.log(response);
        const selectedImageUris = response.assets.map(asset => asset.base64);
        setSelectedImage(selectedImageUris);
        console.log(response.assets);
        setNewPost(response.assets.length);
        validacion = true;
        iamgen = selectedImageUris;
      }
    }
    if (validacion) {
      await addPost(iamgen);
    }
  };

  const addPost = async (imagen: any) => {
    const createdAt = new Date().toISOString();
    try {
      const batch = writeBatch(Firestore_DB);
      //console.log(selectedImage);
      //console.log(imagen);
      for (const base64 of imagen) {
        const docRef = doc(collection(Firestore_DB, 'PostLike'));
        batch.set(docRef, {
          uniqueId: Firebase_AUTH.currentUser?.uid,
          imagen: base64,
          fecha: createdAt,
          voters: [],
          votes: 0,
        });
      }
      await batch.commit();

      if (Platform.OS === 'android') {
        ToastAndroid.show(`${imagen.length} added`, ToastAndroid.SHORT);
      }
      getAllPictures();
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };
  const GoHome = () => {
    navigation.replace('Inside');
  };
  const getAllPictures = async () => {
    const postQuery = query(
      collection(Firestore_DB, 'PostLike'),
      orderBy('fecha', 'desc'),
    );

    const querySnapshot = await getDocs(postQuery);
    const posts: any[] = [];

    for (const docSnapshot of querySnapshot.docs) {
      const postData = docSnapshot.data();
      const userId = postData.uniqueId;

      const userDocRef = doc(Firestore_DB, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();
      posts.push({id: docSnapshot.id, ...postData, userName: userData?.perfil});
    }

    settotalPost(posts);
  };
  const handleVote = async (postId: string, voteType: 'like' | 'dislike') => {
    try {
      const postRef = doc(collection(Firestore_DB, 'PostLike'), postId);

      await runTransaction(Firestore_DB, async transaction => {
        const postDoc = await transaction.get(postRef);
        const postData = postDoc.data();

        if (!postData) {
          console.error('La publicación no existe.');
          return;
        }

        const currentUserUid = Firebase_AUTH.currentUser?.uid;

        if (!currentUserUid) {
          console.error('El usuario no está autenticado.');
          return;
        }

        // Check if the user has already voted
        const hasVoted = postData.voters.includes(currentUserUid);

        if (hasVoted) {
          // User has already voted, remove their vote
          postData.voters = postData.voters.filter(
            (uid: string) => uid !== currentUserUid,
          );
        } else {
          // User has not voted, add their vote
          postData.voters.push(currentUserUid);
        }

        // Update the votes count based on the length of voters array
        postData.votes = postData.voters.length;

        // Update the document in Firestore
        transaction.update(postRef, postData);
      });

      console.log(`Votaste "${voteType}" en esta publicación.`);
      getAllPictures()
        .then(() => {
          setIsLoading(false); // Establecer isLoading en false cuando la carga se completa
        })
        .catch(error => {
          setIsLoading(false); // Asegúrate de manejar errores y establecer isLoading en false
          console.error('Error fetching data:', error);
        });
    } catch (error) {
      console.error(`Error al votar "${voteType}":`, error);
    }
  };
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);

    // Obtenemos el día, mes y año
    const day = date.getDate();
    const month = date.getMonth() + 1; // Sumamos 1 porque los meses comienzan desde 0
    const year = date.getFullYear();

    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Formateamos la fecha y hora como dd/mm/yyyy hh:mm
    const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}`;

    return formattedDateTime;
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View>
          <Text style={{color: '#fff'}}>CosasLindas</Text>
        </View>
      ),
      headerRight: () => (
        <View>
          <TouchableOpacity onPress={GoHome}>
            <Text style={styles.button}>Volver</Text>
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
  useEffect(() => {
    setIsLoading(true);

    getAllPictures()
      .then(() => {
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        console.error('Error fetching data:', error);
      });
  }, []);
  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView style={styles.scrollView}>
          {totalPost.map((post: any, index: number) => (
            <View key={index} style={styles.card}>
              <Image
                resizeMode="cover"
                resizeMethod="scale"
                style={styles.image}
                source={{uri: 'data:image/png;base64,' + post.imagen}}
              />
              <Text style={styles.text}>
                {'Publicado el: ' + formatDate(post.fecha)}
              </Text>
              <Text style={styles.text}>{post.userName}</Text>
              <View style={styles.buttonVoteContainer}>
                <TouchableOpacity
                  onPress={() => {
                    handleVote(post.id, 'like');
                  }}
                  style={[
                    styles.voteButton,
                    {
                      backgroundColor: post.voters.includes(
                        Firebase_AUTH.currentUser?.uid,
                      )
                        ? 'green'
                        : 'red',
                    },
                  ]}>
                  <Icon name="thumbs-o-up" size={24} color="white"></Icon>
                  <Text style={styles.voteButtonText}>
                    {post.voters.includes(Firebase_AUTH.currentUser?.uid)
                      ? 'Votado'
                      : 'Votar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.floatingButtonsContainer}>
        <TouchableOpacity onPress={pickPicture} style={styles.floatingButton}>
          <Icon name="photo" size={24} color="white"></Icon>
          {/* <Icon name="folder-open" size={24} color="black"></Icon> */}
        </TouchableOpacity>
        <TouchableOpacity onPress={takePicture} style={styles.floatingButton}>
          <Icon name="camera" size={24} color="white"></Icon>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.replace('Graficos');
          }}
          style={styles.floatingButton}>
          <Icon name="pie-chart" size={24} color="white"></Icon>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0bbe3',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: '#f763d5',
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 1,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 5,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'green',
  },
  voteButtonText: {
    color: 'white',
    marginLeft: 8,
  },
  floatingButtonsContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    textAlign: 'center',
    flexDirection: 'row',
  },
  floatingButton: {
    backgroundColor: '#6C0079',
    width: 50,
    height: 50,
    borderRadius: 10,
    margin: 5,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    elevation: 2, // Agregamos una elevación mayor para que los botones flotantes estén por encima de las tarjetas
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
  },
  button: {
    backgroundColor: '#56f5b3',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    color: 'black',
    marginTop: 8,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  buttonVoteContainer: {
    flexDirection: 'row', // Alinear los botones horizontalmente
    justifyContent: 'space-between', // Espacio igual entre los botones
    marginTop: 8, // Margen superior para separarlos de la imagen y el texto
  },
  // Estilos para el botón "Like"
  likeButton: {
    backgroundColor: 'green', // Color de fondo para el botón "Like"
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, // Haz que el botón ocupe el 50% del espacio disponible (si solo hay 2 botones)
    marginRight: 4, // Margen derecho para separar los botones
  },
  // Estilos para el botón "Dislike"
  dislikeButton: {
    backgroundColor: 'red', // Color de fondo para el botón "Dislike"
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, // Haz que el botón ocupe el 50% del espacio disponible (si solo hay 2 botones)
    marginLeft: 4, // Margen izquierdo para separar los botones
  },
});

export default Like;
