import React from 'react';
import { Dimensions } from 'react-native';
import { createDrawerNavigator } from 'react-navigation-drawer';
import MyHomeScreen from '../components/home/home';
import MyNotificationsScreen from '../components/notifycation';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import AuthLoadingScreen from '../components/auth/authLoading';
import LoginScreen from '../components/auth/login/loginConnector';
import LeftTopButton from '../components/common/LeftTopButton';
import RotoyaMap from '../components/map/map';
import UserInfoScreen from '../components/user/userInfo';
import CustomDrawerComponent from './contentDrawer';

const { width } = Dimensions.get('window');

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
            screen: HomeStack
        },
        Notifications: {
            screen: MyNotificationsScreen,
        },
        Map: {
            screen: MapStack
        },
        UserInfo: {
            screen: UserInfoScreen
        }
    },
    {
        drawerPosition: 'left',
        initialRouteName: 'Home',
        drawerWidth: width * 3 / 5,
        contentComponent: CustomDrawerComponent,
        contentOptions: {
            activeTintColor: {
                color: 'orange'
            },
        }
    }
);

const switchNavigator = createSwitchNavigator(
    {
        AuthLoading: MyDrawerNavigator,
        App: MyDrawerNavigator,
        Auth: AuthStack,
    },
    {
        initialRouteName: 'AuthLoading',
    }
)

export default createAppContainer(switchNavigator);
