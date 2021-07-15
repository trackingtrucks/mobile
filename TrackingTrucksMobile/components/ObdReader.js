'use strict'

import React, { Component, useState } from 'react'
import { View, Text, StyleSheet, DeviceEventEmitter, TouchableOpacity, Alert, AsyncStorage, LogBox, TouchableHighlight } from 'react-native'
import MemoryStore from './memoryStore'
import SpeedLogo from './multimedia/speed.svg'
import RpmLogo from './multimedia/rpm.svg'
import Info from './info';
import axios from 'axios'
import Config from './Config'

const obd2 = require('react-native-obd2');
LogBox.ignoreLogs(['Setting a timer for a long period of time'])

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
      speed: '0km/h',
      fuelLevel: '0%',
      engineCoolantTemperature: '0°C',
      pendingTroubleCodes: [],
      knownTroubleCodes: [],
      kmsDone: '0km',
      prueba: "",

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
      if (this.state.pendingTroubleCodes == null) {
        const res = await axios.post(Config.API_URL + '/data', {
          data: {
            "fuelLevel": await AsyncStorage.getItem('fuel'),
            "RPM": await AsyncStorage.getItem('rpm'),
            "speed": await AsyncStorage.getItem('speed'),
            "coolantTemperature": await AsyncStorage.getItem('coolant'),
            "kilometrosRecorridos": this.state.kmsDone

          }
        }, {
          headers: {
            'Content-Type': 'application/json',
            "x-access-token": global.accessToken,
          }
        })
      } else if (JSON.stringify(this.state.pendingTroubleCodes) === JSON.stringify(this.state.knownTroubleCodes)) {
        const res = await axios.post(Config.API_URL + '/data', {
          data: {
            "fuelLevel": await AsyncStorage.getItem('fuel'),
            "RPM": await AsyncStorage.getItem('rpm'),
            "speed": await AsyncStorage.getItem('speed'),
            "coolantTemperature": await AsyncStorage.getItem('coolant'),
            "kilometrosRecorridos": this.state.kmsDone,
            "pendingTroubleCodes": this.state.pendingTroubleCodes
          }
        }, {
          headers: {
            'Content-Type': 'application/json',
            "x-access-token": global.accessToken,
          }
        })
      }
      console.log(res.data)
      await AsyncStorage.clear()
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
    if (await AsyncStorage.getItem('fuel') == null) {
      await AsyncStorage.setItem('fuel', JSON.stringify({ [new Date()]: this.state.fuelLevel }))
      await AsyncStorage.setItem('rpm', JSON.stringify({ [new Date()]: this.state.rpm }))
      await AsyncStorage.setItem('speed', JSON.stringify({ [new Date()]: this.state.speed }))
      await AsyncStorage.setItem('coolant', JSON.stringify({ [new Date()]: this.state.engineCoolantTemperature }))
    }
    let copyData = JSON.parse(JSON.stringify(this.state.obd2Data));
    copyData[data.cmdID] = data;
    this.setState({
      obd2Data: copyData,
    });
    if (data.cmdID === 'ENGINE_RPM') {
      this.setState({
        rpm: data.cmdResult
      });
      await AsyncStorage.mergeItem('rpm', JSON.stringify({ [new Date()]: this.state.rpm }))
    }
    if (data.cmdID === 'SPEED') {
      this.setState({
        speed: data.cmdResult,
      });
      await AsyncStorage.mergeItem('speed', JSON.stringify({ [new Date()]: this.state.speed }))
    }
    if (data.cmdID === 'FUEL_LEVEL') {
      this.setState({
        fuelLevel: data.cmdResult,
      });
      await AsyncStorage.mergeItem('fuel', JSON.stringify({ [new Date()]: this.state.fuelLevel }))
    }
    if (data.cmdID === 'ENGINE_COOLANT_TEMP') {
      this.setState({
        engineCoolantTemperature: data.cmdResult,
      });
      await AsyncStorage.mergeItem('coolant', JSON.stringify({ [new Date()]: this.state.engineCoolantTemperature }))
    }
    if (data.cmdID === 'PENDING_TROUBLE_CODES') {
      this.setState({
        pendingTroubleCodes: data.cmdResult,
      });
    }
    if (this.state.pendingTroubleCodes == null) {
      setTimeout(() => {
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
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.scan()}
        >
          <Text>Scanear</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.test()}
        >
          <Text>Cache Test</Text>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <View style={styles.buttonInfo}>
            <TouchableOpacity>
              <Text style={{ textAlign: "center", color: "white" }}>Información</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonTurnos}>
            <TouchableOpacity>
              <Text style={{ textAlign: "center", color: "#830000" }}>Turnos</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Info
          rpm={this.state.rpm}
          speed={this.state.speed}
          fuelLevel={this.state.fuelLevel}
          coolant={this.state.engineCoolantTemperature}
          trouble={this.state.pendingTroubleCodes}
        />
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
    padding: 10,
    textAlign: "center",
    display: "flex"
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:15,
    marginBottom:15
  },
  buttonInfo: {
    backgroundColor: "#830000",
    marginLeft:20,
    flex: 1,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopColor: "#830000",
    borderRightColor: "transparent",
    borderBottomColor: "#830000",
    borderLeftColor:"#830000",
    borderWidth:1,
    paddingBottom: 15,
    paddingTop:15,
    borderRightWidth:0
  },
  buttonTurnos: {
    backgroundColor: "white",
    borderTopColor: "#A6A6A6",
    borderRightColor: "#A6A6A6",
    borderBottomColor: "#A6A6A6",
    borderLeftColor:"transparent",
    borderWidth:1,
    paddingBottom: 15,
    paddingTop:15,
    fontSize:18,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    marginRight:20,
    flex: 1,
    borderLeftWidth:0
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