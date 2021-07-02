import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Image,
    TouchableOpacity,
} from 'react-native';
import Settings from './multimedia/settings.svg'
import Arrow from './multimedia/backArrow.svg'


class Home extends Component {
    render() {
        const { navigation } = this.props
        const pressBackHandler = () => {
            navigation.goBack()
        }

        return (
            <View>
                <TouchableOpacity>
                    <Settings style={{ marginLeft: 20, marginTop: 20 }} />
                    <Text>Hola {global.perfil.nombre} {global.perfil.apellido}</Text>
                    <Text>Tu compania es {global.perfil.companyId}</Text>
                    <Text>Estas despedido!</Text>
                </TouchableOpacity>
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginTop: 70
    },
    arrow: {
        alignSelf: 'flex-start',
        marginLeft: '5%',
        marginTop: '10%'
    },
    bottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: '5%',
        marginTop: '5%'
    },
});

export default Home