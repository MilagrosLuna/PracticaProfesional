import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Button,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState} from 'react';
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
const primaryColor = '#FFC400';
const fourthColor = '#218154';
const buttonBorderRadius = 100;
interface SlidersProps {
  onChangeSlider: (number: number) => void;
}
import {Slider} from '@rneui/themed';
type SlidersComponentProps = {};

const Sliders: React.FunctionComponent<SlidersProps> = ({onChangeSlider}) => {
  const [horizValue, setHorizValue] = useState(0); // Inicializa el valor en 0

  const options = [
    {label: 'Admin', value: 0},
    {label: 'Usuario', value: 1},
    {label: 'Invitado', value: 2},
  ];

  const handleSliderChange = (value: number) => {
    setHorizValue(Math.round(value));
    onChangeSlider(Math.round(value)); // Llama a la función proporcionada desde el componente padre
  };

  return (
    <>
      <View style={styles.horizontalContent}>
        <Slider
          value={horizValue}
          onValueChange={handleSliderChange}
          maximumValue={2} // Máximo valor es 2 (corresponde a "Invitado")
          minimumValue={0} // Mínimo valor es 0 (corresponde a "Admin")
          step={1} // Establece el paso en 1
          thumbStyle={{height: 30, width: 30, backgroundColor: 'transparent'}}
          thumbProps={{
            children: (
              <Icon name="user" style={styles.a} size={30} color="black"></Icon>
            ),
          }}
        />
      </View>
      <Text style={{textAlign: 'center', marginTop: 20,fontSize:18,color:'black'}}>
        USUARIO SELECCIONADO: {options[horizValue].label}
      </Text>
    </>
  );
};

const styles = StyleSheet.create({
  horizontalContent: {
    padding: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  containerBig: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    color: 'black',
    backgroundColor: '#8f94fb',
    textAlign: 'center',
  },
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 2,
    borderRadius: 4,
    padding: 10,
    color: 'black',
    backgroundColor: '#fff',
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
  },
  logo: {
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: fourthColor,
    width: '50%',
    height: 80,
    padding: 10,
    borderRadius: buttonBorderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '5%',
  },
  buttonOutline: {
    backgroundColor: primaryColor,
    marginTop: 5,
    borderColor: fourthColor,
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: fourthColor,
    fontWeight: '700',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  floatingButtonsContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    textAlign: 'center',
    flexDirection: 'row',
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
  a: {
    borderRadius: 30,
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
  const rapido = (number: number) => {
    let email = '';
    let password = '';
    switch (number) {
      case 0: // Admin
        email = 'admin@admin.com';
        password = '111111';
        break;
      case 1: // Usuario
        email = 'usuario@usuario.com';
        password = '333333';
        break;
      case 2: // Invitado
        email = 'invitado@invitado.com';
        password = '222222';
        break;
    }
    setEmail(email);
    setPassword(password);
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
          <View style={styles.logo}>
            <Logo></Logo>
          </View>
          <Text style={styles.text}>ALARMA ANTI ROBO</Text>
          <Text style={styles.text}>Inicia Sesión para continuar</Text>
          <TextInput
            value={email}
            style={styles.input}
            placeholder="correo electrónico"
            placeholderTextColor="black"
            autoCapitalize="none"
            onChangeText={text => setEmail(text)}></TextInput>
          <TextInput
            secureTextEntry={true}
            value={password}
            style={styles.input}
            placeholder="contraseña"
            placeholderTextColor="black"
            autoCapitalize="none"
            onChangeText={text => setPassword(text)}></TextInput>
          {loading ? (
            <ActivityIndicator size="large" color="0000ff" />
          ) : (
            <>
              <View style={styles.buttonContainer}>
                <Button
                  title="Ingresar"
                  onPress={singIn}
                  color="#04C3C0"></Button>
              </View>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </>
          )}
        </KeyboardAvoidingView>
        <Sliders onChangeSlider={rapido}></Sliders>
      </View>
    </View>
  );
};

export default Login;
