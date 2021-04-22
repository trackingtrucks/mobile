import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { globalStyles } from '../styles/global'

export default function Review({ navigation }) {

    const pressHandler = () => {
        navigation.goBack()
    }

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.titleText}>Review screen</Text>
            <Button title='Back to home screen' onPress={pressHandler}></Button>
        </View>
    )
}