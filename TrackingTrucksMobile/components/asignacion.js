import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Image,
    TouchableOpacity,
    TextInput,
    Alert
} from 'react-native';
import axios from 'axios';
import Config from './Config';

class Asignacion extends Component {
    state = {
        patente: ''
    }
    render() {
        const asignarHandler = async () => {
            try {
                const res = await axios
                    .put(Config.API_URL + '/vehiculo',
                        {
                            patente: this.state.patente
                        }, {
                        headers: {
                            'Content-Type': 'application/json',
                            "x-access-token": global.accessToken,
                        }
                    }
                    )
                console.log("res:" + res.data.message)
            }
            catch (error) {
                Alert.alert(
                    "Error",
                    error.response.data.message,
                    [
                        { text: 'OK', onPress: () => { } },
                    ]
                )
                console.error("error:" + error.response.data.message)
            }
        }
        const desasignarHandler = async () => {
            try {
                const res = await axios
                    .delete(Config.API_URL + '/vehiculo', {
                        data: {
                            patente: this.state.patente
                        },
                        headers: {
                            'Content-Type': 'application/json',
                            "x-access-token": global.accessToken,
                        }
                    }
                    )
                console.log("res:" + res.data)
            }
            catch (error) {
                Alert.alert(
                    "Error",
                    error.response.data.message,
                    [
                        { text: 'OK', onPress: () => { } },
                    ]
                )
                console.log("error:" + error.response.data.message)
            }
        }
        return (
            <View style={styles.container}>
                <View style={styles.inputsContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={(e) => {
                            this.setState({ patente: e })
                        }}
                    />
                </View>
                <TouchableOpacity style={styles.asiButton}>
                    <Text style={styles.asiText} onPress={asignarHandler}>Asignarse</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.asiButton}>
                    <Text style={styles.asiText} onPress={desasignarHandler}>Desasignarse</Text>
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
    asiText: {
        color: 'rgba(255, 255, 255, 1)',
        fontSize: 20,
        fontFamily: 'Roboto-Bold'
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        color: "black"
    },
    asiButton: {
        backgroundColor: "rgba(131, 0, 0, 1)",
        borderRadius: 9,
        padding: 15,
        paddingHorizontal: 70,
        marginTop: "15%"
    },
});

export default Asignacion