'use strict'

import React, { Component, useReducer  } from 'react'
import { View, Text, LogBox } from 'react-native'
import Info from './info'
import axios from 'axios'
import Config from './Config'


const obd2 = require('react-native-obd2');
LogBox.ignoreLogs(['Setting a timer for a long period of time'])
const keys = ['coolant', 'speed', 'rpm', 'fuel']
let sendInterval

export default class ObdReader extends Component {

  constructor() {
    super()
    this.state = {
        asignado: global.asignado
    }
}

  componentDidMount(){
    this.getUserInfo()
  }
  
  getUserInfo = async () => {
    try {
        const data = await axios.get(Config.API_URL + "/user", {
            headers: {
                'x-access-token': global.at
            }
        });
        if (data.data.vehiculo.patente) {
            global.asignado = true
        } else {
            global.asignado = false
        }
        console.log("Asignado:" + global.asignado);
    } catch (error) {
        console.log(error?.response?.data?.message || error.message);
        console.log("Asignado:" + global.asignado);
    }
}

  render() {
    
    return (
      <View>
        {this.state.asignado ? <Info
          rpm={this.props.rpm}
          speed={this.props.speed}
          fuelLevel={this.props.fuelLevel}
          coolant={this.props.coolant}
          trouble={this.props.knownTroubleCodes}
          errShown={this.props.errShown}
        /> : 
        <View style={{marginTop:"30%"}}>
          <Text style={{fontFamily:"Roboto-Bold", fontSize:24, textAlign:"center"}}>
            Para visualizar la información y las entregas de un vehículo, debe asignarse a uno en la configuración
          </Text>
        </View>
        }
      </View>
    )
  }
}

