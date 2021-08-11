import axios from 'axios'
import React, { Component, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, } from 'react-native'


export default class Info extends Component {

    constructor() {
        super()
        this.state = {
            asignado: true
        }
    }

    render() {
        return (<View>
            {this.state.asignado ?
                <View style={{ justifyContent: "center", marginLeft: 15, marginRight: 15 }}>
                    <Text style={styles.text} >Usted está asignado al vehículo con patente</Text>
                    <Text style={styles.patente}>{global.patente}</Text>
                    <Text style={styles.text} >Kilometros recorridos del vehículo</Text>
                </View> :
                <View style={{ justifyContent: "center", marginLeft: 15, marginRight: 15 }}>
                    <Text style={{ textAlign: "center", fontFamily: "Roboto-Bold", fontSize: 24, color: "#767676" }} >Usted está asignado al vehículo con patente</Text>
                </View>
            }
        </View>
        )
    }
}

const styles = StyleSheet.create({
    text: {
        textAlign: "center",
        fontFamily: "Roboto-Bold",
        fontSize: 24,
        color: "#767676"
    },
    patente: {
        textAlign: "center",
        fontFamily: "Roboto-Bold",
        fontSize: 24,
        color: "black",
        marginTop:40
    },
})