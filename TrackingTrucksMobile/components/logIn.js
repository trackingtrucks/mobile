
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import Config from './Config'
import { roundToNearestPixel } from 'react-native/Libraries/Utilities/PixelRatio';
import Arrow from './multimedia/backArrow.svg'
import BlackLogo from './multimedia/blackLogo.svg'
import axios from 'axios'

class Login extends Component {
  state = {
    password: '',
    email: '',
  }
  render() {
    const { navigation } = this.props
    const pressLogHandler = async () => {
      try {
        const res = await axios.post(Config.API_URL + '/auth/login', {
          password: this.state.password,
          email: this.state.email,
        })
        global.accessToken = res.data.accessToken
        global.refreshToken = res.data.refreshToken
        global.ATExpires = res.data.ATExpiresIn
        global.RTexpire = res.data.RTExpiresIn
        console.log(res.data)
        navigation.navigate('Home')
      } catch (error) {
        console.log(error.response.data.message || error.message)
        Alert.alert(
          "Error",
          error.response.data.message,
          [
            { text: 'OK', onPress: () => { } },
          ]
        )
      }
      
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
            <Text style={styles.mail} >Mail </Text>
            <TextInput
              style={styles.input}
              onChangeText={(e) => this.setState({email: e})}
            />
            <Text style={styles.mail} >Contraseña</Text>
            <TextInput
              style={styles.input}
              onChangeText={(e) => {
                this.setState({password: e})              
              }}
            />
          </View>
          <TouchableOpacity
            style={styles.logButton}
            disabled={true}
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
    color: "black",
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
