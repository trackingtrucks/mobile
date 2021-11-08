import React, { Component, useState, useEffect } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  LogBox
} from 'react-native';
import Landing from './components/landing'
import { HomeStack, NotLoggedStack } from './routes/homeStack'
import axios from 'axios'
import Config from './components/Config';
import { AuthContextProvider } from './components/context/authContext';

LogBox.ignoreLogs(['AsyncStorage has been extracted from'])

const App = () => {

  const [Rt, setRt] = useState(null)
  const [Fetch, setFetch] = useState(false)

  const [RefreshTokenActive, setRefreshTokenActive] = useState(false)

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    const token = await AsyncStorage.getItem("refreshToken")
    console.log(token)
    setFetch(true)
    setRt(token)
    if (token) {
      setRefreshTokenActive(true)
    } else {
      setRefreshTokenActive(false)
    }
  }
  console.disableYellowBox = true;
  return (
    <View style={styles.fondo}>
      <HomeStack />
    </View>
  )
}
const styles = StyleSheet.create({
  fondo: {
    backgroundColor: '#fff',
    flex: 1
  }
});

export default App