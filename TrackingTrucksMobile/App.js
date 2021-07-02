import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Landing from './components/landing'
import Navigator from './routes/homeStack'
import ObdReader from './components/ObdReader'

const App = () => {
  return (
    <View style={styles.fondo}>
      {/*<Navigator />*/}
       <ObdReader/> 
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
