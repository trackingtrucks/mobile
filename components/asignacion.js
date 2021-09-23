import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Image,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator
} from 'react-native';
import axios from 'axios';
import Config from './Config';

class Asignacion extends Component {
    state = {
        patente: '',
        isLoading: false
    }
    render() {
        const asignar = async () => {
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
                this.setState({
                    isLoading: false
                })

                Alert.alert(
                    "Error",
                    error?.response?.data?.message,
                    [
                        { text: 'OK', onPress: () => { } },
                    ]
                )
                console.log("error:" + error?.response?.data?.message)
            }
        }
        const asignarHandler = () => {
            this.setState({
                isLoading: true
            })
            asignar()
        }
        return (
            <View style={styles.container}>
                <View>
                    <Text style={{ textAlign: "center", fontFamily: "Roboto-Bold", color: "#767676", fontSize: 24, marginTop: "20%", marginBottom: "20%" }}>
                        Ingrese la patente del vehículo al cual se quiera asignar
                    </Text>
                </View>
                <View style={styles.inputsContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={(e) => {
                            this.setState({ patente: e })
                        }}
                    />
                </View>
                <TouchableOpacity style={styles.asiButton} onPress={asignarHandler}>
                    {!this.state.isLoading && <Text style={styles.asiText}>Asignarse</Text>}
                    {this.state.isLoading && <ActivityIndicator color="#fff" />}
                </TouchableOpacity>
            </View>
        )
    }
}

class Desasignacion extends Component {

    state = {
        isLoading: false,
        km: 0
    }

    render() {
        const desasignarHandler = async () => {
            this.setState({
                isLoading: true
            })
            try {
                if (this.state.km >= global.km) {
                    const res = await axios
                        .delete(Config.API_URL + '/vehiculo', {
                            data: {
                                "kilometrajeActual": this.state.km
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
                } else {
                    Alert.alert(
                        "Error",
                        "Debe ingresar el kilometraje correcto",
                        [
                            { text: 'OK', onPress: () => { } },
                        ]
                    )
                    this.setState({
                        isLoading: false
                    })
                }
            }
            catch (error) {
                this.setState({
                    isLoading: false
                })
                console.log("error: " + error)
            }
        }
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: "center", fontFamily: "Roboto-Bold", color: "#767676", fontSize: 24, marginTop: "20%", marginHorizontal:"3%" }}>
                    Usted está asignado al vehículo con patente
                </Text>
                <Text style={{ textAlign: "center", fontFamily: "Roboto-Bold", color: "#000000", fontSize: 24, marginTop:"10%"}}>{global.patente} </Text>
                <Text style={{ textAlign: "center", fontFamily: "Roboto-Bold", color: "#767676", fontSize: 24, marginTop:"10%", marginBottom:"10%"}}>Kilometros recorridos del vehículo {global.km} </Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(e) => {
                        this.setState({ km: e })
                    }}
                />
                <TouchableOpacity style={styles.asiButton} onPress={desasignarHandler}>
                    {!this.state.isLoading && <Text style={styles.asiText}>Desasignarme</Text>}
                    {this.state.isLoading && <ActivityIndicator color="#fff" size="small" />}
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
        height: 50,
        marginHorizontal: "10%",
        borderWidth: 1,
        color: "black",
        borderRadius: 6,
    },
    asiButton: {
        backgroundColor: "rgba(131, 0, 0, 1)",
        borderRadius: 9,
        padding: 15,
        marginHorizontal: "14%",
        marginTop: "15%"
    },
});

export { Desasignacion, Asignacion }