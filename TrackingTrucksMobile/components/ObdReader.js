'use strict'

import React, { Component, useState } from 'react'
import { View, Text, StyleSheet, DeviceEventEmitter, TouchableOpacity, Alert, LogBox, TouchableHighlight,AsyncStorage } from 'react-native'
import MemoryStore from './memoryStore'
import SpeedLogo from './multimedia/speed.svg'
import RpmLogo from './multimedia/rpm.svg'
import axios from 'axios'
import Config from './Config'
import Info from './info'

const obd2 = require('react-native-obd2');
LogBox.ignoreLogs(['Setting a timer for a long period of time'])
const keys = ['coolant', 'speed', 'rpm', 'fuel']

export default class ObdReader extends Component {
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
      speed: '0km\/h',
      fuelLevel: '0%',
      engineCoolantTemperature: '0C',
      pendingTroubleCodes: ["00BE"],
      knownTroubleCodes: [],
      kmsDone: '0km',
      prueba: "",
      errShown: true
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
    this.dataSend()
  }

  onReady() {
    obd2.ready();
    obd2.getBluetoothDeviceNameList()
      .then((nameList) => {
        this.setState({ btDeviceList: nameList });
        let deviceForUI = nameList.map((item, index) => {
          if (item.address === this.props.btSelectedDeviceAddress) {
            this.setState({ selectedBTDeviceIndex: index });
          }
          if (item.name === 'OBDII') {
            this.setState({
              btSelectedDeviceAddress: item.address,
            })
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

  dataSend = async () => {
    try {
      this.state.pendingTroubleCodes.sort()
      this.state.knownTroubleCodes.sort()
      if (this.state.pendingTroubleCodes.length == 0) {
        const res = await axios.post(Config.API_URL + '/data', {
          "fuelLevel": JSON.parse(parseInt(await AsyncStorage.getItem('fuel')).replace(/'/g,`"`)),
          "RPM": JSON.parse(parseInt(await AsyncStorage.getItem('rpm')).replace(/'/g,`"`)),
          "speed": JSON.parse(parseInt(await AsyncStorage.getItem('speed')).replace(/'/g,`"`)),
          "coolantTemperature": JSON.parse(parseInt(await AsyncStorage.getItem('coolant')).replace(/'/g,`"`)),
          "kilometrosRecorridos": this.state.kmsDone
        }, {
          headers: {
            'Content-Type': 'application/json',
            "x-access-token": global.accessToken,
          }
        })
        this.setState({
          errShown: false
        })
      } else if (JSON.stringify(this.state.pendingTroubleCodes) === JSON.stringify(this.state.knownTroubleCodes)) {
        this.setState({
          errShown: true
        })
        const res = await axios.post(Config.API_URL + '/data', {
          "fuelLevel": JSON.parse(parseInt(await AsyncStorage.getItem('fuel')).replace(/'/g,`"`)),
          "RPM": JSON.parse(parseInt(await AsyncStorage.getItem('rpm')).replace(/'/g,`"`)),
          "speed": JSON.parse(parseInt(await AsyncStorage.getItem('speed')).replace(/'/g,`"`)),
          "coolantTemperature": JSON.parse(parseInt(await AsyncStorage.getItem('coolant')).replace(/'/g,`"`)),
          "kilometrosRecorridos": this.state.kmsDone,
          "pendingTroubleCodes": this.state.pendingTroubleCodes
        }, {
          headers: {
            'Content-Type': 'application/json',
            "x-access-token": global.accessToken,
          }
        })
      }
      console.log('hola')
      await AsyncStorage.multiRemove(keys)
      this.setState({
        pendingTroubleCodes: [],
        knownTroubleCodes: this.state.pendingTroubleCodes
      })
    } catch (error) {
      this.setState({ disableButton: false })
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

  obdLiveData = async (data) => {
    if (await AsyncStorage.getItem('fuel') === null) {
      await AsyncStorage.setItem('fuel', JSON.stringify({ [Date.now()]: this.state.fuelLevel }))
      await AsyncStorage.setItem('rpm', JSON.stringify({ [Date.now()]: this.state.rpm }))
      await AsyncStorage.setItem('speed', JSON.stringify({ [Date.now()]: this.state.speed }))
      await AsyncStorage.setItem('coolant', JSON.stringify({ [Date.now()]: this.state.engineCoolantTemperature }))
    }
    let copyData = JSON.parse(JSON.stringify(this.state.obd2Data));
    copyData[data.cmdID] = data;
    this.setState({
      obd2Data: copyData,
    });
    if(data.cmdID != null){
      if (data.cmdID === 'ENGINE_RPM') {
        this.setState({
          rpm: data.cmdResult
        });
        await AsyncStorage.mergeItem('rpm', JSON.stringify({ [Date.now()]: this.state.rpm }))
      }
      if (data.cmdID === 'SPEED') {
        this.setState({
          speed: data.cmdResult,
        });
        await AsyncStorage.mergeItem('speed', JSON.stringify({ [Date.now()]: this.state.speed }))
      }
      if (data.cmdID === 'FUEL_LEVEL') {
        this.setState({
          fuelLevel: data.cmdResult,
        });
        await AsyncStorage.mergeItem('fuel', JSON.stringify({ [Date.now()]: this.state.fuelLevel }))
      }
      if (data.cmdID === 'ENGINE_COOLANT_TEMP') {
        this.setState({
          engineCoolantTemperature: data.cmdResult,
        });
        await AsyncStorage.mergeItem('coolant', JSON.stringify({ [Date.now()]: this.state.engineCoolantTemperature }))
      }
    } 
    if (data.cmdID === 'PENDING_TROUBLE_CODES') {
      this.setState({
        pendingTroubleCodes: data.cmdResult,
      });
    }
    if (this.state.pendingTroubleCodes.length == 0) {
      setInterval(() => {
        this.dataSend()
      }, 300000);
    } else {
      this.dataSend()
    }
  }

  scan = async () => {
    this.startLiveData();
  }

  test = async () => {
  }

  render() {
    return (
      <View>
        <Info
          rpm={this.state.rpm}
          speed={this.state.speed}
          fuelLevel={this.state.fuelLevel}
          coolant={this.state.engineCoolantTemperature}
          trouble={this.state.pendingTroubleCodes}
          errShown={this.state.errShown}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    textAlign: "center",
    display: "flex"
  },
  card: {
    backgroundColor: "rgba(227, 227, 227, 1)",
    width: "45%",
    height: 142,
    borderRadius: 9,
    justifyContent: 'center',
    shadowColor: "#830000",
    shadowOpacity: 0,
  },
  errCard: {
    backgroundColor: "#830000",
    height: 142,
    borderRadius: 9,
    justifyContent: 'center',
    shadowColor: "#830000",
    shadowOpacity: 0,
  },
  errCardText: {
    color: "#FFFFFF",
    fontFamily: "Roboto-Regular",
    fontSize: 18,
    textAlign: 'center'
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15
  },
  cardText: {
    textAlign: 'center',
    color: "#830000",
    fontSize: 16,
    fontFamily: "Roboto-Regular"
  },
  cardText2: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: "Roboto-Regular"
  }
})