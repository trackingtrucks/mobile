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

export default class HomeHeader extends Component {
    constructor(props) {
        super()
        this.state = {
            infoTextColor: "white",
            infoColor: "#830000",
            turnoTextColor: "#830000",
            turnoColor: "white"
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
            turnoColor: "white"
            })
        }

        const pressTurnoHandler = () => {
            this.props.renderTurno()
            this.setState({
                infoTextColor: "#830000",
                infoColor: "white",
                turnoTextColor: "white",
                turnoColor: "#830000"
            })
        }

        return (
            <View>
                <View style={styles.header}>
                    <TouchableOpacity onPress={pressSettings}>
                        <Settings style={styles.settings} />
                    </TouchableOpacity>
                    <Logo width="65" height="65" style={styles.logo} />
                    <View style={styles.nombre}>
                        <Text>{global.perfil.nombre}</Text>
                        <Text>{global.perfil.rol}</Text>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <View style={styles.buttonInfoContainer} >
                        <TouchableOpacity style={[styles.buttonInfo, {backgroundColor: this.state.infoColor}]}>
                            <Text style={{ textAlign: "center", color: this.state.infoTextColor, fontFamily: "Roboto-Medium", fontSize: 18 }} onPress={pressInfoHandler}>Información </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonTurnosContainer}>
                        <TouchableOpacity style={[styles.buttonTurnos, {backgroundColor:this.state.turnoColor}]}>
                            <Text style={{ textAlign: "center", color: this.state.turnoTextColor, fontFamily: "Roboto-Medium", fontSize: 18 }} onPress={pressTurnoHandler}>Turnos</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
        justifyContent: "space-between"
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        marginBottom: 15
    },
    buttonInfo:{
        borderTopColor: "#830000",
        borderRightColor: "transparent",
        borderBottomColor: "#830000",
        borderLeftColor: "#830000",
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
    buttonTurnosContainer:{
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        marginRight: 20,
        flex: 1,
    },
    buttonTurnos: {
        backgroundColor: "white",
        borderTopColor: "#A6A6A6",
        borderRightColor: "#A6A6A6",
        borderBottomColor: "#A6A6A6",
        borderLeftColor: "transparent",
        borderWidth: 1,
        paddingBottom: 15,
        paddingTop: 15,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        
    },
});