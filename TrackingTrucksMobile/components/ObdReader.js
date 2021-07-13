'use strict'

import React, { Component, useState } from 'react'
import { View, Text, StyleSheet, DeviceEventEmitter, TouchableOpacity, Alert } from 'react-native'
import { Cache } from 'react-native-cache';
import MemoryStore from './memoryStore'
import SpeedLogo from './multimedia/speed.svg'
import RpmLogo from './multimedia/rpm.svg'
import Info from './info';

const obd2 = require('react-native-obd2');
const cache = new Cache({
  namespace: "ObdReader",
  policy: {
    maxEntries: 50000
  },
  backend: MemoryStore
});


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
      pendingTroubleCodes: ["error1", "error2"],
      kmsDone: '0km'
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
    cache.clearAll()
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
    const allCache = cache.getAll()
    try {
      const res = await axios.post(Config.API_URL + '/data', {
        headers: {
          "Content-type": "application/json",
          "x-access-token": global.accessToken
        },
        data: {
          "fuelLevel": allCache.fuelLevel,
          "RPM": allCache.engineRpm,
          "speed": allCache.speed,
          "coolantTemperature": allCache.engineCoolant,
          "pendingTroubleCodes": allCache.troubleCodes,
          "kilometrosRecorridos": this.state.kmsDone
        }
      })
      console.log(res.data)
    } catch (error) {
      this.setState({ disableButton: false })
      console.log(error || error.message)
      Alert.alert(
        "Error",
        error,
        [
          { text: 'OK', onPress: () => { } },
        ]
      )
    }
  }

  obdLiveData = async (data) => {
    let copyData = JSON.parse(JSON.stringify(this.state.obd2Data));
    copyData[data.cmdID] = data;
    this.setState({
      obd2Data: copyData,
    });
    if (data.cmdID === 'ENGINE_RPM') {
      this.setState({
        rpm: data.cmdResult
      });
      await cache.set("engineRpm", this.state.rpm);
    }
    if (data.cmdID === 'SPEED') {
      this.setState({
        speed: data.cmdResult,
      });
      await cache.set("speed", this.state.speed);
    }
    if (data.cmdID === 'FUEL_LEVEL') {
      this.setState({
        fuelLevel: data.cmdResult,
      });
      await cache.set("fuelLevel", this.state.fuelLevel);
    }
    if (data.cmdID === 'ENGINE_COOLANT_TEMP') {
      this.setState({
        engineCoolantTemperature: data.cmdResult,
      });
      await cache.set("engineCoolant", this.state.engineCoolantTemperature);
    }
    if (data.cmdID === 'PENDING_TROUBLE_CODES') {
      this.setState({
        pendingTroubleCodes: data.cmdResult,
      });
      await cache.set("troubleCodes", this.state.pendingTroubleCodes);
    }
    setTimeout(async () => {
      this.dataSend();
    }, 3000);

  }

  scan = async () => {
    this.startLiveData();
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
          <TouchableOpacity
            style={styles.buttonInfo}
          >
            <Text>Información</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonTurnos}
          >
            <Text>turnos</Text>
          </TouchableOpacity>
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
  },
  buttonInfo:{
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
  },
  buttonTurnos:{
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent:'space-around' ,
    marginBottom: 15,
    marginTop:20,
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