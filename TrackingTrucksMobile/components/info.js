import React, { Component, useState } from 'react'
import { View, Text, StyleSheet, DeviceEventEmitter, TouchableOpacity, Modal } from 'react-native'
import MemoryStore from './memoryStore'
import SpeedLogo from './multimedia/speed.svg'
import RpmLogo from './multimedia/rpm.svg'
import DownArrow from './multimedia/downArrow.svg'
import FuelLogo from './multimedia/fuel.svg'
import CoolantLogo from './multimedia/coolant.svg'
import ErrorLogo from './multimedia/error.svg'
import Collapsible from 'react-native-collapsible';
import Accordion from 'react-native-collapsible/Accordion';
import MyModal from './modal'

export default class Info extends Component {

    state = {
        alertsShown: true,
    };

    render() {
        const alertPressHandler = () => {
            if (this.state.alertsShown) {
                this.setState({
                    alertsShown: false
                })
            } else {
                this.setState({
                    alertsShown: true
                })
            }
        }
        return (
            <View >
                <View style={styles.container}>
                    <View elevation={5} style={styles.card}>
                        <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: "center" }}>
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
                        <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: "center" }}>
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
                        <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: "center" }}>
                            <Text style={styles.cardText}>
                                Nivel de nafta
                            </Text>
                            <FuelLogo />
                        </View>
                        <Text style={styles.cardText2}>
                            {" " + this.props.fuelLevel}
                        </Text>
                    </View>
                    <View elevation={5} style={styles.card}>
                        <View style={{ flexDirection: "row", justifyContent: "center" }}>
                            <Text style={styles.cardCoolantText}>
                                Temperatura líquido refrigerante
                            </Text>
                            <CoolantLogo style={{ marginLeft: -8 }} />
                        </View>
                        <Text style={styles.cardText2}>
                            {" " + this.props.coolant}
                        </Text>
                    </View>
                </View>
                {this.state.alertsShown ? <TouchableOpacity style={styles.accordionButton} onPress={alertPressHandler}>
                    <View style={styles.accordionContainer} >
                        <View style={styles.accordionFirst}></View>
                        <View>
                            <Text style={styles.accordionText} >Alertas</Text>
                        </View>
                        <View style={styles.accordionArrow}><DownArrow></DownArrow></View>
                    </View>
                </TouchableOpacity> :
                    <TouchableOpacity style={[styles.accordionButton, { height: 100 }]} onPress={alertPressHandler}>
                        <View style={styles.accordionContainer} >
                            <View style={styles.accordionFirst}></View>
                            <View>
                                <Text style={styles.accordionText} >Alertas</Text>
                            </View>
                            <View style={styles.accordionArrow}>
                                <DownArrow style={{ transform: [{ rotateX: '180deg' }] }} />
                            </View>
                        </View>
                        {this.props.errShown ? <View>
                            <Text>{this.props.trouble}</Text>
                        </View> : <View >
                            <Text style={{ textAlign: "center", marginTop: 10 }} >Por el momento no hay alertas</Text>
                        </View>}
                    </TouchableOpacity>
                }
                {this.props.errShown ? <View>
                    <MyModal>
                        <View style={styles.errCard}>
                            <View style={styles.errorTitle} >
                                <View style={{ flex: 1 }}>
                                    <ErrorLogo />
                                </View>
                                <Text style={styles.errCardText}>
                                    Código de problemas pendientes
                                </Text>
                            </View>
                            <Text style={styles.errCardText} >{" " + this.props.trouble}</Text>
                        </View>
                    </MyModal>
                </View> : null}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        margin: 15
    },
    accordionButton: {
        backgroundColor: "#E3E3E3",
        borderColor: "#830000",
        borderWidth: 1,
        marginLeft: 17,
        marginRight: 17,
        borderRadius: 9,
        height: 50,
        marginTop: 60,
        justifyContent: "flex-start"
    },
    accordionContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10
    },
    accordionArrow: {
        flex: 1,
        alignItems: "flex-end",
        marginRight: 20,
    },
    accordionFirst: {
        justifyContent: 'flex-start',
        flex: 1,
        marginLeft: 20
    },
    accordionText: {
        color: "#830000",
        fontSize: 20,
        fontFamily: "Roboto-Medium",

    },
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
        flex: 1,
        borderRadius: 9,
        shadowColor: "#830000",
        shadowOpacity: 0,
        marginTop: 25,
        marginRight: 15,
        marginLeft: 15,
        alignItems: "center",
    },
    errorTitle: {
        flexDirection: "row",
        alignItems: "center",
    },
    errCardText: {
        color: "#FFFFFF",
        fontFamily: "Roboto-Regular",
        fontSize: 18,
        textAlign: 'center',
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