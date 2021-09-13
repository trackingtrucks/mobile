import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Image,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import Config from './Config';
import HomeHeader from './homeHeader';
import Logo from './multimedia/logo.svg'
import Back from './multimedia/backArrow.svg'

class Settings extends Component {
    render() {
        const { navigation } = this.props
        const pressLogOutHandler = async () => {
            console.log(global.refreshToken)
            try {
                await axios.delete(Config.API_URL + '/auth/token', {
                    headers: {
                        "x-refresh-token": global.refreshToken,
                        "x-access-token": global.at
                    }
                })

                navigation.navigate('Landing')
            }
            catch (error) {
                console.error(error.response.data.message || error.message)
            }
        }
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.settings}>
                        <TouchableOpacity >
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
                <View style={{ justifyContent: "flex-end", flex: 1 }}>
                    <View style={{ alignItems: "center" }}>
                        <View style={{ backgroundColor: '#A2A2A2', height: 1, width: "90%" }}></View>
                    </View>
                    <Text onPress={pressLogOutHandler} style={styles.logText}>Cerrar Sesión</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    logText: {
        color: '#D90000',
        fontSize: 20,
        fontFamily: 'Roboto-Bold',
        marginLeft: "5%",
        marginBottom: "20%"
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
});

export default Settings