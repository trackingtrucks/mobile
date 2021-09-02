
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  AsyncStorage,
  ActivityIndicator,
  ImageBackground
} from 'react-native';
import Config from './Config'
import { roundToNearestPixel } from 'react-native/Libraries/Utilities/PixelRatio';
import Arrow from './multimedia/backArrow.svg'
import BlackLogo from './multimedia/blackLogo.svg'
import axios from 'axios'
import MyModal from './modal'

class Login extends Component {
  state = {
    password: 'contraseña',
    email: 'conductor@gmail.com',
    disableButton: false,
    isLoading: false,
    visible: false,
    emailNewPass: ''
  }
  render() {
    const { navigation } = this.props
    const logIn = async () => {
      if (this.state.disableButton) return console.log("disabled!!");
      try {
        const res = await axios.post(Config.API_URL + '/auth/login', {
          password: this.state.password,
          email: this.state.email,
        })
        console.log(res.data.accessToken)
        global.nombre = res.data.perfil.nombre
        global.rol = res.data.perfil.rol
        global.at = res.data.accessToken
        this.setState({ disableButton: false })
        navigation.navigate('Home')
        this.setState({
          isLoading: false
        })
      } catch (error) {
        this.setState({
          disableButton: false,
          isLoading: false
        })
        console.log(error?.response?.data?.message || error.message)
        Alert.alert(
          "Error",
          error.response.data.message,
          [
            { text: 'OK', onPress: () => { } },
          ]
        )
      }
    }

    const closeModal = () => {
      this.setState({
        visible: false
      })
    }

    const openModal = () => {
      this.setState({
        visible: true
      })
    }

    const pressLogHandler = () => {
      this.setState({
        disableButton: true,
        isLoading: true
      })
      logIn()
    }

    const newPassHandler = async () => {
      try {
        const res = await axios.post(Config.API_URL + '/user/restablecer', {
          email: this.state.emailNewPass,
        })
        console.log(res.data.accessToken)
        this.setState({
          isLoading: false
        })
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
        <ImageBackground source={require('./multimedia/backgroundLogo.jpg')} style={{ height: "100%" }}>
          <View style={styles.container}>
            <Text style={styles.textTitle}>¡Bienvenido!</Text>
            <Text style={styles.textLogIn}>Inicio de sesión</Text>
            <View style={styles.inputsContainer}>
              <Text style={styles.mail} >Mail </Text>
              <TextInput
                style={styles.input}
                onChangeText={(e) => this.setState({ email: e })}
                value={this.state.email}
              />
              <Text style={styles.mail} >Contraseña</Text>
              <TextInput
                style={styles.input}
                value={this.state.password}
                secureTextEntry={true}
                onChangeText={(e) => {
                  this.setState({ password: e })
                }}
              />
            </View>
            <TouchableOpacity
              style={styles.logButton}
              disabled={this.state.disableButton}
              activeOpacity={this.state.disableButton ? 1 : 0.7}
              onPress={pressLogHandler}
            >
              {!this.state.isLoading && <Text style={styles.logText}>Iniciar Sesion</Text>}
              {this.state.isLoading && <ActivityIndicator color="#fff" sixe="small" />}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.forgot}
              onPress={openModal}
            >
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

          </View>
          <View style={styles.bottom} >
            <TouchableOpacity style={styles.arrow} onPress={pressBackHandler}>
              <Arrow width={20} height={19} />
            </TouchableOpacity>
            <BlackLogo width={39} height={75} style={styles.logo}></BlackLogo>
          </View>

          <MyModal visible={this.state.visible}>
            <TouchableOpacity onPress={closeModal} style={{ height: "100%", width: "100%", position: "absolute" }} >
            </TouchableOpacity>
            <View style={styles.newPass}>
              <Text style={styles.newPassText}>
                Nueva contraseña
              </Text>
              <Text style={styles.newPassContent}>
                Ingrese su mail para recibir un enlace para reestablecer su contraseña
              </Text>
              <TextInput style={styles.inputTextPass} onChangeText={(e) => {
                this.setState({ emailNewPass: e })
              }} />
              <View>
                <TouchableOpacity style={styles.newPassButton} onPress={newPassHandler}>
                  <Text style={{ color: "#fff", textAlign: "center", fontFamily: "Roboto-Medium", fontSize: 18 }}>
                    Enviar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </MyModal>
        </ImageBackground>
      </View>

    );
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 70
  },
  newPass: {
    backgroundColor: "#fff",
    width: "80%",
    borderRadius: 9,
    paddingVertical: 30,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  newPassText: {
    color: "#000",
    fontFamily: "Roboto-Bold",
    fontSize: 24,
    textAlign: 'center',
  },
  newPassContent: {
    color: "#454545",
    fontFamily: "Roboto-Bold",
    fontSize: 18,
    textAlign: 'center',
    paddingTop: "10%"
  },
  inputTextPass: {
    height: 45,
    marginTop: "12%",
    color: "black",
    borderRadius: 6,
    backgroundColor: "#C4C4C4",
  },
  newPassButton: {
    backgroundColor: "rgba(131, 0, 0, 1)",
    borderRadius: 9,
    height: 55,
    paddingTop: 15,
    paddingBottom: 15,
    marginHorizontal: 50,
    marginTop: "15%",
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
  forgotText: {
    color: 'rgba(131, 0, 0, 1)'
  },
  registerText: {
    color: 'rgba(131, 0, 0, 1)'
  },
  textTitle: {
    fontSize: 36,
    fontFamily: 'Roboto-Bold'
  },
  logButton: {
    backgroundColor: "rgba(131, 0, 0, 1)",
    borderRadius: 9,
    paddingTop: 15,
    paddingBottom: 15,
    minWidth: 263,
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
