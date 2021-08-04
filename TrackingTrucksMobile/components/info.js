import React, { Component, useState } from 'react'
import { View, Text, StyleSheet, DeviceEventEmitter, TouchableOpacity, Alert } from 'react-native'
import MemoryStore from './memoryStore'
import SpeedLogo from './multimedia/speed.svg'
import RpmLogo from './multimedia/rpm.svg'
import FuelLogo from './multimedia/fuel.svg'
import CoolantLogo from './multimedia/coolant.svg'

export default class Info extends Component {
    render() {
        return (
            <View >
                <View style={styles.container}>
                    <View elevation={5} style={styles.card}>
                        <View style={{ flexDirection: "row", justifyContent: 'center', alignItems:"center" }}>
                            <Text style={styles.cardText}>
                                RPM
                            </Text>
                            <RpmLogo />
                        </View>
                        <Text style={styles.cardText2}>
                            {" " + this.props.rpm}
                        </Text>
                    </View>
                    <View elevation={5} style={styles.card}>
                        <View style={{ flexDirection: "row", justifyContent: 'center', alignItems:"center" }}>
                            <Text style={styles.cardText}>
                                Velocidad
                            </Text>
                            <SpeedLogo />
                        </View>
                        <Text style={styles.cardText2}>
                            {" " + this.props.speed}
                        </Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View elevation={5} style={styles.card}>
                        <View style={{ flexDirection: "row", justifyContent: 'center', alignItems:"center" }}>
                            <Text style={styles.cardText}>
                                Nivel de nafta
                            </Text>
                            <FuelLogo/>
                        </View>
                        <Text style={styles.cardText2}>
                            {" " + this.props.fuelLevel}
                        </Text>
                    </View>
                    <View elevation={5} style={styles.card}>
                        <View style={{ flexDirection: "row", justifyContent:"center"}}>
                            <Text style={styles.cardCoolantText}>
                                Temperatura líquido refrigerante
                            </Text>
                            <CoolantLogo style={{marginLeft:-8}} />
                        </View>
                        <Text style={styles.cardText2}>
                            {" " + this.props.coolant}
                        </Text>
                    </View>
                </View>
                {this.props.errShown ? <View style={styles.errCard}>
                    <Text style={styles.errCardText}>
                        Código de problemas pendientes
                    </Text>
                    <Text style={styles.errCardText} >{" " + this.props.trouble}</Text>
                </View> : null}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 10
    },
    card: {
        backgroundColor: "rgba(227, 227, 227, 1)",
        width: "43%",
        height: 142,
        borderRadius: 9,
        justifyContent: 'space-evenly',
        shadowColor: "#830000",
        shadowOpacity: 0,
        margin: 10
    },
    errCard: {
        backgroundColor: "#830000",
        height: 100,
        borderRadius: 9,
        justifyContent: 'center',
        shadowColor: "#830000",
        shadowOpacity: 0,
        marginTop: 25,
        marginLeft: 15,
        marginRight: 15
    },
    errCardText: {
        color: "#FFFFFF",
        fontFamily: "Roboto-Regular",
        fontSize: 18,
        textAlign: 'center'
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    cardText: {
        textAlign: 'center',
        color: "#830000",
        fontSize: 14,
        fontFamily: "Roboto-Regular",
        marginRight: 10
    },
    cardCoolantText: {
        textAlign: 'center',
        color: "#830000",
        fontSize: 14,
        fontFamily: "Roboto-Regular",
        marginLeft: 10
    },
    cardText2: {
        textAlign: 'center',
        fontSize: 14,
        fontFamily: "Roboto-Regular"
    }
})