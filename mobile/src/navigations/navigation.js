import React from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';
import MyHomeScreen from '../components/home';
import MyNotificationsScreen from '../components/notifycation';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import AuthLoadingScreen from '../components/auth/authLoading';
import LoginScreen from '../components/auth/login/loginConnector';
import LeftTopButton from '../components/common/LeftTopButton';
import RotoyaMap from '../components/map/map';

const AuthStack = createStackNavigator({
    Login: LoginScreen
}, { headerMode: 'none' });

const HomeStack = createStackNavigator({
    Main: {
        screen: MyHomeScreen
    }
}, {
    initialRouteName: 'Main',
    defaultNavigationOptions: ({ navigation }) => ({
        headerLeft: (<LeftTopButton navigation={navigation} />)
    })
})

const MapStack = createStackNavigator({
    Main: {
        screen: RotoyaMap
    }
}, {
    initialRouteName: 'Main',
    defaultNavigationOptions: ({ navigation }) => ({
        headerLeft: (<LeftTopButton navigation={navigation} />)
    })
})

const MyDrawerNavigator = createDrawerNavigator(
    {
        Home: {
            screen: HomeStack,
            contentOptions: {
                activeTintColor: '#e91e63'
            }
        },
        Notifications: {
            screen: MyNotificationsScreen,
        },
        Map: {
            screen: MapStack
        }
    },
    {
        drawerPosition: 'left',
        initialRouteName: 'Home',
        drawerBackgroundColor: 'orange',
        drawerWidth: 200
    }
);

const switchNavigator = createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        App: MyDrawerNavigator,
        Auth: AuthStack,
    },
    {
        initialRouteName: 'AuthLoading',
    }
)

export default createAppContainer(switchNavigator);
