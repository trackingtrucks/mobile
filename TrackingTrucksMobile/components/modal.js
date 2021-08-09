import React, { Component, useState } from 'react'
import { View, Modal } from 'react-native'

export default class MyModal extends Component {
    render() {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.props.visible}
            >
                <View style={{ flex: 1, flexDirection: "row", alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    {this.props.children}
                </View>
            </Modal>
        )
    }
}