import axios from 'axios'
import moment from 'moment-timezone'
import React, { Component, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { startDetecting } from 'react-native/Libraries/Utilities/PixelRatio'
import Config from './Config'

export default class cardTurno extends Component {

    constructor(props) {
        super()
        this.state = {
            turnosPendientes: [],
            turnoActual: {},
            isTurnoActual: false,
            isStartLoading: '',
            isFinishLoading: false
        }
    }

    startHanlder = async (turno, i) => {
        this.props.startTrip()
        if (!this.state.isTurnoActual) {
            this.setState({
                isStartLoading: turno
            })
            try {
                const res = await axios.patch(Config.API_URL + '/user/entrega/empezar', {
                    "codigoDeTurno": turno,
                }, {
                    headers: {
                        "Content-type": "application/json",
                        "x-access-token": global.at
                    },

                }
                )
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
                this.setState({
                    isTurnoActual: true,
                    isStartLoading: ''
                })
            } catch (error) {
                console.log(error.response.data.message || error.message)
                Alert.alert(
                    "Error",
                    error.response.data.message,
                    [
                        { text: 'OK', onPress: () => { } },
                    ]
                )
                this.setState({
                    isStartLoading: '',
                    isTurnoActual: false
                })
            }
        } else {
            Alert.alert(
                "Error",
                'Ya estás en una entrega',
                [
                    { text: 'OK', onPress: () => { } },
                ]
            )
        }
    }

    finishHandler = async () => {
        this.setState({
            isFinishLoading: true
        })
        try {
            const res = await axios.patch(Config.API_URL + '/user/entrega/terminar', {}, {
                headers: {
                    "x-access-token": global.at
                }
            })
            this.setState({
                isTurnoActual: false,
                isFinishLoading: false
            })
            global.turnoActual = null;
        } catch (error) {
            console.log(global.at)
            console.log(error.response.data.message || error.message)
            Alert.alert(
                "Error",
                error.response.data.message,
                [
                    { text: 'OK', onPress: () => { } },
                ]
            )
            this.setState({
                isTurnoActual: true
            })
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
                        <Text style={styles.cardSubtitle}>Fecha y hora: </Text>
                        <Text style={styles.cardSubtitleText}>{moment(global.turnoActual.fechaYhora).format('l').replace(/\//g, "-") + " " + moment(global.turnoActual.fechaYhora).format('HH:mm')}</Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={styles.cardSubtitle}>Código de turno: </Text>
                        <Text style={styles.cardSubtitleText}>{global.turnoActual.codigoDeTurno}</Text>
                    </View>
                    <TouchableOpacity style={styles.botonEntrega} onPress={() => this.finishHandler()} >
                        <Text style={{ color: "#fff", textAlign: "center", fontFamily: "Roboto-Medium", fontSize: 18 }}>
                            Finalizar entrega
                        </Text>
                        {this.state.isFinishLoading && <ActivityIndicator color="#fff" sixe="small" />}
                    </TouchableOpacity>
                </View> : null}
                {global?.turnosPendientes && true ? global?.turnosPendientes.map((turnos, i) => {
                    return (
                        <View style={styles.card} key={i}>
                            <Text style={styles.cardTitle}>{turnos.nombreVendedor}</Text>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={styles.cardSubtitle}>Fecha y hora: </Text>
                                <Text style={styles.cardSubtitleText}>{moment(turnos.fechaYhora).format('l').replace(/\//g, "-") + " " + moment(turnos.fechaYhora).format('HH:mm')}</Text>
                                <Text>{ }</Text>
                            </View>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={styles.cardSubtitle}>Código de turno: </Text>
                                <Text style={styles.cardSubtitleText}>{turnos.codigoDeTurno}</Text>
                            </View>
                            <TouchableOpacity style={styles.botonEntrega} onPress={async (i) => {
                                this.startHanlder(turnos.codigoDeTurno, i);
                            }}>
                                <Text style={{ color: "#fff", textAlign: "center", fontFamily: "Roboto-Medium", fontSize: 18 }}>
                                    Empezar entrega
                                </Text>
                                {this.state.isStartLoading == turnos.codigoDeTurno ? <ActivityIndicator color="#fff" sixe="small" /> : null}
                            </TouchableOpacity>
                        </View>
                    )
                }) : null}
                {global?.turnosPendientes?.length == 0 && !this.state.isTurnoActual ?
                    <View>
                        <Text style={{ fontSize: 24, textAlign: "center", fontFamily: "Roboto-Medium" }}>Aún no tienes ningún turno</Text>
                    </View> : null}
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