import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Home from '../screens/Home'
import Review from '../screens/Review'
// import About from '../screens/About'

const screens = {
    Home: {
        screen: Home
    },
    Review: {
        screen: Review
    },
    // About: {
    //     screen: About
    // }
}

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);