import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import Geolocation from 'react-native-geolocation-service'

export default class LocationReader extends Component {
    
    componentDidMount() {
        if (true) {
          Geolocation.getCurrentPosition(
              (position) => {
                console.log(position);
              },
              (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
              },
              { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
        }
      }

    render() {
        return (
            <View>
                <TouchableOpacity onPress={this.printCoordinates}>
                    <Text>
                        Hola
                    </Text>
                </TouchableOpacity>
                <Text> textInComponent </Text>
            </View>
        )
    }
}

