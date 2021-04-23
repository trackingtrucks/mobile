import { createStackNavigator } from 'react-navigation-stack';
import Home from '../screens/Home'
import Review from '../screens/Review'
import Header from '../components/header'
import React from 'react';
// import About from '../screens/About'

const screens = {
    Home: {
        screen: Home,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <Header navigation={navigation} title='Home' />,
            }
        }
    },
    Review: {
        screen: Review,
        navigationOptions: {
            title: 'Detalles de la review'
        }
    },
    // About: {
    //     screen: About
    // }
}

const HomeStack = createStackNavigator(screens, {
    defaultNavigationOptions: {
        headerTintColor: '#444',
        headerStyle: { backgroundColor: '#999', height: 100, }
    }
});

export default HomeStack;