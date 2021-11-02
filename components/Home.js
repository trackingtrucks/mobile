import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Image,
    ScrollView,
    TouchableOpacity,
    DeviceEventEmitter,
    AsyncStorage,
    LogBox
} from 'react-native';
import ObdReader from './ObdReader'
import HomeHeader from './homeHeader';
import Turno from './turno'
import LocationReader from './locationReader';
import MemoryStore from './memoryStore'
import SpeedLogo from './multimedia/speed.svg'
import RpmLogo from './multimedia/rpm.svg'
import axios from 'axios'
import Config from './Config'
import Info from './info'
import focus from '../jasons/focus.json'
import CardTurno from './cardTurnos'

const obd2 = require('react-native-obd2');
LogBox.ignoreLogs(['Setting a timer for a long period of time'])
const keys = ['coolant', 'speed', 'rpm', 'fuel']
let sendInterval

class Home extends Component {

    constructor(props) {
        super()
        this.state = {
            turnoShown: false,
            infoShown: true,
            obdStatus: '',
            btStatus: '',
            obd2Data: {},
            isStartLiveData: false,
            btSelectedDeviceAddress: '',
            btDeviceList: [],
            selectedBTDeviceIndex: 0,
            btDeviceListForUI: [],
            rpm: 0,
            speed: 0,
            fuelLevel: 0,
            engineCoolantTemperature: 0,
            pendingTroubleCodes: [],
            knownTroubleCodes: [],
            kmsDone: 0,
            prueba: "",
            errShown: false
        }
    }

    btStatus = (data) => {
        this.setState({ btStatus: data.status });
    }
    obdStatus = (data) => {
        this.setState({ obdStatus: data.status });
    }

    componentDidMount() {
        this.btStatusListener = DeviceEventEmitter.addListener('obd2BluetoothStatus', this.btStatus);
        this.obdStatusListener = DeviceEventEmitter.addListener('obd2Status', this.obdStatus);
        this.obdLiveDataListener = DeviceEventEmitter.addListener('obd2LiveData', this.obdLiveData);
        this.onReady();
    }

    componentWillUnmount() {
        obd2.stopLiveData();
        this.btStatusListener.remove();
        this.obdStatusListener.remove();
    }

    onReady() {
        obd2.ready();
        obd2.getBluetoothDeviceNameList()
            .then((nameList) => {
                this.setState({ btDeviceList: nameList });
                let deviceForUI = nameList.map((item, index) => {
                    if (item.address === this.props.btSelectedDeviceAddress) {
                        this.setState({ selectedBTDeviceIndex: index });
                    }
                    if (item.name === 'OBDII') {
                        this.setState({
                            btSelectedDeviceAddress: item.address,
                        })
                    }
                });
                this.setState({ btDeviceListForUI: deviceForUI });
            })
    }

    startLiveData = () => {
        if (this.state.btSelectedDeviceAddress.length === 0) {
            Alert.alert(
                'Dispositivo Bluetooth',
                'Tiene que activar bluetooth y/o conectarse al dispositivo con el nombre OBDII',
                [
                    { text: 'OK', onPress: () => { } },
                ]
            )
            return;
        }
        this.setState({
            isStartLiveData: true,
        });
        obd2.startLiveData(this.state.btSelectedDeviceAddress);
    }

    stopLiveData() {
        this.setState({
            isStartLiveData: false,
            btStatus: '-',
        });
        SensorManager.stopOrientation();
        this.obdLiveDataListener && this.obdLiveDataListener.remove();
        this.listenerOrientation && this.listenerOrientation.remove();
        obd2.stopLiveData();
    }

    dataSend = async () => {
        try {
            this.state.knownTroubleCodes.sort()
            if (this.state.pendingTroubleCodes.length == 0) {
                const res = await axios.post(Config.API_URL + '/data', {
                    "fuelLevel": JSON.parse((await AsyncStorage.getItem("fuel")).replace(/'/g, `"`)),
                    "RPM": JSON.parse((await AsyncStorage.getItem("rpm")).replace(/'/g, `"`)),
                    "speed": JSON.parse((await AsyncStorage.getItem("speed")).replace(/'/g, `"`)),
                    "coolantTemperature": JSON.parse((await AsyncStorage.getItem("coolant")).replace(/'/g, `"`)),
                    "kilometrosRecorridos": this.state.kmsDone
                }, {
                        headers: {
                            'Content-Type': 'application/json',
                            "x-access-token": global.at,
                        }
                    })
                this.setState({
                    errShown: false
                })
            } else if (JSON.stringify(this.state.pendingTroubleCodes) !== JSON.stringify(this.state.knownTroubleCodes)) {
                this.setState({
                    errShown: true
                })
                console.log("Los pending: " + this.state.pendingTroubleCodes);
                const res = await axios.post(Config.API_URL + '/data', {
                    "fuelLevel": JSON.parse((await AsyncStorage.getItem("fuel")).replace(/'/g, `"`)),
                    "RPM": JSON.parse((await AsyncStorage.getItem("rpm")).replace(/'/g, `"`)),
                    "speed": JSON.parse((await AsyncStorage.getItem("speed")).replace(/'/g, `"`)),
                    "coolantTemperature": JSON.parse((await AsyncStorage.getItem("coolant")).replace(/'/g, `"`)),
                    "kilometrosRecorridos": this.state.kmsDone,
                    "pendingTroubleCodes": this.state.pendingTroubleCodes
                }, {
                        headers: {
                            'Content-Type': 'application/json',
                            "x-access-token": global.at,
                        }
                    })
            }
            await AsyncStorage.multiRemove(keys)
            this.state.knownTroubleCodes.push(this.state.pendingTroubleCodes)
            this.setState({
                pendingTroubleCodes: []
            })
            console.log(this.state.pendingTroubleCodes);
        } catch (error) {
            this.setState({ disableButton: false })
            console.log(error)
            Alert.alert(
                "Error",
                error ?.response ?.data ?.message, "hola",
                [
                    { text: 'OK', onPress: () => { } },
                ]
            )
        }
    }

    obdLiveData = async (data) => {
        let copyData = JSON.parse(JSON.stringify(this.state.obd2Data));
        copyData[data.cmdID] = data;
        this.setState({
            obd2Data: copyData,
        });
        if (data.cmdID != null) {
            if (data.cmdID === 'ENGINE_RPM') {
                if (await AsyncStorage.getItem('rpm') === null) {
                    await AsyncStorage.setItem('rpm', JSON.stringify({ [Date.now()]: parseInt(data.cmdResult) }))
                }
                this.setState({
                    rpm: parseInt(data.cmdResult)
                });
                await AsyncStorage.mergeItem('rpm', JSON.stringify({ [Date.now()]: parseInt(data.cmdResult) }))
            }
            if (data.cmdID === 'SPEED') {
                if (await AsyncStorage.getItem('speed') === null) {
                    await AsyncStorage.setItem('speed', JSON.stringify({ [Date.now()]: parseInt(data.cmdResult) }))
                }
                this.setState({
                    speed: parseInt(data.cmdResult),
                });
                await AsyncStorage.mergeItem('speed', JSON.stringify({ [Date.now()]: parseInt(data.cmdResult) }))
            }
            if (data.cmdID === 'FUEL_LEVEL') {
                if (await AsyncStorage.getItem('fuel') === null) {
                    await AsyncStorage.setItem('fuel', JSON.stringify({ [Date.now()]: parseInt(data.cmdResult) }))
                }
                this.setState({
                    fuelLevel: parseInt(data.cmdResult),
                });
                await AsyncStorage.mergeItem('fuel', JSON.stringify({ [Date.now()]: parseInt(data.cmdResult) }))
            }
            if (data.cmdID === 'ENGINE_COOLANT_TEMP') {
                if (await AsyncStorage.getItem('coolant') === null) {
                    await AsyncStorage.setItem('coolant', JSON.stringify({ [Date.now()]: parseInt(data.cmdResult) }))
                }
                this.setState({
                    engineCoolantTemperature: parseInt(data.cmdResult),
                });
                await AsyncStorage.mergeItem('coolant', JSON.stringify({ [Date.now()]: parseInt(data.cmdResult) }))
            }
        }
        if (data.cmdID === 'PENDING_TROUBLE_CODES') {
            this.setState({
                pendingTroubleCodes: focus[data.cmdResult],
            });
        }
    }

    scan = async () => {
        this.startLiveData();
        if (this.state.pendingTroubleCodes.length == 0) {
            setInterval(() => {
                this.dataSend()
            }, 300000);
        } else {
            this.dataSend()
        }
    }

    dataSendTest = async () => {
        if (this.state.pendingTroubleCodes.length == 0) {
            sendInterval = setInterval(() => {
                console.log("Esta es sin errores: " + this.state.pendingTroubleCodes.length);
                this.dataSend()
            }, 300000)
        }
    }

    errorDataSend = () => {
        if (this.state.pendingTroubleCodes.length != 0) {
            console.log("Esta es con errores: " + this.state.pendingTroubleCodes.length);
            this.dataSend()
            setTimeout(() => {
                clearInterval(sendInterval)
                this.dataSendTest()
            }, 2000);
        }
        setTimeout(() => {
            this.errorDataSend()
        }, 2000);
    }

    addError = () => {
        let data = "P1904"
        data = focus[data]
        console.log("data:" + data);
        this.setState({
            pendingTroubleCodes: data
        })
        this.state.knownTroubleCodes.push(this.state.pendingTroubleCodes)
        console.log("Known: " + this.state.knownTroubleCodes)
        console.log("Pending: " + this.state.pendingTroubleCodes)
        this.setState({
            errShown: true
        })
    }

    addError2 = () => {
        this.setState({
            pendingTroubleCodes: "Error2"
        })
        this.state.knownTroubleCodes.push(this.state.pendingTroubleCodes)
        console.log("Known: " + this.state.knownTroubleCodes)
        console.log("Pending: " + this.state.pendingTroubleCodes)
        this.setState({
            errShown: true
        })
    }

    startTrip = async () => {
        this.startLiveData()
        this.dataSendTest()
        this.errorDataSend()
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
                <ImageBackground source={require('./multimedia/backgroundLogo.jpg')} style={{ height: "100%", width: "102%" }} imageStyle={{ resizeMode: 'cover', position: 'absolute', left: "48%", top: "18%" }}>
                    <ScrollView style={{ marginBottom: 20 }}>
                        <HomeHeader renderInfo={renderInfo} renderTurno={renderTurno} navigation={this.props} />
                        {this.state.turnoShown ? <Turno startTrip={this.startTrip} /> : null}
                        {this.state.infoShown ? <ObdReader startTrip={this.startTrip} 
                            rpm={this.state.rpm}
                            speed={this.state.speed}
                            fuelLevel={this.state.fuelLevel}
                            coolant={this.state.engineCoolantTemperature}
                            trouble={this.state.knownTroubleCodes}
                            errShown={this.state.errShown} /> : null}
                    </ScrollView>
                </ImageBackground>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
});

export default Home