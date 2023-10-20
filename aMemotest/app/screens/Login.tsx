import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Animated,
} from 'react-native';
import {Firebase_AUTH} from '../../FirebaseConfig';
import {signInWithEmailAndPassword} from 'firebase/auth';
import Logo from '../componentes/Logo';
import {RootStackParamList} from '../../App';
import {useNavigation} from '@react-navigation/core';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome'; // Asegúrate de que el nombre del ícono sea el correcto

const styles = StyleSheet.create({
  containerBig: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A9DEF9',
  },
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    marginVertical: 10,
    height: 50,
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    color: 'black',
    backgroundColor: '#D0F4DE',
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 30,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  text: {
    textAlign: 'center',
    fontSize: 28,
    color: '#000',
    marginBottom: 20,
  },
  logo: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  errorText: {
    color: 'white',
    fontSize: 20,
    marginTop: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FF99C8',
    width: '50%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#000',
  },
  floatingButtonsContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    textAlign: 'center',
    flexDirection: 'row',
  },
  floatingButton: {
    backgroundColor: '#FD151B',
    width: 50,
    height: 50,
    margin: 5,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    elevation: 2, // Agregamos una elevación mayor para que los botones flotantes estén por encima de las tarjetas
  },
  circle: {
    width: 65,
    height: 65,
    position: 'absolute',
    bottom: 20,
    right: 40,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle2: {
    backgroundColor: '#000',
    padding: 8,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circlemain: {
    backgroundColor: '#fff',
    width: 75,
    height: 75,
    position: 'absolute',
    top: 20,
    right: 30,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const auth = Firebase_AUTH;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const rapido = async (number: number) => {
    let email = '';
    let password = '';
    switch (number) {
      case 1:
        email = 'admin@admin.com';
        password = '111111';
        break;
      case 2:
        email = 'invitado@invitado.com';
        password = '222222';
        break;
      case 3:
        email = 'usuario@usuario.com';
        password = '333333';
        break;
    }
    setEmail(email);
    setPassword(password);
  };
  const singIn = async () => {
    setLoading(true);
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential: {user: any}) => {
        navigation.replace('Inside');
        const user = userCredential.user;
        console.log('Logged in with', user.email);
      })
      .catch(error => {
        console.log(error.message);
        switch (error.code) {
          case 'auth/invalid-email':
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/internal-error':
          case 'auth/too-many-requests':
            setError('Credenciales inválidas');
            break;
          default:
            setError(error.message);
            break;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [icon_1] = useState(new Animated.Value(40));
  const [icon_2] = useState(new Animated.Value(40));
  const [icon_3] = useState(new Animated.Value(40));
  const [pop, setPop] = useState(false);

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
      toValue: 40,
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

  return (
    <View style={styles.containerBig}>
      <View style={styles.container}>
        <KeyboardAvoidingView behavior="padding">
          <View style={styles.logo}>
            <Logo />
          </View>
          <Text style={styles.text}>Inicia Sesión para continuar</Text>
          <Text style={styles.text}>Memo test</Text>
          <TextInput
            value={email}
            style={styles.input}
            placeholder="correo electrónico"
            placeholderTextColor="black"
            autoCapitalize="none"
            onChangeText={text => setEmail(text)}
          />
          <TextInput
            secureTextEntry={true}
            value={password}
            style={styles.input}
            placeholder="contraseña"
            placeholderTextColor="black"
            autoCapitalize="none"
            onChangeText={text => setPassword(text)}
          />
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={singIn}>
                  <Text style={styles.buttonText}>Ingresar</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </KeyboardAvoidingView>
      </View>
      <View style={{flex: 1, position: 'absolute', top: 10, right: 1}}>
        <Animated.View style={[styles.circle, {top: icon_1}]}>
          <TouchableOpacity style={styles.circle2}>
            <Icon
              name="user"
              size={24}
              onPress={() => {
                rapido(1);
                popOut();
              }}
              color="white">
              1
            </Icon>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[styles.circle, {top: icon_2, right: icon_2}]}>
          <TouchableOpacity style={styles.circle2}>
            <Icon
              name="user"
              size={24}
              onPress={() => {
                rapido(2);
                popOut();
              }}
              color="white">
              2
            </Icon>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[styles.circle, {top: icon_3, right: icon_1}]}>
          <TouchableOpacity style={styles.circle2}>
            <Icon
              name="user"
              size={24}
              onPress={() => {
                rapido(3);
                popOut();
              }}
              color="white">
              3
            </Icon>
          </TouchableOpacity>
        </Animated.View>
        <TouchableOpacity
          style={styles.circlemain}
          onPress={() => {
            pop === false ? popIn() : popOut();
          }}>
          <Icon name="user" size={24} color="black"></Icon>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
