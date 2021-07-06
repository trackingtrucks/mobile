'use strict'

import React, { Component, useState } from 'react'
import { View, Text, FlatList, StyleSheet, DeviceEventEmitter, MenuContext, NavigationBar, Menu, MenuTrigger, MenuOption, MenuOptions, ScrollView, TouchableOpacity, AppState, Alert } from 'react-native'

const obd2 = require('react-native-obd2');

export default class bluetoothList extends Component {
  constructor(props) {
    super()
    this.state = {
      obdStatus: '',
      btStatus: '',
      obd2Data: {},
      isStartLiveData: false,
      btSelectedDeviceAddress: '',
      btDeviceList: [],
      selectedBTDeviceIndex: 0,
      btDeviceListForUI: [],
      rpm: '0RPM',
      speed: '0km/h',
      fuelLevel: '0%',
      fuelConsumptionRate: '0l/h',
      engineCoolantTemperature: '0°C',
      pendingTroubleCodes: ["error1", "error2"],
    }
  }
  btStatus = (data) => {
    this.setState({ btStatus: data.status });
  }
  obdStatus = (data) => {
    this.setState({ obdStatus: data.status });
  }
  componentDidMount() {
    this.btStatusListener = DeviceEventEmitter.addListener('obd2BluetoothStatus', this.btStatus);
    this.obdStatusListener = DeviceEventEmitter.addListener('obd2Status', this.obdStatus);
    this.obdLiveDataListener = DeviceEventEmitter.addListener('obd2LiveData', this.obdLiveData);
    this.onReady();
  }
  componentWillUnmount() {
    obd2.stopLiveData();
    this.btStatusListener.remove();
    this.obdStatusListener.remove();
  }

  onReady() {
    obd2.ready();
    obd2.getBluetoothDeviceNameList()
      .then((nameList) => {
        console.log('Bluetooth device list : ' + JSON.stringify(nameList));
        this.setState({ btDeviceList: nameList });
        let deviceForUI = nameList.map((item, index) => {
          if (item.address === this.props.btSelectedDeviceAddress) {
            this.setState({ selectedBTDeviceIndex: index });
          }
          if (item.name === 'OBDII') {
            this.setState({
              btSelectedDeviceAddress: item.address,
            })
            console.log("OBD2:" + this.state.btSelectedDeviceAddress.length)
          }
        });
        this.setState({ btDeviceListForUI: deviceForUI });
      })
  }

  startLiveData = () => {
    if (this.state.btSelectedDeviceAddress.length === 0) {
      Alert.alert(
        'Dispositivo Bluetooth',
        'Tiene que activar bluetooth y/o conectarse al dispositivo con el nombre OBDII',
        [
          { text: 'OK', onPress: () => { } },
        ]
      )
      return;
    }
    this.setState({
      isStartLiveData: true,
    });
    obd2.startLiveData(this.state.btSelectedDeviceAddress);
  }

  stopLiveData() {
    this.setState({
      isStartLiveData: false,
      btStatus: '-',
    });
    SensorManager.stopOrientation();
    this.obdLiveDataListener && this.obdLiveDataListener.remove();
    this.listenerOrientation && this.listenerOrientation.remove();
    obd2.stopLiveData();
  }
  obdLiveData = (data) => {
    let copyData = JSON.parse(JSON.stringify(this.state.obd2Data));
    copyData[data.cmdID] = data;
    this.setState({
      obd2Data: copyData,
    });
    if (data.cmdID === 'ENGINE_RPM') {
      this.setState({
        rpm: data.cmdResult,
      });
    }
    if (data.cmdID === 'SPEED') {
      this.setState({
        speed: data.cmdResult,
      });
    }
    if (data.cmdID === 'FUEL_LEVEL') {
      this.setState({
        fuelLevel: data.cmdResult,
      });
    }
    if (data.cmdID === 'FUEL_CONSUMPTION_RATE') {
      this.setState({
        fuelConsumptionRate: data.cmdResult,
      });
    }
    if (data.cmdID === 'ENGINE_COOLANT_TEMP') {
      this.setState({
        engineCoolantTemperature: data.cmdResult,
      });
    }
    if (data.cmdID === 'PENDING_TROUBLE_CODES') {
      this.setState({
        pendingTroubleCodes: data.cmdResult,
      });
    }
  }

  scan() {
    this.startLiveData();
    console.log('Este es el status con el deviceEmitter: ' + this.state.obd2BtStatus);
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.scan()}
        >
          <Text>Scanear</Text>
        </TouchableOpacity>
        <Text>
          Este es el status del device:
          {" " + this.state.btStatus}
        </Text>
        <Text>
          Este es el status del obd:
          {" " + this.state.obdStatus}
        </Text>
        <Text>
          Este es el rpm:
          {" " + this.state.rpm}
        </Text>
        <Text>
          Este es el speed:
          {" " + this.state.speed}
        </Text>
        <Text>
          Fuel level:
          {" " + this.state.fuelLevel}
        </Text>
        <Text>
          Fuel consumption rate:
          {" " + this.state.fuelConsumptionRate}
        </Text>
        <Text>
          Engine coolant temperate:
          {" " + this.state.engineCoolantTemperature}
        </Text>
        <Text>
          Pending trouble codes:
          {" " + this.state.pendingTroubleCodes}
        </Text>
        <Text>
          Address:
          {" " + this.state.btSelectedDeviceAddress}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  },
})