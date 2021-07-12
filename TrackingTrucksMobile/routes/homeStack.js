import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import Landing from '../components/landing'
import logIn from '../components/logIn'
import Settings from "../components/settings";
import Home from '../components/Home'
import { CardStyleInterpolators } from "react-navigation-stack";
import { Dimensions } from 'react-native'

const screens = {
    Landing: {
        screen: Landing,
        navigationOptions: {
            headerShown: false,
        }
    },
    logIn: {
        screen: logIn,
        navigationOptions: {
            headerShown: false,
        }
    },
    Home: {
        screen: Home,
        navigationOptions:{
            headerShown: false
        }
    },
    Settings: {
        screen: Settings,
        navigationOptions:{
            headerShown: false
        }
    }
    
}

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);