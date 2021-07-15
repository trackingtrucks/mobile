import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Image,
    TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import Config from './Config';
import Asignacion from './asignacion';

class Settings extends Component {
    render() {
        const { navigation } = this.props
        const pressLogOutHandler = async () => {
            console.log(global.refreshToken)
            try {
                await axios.delete(Config.API_URL + '/auth/token', {
                    headers: {
                        "x-refresh-token": global.refreshToken,
                        "x-access-token": global.accessToken
                    }
                })
                
                navigation.navigate('Landing')
            }
            catch (error) {
                console.error(error?.response?.data?.message || error.message)
            }
        }
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.logButton}>
                    <Text style={styles.logText} onPress={pressLogOutHandler}>Cerrar Sesión</Text>
                </TouchableOpacity>
                <Asignacion/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
    },
    logButton: {
        backgroundColor: "rgba(131, 0, 0, 1)",
        borderRadius: 9,
        padding: 15,
        paddingHorizontal: 70,
        marginTop: "15%"
    },
    logText: {
        color: 'rgba(255, 255, 255, 1)',
        fontSize: 20,
        fontFamily: 'Roboto-Bold'
    }
});

export default Settings