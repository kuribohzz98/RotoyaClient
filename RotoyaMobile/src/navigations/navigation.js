import React from 'react';
import { Dimensions } from 'react-native';
import { createDrawerNavigator } from 'react-navigation-drawer';
import MyHomeScreen from '../components/home/home';
import MyNotificationsScreen from '../components/notifycation';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import AuthLoadingScreen from '../components/auth/authLoading';
import LoginScreen from '../components/auth/login/loginScreen';
import LeftTopButton from '../components/common/LeftTopButton';
import RotoyaMap from '../components/map/map';
import UserInfoScreen from '../components/user/userInfo';
import CustomDrawerComponent from './contentDrawer';
import { Icon } from 'react-native-elements';
import RegisterScreen from '../components/auth/register/registerScreen';
import SportCenterScreen from '../components/sportCenter/sportCenterScreen';

const { width } = Dimensions.get('window');

const AuthStack = createStackNavigator({
    Login: {
        screen: LoginScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    Register: {
        screen: RegisterScreen,
        navigationOptions: {
            title: 'Create Account'
        }
    }
}, {
    initialRouteName: 'Login'
});

const HomeStack = createStackNavigator({
    Home: {
        screen: MyHomeScreen,
        navigationOptions: ({ navigation }) => ({
            headerLeft: (<LeftTopButton navigation={navigation} />)
        })
    },
    SportCenter: {
        screen: SportCenterScreen
        // createStackNavigator({
        //     SportCenterScreen: {
        //         screen: SportCenterScreen,
        //         params: ({ navigation }) => navigation.getParam('id'),
        //         navigationOptions: {
        //             headerShown: false
        //         }
        //     }
        // })
    }
}, {
    initialRouteName: 'Home'
})

const userInfoStack = createStackNavigator({
    Main: {
        screen: UserInfoScreen,
        // navigationOptions: {
        //     headerShown: false
        // }
    }
}, {
    defaultNavigationOptions: ({ navigation }) => ({
        headerLeft: (<LeftTopButton navigation={navigation} />),
    }),
})

const MapStack = createStackNavigator({
    Main: {
        screen: RotoyaMap
    }
}, {
    defaultNavigationOptions: ({ navigation }) => ({
        headerLeft: (<LeftTopButton navigation={navigation} />)
    })
})

const MyDrawerNavigator = createDrawerNavigator(
    {
        Home: {
            screen: HomeStack,
            navigationOptions: {
                drawerIcon: ({ tintColor }) => (<Icon type="font-awesome" name="home" size={24} color={tintColor}></Icon>)
            }
        },
        // Notifications: {
        //     screen: MyNotificationsScreen,
        //     navigationOptions: {
        //         drawerIcon: ({ tintColor }) => (<Icon type="material-community" name="home" size={24} color={tintColor}></Icon>)
        //     }
        // },
        Map: {
            screen: MapStack,
            navigationOptions: {
                drawerIcon: ({ tintColor }) => (<Icon type="font-awesome" name="map" size={24} color={tintColor}></Icon>)
            }
        },
        UserInfo: {
            screen: userInfoStack,
            navigationOptions: {
                drawerIcon: ({ tintColor }) => (<Icon type="font-awesome" name="user" size={24} color={tintColor}></Icon>)
            }
        }
    },
    {
        drawerPosition: 'left',
        initialRouteName: 'Home',
        contentComponent: CustomDrawerComponent,
        drawerBackgroundColor: "white",
        drawerWidth: width * 3 / 5
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