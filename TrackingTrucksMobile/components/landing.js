import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import Logo from './multimedia/logo.svg'

class Landing extends Component {
  render() {
    const pressHandler = () => {
      this.props.navigation.navigate('logIn', {
        itemId: 86,
        otherParam: 'anything you want here'
      })
    }
    return (
      <View style={styles.container}>
        <ImageBackground source={require('./multimedia/backgroundLogo.jpg')} style={styles.backgroundImage}>
          <View style={styles.logo}>
            <Logo />
            <Text style={styles.textTitle}>Tracking Trucks</Text>
          </View>
          <View style={styles.logIn}>
            <TouchableOpacity
              style={styles.logButton}
              onPress={pressHandler}
            >
              <Text style={styles.logText}>Iniciar Sesion</Text>
            </TouchableOpacity>
            <Text style={styles.regText}>¿Todavía no tenes cuenta?</Text>
          </View>
        </ImageBackground>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  regText: {
    color: 'rgba(131, 0, 0, 1)',
    marginTop: 20,
    fontSize: 17,
    fontFamily: 'Roboto-Bold'
  },
  logIn: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36,
    alignItems: 'center'
  },
  logButton: {
    backgroundColor: "rgba(131, 0, 0, 1)",
    borderRadius: 9,
    padding: 15,
    paddingHorizontal: 70
  },
  logText: {
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 20,
    fontFamily: 'Roboto-Bold'
  },
  logo: {
    alignItems: "center",
    marginTop: 100
  },
  textTitle: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold'
  },
  backgroundImage: {
    flex: 1,
  }
});

export default Landing;
