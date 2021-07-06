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


class Home extends Component {
    render() {
        const { navigation } = this.props
        const pressBackHandler = () => {
            navigation.goBack()
        }

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity>
                        <Settings style={styles.settings} />
                    </TouchableOpacity>
                    <Logo width="65" height="65" style={{ marginTop: -8 }} />
                    <View style={styles.nombre}>
                        <Text>{global.perfil.nombre}</Text>
                        <Text>{global.perfil.rol}</Text>
                    </View>
                </View>
                <ObdReader />
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
        justifyContent:"space-between"
    },
    nombre:{
    },
    settings:{

    }
});

export default Home