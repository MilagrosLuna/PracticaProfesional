import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Modal,
  TouchableHighlight,
  Text,
  Image,
  Animated,
} from 'react-native';
import {RootStackParamList} from '../../App';
import {Firebase_AUTH} from '../../FirebaseConfig';
import Icon from 'react-native-vector-icons/FontAwesome';
import {FAB} from 'react-native-elements';
import FloatingButton from '../componentes/button';
var Sound = require('react-native-sound');
Sound.setCategory('Playback');
function useForceUpdate() {
  const [value, setValue] = useState(0);

  return () => setValue(value => value + 1);
}
const styles = StyleSheet.create({
  containerBig: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#ff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'row',
  },
  logOut: {
    backgroundColor: '#20A4F3',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    color: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#3479bf',
    padding: 5,
  },
  button: {
    height: height * 0.186, // Ocupa el 20% de la altura de la pantalla
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'black', // Cambia el color del texto según tus preferencias
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  floatingButtonsContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'column',
  },
  floatingButton: {
    backgroundColor: 'lightblue',
    width: 80,
    height: 80,
    borderRadius: 25,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagIcon: {
    width: 60,
    height: 60,
  },
  modalsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3479bf',
    padding: 20,
    textAlign: 'center',
  },
  languageContainer: {
    marginBottom: 20, // Espacio entre las opciones de idioma
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1, // Línea divisoria entre opciones de idioma
    borderBottomColor: 'lightgray', // Color de la línea divisoria
  },
  languageText: {
    marginLeft: 10,
    fontSize: 38,
    textAlign: 'center',
    color: '#fff',
  },
  icon: {
    objectfit: 'contain',
    width: '100%',
    height: '100%',
  },
  img: {
    objectfit: 'contain',
    width: '100%',
    height: '100%',
  },
  circle: {
    width: 60,
    height: 60,
    position: 'absolute',
    bottom: 40,
    right: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle2: {
    width: 60,
    height: 60,
    position: 'absolute',
    bottom: 40,
    left: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circlemain: {
    backgroundColor: '#fff',
    width: 70,
    height: 70,
    position: 'absolute',
    bottom: 40,
    right: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
const resources: any = {
  numeros: {
    espanol: {
      image1: require('../../assets/fotos//uno.png'),
      sound1: require('../../assets/sounds/espanol/1E.mp3'),
      image2: require('../../assets/fotos//dos.png'),
      sound2: require('../../assets/sounds/espanol/2E.mp3'),
      image3: require('../../assets/fotos//tres.png'),
      sound3: require('../../assets/sounds/espanol/3E.mp3'),
      image4: require('../../assets/fotos//cuatro.png'),
      sound4: require('../../assets/sounds/espanol/4E.mp3'),
      image5: require('../../assets/fotos//cinco.png'),
      sound5: require('../../assets/sounds/espanol/5E.mp3'),
    },
    ingles: {
      image1: require('../../assets/fotos//uno.png'),
      sound1: require('../../assets/sounds/ingles/1I.mp3'),
      image2: require('../../assets/fotos//dos.png'),
      sound2: require('../../assets/sounds/ingles/2I.mp3'),
      image3: require('../../assets/fotos//tres.png'),
      sound3: require('../../assets/sounds/ingles/3I.mp3'),
      image4: require('../../assets/fotos//cuatro.png'),
      sound4: require('../../assets/sounds/ingles/4I.mp3'),
      image5: require('../../assets/fotos//cinco.png'),
      sound5: require('../../assets/sounds/ingles/5I.mp3'),
    },
    portugues: {
      image1: require('../../assets/fotos//uno.png'),
      sound1: require('../../assets/sounds/portuges/1P.mp3'),
      image2: require('../../assets/fotos//dos.png'),
      sound2: require('../../assets/sounds/portuges/2P.mp3'),
      image3: require('../../assets/fotos//tres.png'),
      sound3: require('../../assets/sounds/portuges/3P.mp3'),
      image4: require('../../assets/fotos//cuatro.png'),
      sound4: require('../../assets/sounds/portuges/4P.mp3'),
      image5: require('../../assets/fotos//cinco.png'),
      sound5: require('../../assets/sounds/portuges/5P.mp3'),
    },
  },
  colores: {
    espanol: {
      image1: require('../../assets/fotos//rojo.png'),
      sound1: require('../../assets/sounds/espanol/rojoE.mp3'),
      image2: require('../../assets/fotos//azul.png'),
      sound2: require('../../assets/sounds/espanol/azulE.mp3'),
      image3: require('../../assets/fotos//verde.png'),
      sound3: require('../../assets/sounds/espanol/verdeE.mp3'),
      image4: require('../../assets/fotos//rosa.png'),
      sound4: require('../../assets/sounds/espanol/rosaE.mp3'),
      image5: require('../../assets/fotos//amarillo.png'),
      sound5: require('../../assets/sounds/espanol/amarilloE.mp3'),
    },
    ingles: {
      image1: require('../../assets/fotos//rojo.png'),
      sound1: require('../../assets/sounds/ingles/rojoI.mp3'),
      image2: require('../../assets/fotos//azul.png'),
      sound2: require('../../assets/sounds/ingles/azulI.mp3'),
      image3: require('../../assets/fotos//verde.png'),
      sound3: require('../../assets/sounds/ingles/verdeI.mp3'),
      image4: require('../../assets/fotos//rosa.png'),
      sound4: require('../../assets/sounds/ingles/rosaI.mp3'),
      image5: require('../../assets/fotos//amarillo.png'),
      sound5: require('../../assets/sounds/ingles/amarilloI.mp3'),
    },
    portugues: {
      image1: require('../../assets/fotos//rojo.png'),
      sound1: require('../../assets/sounds/portuges/rojoP.mp3'),
      image2: require('../../assets/fotos//azul.png'),
      sound2: require('../../assets/sounds/portuges/azulP.mp3'),
      image3: require('../../assets/fotos//verde.png'),
      sound3: require('../../assets/sounds/portuges/verdeP.mp3'),
      image4: require('../../assets/fotos//rosa.png'),
      sound4: require('../../assets/sounds/portuges/rosaP.mp3'),
      image5: require('../../assets/fotos//amarillo.png'),
      sound5: require('../../assets/sounds/portuges/amarilloP.mp3'),
    },
  },
  animales: {
    espanol: {
      image1: require('../../assets/fotos//perro.png'),
      sound1: require('../../assets/sounds/espanol/perroE.mp3'),
      image2: require('../../assets/fotos//vaca.png'),
      sound2: require('../../assets/sounds/espanol/vacaE.mp3'),
      image3: require('../../assets/fotos//gato.png'),
      sound3: require('../../assets/sounds/espanol/gatoE.mp3'),
      image4: require('../../assets/fotos//pulpo.png'),
      sound4: require('../../assets/sounds/espanol/pulpoE.mp3'),
      image5: require('../../assets/fotos//leon.png'),
      sound5: require('../../assets/sounds/espanol/leonE.mp3'),
    },
    ingles: {
      image1: require('../../assets/fotos//perro.png'),
      sound1: require('../../assets/sounds/ingles/perroI.mp3'),
      image2: require('../../assets/fotos//vaca.png'),
      sound2: require('../../assets/sounds/ingles/vacaI.mp3'),
      image3: require('../../assets/fotos//gato.png'),
      sound3: require('../../assets/sounds/ingles/gatoI.mp3'),
      image4: require('../../assets/fotos//pulpo.png'),
      sound4: require('../../assets/sounds/ingles/pulpoI.mp3'),
      image5: require('../../assets/fotos//leon.png'),
      sound5: require('../../assets/sounds/ingles/leonI.mp3'),
    },
    portugues: {
      image1: require('../../assets/fotos//perro.png'),
      sound1: require('../../assets/sounds/portuges/perroP.mp3'),
      image2: require('../../assets/fotos//vaca.png'),
      sound2: require('../../assets/sounds/portuges/vacaP.mp3'),
      image3: require('../../assets/fotos//gato.png'),
      sound3: require('../../assets/sounds/portuges/gatoP.mp3'),
      image4: require('../../assets/fotos//pulpo.png'),
      sound4: require('../../assets/sounds/portuges/pulpoP.mp3'),
      image5: require('../../assets/fotos//leon.png'),
      sound5: require('../../assets/sounds/portuges/leonP.mp3'),
    },
  },
};
const {height, width} = Dimensions.get('window');

export default function InsideLayout() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const forceUpdate = useForceUpdate();
  async function handlerSingOut() {
    await Firebase_AUTH.signOut()
      .then(() => {
        navigation.replace('Login');
      })
      .catch((error: any) => console.log(error));
  }
  const [selectedLanguage, setSelectedLanguage] = useState<any>('ingles');

  const [selectedCategory, setSelectedCategory] = useState<any>('numeros');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSounds, setCurrentSounds] = useState<any>({});
  const [secondModalVisible, setSecondModalVisible] = useState(false);
  const [languageVisible, setLanguageVisible] = useState(false);
  const [themeVisible, setThemeVisible] = useState(false);
  const [buttonImages, setButtonImages] = useState<any>({
    image1: require('../../assets/fotos/uno.png'),
    image2: require('../../assets/fotos/dos.png'),
    image3: require('../../assets/fotos/tres.png'),
    image4: require('../../assets/fotos/cuatro.png'),
    image5: require('../../assets/fotos/cinco.png'),
  });
  const [headerLanguageImage, setHeaderLanguageImage] = useState(
    require('../../assets/languages/inglaterra.png'),
  );
  const [headerCategoryImage, setHeaderCategoryImage] = useState(
    require('../../assets/categories/1.png'),
  );
  const data = [
    {id: '1', text: 'Botón 1', backgroundColor: '#6DD3CE'},
    {id: '2', text: 'Botón 2', backgroundColor: '#C8E9A0'},
    {id: '3', text: 'Botón 3', backgroundColor: '#F7A278'},
    {id: '4', text: 'Botón 4', backgroundColor: '#CC706E'},
    {id: '5', text: 'Botón 5', backgroundColor: '#ECF368'},
  ];

  const handleLanguageButtonPress = () => {
    setModalVisible(true); // Activa el primer modal cuando se presiona el primer botón flotante de idiomas
  };

  const handleLanguageChange = (
    language: 'espanol' | 'ingles' | 'portugues',
  ) => {
    popOut();
    console.log('Seleccionado idioma:', language);
    setSelectedLanguage(language);
    cargarSonidos(); // Vuelve a cargar los sonidos cuando cambias de idioma.

    switch (language) {
      case 'espanol':
        setHeaderLanguageImage(require('../../assets/languages/espana.png'));
        break;
      case 'ingles':
        setHeaderLanguageImage(
          require('../../assets/languages/inglaterra.png'),
        );
        break;
      case 'portugues':
        setHeaderLanguageImage(require('../../assets/languages/portugal.png'));
        break;
    }
  };

  const handleCategoryChange = (
    category: 'animales' | 'colores' | 'numeros',
  ) => {
    popOut2();
    console.log('Seleccionada categoría:', category);
    setSelectedCategory(category);
    setButtonImages(resources[category][selectedLanguage]);
    cargarSonidos(); // Vuelve a cargar los sonidos cuando cambias de categoría.

    switch (category) {
      case 'animales':
        setHeaderCategoryImage(require('../../assets/categories/2.png'));
        break;
      case 'colores':
        setHeaderCategoryImage(require('../../assets/categories/3.png'));
        break;
      case 'numeros':
        setHeaderCategoryImage(require('../../assets/categories/1.png'));
        break;
    }
  };

  const handleSecondButtonPress = () => {
    setSecondModalVisible(true);
  };

  useEffect(() => {
    console.log('Selected Category:', selectedCategory);
    console.log('Selected Language:', selectedLanguage);
    const selectedSounds = resources[selectedCategory][selectedLanguage];
    setCurrentSounds(selectedSounds);

    cargarSonidos();
  }, [selectedCategory, selectedLanguage]);
  function cargarSonidos() {
    const selectedSounds = resources[selectedCategory][selectedLanguage];
    const newSounds = {...currentSounds};

    for (const key in selectedSounds) {
      if (key.startsWith('sound')) {
        const soundKey = `sound${key.substring(5)}`;
        try {
          newSounds[soundKey] = new Sound(
            selectedSounds[key],
            Sound.MAIN_BUNDLE,
            (error: any) => {
              if (error) {
                console.error(`Error al cargar ${soundKey}: ${error}`);
              } else {
                console.log(`${soundKey} cargado correctamente.`);
              }
            },
          );
        } catch (error: any) {
          console.error(`Error al crear ${soundKey}: ${error.message}`);
        }
      }
    }

    setCurrentSounds(newSounds);
  }
  const [buttonHeight, setButtonHeight] = useState(height * 0.16); // Establecer la altura inicial

  var isLandscape = () =>
    Dimensions.get('screen').width > Dimensions.get('screen').height;

  const handleOrientationChange = () => {
    isLandscape = () =>
      Dimensions.get('screen').width < Dimensions.get('screen').height;
    if (isLandscape()) {
      setButtonHeight(height * 0.186);
      console.log(height);
      console.log('wid_' + Dimensions.get('screen').width);
    } else {
      setButtonHeight(width * 0.16);
      console.log(height);
      console.log('wid_' + Dimensions.get('screen').width);
    }
  };

  useLayoutEffect(() => {
    Dimensions.addEventListener('change', handleOrientationChange);
    return () => {};
  }, []);

  const renderButton = (item: any) => {
    const imageKey = `image${item.id}`;
    const soundKey = `sound${item.id}`;
    const styleToApply = selectedCategory == 'colores' ? true : false;
    // var height1 = 0.186;

    // if (isLandscape()) {
    //   height1 = 0.156;
    // } else {
    //   height1 = 0.186;
    // }
    return (
      <TouchableOpacity
        style={[
          {
            backgroundColor: item.backgroundColor,
            height: buttonHeight, //height * height1, // Ocupa el 20% de la altura de la pantalla height: Dimensions.get('window').height * 0.186
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
        onPress={() => {
          const imageSource = buttonImages[imageKey];
          // const sound = resources.numeros[selectedLanguage][soundKey];
          const sound = currentSounds[soundKey];
          console.log('Imagen:', imageSource);
          console.log('Sonido:', soundKey);

          sound.play((success: any) => {
            if (success) {
              console.log('successfully finished playing');
            } else {
              console.log('playback failed due to audio decoding errors');
            }
          });
        }}>
        {styleToApply == true ? (
          <Image
            source={buttonImages[imageKey]}
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '100%',
            }}
          />
        ) : (
          <Image
            source={buttonImages[imageKey]}
            style={{
              width: 70,
              height: 70,
            }}
          />
        )}
      </TouchableOpacity>
    );
  };
  const [icon_1] = useState(new Animated.Value(40));
  const [icon_2] = useState(new Animated.Value(40));
  const [icon_3] = useState(new Animated.Value(40));
  const [icon_4] = useState(new Animated.Value(40));
  const [icon_5] = useState(new Animated.Value(40));
  const [icon_6] = useState(new Animated.Value(40));

  const [pop, setPop] = useState(false);
  const [pop2, setPop2] = useState(false);

  const popIn = () => {
    setPop(true);
    Animated.timing(icon_1, {
      toValue: 130,
      duration: 500,
      useNativeDriver: false,
    }).start();
    Animated.timing(icon_2, {
      toValue: 110,
      duration: 500,
      useNativeDriver: false,
    }).start();
    Animated.timing(icon_3, {
      toValue: 130,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const popOut = () => {
    setPop(false);
    Animated.timing(icon_1, {
      toValue: 40,
      duration: 500,
      useNativeDriver: false,
    }).start();
    Animated.timing(icon_2, {
      toValue: 40,
      duration: 500,
      useNativeDriver: false,
    }).start();
    Animated.timing(icon_3, {
      toValue: 40,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };
  const popIn2 = () => {
    setPop2(true);
    Animated.timing(icon_4, {
      toValue: 130,
      duration: 500,
      useNativeDriver: false,
    }).start();
    Animated.timing(icon_5, {
      toValue: 110,
      duration: 500,
      useNativeDriver: false,
    }).start();
    Animated.timing(icon_6, {
      toValue: 130,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const popOut2 = () => {
    setPop2(false);
    Animated.timing(icon_4, {
      toValue: 40,
      duration: 500,
      useNativeDriver: false,
    }).start();
    Animated.timing(icon_5, {
      toValue: 40,
      duration: 500,
      useNativeDriver: false,
    }).start();
    Animated.timing(icon_6, {
      toValue: 40,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };
  return (
    <View style={styles.containerBig}>
      <Header
        onSignOut={handlerSingOut}
        headerLanguageImage={headerLanguageImage}
        headerCategoryImage={headerCategoryImage}
      />
      <View style={styles.container}>
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({item}) => renderButton(item)}
        />
      </View>

      <View style={{flex: 1, position: 'absolute', bottom: 20, right: 5}}>
        <Animated.View style={[styles.circle, {bottom: icon_1}]}>
          <TouchableOpacity
            onPress={() => {
              handleLanguageChange('espanol');
            }}>
            <Image
              source={require('../../assets/languages/espana.png')}
              style={{width: 60, height: 60}} // Ajusta el tamaño aquí
            />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[styles.circle, {bottom: icon_2, right: icon_2}]}>
          <TouchableOpacity onPress={() => handleLanguageChange('ingles')}>
            <Image
              source={require('../../assets/languages/inglaterra.png')}
              style={{width: 60, height: 60}} // Ajusta el tamaño aquí
            />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[styles.circle, {right: icon_3}]}>
          <TouchableOpacity onPress={() => handleLanguageChange('portugues')}>
            <Image
              source={require('../../assets/languages/portugal.png')}
              style={{width: 60, height: 60}} // Ajusta el tamaño aquí
            />
          </TouchableOpacity>
        </Animated.View>
        <TouchableOpacity
          style={styles.circlemain}
          onPress={() => {
            pop === false ? popIn() : popOut();
          }}>
          <Image
            source={require('../../assets/languages/idioma.png')}
            style={{width: 60, height: 60}} // Ajusta el tamaño aquí
          />
        </TouchableOpacity>
      </View>

      <View style={{flex: 1, position: 'absolute', bottom: 20, left: 5}}>
        <Animated.View style={[styles.circle2, {bottom: icon_4}]}>
          <TouchableOpacity onPress={() => handleCategoryChange('animales')}>
            <Image
              source={require('../../assets/categories/2.png')}
              style={{width: 60, height: 60}} // Ajusta el tamaño aquí
            />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[styles.circle2, {bottom: icon_5, left: icon_5}]}>
          <TouchableOpacity onPress={() => handleCategoryChange('numeros')}>
            <Image
              source={require('../../assets/categories/1.png')}
              style={{width: 60, height: 60}} // Ajusta el tamaño aquí
            />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[styles.circle2, {left: icon_6}]}>
          <TouchableOpacity onPress={() => handleCategoryChange('colores')}>
            <Image
              source={require('../../assets/categories/3.png')}
              style={{width: 60, height: 60}} // Ajusta el tamaño aquí
            />
          </TouchableOpacity>
        </Animated.View>
        <TouchableOpacity
          style={styles.circle2}
          onPress={() => {
            pop2 === false ? popIn2() : popOut2();
          }}>
          <Image
            source={require('../../assets/languages/categoria.png')}
            style={{width: 60, height: 60}} // Ajusta el tamaño aquí
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const Header = ({onSignOut, headerLanguageImage, headerCategoryImage}) => {
  return (
    <View style={styles.header}>
      <Image source={headerLanguageImage} style={{width: 55, height: 55}} />
      <Image source={headerCategoryImage} style={{width: 55, height: 55}} />
      <TouchableOpacity onPress={onSignOut}>
        <Icon name="remove" size={36} color="red" />
      </TouchableOpacity>
    </View>
  );
};
