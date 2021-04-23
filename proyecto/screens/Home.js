import React, { useState } from 'react'
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity } from 'react-native'
import { globalStyles } from '../styles/global'

export default function Home({ navigation }) {
    const [reviews, setReviews] = useState([
        { title: 'El paro de camioneros', rating: 10, body: 'Moyano es terrible gato', key: 1 },
        { title: 'El paro de camioneros2', rating: 10, body: 'Moyano es terrible gato2', key: 2 },
        { title: 'El paro de camioneros3', rating: 10, body: 'Moyano es terrible gato3', key: 3 },
    ])

    return (
        <View style={globalStyles.container}>
            <FlatList
                data={reviews}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('Review', item)}>
                        <Text style={globalStyles.titleText}>{item.title}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}
