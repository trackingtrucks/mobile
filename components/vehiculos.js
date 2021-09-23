import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { Asignacion, Desasignacion } from './asignacion'
import axios from 'axios';
import Config from './Config';
import HomeHeader from './homeHeader';
import Logo from './multimedia/logo.svg'
import Back from './multimedia/backArrow.svg'

export default class Vehiculos extends Component {
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
            console.log(global.asignado, this.state.asignado ,global.patente);
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
        }, 1000);
    }
    render() {
        const { navigation } = this.props
        const goBack = () => {
            navigation.goBack()
        }

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.settings}>
                        <TouchableOpacity onPress={goBack}>
                            <Back />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.logo}>
                        <Logo width="65" height="65" />
                    </View>
                    <View style={styles.nombre}>
                        <Text style={{ textAlign: "center" }} >{global.nombre}{'\n'}{global.rol.charAt(0).toUpperCase() + global.rol.slice(1)}</Text>
                    </View>
                </View>
                {!this.state.asignado?
                    <Asignacion cambiarEstado={this.cambiarAsignado} /> : <Desasignacion desasignar={this.props.desasignar} cambiarEstado={this.cambiarAsignado} />}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
    },
    nombre: {
        flex: 1,
        alignItems: "flex-end",
        marginRight: 20,
    },
    logo: {
        justifyContent: 'center',
    },
    settings: {
        justifyContent: 'flex-start',
        flex: 1,
        marginLeft: 20
    },
});



