
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { roundToNearestPixel } from 'react-native/Libraries/Utilities/PixelRatio';
import Arrow from './multimedia/backArrow.svg'
import BlackLogo from './multimedia/blackLogo.svg'

class Login extends Component {
  render() {
    const {navigation} = this.props
    const pressLogHandler = () => {
      navigation.navigate('Home')
    }

    const pressBackHandler = () => {
      navigation.goBack()
    }

    return (
      <View>
        <View style={styles.container}>
          <Text style={styles.textTitle}>¡Bienvenido!</Text>
          <Text style={styles.textLogIn}>Inicio de sesión</Text>
          <View style={styles.inputsContainer}>
            <Text style={styles.mail} >Mail  </Text>
            <TextInput
              style={styles.input}
            />
            <Text style={styles.mail} >Contraseña</Text>
            <TextInput
              style={styles.input}
            />
          </View>
          <TouchableOpacity
            style={styles.logButton}
          >
            <Text style={styles.logText} onPress={pressLogHandler}>Iniciar Sesion</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.forgot}
          >
            <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.register}
          >
            <Text style={styles.registerText}>¿Todavía no tenes cuenta? Registrate</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottom} >
          <TouchableOpacity style={styles.arrow} onPress={pressBackHandler}>
            <Arrow width={20} height={19} />
          </TouchableOpacity>
          <BlackLogo width={39} height={75} style={styles.logo}></BlackLogo>
        </View>
      </View>

    );
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 70
  },
  arrow: {
    alignSelf: 'flex-start',
    marginLeft: '5%',
    marginTop: '10%'
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: '5%',
    marginTop: '5%'
  },
  forgot: {
    margin: 25
  },
  logo: {

  },
  forgotText: {
    color: 'rgba(131, 0, 0, 1)'
  },
  registerText: {
    color: 'rgba(131, 0, 0, 1)'
  },
  register: {

  },
  textTitle: {
    fontSize: 36,
    fontFamily: 'Roboto-Bold'
  },
  logButton: {
    backgroundColor: "rgba(131, 0, 0, 1)",
    borderRadius: 9,
    padding: 15,
    paddingHorizontal: 70,
    marginTop: "15%"
  },
  logText: {
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 20,
    fontFamily: 'Roboto-Bold'
  },
  textLogIn: {
    marginTop: 20,
    fontSize: 27,
    fontFamily: 'Roboto-Bold'
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 0,
    color: "#0000",
    borderRadius: 6,
    backgroundColor: "#C4C4C4",
  },
  mail: {
    marginLeft: "4%",
    fontFamily: 'Roboto-Medium'
  },
  inputsContainer: {
    width: '80%',
    marginTop: "30%"
  }
});

export default Login;
