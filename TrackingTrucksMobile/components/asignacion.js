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
                            "x-access-token": global.at,
                        }
                    }
                    )
                global.asignado = true
                this.props.cambiarEstado()
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
            </View>
        )
    }
}

class Desasignacion extends Component {

    render() {
        const desasignarHandler = async () => {
            try {
                const res = await axios
                    .delete(Config.API_URL + '/vehiculo', {
                        data: {
                            "kilometrajeActual": global.km
                        },
                        headers: {
                            'Content-Type': 'application/json',
                            "x-access-token": global.at,
                        }
                    }
                    )
                global.asignado = false
                this.props.cambiarEstado()
                console.log("Desasignado pa")
            }
            catch (error) {
                console.log("error: " +error.response.data.message)
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
                <TouchableOpacity style={styles.asiButton} onPress={desasignarHandler}>
                    <Text style={styles.asiText}>Desasignarme</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
    },
    asiText: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Roboto-Medium',
        textAlign: "center"
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

export { Desasignacion, Asignacion }