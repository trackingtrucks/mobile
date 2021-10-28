'use strict'

import React, { Component, useState } from 'react'
import { View, Text, LogBox } from 'react-native'
import Info from './info'

const obd2 = require('react-native-obd2');
LogBox.ignoreLogs(['Setting a timer for a long period of time'])
const keys = ['coolant', 'speed', 'rpm', 'fuel']
let sendInterval

export default class ObdReader extends Component {
  render() {
    return (
      <View>
        {global.asignado ? <Info
          rpm={this.props.rpm}
          speed={this.props.speed}
          fuelLevel={this.props.fuelLevel}
          coolant={this.props.engineCoolantTemperature}
          trouble={this.props.knownTroubleCodes}
          errShown={this.props.errShown}
        /> : 
        <View>
          <Text>
            Para conectarte a un vehículo, asignese al mismo dirigiendose a configuración
          </Text>
        </View>
        }
      </View>
    )
  }
}

