import { createDrawerNavigator } from 'react-navigation-drawer';
import MyHomeScreen from '../components/home';
import MyNotificationsScreen from '../components/notifycation';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import AuthLoadingScreen from '../components/auth/authLoading';
import LoginScreen from '../components/auth/login/loginConnector';

const AuthStack = createStackNavigator({ Login: LoginScreen });

const MyDrawerNavigator = createDrawerNavigator(
    {
        Home: {
            screen: MyHomeScreen,
        },
        Notifications: {
            screen: MyNotificationsScreen,
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
