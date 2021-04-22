import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { globalStyles } from '../styles/global'

export default function Home({ navigation }) {

    const pressHanlder = () => {
        navigation.navigate('Review')
    }

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.titleText}>Home screen</Text>
            <Button title='go to Review' onPress={pressHanlder}></Button>
        </View>
    )
}
