import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Vibration,
  TextInput,
  Button,
  BackHandler,
  StatusBar,
} from 'react-native';
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import {useNavigation} from '@react-navigation/core';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import Torch from 'react-native-torch';
var Sound = require('react-native-sound');
Sound.setCategory('Playback');
import {Firebase_AUTH} from '../../FirebaseConfig';

const {height} = Dimensions.get('window');
const {width} = Dimensions.get('window');
const isHorizontal = width > height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#8f94fb',
  },
  input: {
    width: 220,
    height: 50,
    borderColor: '#000',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    margin: 20,
  },
  button: {
    width: 200,
    height: 40,
    margin: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green', // Cambia el color según el estado de la alarma
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  },
  errorText: {
    color: 'red',
  },
  text: {
    fontSize: 28,
    margin: 20,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonbig: {
    width: '95%',
    height: '95%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButtonsContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    textAlign: 'center',
    flexDirection: 'row',
    zIndex: 1, // Establecer la capa más alta
  },
  floatingButton: {
    backgroundColor: '#04C3C0',
    width: 50,
    height: 50,
    borderRadius: 30,
    margin: 5,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    elevation: 2, // Agregamos una elevación mayor para que los botones flotantes estén por encima de las tarjetas
  },
});

export default function InsideLayout() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [alarmaActivada, setAlarmaActivada] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [activandoAlarma, setActivandoAlarma] = useState(false); // Nuevo estado
  const [bloquearSalida, setBloquearSalida] = useState(false);

  const handlerSingOut = async () => {
    if (!alarmaActivada && !bloquearSalida) {
      await Firebase_AUTH.signOut()
        .then(() => {
          navigation.replace('Login');
        })
        .catch((error: any) => console.log(error.message));
    } else {
      reproducirSonidoHorizontal();
    }
  };

  const [sonido, setSonido] = useState<any | null>(null);
  const [sonido2, setSonido2] = useState<any | null>(null);
  const [sonido3, setSonido3] = useState<any | null>(null);
  const [sonido4, setSonido4] = useState<any | null>(null);
  const [sonido5, setSonido5] = useState<any | null>(null);

  useEffect(() => {
    var sonido = require('../../assets/voy.mp3');
    const sounds = new Sound('dejame.mp3', Sound.MAIN_BUNDLE, (error: any) => {
      if (error) {
        console.log('Error al cargar el sonido', error);
      } else {
        setSonido(sounds);
        console.log('Sonido cargado correctamente');
      }
    });
    console.log(sounds);
    return () => {
      if (sonido) {
        console.log(sonido);
      }
    };
  }, []);
  useEffect(() => {
    var sonido = require('../../assets/voy.mp3');
    const sounds = new Sound('deja.mp3', Sound.MAIN_BUNDLE, (error: any) => {
      if (error) {
        console.log('Error al cargar el sonido', error);
      } else {
        setSonido2(sounds);
        console.log('Sonido cargado correctamente');
      }
    });
    console.log(sounds);
    return () => {
      if (sonido) {
        console.log(sonido);
      }
    };
  }, []);
  useEffect(() => {
    var sonido = require('../../assets/voy.mp3');
    const sounds = new Sound('epa.mp3', Sound.MAIN_BUNDLE, (error: any) => {
      if (error) {
        console.log('Error al cargar el sonido', error);
      } else {
        setSonido3(sounds);
        console.log('Sonido cargado correctamente');
      }
    });
    console.log(sounds);
    return () => {
      if (sonido) {
        console.log(sonido);
      }
    };
  }, []);
  useEffect(() => {
    var sonido = require('../../assets/voy.mp3');
    const sounds = new Sound('robando.mp3', Sound.MAIN_BUNDLE, (error: any) => {
      if (error) {
        console.log('Error al cargar el sonido', error);
      } else {
        setSonido4(sounds);
        console.log('Sonido cargado correctamente');
      }
    });
    console.log(sounds);
    return () => {
      if (sonido) {
        console.log(sonido);
      }
    };
  }, []);
  useEffect(() => {
    var sonido = require('../../assets/voy.mp3');
    const sounds = new Sound(
      'incorrecta.mp3',
      Sound.MAIN_BUNDLE,
      (error: any) => {
        if (error) {
          console.log('Error al cargar el sonido', error);
        } else {
          setSonido5(sounds);
          console.log('Sonido cargado correctamente');
        }
      },
    );
    console.log(sounds);
    return () => {
      if (sonido) {
        console.log(sonido);
      }
    };
  }, []);
  let sonidoHorizontalTimeout: any; // Variable para mantener el temporizador

  const handleCambioOrientacion = (x: number, y: number, z: number) => {
    const gravity = 9.8; // Aceleración gravitatoria en m/s²
    const verticalThreshold = 1.0; // Umbral para considerar la posición vertical

    // Calcula la magnitud de la aceleración total sin el componente gravitatorio
    const aceleracionTotalSinGravedad = Math.sqrt(
      x * x + y * y + (z - gravity) * (z - gravity),
    );

    let costados = false;
    let sonidoHorizontalReproducido = false;
    const umbralY = 0.5; // Ajusta este valor según tus necesidades
    const umbralZ = 1.0; // Ajusta este valor según tus necesidades

    encenderLuz(false);
    if (aceleracionTotalSinGravedad > verticalThreshold && x > 2) {
      // Movimiento horizontal a la derecha

      vibrar();
      if (!sonidoHorizontalReproducido) {
        reproducirSonidoHorizontalIzquierda();
        sonidoHorizontalReproducido = true;
        // Configura un temporizador para detener el sonido después de 3 segundos
        setTimeout(() => {
          reproducirSonidoHorizontalIzquierda(); // Detén el sonido
        }, 1000); // 3000 milisegundos = 3 segundos
      }
      costados = true;
      // El dispositivo está en posición vertical
    } else if (aceleracionTotalSinGravedad > verticalThreshold && x < -2) {
      // Movimiento horizontal a la izquierda
      vibrar();
      if (!sonidoHorizontalReproducido) {
        reproducirSonidoHorizontalDerecha();
        sonidoHorizontalReproducido = true;
        // Configura un temporizador para detener el sonido después de 3 segundos
        setTimeout(() => {
          reproducirSonidoHorizontalDerecha(); // Detén el sonido
        }, 1000); // 3000 milisegundos = 3 segundos
      }
      costados = true;
    } else {
      // Si no hay movimiento horizontal, restablece la bandera y cancela el temporizador
      sonidoHorizontalReproducido = false;
      clearTimeout(sonidoHorizontalTimeout); // Cancela el temporizador si estaba activo
    }
    if (y > 2) {
      vibrar();
      encenderLuz(true);
      reproducirSonidoVertical(); // Detén el sonido
    }
  };

  const vibrar = () => {
    Vibration.vibrate(3000);
  };
  useEffect(() => {
    if (alarmaActivada) {
      // Configura el acelerómetro y la lógica de activación aquí
      setUpdateIntervalForType(SensorTypes.accelerometer, 100);
      setBloquearSalida(true);
      StatusBar.setHidden(true);
      const subscription = accelerometer.subscribe(({x, y, z, timestamp}) => {
        handleCambioOrientacion(x, y, z); // Llama a la función aquí
        // console.log({ x, y, z, timestamp })
      });

      return () => {
        subscription.unsubscribe();
        encenderLuz(false);
        Vibration.cancel();
        setBloquearSalida(false);
      };
    } else {
      StatusBar.setHidden(false);
    }
  }, [alarmaActivada]);
  const reproducirSonidoHorizontalIzquierda = () => {
    console.log(sonido2);
    sonido2.play((success: any) => {
      if (success) {
        console.log('Sonido reproducido exitosamente');
      } else {
        console.log('Error al reproducir el sonido');
      }
    });
  };
  const reproducirSonidoHorizontalDerecha = () => {
    if (sonido3) {
      sonido3.play((success: any) => {
        if (success) {
          console.log('Sonido reproducido exitosamente');
        } else {
          console.log('Error al reproducir el sonido');
        }
      });
    }
  };
  const reproducirSonidoHorizontal = () => {
    if (sonido) {
      sonido.play((success: any) => {
        if (success) {
          console.log('Sonido reproducido exitosamente');
        } else {
          console.log('Error al reproducir el sonido');
        }
      });
    }
  };
  const reproducirSonidoVertical = () => {
    console.log(sonido4);
    if (sonido4) {
      sonido4.play((success: any) => {
        if (success) {
          console.log('Sonido reproducido exitosamente');
        } else {
          console.log('Error al reproducir el sonido');
        }
      });
    }
  };
  const encenderLuz = (encender: any) => {
    if (encender) {
      Torch.switchState(true);
    } else {
      Torch.switchState(false);
    }
  };
  const reproducirSonidoIncorrecto = () => {
    if (sonido5) {
      sonido5.play((success: any) => {
        if (success) {
          console.log('Sonido reproducido exitosamente');
        } else {
          console.log('Error al reproducir el sonido');
        }
      });
    }
  };
  const handleActivarDesactivarAlarma = () => {
    if (!activandoAlarma) {
      // Evitar llamadas repetidas mientras se está activando/desactivando
      setActivandoAlarma(true);

      // Cambia el estado de la alarma aquí
      setAlarmaActivada(!alarmaActivada);

      // Restablece el estado de activación después de un tiempo
      setTimeout(() => {
        setActivandoAlarma(false);
      }, 1000); // Ajusta el tiempo según sea necesario
    }
  };
  useEffect(() => {
    const handleBackButton = () => {
      if (bloquearSalida) {
        // Si la alarma está activada y bloqueamos la salida, no permitir cerrar la aplicación
        return true;
      } else {
        // De lo contrario, permitir el comportamiento predeterminado (salir de la aplicación)
        return false;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButton,
    );

    return () => {
      backHandler.remove();
    };
  }, [bloquearSalida]);

  const handleIngresarContraseña = () => {
    const contraseñaCorrecta = inputPassword === 'mili';

    if (contraseñaCorrecta) {
      // Desactiva la alarma y realiza otras acciones necesarias
      setAlarmaActivada(false);
      setShowPasswordError(false);
      Vibration.cancel();
      encenderLuz(false);
    } else {
      setShowPasswordError(true);
      encenderLuz(true);
      const pattern = [0, Number.MAX_SAFE_INTEGER];
      Vibration.vibrate(pattern, true);
      reproducirSonidoIncorrecto();
      encenderLuz(false);
      encenderLuz(true);
      encenderLuz(false);
      encenderLuz(true);
      encenderLuz(false);
      encenderLuz(true);
      encenderLuz(false);
      encenderLuz(true);
      encenderLuz(false);
      encenderLuz(true);
      encenderLuz(false);
      encenderLuz(true);
      encenderLuz(false);
      encenderLuz(true);
      encenderLuz(false);
      encenderLuz(true);
      encenderLuz(false);
      encenderLuz(true);
      encenderLuz(false);
      encenderLuz(true);
      encenderLuz(false);
      encenderLuz(true);
      encenderLuz(false);
      encenderLuz(true);
      encenderLuz(false);
      encenderLuz(true);
      encenderLuz(false);
      encenderLuz(true);
      encenderLuz(false);
      encenderLuz(true);
      encenderLuz(false);
      encenderLuz(true);
      encenderLuz(false);
      encenderLuz(true);
      encenderLuz(false);
      encenderLuz(true);
      encenderLuz(false);
      encenderLuz(true);
      encenderLuz(false);
      encenderLuz(true);
      encenderLuz(false);
      encenderLuz(true);
      encenderLuz(false);
      encenderLuz(true);
      encenderLuz(false);
      encenderLuz(true);
      encenderLuz(false);
      encenderLuz(true);
      encenderLuz(false);
      encenderLuz(true);
      encenderLuz(false);
      encenderLuz(true);
      encenderLuz(false);
      encenderLuz(true);
      encenderLuz(false);
      encenderLuz(true);
      encenderLuz(false);
      encenderLuz(true);
      encenderLuz(false);
      encenderLuz(true);
      encenderLuz(false);
      encenderLuz(true);
      encenderLuz(false);
      encenderLuz(true);
    }

    setInputPassword('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.floatingButtonsContainer}>
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={handlerSingOut}>
          <Text style={{color: 'black'}}>Salir</Text>
        </TouchableOpacity>
      </View>

      {alarmaActivada ? (
        <View style={styles.container}>
          <Text style={styles.text}>
            Ingrese la contraseña para desactivar la alarma
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
            value={inputPassword}
            onChangeText={text => setInputPassword(text)}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleIngresarContraseña}>
            <Text style={styles.buttonText}>Ingresar</Text>
          </TouchableOpacity>
          {showPasswordError && (
            <Text style={styles.errorText}>Contraseña incorrecta</Text>
          )}
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.buttonbig,
            {backgroundColor: alarmaActivada ? 'red' : 'green'},
          ]}
          onPress={handleActivarDesactivarAlarma}>
          <Text style={styles.buttonText}>
            {alarmaActivada ? 'DESACTIVAR' : 'ACTIVAR'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
