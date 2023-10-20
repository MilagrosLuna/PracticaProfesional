import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import {Firebase_AUTH} from '../../FirebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import Logo from '../componentes/Logo';
import {RootStackParamList} from '../../App';
import {useNavigation} from '@react-navigation/core';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome'; // Asegúrate de que el nombre del ícono sea el correcto

import {CheckBox} from 'react-native-elements';

const styles = StyleSheet.create({
  containerBig: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#07BEB8',
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
    backgroundColor: '#D2FFFA',
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
    color: '#fff',
    marginBottom: 20,
  },
  logo: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 20,
    marginTop: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#9CEAEF',
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
    flexDirection: 'column', // Cambiamos a una disposición de columna para alinear verticalmente los checkboxes
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBoxText: {
    marginLeft: 10,
    fontSize: 16,
    color: 'black',
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
  const [quickAccess, setQuickAccess] = useState(null);
  const handleCheckBoxChange = (selectedOption: any) => {
    setQuickAccess(selectedOption);
    // Lógica para establecer el correo y contraseña en función de la opción seleccionada
    switch (selectedOption) {
      case 1:
        rapido(1);
        break;
      case 2:
        rapido(2);
        break;
      case 3:
        rapido(3);
        break;
      default:
        setEmail('');
        setPassword('');
        break;
    }
  };
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

  const singUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.containerBig}>
      <View style={styles.container}>
        <KeyboardAvoidingView behavior="padding">
          <Text style={styles.text}>Carga de Crédito</Text>
          <View style={styles.logo}>
            <Logo />
          </View>
          <Text style={styles.text}>Inicia Sesión para continuar</Text>
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
      <View style={styles.floatingButtonsContainer}>
        <View style={styles.checkBoxContainer}>
          <CheckBox
            checked={quickAccess == 1}
            onPress={() => handleCheckBoxChange(1)}
          />
          <Icon
            name="user"
            size={24}
            onPress={() => {
              rapido(2);
            }}
            color="black">
            <Text style={styles.checkBoxText}> 1</Text>
          </Icon>
        </View>
        <View style={styles.checkBoxContainer}>
          <CheckBox
            checked={quickAccess === 2}
            onPress={() => handleCheckBoxChange(2)}
          />
          <Icon
            name="user"
            size={24}
            onPress={() => {
              rapido(2);
            }}
            color="black">
            <Text style={styles.checkBoxText}> 2</Text>
          </Icon>
        </View>
        <View style={styles.checkBoxContainer}>
          <CheckBox
            checked={quickAccess === 3}
            onPress={() => handleCheckBoxChange(3)}
          />
          <Icon
            name="user"
            size={24}
            onPress={() => {
              rapido(2);
            }}
            color="black">
            <Text style={styles.checkBoxText}> 3</Text>
          </Icon>
        </View>
      </View>
    </View>
  );
};

export default Login;
