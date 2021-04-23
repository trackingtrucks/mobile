import { createStackNavigator } from 'react-navigation-stack';
import About from '../screens/About'
import Header from '../components/header'
import React from 'react';

const screens = {
    About: {
        screen: About,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <Header navigation={navigation} title='About'/>,
            }
        }
    },
}

const AboutStack = createStackNavigator(screens, {
    defaultNavigationOptions: {
        headerTintColor: '#444' ,
        headerStyle: { backgroundColor: '#999', height: 100, }
    }
});

export default AboutStack;