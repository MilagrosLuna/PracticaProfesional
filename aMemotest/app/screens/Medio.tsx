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

export default function Medio() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View>
          <TouchableOpacity
            onPress={() => {
              navigation.replace('Inside');
            }}>
            <Text style={styles.buttonLogout}>volver</Text>
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

  const animalImages = [
    require('../../assets/herramientas/cerrucho.png'),
    require('../../assets/herramientas/destornillador.png'),
    require('../../assets/herramientas/llave.png'),
    require('../../assets/herramientas/martillo.png'),
    require('../../assets/herramientas/pala.png'),
    require('../../assets/herramientas/cerrucho.png'),
    require('../../assets/herramientas/destornillador.png'),
    require('../../assets/herramientas/llave.png'),
    require('../../assets/herramientas/martillo.png'),
    require('../../assets/herramientas/pala.png'),
  ];

  const [shuffledImages, setShuffledImages] = useState(() =>
    shuffleArray(animalImages),
  );
  const [flippedCards, setFlippedCards] = useState<any>([]);
  const [matchedPairs, setMatchedPairs] = useState<any>([]);
  const [timer, setTimer] = useState(0);
  const startTimer = () => {
    const interval = setInterval(() => {
      setTimer(prevTimer => prevTimer + 1);
    }, 1000); // Actualiza el temporizador cada segundo (1000 ms)

    return interval;
  };
  // Función para mezclar aleatoriamente el array
  function shuffleArray(array: any) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  }

  const handleCardClick = (index: any) => {
    if (
      !gameInProgress ||
      flippedCards.length === 2 ||
      matchedPairs.includes(index)
    ) {
      return;
    }
    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const [firstIndex, secondIndex] = newFlippedCards;

      if (shuffledImages[firstIndex] === shuffledImages[secondIndex]) {
        setMatchedPairs([...matchedPairs, firstIndex, secondIndex]);

        if (matchedPairs.length + 2 === shuffledImages.length) {
          console.log('¡Ganaste!', 'Has encontrado todas las parejas.');
          ToastAndroid.show(
            `Ganaste en ${timer} segundos!!`,
            ToastAndroid.SHORT,
          );
          addJugador();
          clearInterval(timer);
          setGameCompleted(true);
        }
      }

      setTimeout(() => setFlippedCards([]), 1000);
    }
  };

  const [gameInProgress, setGameInProgress] = useState(true);
  const restartGame = () => {
    setFlippedCards([]);
    setMatchedPairs([]);
    setShuffledImages(shuffleArray(animalImages));
    setGameInProgress(true);
    clearInterval(timer);
    setTimer(0);
    setGameCompleted(false); // Reinicia el juego
  };
  const [gameCompleted, setGameCompleted] = useState(false); // Variable para rastrear si todas las parejas se han encontrado

  useEffect(() => {
    if (gameInProgress && !gameCompleted) {
      // Solo inicia el temporizador si el juego está en progreso y no se ha completado
      const interval = startTimer();
      return () => clearInterval(interval);
    }
  }, [gameInProgress, gameCompleted]);
  useEffect(() => {
    if (matchedPairs.length === shuffledImages.length) {
      console.log('¡Ganaste!', 'Has encontrado todas las parejas.');
      clearInterval(timer);
    }
  }, [matchedPairs]);
  const addJugador = async () => {
    const fechaActual = new Date().toISOString();

    try {
      const batch = writeBatch(Firestore_DB);
      const docRef = doc(collection(Firestore_DB, 'tiempos'));
      batch.set(docRef, {
        nombre: Firebase_AUTH?.currentUser?.email?.toUpperCase(),
        tiempo: timer,
        fecha: fechaActual,
      });
      await batch.commit();
      if (Platform.OS === 'android') {
        ToastAndroid.show('Jugador y tiempos guardado', ToastAndroid.SHORT);
      }
    } catch (e) {
      console.error('Error al agregar el documento: ', e);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.floatingButtonsContainer2}>
        <Text style={styles.timerText}>Tiempo: {timer} segundos</Text>
      </View>

      <View style={styles.cardContainer}>
        {shuffledImages.map((image, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => handleCardClick(index)}>
            {flippedCards.includes(index) || matchedPairs.includes(index) ? (
              <Image source={image} style={styles.image} />
            ) : (
              <Image
                source={require('../../assets/dorso.png')}
                style={styles.image}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {matchedPairs.length === shuffledImages.length && (
        <TouchableOpacity
          style={styles.floatingButtonsContainer}
          onPress={restartGame}>
          <Icon name="repeat" size={40} color="white"></Icon>
        </TouchableOpacity>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLogout: {
    fontSize: 21,
    padding: 5,
    margin: 5,
    borderRadius: 10,
    color: '#000',
    backgroundColor: '#FF99C8',
  },
  timerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white', // Cambia el color según tus preferencias
  },
  card: {
    width: 190,
    height: 145,
    margin: 5,
    borderWidth: 1,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  flipped: {
    backgroundColor: '#A9DEF9',
  },
  floatingButtonsContainer: {
    backgroundColor: '#f000ff',
    margin: 5,
    padding: 10,
    borderRadius: 10,
    position: 'absolute',
    bottom: 20,
    right: 20,
    textAlign: 'center',
    flexDirection: 'row',
  },
  floatingButtonsContainer2: {
    backgroundColor: '#f000ff',
    padding: 3,
    borderRadius: 10,
    position: 'absolute',
    top: 5,
    textAlign: 'center',
    zIndex: 5,
    flexDirection: 'row',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  containerMain: {
    alignItems: 'center',
    display: 'flex',
  },
});
