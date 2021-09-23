import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import Landing from '../components/landing'
import logIn from '../components/logIn'
import Settings from "../components/settings";
import Home from '../components/Home';
import Vehiculos from "../components/vehiculos";
import HomeHeader from "../components/homeHeader";
import { CardStyleInterpolators } from "react-navigation-stack";
import { Dimensions } from 'react-native'

const homeScreens = {
    
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
        navigationOptions: {
            headerShown: false
        }
    },
    Settings: {
        screen: Settings,
        navigationOptions: {
            headerShown: false
        }
    }, 
    HomeHeader: {
        screen: HomeHeader,
        navigationOptions: {
            headerShown: false
        }
    },
    Vehiculos: {
        screen: Vehiculos,
        navigationOptions: {
            headerShown: false
        }
    }
}

const notLoggedScreens = {
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
    }
}

const HomeStack = createAppContainer(createStackNavigator(homeScreens));
const NotLoggedStack = createAppContainer(createStackNavigator(notLoggedScreens))
export {NotLoggedStack, HomeStack}