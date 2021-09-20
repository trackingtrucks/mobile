import axios from 'axios'
import React, { Component, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import Config from './Config'

export default class cardTurno extends Component {

    constructor(props) {
        super()
        this.state = {
            turnosPendientes: [],
            turnoActual: {},
            isTurnoActual: false,
            codigoDeTurno: ""
        }
    }

    startHanlder = async (i) => {
        try {
            const res = await axios.patch(Config.API_URL + '/user/entrega/empezar', {
                "codigoDeTurno": this.state.codigoDeTurno,
            }, {
                headers: {
                    "Content-type": "application/json",
                    "x-access-token": global.at
                },

            }
            )
            console.log(res)
        } catch (error) {
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

    finishHandler = async () => {
        try {
            const res = await axios.patch(Config.API_URL + '/user/entrega/terminar', {
                headers: {
                    "x-access-token": global.at
                }
            }
            )
            console.log(res)
        } catch (error) {
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

    componentDidMount() {
        if (global.turnoActual) {
            this.setState({
                isTurnoActual: true,
                turnoActual: global.turnoActual
            })
        } else {
            this.setState({
                isTurnoActual: false
            })
        }
    }

    render() {
        return (
            <View>
                {this.state.isTurnoActual ? <View style={styles.card}>
                    <View style={{ backgroundColor: "#00AB5C", borderRadius: 7, borderWidth: 0.5, padding: 4 }}>
                        <Text style={{ textAlign: "center", fontFamily: "Roboto-Medium", fontSize: 18 }}>
                            En proceso
                        </Text>
                    </View>
                    <Text style={styles.cardTitle}>{global.turnoActual.nombreVendedor}</Text>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={styles.cardSubtitle}>Fecha y hora:  </Text>
                        <Text style={styles.cardSubtitleText}>{global.turnoActual.fechaYhora}</Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={styles.cardSubtitle}>Código de turno: </Text>
                        <Text style={styles.cardSubtitleText}>{global.turnoActual.codigoDeTurno}</Text>
                    </View>
                    <TouchableOpacity style={styles.botonEntrega} onPress={() => this.finishHandler()} >
                        <Text style={{ color: "#fff", textAlign: "center", fontFamily: "Roboto-Medium", fontSize: 18 }}>
                            Finalizar entrega
                        </Text>
                    </TouchableOpacity>
                </View> : null}
                {global.turnosPendientes.map((turnos, i) => {
                    return (
                        <View style={styles.card} key={i}>
                            <Text style={styles.cardTitle}>{turnos.nombreVendedor}</Text>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={styles.cardSubtitle}>Fecha y hora: </Text>
                                <Text style={styles.cardSubtitleText}>{turnos.fechaYhora}</Text>
                            </View>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={styles.cardSubtitle}>Código de turno: </Text>
                                <Text style={styles.cardSubtitleText}>{turnos.codigoDeTurno}</Text>
                            </View>
                            <TouchableOpacity style={styles.botonEntrega} onPress={async (i) => {
                                this.setState({
                                    codigoDeTurno: turnos.codigoDeTurno
                                }); this.startHanlder();
                            }}>
                                <Text style={{ color: "#fff", textAlign: "center", fontFamily: "Roboto-Medium", fontSize: 18 }}>
                                    Empezar entrega
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )
                })}
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
    botonEntrega: {
        backgroundColor: "#830000",
        alignSelf: "flex-end",
        marginRight: "5%",
        borderRadius: 7,
        paddingVertical: 7,
        paddingHorizontal: 18,
        marginBottom: "2%"
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