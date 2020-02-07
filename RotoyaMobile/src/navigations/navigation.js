import React from 'react';
import { Dimensions } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MyHomeScreen from '../components/home/home';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
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

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const StackHome = () => (
    <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
            name="Main"
            component={MyHomeScreen}
            options={({ navigation }) => ({
                headerLeft: props => (<LeftTopButton {...props} navigation={navigation} />)
            })}
        />
        <Stack.Screen
            name="SportCenter"
            component={SportCenterScreen}
        />
    </Stack.Navigator>
)

const StackMap = () => (
    <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
            name="Main"
            component={RotoyaMap}
            options={({ navigation }) => ({
                headerLeft: props => (<LeftTopButton {...props} navigation={navigation} />)
            })}
        />
    </Stack.Navigator>
)

const StackUserInfo = () => (
    <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
            name="Main"
            component={UserInfoScreen}
            options={({ navigation }) => ({
                headerLeft: props => (<LeftTopButton {...props} navigation={navigation} />)
            })}
        />
    </Stack.Navigator>
)

const DrawerNavigation = () => (
    <Drawer.Navigator initialRouteName="Home"
        drawerContent={props => <CustomDrawerComponent {...props} />}
        drawerContentOptions={{
            activeBackgroundColor: "rgb(7, 184, 178)",
            activeTintColor: "white"
        }}
        drawerStyle={{
            backgroundColor: "white",
            width: width * 3.5 / 5
        }}
    >
        <Drawer.Screen
            name="Home"
            component={StackHome}
            options={{
                drawerIcon: props => (
                    <Icon type="font-awesome" name="home" size={24} color={props.color}></Icon>
                )
            }}
        />
        <Drawer.Screen
            name="Map"
            component={StackMap}
            options={{
                drawerIcon: props => (
                    <Icon type="font-awesome" name="map" size={24} color={props.color}></Icon>
                )
            }}
        />
        <Drawer.Screen
            name="UserInfo"
            component={StackUserInfo}
            options={{
                drawerIcon: props => (
                    <Icon type="font-awesome" name="user" size={24} color={props.color}></Icon>
                )
            }}
        />
    </Drawer.Navigator>
)

const StackAuth = () => (
    <Stack.Navigator
        initialRouteName="Login"
        headerMode="screen"
    >
        <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
                headerShown: false
            }}
        />
        <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
                headerTitle: 'Register Account'
            }}
        />
    </Stack.Navigator>
)

const StackAuthSwitch = () => (
    <Stack.Navigator
        initialRouteName="AuthLoading"
        headerMode='none'
    >
        <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
        <Stack.Screen name="App" component={DrawerNavigation} />
        <Stack.Screen name="Auth" component={StackAuth} />
    </Stack.Navigator>
)

function NavigationApp() {
    return (
        <NavigationContainer>
            <StackAuthSwitch />
        </NavigationContainer>
    )
}

export default NavigationApp;