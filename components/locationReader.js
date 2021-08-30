import React, { Component } from 'react'
import { Text, View, TouchableOpacity, PermissionsAndroid } from 'react-native'
import Geolocation from 'react-native-geolocation-service'
import MapView, { Marker } from 'react-native-maps';

export default class LocationReader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      latitude: 0,
      longitude: 0,
      error: null
    }
  }

  componentDidMount() {
    /*Geolocation.getCurrentPosition(
      async (position) => {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        console.log(position);
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );*/
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null
      })
    }, error => this.setState({
      error: error.message
    }))
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

