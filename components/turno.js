import axios from 'axios'
import React, { Component, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Asignacion, Desasignacion } from './asignacion';
import Config from './Config';
import CardTurnos from './cardTurnos';

export default class Info extends Component {

    constructor() {
        super()
        this.state = {
            asignado: global.asignado
        }
    }

    getTurnoInfo = async () => {
        try {
            const data = await axios.get(Config.API_URL + "/company/user/turnos", {
                headers: {
                    'x-access-token': global.at
                }
            });
            global.turnosPendientes = data.data.turnosPendientes
            global.turnoActual = data.data.turnoActual
        } catch (error) {
            console.log(error.message);
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
            if (data.data.vehiculo.patente) {
                global.asignado = true
            } else {
                global.asignado = false
            }
        } catch (error) {
            console.log(error.response.data.message || error.message);
        }
    }



    componentDidMount() {
        console.log(global.asignado); 
        this.getUserInfo()
        this.getTurnoInfo()
        if (global.asignado) {
            this.setState({
                asignado: true
            })
        } else {
            this.setState({
                asignado: false
            })
        }
        console.log("huola", this.state.asignado); 
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
        return (
            <View>
                {this.state.asignado ? <CardTurnos startTrip={this.props.startTrip} /> :
                    <View style={{ marginTop: "30%" }}>
                        <Text style={{ fontFamily: "Roboto-Bold", fontSize: 24, textAlign: "center" }}>
                            Para visualizar la información y las entregas de un vehículo, debe asignarse a uno en la configuración
                        </Text>
                    </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#C4C4C4",
        width: "90%",
        marginLeft: "5%",
        borderColor: "#000",
        borderWidth: 0.5,
        borderRadius: 7,
        marginBottom: "10%"
    },
    cardTitle: {
        textAlign: "center",
        fontFamily: "Roboto-Bold",
        fontSize: 18,
        margin: 10
    },
    cardSubtitle: {
        color: "#830000",
        fontFamily: "Roboto-Medium",
        fontSize: 15,
        marginBottom: 10,
        marginLeft: 10
    },
    cardSubtitleText: {
        fontFamily: "Roboto-Medium",
        fontSize: 15,
    }
})