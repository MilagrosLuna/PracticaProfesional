import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import {BarChart, PieChart} from 'react-native-chart-kit';
import {Firebase_AUTH, Firestore_DB} from '../../FirebaseConfig';
import {
  query,
  getDocs,
  doc,
  getDoc,
  collection,
  orderBy,
} from 'firebase/firestore';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../App';

function Graficos(): JSX.Element {
  const [likeData, setLikeData] = useState<any[]>([]);
  const [dislikeData, setDislikeData] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [selectedindex, setSelectedindex] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    getAllLikePictures();
    getAllDislikePictures();
  }, []);

  const getAllLikePictures = async () => {
    try {
      const postQuery = query(
        collection(Firestore_DB, 'PostLike'),
        orderBy('fecha', 'desc'),
      );
      const querySnapshot = await getDocs(postQuery);
      const likePosts: any[] = [];

      for (const docSnapshot of querySnapshot.docs) {
        const postData = docSnapshot.data();
        const userId = postData.uniqueId;
        const userDocRef = doc(Firestore_DB, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();

        likePosts.push({
          id: docSnapshot.id,
          ...postData,
          userName: userData?.perfil,
        });
      }

      setLikeData(likePosts);
    } catch (error) {
      console.error('Error al obtener los datos de PostLike:', error);
    }
  };

  const getAllDislikePictures = async () => {
    try {
      const postQuery = query(
        collection(Firestore_DB, 'PostDislike'),
        orderBy('fecha', 'desc'),
      );
      const querySnapshot = await getDocs(postQuery);
      const dislikePosts: any[] = [];

      for (const docSnapshot of querySnapshot.docs) {
        const postData = docSnapshot.data();
        const userId = postData.uniqueId;
        const userDocRef = doc(Firestore_DB, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();

        dislikePosts.push({
          id: docSnapshot.id,
          ...postData,
          userName: userData?.perfil,
        });
      }

      setDislikeData(dislikePosts);
    } catch (error) {
      console.error('Error al obtener los datos de PostDislike:', error);
    }
  };
  const predefinedColors = [
    '#FF5733',
    '#33FF57',
    '#5733FF',
    '#FFFF33',
    '#33FFFF',
    '#FF33FF',
    '#FF5733',
    '#33FF57',
    '#5733FF',
    '#FFFF33',
    '#33FFFF',
    '#FF33FF',
    '#FF5733',
    '#33FF57',
    '#5733FF',
    '#FFFF33',
    '#33FFFF',
    '#FF33FF',
  ];

  // Función para obtener un color de la lista predefinida
  const getColor = (index: any) => {
    return predefinedColors[index % predefinedColors.length];
  };

  const renderImageNumbers = (data: any[]) => {
    return (
      <ScrollView horizontal style={styles.imageNumbersContainer}>
        {data.map((post, index) => (
          <TouchableOpacity
            key={index} // Usar el índice como clave
            onPress={() => handleImageClick(post, index)}
            style={{
              backgroundColor: getColor(index),
              borderRadius: 10,
              padding: 10,
              margin: 5,
            }}>
            <Text style={styles.imageNumberText}>{index + 1}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const handleImageClick = (post: any, index: number) => {
    // Mostrar el modal con la imagen y el ID
    setSelectedImage(post);
    setSelectedindex(index + 1);
    setModalVisible(true);
  };
  const GoHome = () => {
    navigation.replace('Inside');
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View>
          <Text style={{color: '#fff'}}>Graficos</Text>
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Cosas Lindas</Text>
        <PieChart
          data={likeData.map((post, index) => ({
            name: post.userName.toString(),
            value: post.votes,
            color: getColor(index),
            legendFontSize:20
          }))}
          width={400}
          height={290}
          chartConfig={{
            backgroundGradientFrom: '#f0bbe3',
            backgroundGradientTo: '#f0bbe3',
            color: (opacity = 1) => `rgba(108, 0, 121, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },          
            propsForHorizontalLabels:{
              fontSize:16
            }
          }}
          absolute={true}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="15"
        />
        {/* {renderImageNumbers(likeData)} */}
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Cosas Feas</Text>
        <BarChart
          data={{
            labels: dislikeData.map((post, index) => post.userName.toString()),
            datasets: [
              {
                data: dislikeData.map(post => post.votes),
              },
            ],
          }}
          width={400}
          height={300}
          yAxisSuffix=" votos"
          yAxisLabel=""
          chartConfig={{
            backgroundGradientFrom: '#f0bbe3',
            backgroundGradientTo: '#f0bbe3',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(108, 0, 121, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForLabels:{
              fontSize:16
            }
          }}
        />
        {/* {renderImageNumbers(dislikeData)} */}
      </View>
      {/* 
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          {selectedImage && (
            <>
              <Image
                source={{uri: 'data:image/png;base64,' + selectedImage.imagen}}
                style={styles.image}
              />
              <Text>ID de la imagen: {selectedImage.id}</Text>
              
            </>
          )}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}>
            <Text>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0bbe3',
    padding: 10,
    fontSize:26
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
  chartContainer: {
    margin:5,
    padding:5
  },
  chartTitle: {
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imageNumbersContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  imageNumber: {
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
    borderRadius: 20,
  },
  imageNumberText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 5,
  },
});

export default Graficos;
