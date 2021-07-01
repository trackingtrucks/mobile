import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Landing from './components/landing'
import Navigator from './routes/homeStack'

const App = () => {
  return (
    <View style={styles.fondo}>
      <Navigator />
    </View>
  );
};

const styles = StyleSheet.create({
  fondo:{
    backgroundColor:'#fff',
    flex:1
  }
});

export default App;
