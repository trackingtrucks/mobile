import axios from 'axios'
import React, { Component, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Asignacion, Desasignacion } from './asignacion';
import Config from './Config';


export default class Info extends Component {

    constructor() {
        super()
        this.state = {
            asignado: global.asignado
        }
    }

    getUserInfo = async () => {
        try {
            const data = await axios.get(Config.API_URL + "/user", {
                headers: {
                    'x-access-token': global.at
                }
            });
            global.patente = data.data.vehiculo.patente
            global.km = data.data.vehiculo.kilometraje
        } catch (error) {
            console.log(error?.response?.data?.message || error.message);
        }
    }

    componentDidMount() {
        this.getUserInfo()
        if (!global.patente) {
            this.setState({
                asignado: false
            })
        } else {
            this.setState({
                asignado: true
            })
        }
    }
    cambiarAsignado = () => {
        this.getUserInfo()
        setTimeout(() => {
            this.setState({
                asignado: !this.state.asignado
            })
        }, 2000);
    }

    render() {
        return (<View>
            {this.state.asignado ?
                <View style={{ justifyContent: "center", marginLeft: 15, marginRight: 15 }}>
                    <Text style={styles.text} >Usted está asignado al vehículo con patente</Text>
                    <Text style={styles.patente}>{global.patente}</Text>
                    <Text style={[styles.text, { marginTop: 40, fontSize: 20 }]} >Kilometros recorridos del vehículo: {global.km} Km</Text>
                    <Desasignacion desasignar={this.props.desasignar} cambiarEstado={this.cambiarAsignado} />
                </View> :
                <View style={{ justifyContent: "center", marginLeft: 15, marginRight: 15 }}>
                    <Text style={{ textAlign: "center", fontFamily: "Roboto-Bold", fontSize: 24, color: "#767676" }} >Ingrese la patente del vehículo al cual se quiera asignar</Text>
                    <Asignacion cambiarEstado={this.cambiarAsignado} />
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
        marginTop: 40
    },
})