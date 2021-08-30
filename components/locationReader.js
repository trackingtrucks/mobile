import React, { Component } from 'react'
import { Text, View, TouchableOpacity, PermissionsAndroid, ToastAndroid, Platform } from 'react-native'
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

  hasLocationPermission = async () => {
    console.log("a")
    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }
    return false;
  };

  getLocation = async() => {
    if (await this.hasLocationPermission()) {
      Geolocation.getCurrentPosition(
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
      );
    }
  }

  render() {
    return (
      <View>
        <TouchableOpacity onPress={this.hasLocationPermission}>
          <Text>
            Hola
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.getLocation}>
          <Text>
            Hola
          </Text>
        </TouchableOpacity>
        <Text> textInComponent </Text>
      </View>
    )
  }
}

