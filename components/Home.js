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
import HomeHeader from './homeHeader';
import Turno from './turno'
import LocationReader from './locationReader';

class Home extends Component {

    constructor(props) {
        super()
        this.state = {
            turnoShown: false,
            infoShown: true
        }
    }

    render() {
        const renderTurno = () => {
            this.setState({
                infoShown: false,
                turnoShown: true
            })
        }

        const renderInfo = () => {
            this.setState({
                infoShown: true,
                turnoShown: false
            })
        }

        return (
            <View style={styles.container}>
                <ImageBackground source={require('./multimedia/backgroundLogo.jpg')} style={{ height: "100%" }}>
                    <HomeHeader renderInfo={renderInfo} renderTurno={renderTurno} navigation={this.props} />
                    {this.state.turnoShown ? <Turno /> : null}
                    {this.state.infoShown ? <ObdReader /> : null}
                </ImageBackground>
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
});

export default Home