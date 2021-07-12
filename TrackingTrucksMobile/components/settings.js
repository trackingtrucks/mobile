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

class Settings extends Component {
    render() {
        const pressLogOutHandler = () => {
            axios.delete(Config.API_URL, '/auth/token', {
                headers: {
                    "x-refresh-token": global.refreshToken,
                    "x-access-token": global.accessToken
                }
            })
            const { navigation } = this.props
            navigation.navigate('Landing')
        }
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.logButton}>
                    <Text style={styles.logText} onPress={pressLogOutHandler}>Cerrar Sesión</Text>
                </TouchableOpacity>
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