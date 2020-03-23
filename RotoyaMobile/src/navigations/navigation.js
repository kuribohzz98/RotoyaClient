import React from 'react';
import { Dimensions } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Icon } from 'react-native-elements';
import { Header } from '../components/common';
import Components from '../components';
import { ColorConstants } from '../constants';

const { width } = Dimensions.get('window');

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const StackHome = () => (
    <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
            name="Home"
            component={Components.HomeScreen}
            headerMode="screen"
            options={{
                header: ({ navigation, scene }) => (
                    <Header
                        title="Home"
                        navigation={navigation}
                        scene={scene}
                    />
                )
            }}
        />
        <Stack.Screen
            name="Filter"
            component={Components.HomeFilterScreen}
            headerMode="screen"
            options={{
                header: ({ navigation, scene }) => (
                    <Header
                        title="Filter"
                        back
                        navigation={navigation}
                        scene={scene}
                    />
                )
            }}
        />
        <Stack.Screen
            name="SportCenter"
            component={Components.SportCenterScreen}
            headerMode="screen"
            options={{
                header: ({ navigation, scene }) => (
                    <Header
                        title="Sport Center"
                        back
                        navigation={navigation}
                        scene={scene}
                    />
                )
            }}
        />
        <Stack.Screen
            name="Bill"
            component={Components.BillScreen}
        />
        <Stack.Screen
            name="Payment"
            component={Components.PaymentScreen}
            headerMode="screen"
            options={{
                header: ({ navigation, scene }) => (
                    <Header
                        title="Payment"
                        back
                        navigation={navigation}
                        scene={scene}
                    />
                )
            }}
        />
        <Stack.Screen
            name="PaymentWebView"
            component={Components.PaymentWebViewScreen}
            headerMode="screen"
        />
    </Stack.Navigator>
)

const StackBooked = () => (
    <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
            name="Main"
            component={Components.BookedScreen}
            headerMode="screen"
            options={{
                header: ({ navigation, scene }) => (
                    <Header
                        title="Booked Ground"
                        back
                        navigation={navigation}
                        scene={scene}
                    />
                )
            }}
        />
        <Stack.Screen
            name="detail"
            component={Components.BookedDetailScreen}
        />
    </Stack.Navigator>
)

const StackMap = () => (
    <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
            name="Main"
            component={Components.MapScreen}
            headerMode="screen"
            options={{
                header: ({ navigation, scene }) => (
                    <Header
                        title="Map"
                        back
                        navigation={navigation}
                        scene={scene}
                    />
                )
            }}
        />
    </Stack.Navigator>
)

const StackUserInfo = () => (
    <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
            name="Main"
            component={Components.UserScreen}
            headerMode="screen"
            options={{
                header: ({ navigation, scene }) => (
                    <Header
                        title="Info"
                        back
                        navigation={navigation}
                        scene={scene}
                    />
                )
            }}
        />
    </Stack.Navigator>
)

const DrawerNavigation = () => (
    <Drawer.Navigator initialRouteName="Home"
        drawerContent={props => <Components.ContentDrawerScreen {...props} />}
        drawerContentOptions={{
            activeBackgroundColor: ColorConstants.DrawerNavigation.ActiveBackground,
            activeTintColor: ColorConstants.DrawerNavigation.ActiveTint
        }}
        drawerStyle={{
            backgroundColor: ColorConstants.DrawerNavigation.StyleBackground,
            width: width * 3.5 / 5
        }}
        edgeWidth={-10}
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
            name="Booked Ground"
            component={StackBooked}
            options={{
                drawerIcon: props => (
                    <Icon type="font-awesome" name="bookmark" size={24} color={props.color}></Icon>
                ),
                title: 'Booked Ground'
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
                ),
                title: 'User Info'
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
            component={Components.LoginScreen}
            options={{
                headerShown: false
            }}
        />
        <Stack.Screen
            name="Register"
            component={Components.RegisterScreen}
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
        <Stack.Screen name="AuthLoading" component={Components.AuthLoadingScreen} />
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