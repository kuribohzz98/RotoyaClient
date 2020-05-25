import React from 'react';
import { Dimensions } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Icon } from 'react-native-elements';
import { Header } from '../components/common';
import Components from '../components';
import { ColorConstants, StorageConstants } from '../constants';
import { StorageService } from '../service';

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
                        title="Trang chủ"
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
                        title="Bộ lọc tìm kiếm"
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
                        title="Trung tâm thể thao"
                        back
                        navigation={navigation}
                        scene={scene}
                    />
                )
            }}
        />
        <Stack.Screen
            name="Booking"
            component={Components.BookingScreen}
            headerMode="screen"
            options={{
                header: ({ navigation, scene }) => (
                    <Header
                        title="Đặt sân"
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
            headerMode="screen"
            options={{
                header: ({ navigation, scene }) => (
                    <Header
                        title="Hóa đơn"
                        back
                        navigation={navigation}
                        scene={scene}
                    />
                )
            }}
        />
        <Stack.Screen
            name="Payment"
            component={Components.PaymentScreen}
            headerMode="screen"
            options={{
                header: ({ navigation, scene }) => (
                    <Header
                        title="Thanh toán"
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
        <Stack.Screen
            name="BookedDetail"
            component={Components.BookedDetailScreen}
        />
        <Stack.Screen
            name="Position"
            component={Components.MapScreen}
            headerMode="screen"
            options={{
                header: ({ navigation, scene }) => (
                    <Header
                        title="Vị trí trung tâm thể thao"
                        back
                        navigation={navigation}
                        scene={scene}
                    />
                )
            }}
        />
    </Stack.Navigator>
)

const StackFavorites = () => (
    <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
            name="FavoritesScreen"
            component={Components.FavoritesScreen}
            headerMode="screen"
            options={{
                header: ({ navigation, scene }) => (
                    <Header
                        title="Yêu thích"
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
                        title="Trung tâm thể thao"
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
            headerMode="screen"
            options={{
                header: ({ navigation, scene }) => (
                    <Header
                        title="Hóa đơn"
                        back
                        navigation={navigation}
                        scene={scene}
                    />
                )
            }}
        />
        <Stack.Screen
            name="Payment"
            component={Components.PaymentScreen}
            headerMode="screen"
            options={{
                header: ({ navigation, scene }) => (
                    <Header
                        title="Thanh toán"
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
        <Stack.Screen
            name="BookedDetail"
            component={Components.BookedDetailScreen}
        />
        <Stack.Screen
            name="Position"
            component={Components.MapScreen}
            headerMode="screen"
            options={{
                header: ({ navigation, scene }) => (
                    <Header
                        title="Vị trí trung tâm thể thao"
                        back
                        navigation={navigation}
                        scene={scene}
                    />
                )
            }}
        />
    </Stack.Navigator>
)

const StackBooked = () => (
    <Stack.Navigator initialRouteName="Booked">
        <Stack.Screen
            name="Booked"
            component={Components.BookedScreen}
            headerMode="screen"
            options={{
                header: ({ navigation, scene }) => (
                    <Header
                        title="Các sân đã đặt"
                        navigation={navigation}
                        scene={scene}
                    />
                )
            }}
        />
        <Stack.Screen
            name="BookedDetail"
            component={Components.BookedDetailScreen}
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
                        title="Thông tin cá nhân"
                        navigation={navigation}
                        scene={scene}
                    />
                )
            }}
        />
    </Stack.Navigator>
)

const StackQrScanner = () => (
    <Stack.Navigator initialRouteName="Scanner">
        <Stack.Screen
            name="Scanner"
            component={Components.QrScannerScreen}
            headerMode="screen"
            options={{
                header: ({ navigation, scene }) => (
                    <Header
                        title="Quét mã QR"
                        navigation={navigation}
                        scene={scene}
                    />
                )
            }}
        />
        <Stack.Screen
            name="BookedScanner"
            component={Components.BookedScannerScreen}
            headerMode="screen"
            options={{
                header: ({ navigation, scene }) => (
                    <Header
                        title="Thông tin đơn"
                        navigation={navigation}
                        scene={scene}
                    />
                )
            }}
        />
    </Stack.Navigator>
)

class DrawerNavigation extends React.Component {
    // const [role, setRole] = React.useState(null);
    // React.useEffect(async () => {
    //     const role_temp = await StorageService.getItem(StorageConstants.Role);
    //     setRole(role_temp);
    // }, [role])
    constructor(props) {
        super(props);
        this.state = {
            role: ""
        }
    }
    async componentDidMount() {
        const role_temp = await StorageService.getItem(StorageConstants.Role);
        this.setState({ role: role_temp })
    }
    render() {
        return (
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
                {
                    this.state.role && this.state.role == "" ?
                        <Drawer.Screen
                            name="main"
                            component={Components.EmptyScreen}
                            options={{
                                drawerIcon: props => (
                                    <Icon type="font-awesome" name="home" size={24} color={props.color}></Icon>
                                ),
                                title: ''
                            }}
                        /> : (!this.state.role ? <>
                            <Drawer.Screen
                                name="Home"
                                component={StackHome}
                                options={{
                                    drawerIcon: props => (
                                        <Icon type="font-awesome" name="home" size={24} color={props.color}></Icon>
                                    ),
                                    title: 'Trang chủ'
                                }}
                            />
                            <Drawer.Screen
                                name="Favorites"
                                component={StackFavorites}
                                options={{
                                    drawerIcon: props => (
                                        <Icon type="material" name="favorite" size={24} color={props.color}></Icon>
                                    ),
                                    title: 'Yêu thích'
                                }}
                            />
                            <Drawer.Screen
                                name="Booked"
                                component={StackBooked}
                                options={{
                                    drawerIcon: props => (
                                        <Icon type="font-awesome" name="bookmark" size={24} color={props.color}></Icon>
                                    ),
                                    title: 'Các sân đã đặt'
                                }}
                            />
                            <Drawer.Screen
                                name="UserInfo"
                                component={StackUserInfo}
                                options={{
                                    drawerIcon: props => (
                                        <Icon type="font-awesome" name="user" size={24} color={props.color}></Icon>
                                    ),
                                    title: 'Thông tin cá nhân'
                                }}
                            />
                        </> : <Drawer.Screen
                                name="QrScanner"
                                component={StackQrScanner}
                                options={{
                                    drawerIcon: props => (
                                        <Icon type="font-awesome" name="qrcode" size={24} color={props.color}></Icon>
                                    ),
                                    title: 'Quét mã QR'
                                }}
                            />)
                }
            </Drawer.Navigator>
        )
    }
}

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