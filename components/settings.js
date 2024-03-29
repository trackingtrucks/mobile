import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Image,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView,
    KeyboardAvoidingView
} from 'react-native';
import axios from 'axios';
import Config from './Config';
import HomeHeader from './homeHeader';
import Logo from './multimedia/logo.svg'
import Back from './multimedia/backArrow.svg'



class Settings extends Component {
    
    state = {
        nombre: global.nombre,
        passwordActual: '',
        passwordNueva: ''
    }

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

        const goBack = () => {
            navigation.goBack()
        }

        const desasiganarHandler = () => {
            navigation.navigate('Vehiculos')
            
        }

        const changePassword = async () => {
            try {
                const res = await axios.patch(Config.API_URL + '/user/cambiar/contrasena/logueado', {
                    "passwordActual": this.state.passwordActual,
                    "password": this.state.passwordNueva
                }, {
                    headers: {
                        "x-access-token": global.at
                    },

                }
                )
                console.log(res)
                navigation.navigate("logIn")
            } catch (error) {
                console.log(error.response.data.message || error.message)
                Alert.alert(
                    "Error",
                    error.response.data.message,
                    [
                        { text: 'OK', onPress: () => { } },
                    ]
                )
            }
        }

        return (
            <KeyboardAvoidingView style={styles.container} >
                <ImageBackground  source={require('./multimedia/backgroundLogoSettings.jpg')} style={{ height: "100%", width:"103%" }} imageStyle={{resizeMode: 'stretch', position: 'absolute', left: "35%",}}>
                    <ScrollView>
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
                        <View>
                            <Text style={{ textAlign: "center", fontFamily: "Montserrat-Bold", textDecorationLine: "underline", fontSize: 22, marginTop: 15, marginBottom: 20 }} >Configuración</Text>
                            <Text style={[styles.width, styles.textStyle]}>
                                Nombre
                            </Text>
                            <TextInput
                                style={[styles.width, styles.input]}
                                value={this.state.nombre}
                                nativeID="nombre"
                                onChangeText={(e) => this.setState({ nombre: e })}
                            />
                            <Text style={[styles.width, styles.textStyle]}>
                                Apellido
                            </Text>
                            <TextInput
                                style={[styles.width, styles.input]}
                                value={global.rol.charAt(0).toUpperCase() + global.rol.slice(1)}
                                onChangeText={(e) => this.setState({ nombre: e })}
                            />
                            <Text style={[styles.width, styles.textStyle]}>
                                Contraseña actual
                            </Text>
                            <TextInput
                                style={[styles.width, styles.input]}
                                onChangeText={(e) => { this.setState({ passwordActual: e }) }}
                            />
                            <Text style={[styles.width, styles.textStyle]}>
                                Contraseña nueva
                            </Text>
                            <TextInput
                                style={[styles.width, styles.input]}
                                onChangeText={(e) => this.setState({ passwordNueva: e })}
                            />
                            <Text style={[styles.width, styles.textStyle]}>
                                Confirmar contraseña nueva
                            </Text>
                            <TextInput
                                style={[styles.width, styles.input]}
                                onChangeText={(e) => this.setState({ passwordNueva: e })}
                            />
                        </View>
                        <View style={{ justifyContent: "flex-end", flex: 1 }}>
                            <TouchableOpacity style={[styles.width, styles.desasignar]} onPress={desasiganarHandler}>
                                <Text style={{ color: "#830000", textAlign: "center", fontFamily: "Roboto-Medium", fontSize: 18 }}>
                                    {global.asignado ?  "Desasignación de vehículo" : "Asignación del vehículo"}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.guardar} onPress={changePassword}>
                                <Text style={{ color: "#fff", textAlign: "center", fontFamily: "Roboto-Medium", fontSize: 18 }}>
                                    Guardar
                                </Text>
                            </TouchableOpacity>
                            <View style={{ width: "90%", borderBottomWidth: 1, marginLeft: "5%" }}></View>
                            <Text onPress={pressLogOutHandler} style={styles.logText}>Cerrar Sesión</Text>
                        </View>
                    </ScrollView>
                </ImageBackground>
            </KeyboardAvoidingView >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white"
    },
    guardar: {
        backgroundColor: "#830000",
        alignSelf: "flex-end",
        marginRight: "5%",
        borderRadius: 7,
        paddingVertical: 7,
        paddingHorizontal: 18,
        marginTop: "4%",
        marginBottom: "4%",
    },
    logText: {
        color: '#D90000',
        fontSize: 20,
        fontFamily: 'Roboto-Bold',
        marginLeft: "5%",
        textAlign: "center",
        marginBottom: "2%"
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
    desasignar: {
        backgroundColor: "#CCCACA",
        borderRadius: 7,
        padding: 20,
        marginTop: "5%"
    },
    width: {
        marginLeft: "5%",
        maxWidth: "90%"
    },
    input: {
        backgroundColor: "rgba(227, 227, 227, 0.3);",
        borderBottomColor: "#9D9D9D",
        borderBottomWidth: 1,
        color: "#000",
        marginBottom: "3%"
    },
    textStyle: {
        fontFamily: "Roboto-Bold",
        fontSize: 16,
        marginBottom: "5%",
    }
});

export default Settings