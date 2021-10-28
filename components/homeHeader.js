import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Image,
    TouchableOpacity,
} from 'react-native';
import ObdReader from './ObdReader'
import Settings from './multimedia/settings.svg'
import Arrow from './multimedia/backArrow.svg'
import Logo from './multimedia/logo.svg'
import Info from './info'
import axios from 'axios';
import Config from './Config';

export default class HomeHeader extends Component {
    constructor(props) {
        super()
        this.state = {
            infoTextColor: "white",
            infoColor: "#830000",
            turnoTextColor: "#830000",
            turnoColor: "white",
            borderInfoColor: "#830000",
            borderTurnoColor: "#A6A6A6",
        }
    }
    render() {

        const { navigation } = this.props.navigation
        const pressBackHandler = () => {
            navigation.goBack()
        }

        const pressSettings = () => {
            navigation.navigate('Settings')
        }
        
        const pressInfoHandler = () => {
            this.props.renderInfo()
            this.setState({
                infoTextColor: "white",
                infoColor: "#830000",
                turnoTextColor: "#830000",
                turnoColor: "white",
                borderInfoColor: "#830000",
                borderTurnoColor: "#A6A6A6",
            })
        }

        const pressTurnoHandler = () => {
            this.props.renderTurno()
            this.setState({
                infoTextColor: "#830000",
                infoColor: "white",
                turnoTextColor: "white",
                turnoColor: "#830000",
                borderInfoColor: "#A6A6A6",
                borderTurnoColor: "#830000",
            })
        }

        return (
            <View>
                <View style={styles.header}>
                    <View style={styles.settings}>
                        <TouchableOpacity onPress={pressSettings}>
                            <Settings />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.logo}>
                        <Logo width="65" height="65" />
                    </View>
                    <View style={styles.nombre}>
                        <Text style={{ textAlign: "center" }} >{global.nombre}{'\n'}{global.rol.charAt(0).toUpperCase() + global.rol.slice(1)}</Text>
                    </View>
                </View>
                {global.asignado ? <View style={styles.buttonContainer}>
                    <View style={styles.buttonInfoContainer} >
                        <TouchableOpacity onPress={pressInfoHandler} style={[styles.buttonInfo, {
                            backgroundColor: this.state.infoColor,
                            borderTopColor: this.state.borderInfoColor,
                            borderRightColor: "transparent",
                            borderBottomColor: this.state.borderInfoColor,
                            borderLeftColor: this.state.borderInfoColor,
                        }]}>
                            <Text style={{
                                textAlign: "center", color: this.state.infoTextColor, fontFamily: "Roboto-Medium", fontSize: 18
                            }}>Información </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonTurnosContainer}>
                        <TouchableOpacity onPress={pressTurnoHandler} style={[styles.buttonTurnos, {
                            backgroundColor: this.state.turnoColor,
                            borderTopColor: this.state.borderTurnoColor,
                            borderRightColor: this.state.borderTurnoColor,
                            borderBottomColor: this.state.borderTurnoColor,
                            borderLeftColor: "transparent",
                        }]}>
                            <Text style={{
                                textAlign: "center", color: this.state.turnoTextColor, fontFamily: "Roboto-Medium", fontSize: 18
                            }} 
                            >Entregas</Text>
                        </TouchableOpacity>
                    </View>
                </View>: null }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
    },
    settings: {
        justifyContent: 'flex-start',
        flex: 1,
        marginLeft: 20
    },
    nombre: {
        flex: 1,
        alignItems: "flex-end",
        marginRight: 20,
    },
    logo: {
        justifyContent: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 80,
        marginBottom: 60
    },
    buttonInfo: {
        borderWidth: 1,
        paddingBottom: 15,
        paddingTop: 15,
        borderRightWidth: 0,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    buttonInfoContainer: {
        marginLeft: 20,
        flex: 1,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    buttonTurnosContainer: {
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        marginRight: 20,
        flex: 1,
    },
    buttonTurnos: {
        backgroundColor: "white",
        borderWidth: 1,
        paddingBottom: 15,
        paddingTop: 15,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,

    },
});