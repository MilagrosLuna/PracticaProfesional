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
import Icon from 'react-native-vector-icons/FontAwesome';
import {RadioButton} from 'react-native-paper';
const styles = StyleSheet.create({
  containerBig: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f763d5',
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
    backgroundColor: '#f0bbe3',
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
    color: 'black',
    marginBottom: 20,
  },
  logo: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  errorText: {
    color: 'blue',
    fontSize: 20,
    marginTop: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#56f5b3',
    width: '50%',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#000',
  },
  floatingButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Ajusta según tus necesidades
    alignItems: 'center', // Ajusta según tus necesidades
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin:10
  },
});

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checked, setChecked] = React.useState('first');
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

  return (
    <View style={styles.containerBig}>
      <View style={styles.container}>
        <KeyboardAvoidingView behavior="padding">
          <Text style={styles.text}>Inicia Sesión para continuar</Text>
          <Text style={styles.text}>EDIFICIOS</Text>
          <View style={styles.logo}>
            <Logo />
          </View>
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
        <View style={styles.floatingButtonsContainer}>
          <View style={styles.radioButtonContainer}>
            <RadioButton
              value="1"
              status={checked === 'first' ? 'checked' : 'unchecked'}
              onPress={() => {
                setChecked('first'), rapido(1);
              }}
            />
            <Icon
              name="user"
              size={24}
              onPress={() => {
                rapido(3);
              }}
              color="white"> 1</Icon>
          </View>
          <View style={styles.radioButtonContainer}>
            <RadioButton
              value="2"
              status={checked === 'second' ? 'checked' : 'unchecked'}
              onPress={() => {
                setChecked('second'), rapido(2);
              }}
            />
            <Icon
              name="user"
              size={24}
              onPress={() => {
                rapido(3);
              }}
              color="white"> 2</Icon>
          </View>
          <View style={styles.radioButtonContainer}>
            <RadioButton
              value="3"
              status={checked === '3' ? 'checked' : 'unchecked'}
              onPress={() => {
                setChecked('3'), rapido(3);
              }}
            />
            <Icon
              name="user"
              size={24}
              onPress={() => {
                rapido(3);
              }}
              color="white"> 3</Icon>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Login;
