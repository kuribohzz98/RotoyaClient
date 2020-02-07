import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    ImageBackground,
    TouchableOpacity,
    View,
    StyleSheet,
    Alert
} from 'react-native';
import { Block, theme, Text } from "galio-framework";
import { DrawerItems } from 'react-navigation-drawer';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { logoutAction } from '../redux/action/auth.action';
import { Avatar, Icon, Divider } from 'react-native-elements';

class CustomDrawerComponent extends React.Component {
    logout = () => {
        this.props.logoutAction();
        this.props.navigation.navigate('Auth')
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ padding: 15 }}>
                    <View>
                        <Avatar
                            rounded
                            size="large"
                            source={{ uri: 'data:image/jpeg;base64,' + this.props.avatar }}
                            showEditButton
                            onPress={() => this.props.navigation.navigate('UserInfo')}
                        />
                    </View>
                    <Block style={{ marginTop: 10 }}>
                        <Text bold >{this.props.lastName}</Text>
                    </Block>
                </View>
                <Divider style={{ backgroundColor: 'blue', marginBottom: 10 }} />
                <ScrollView>
                    <DrawerItems {...this.props} />
                    <TouchableOpacity onPress={() =>
                        Alert.alert(
                            'Log out',
                            'Do you want to logout?',
                            [
                                { text: 'Cancel' },
                                {
                                    text: 'Confirm', onPress: () => this.logout()
                                }
                            ],
                            { cancelable: false }
                        )
                    }>
                        <View style={{ flexDirection: 'row', ...styles.Logout }}>
                            <Icon type="material-community" name="logout" size={24} {...styles.LogoutColor} ></Icon>
                            <Text style={{ ...styles.LogoutText, ...styles.LogoutColor }}>Logout</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
            // <Block style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
            //     <Block flex={0.05} style={styles.header}>
            //         <Avatar
            //             rounded
            //             size="large"
            //             source={require('../../assets/brown-and-white-short-coated-puppy.jpg')}
            //             showEditButton
            //             onPress={() => this.props.navigation.navigate('UserInfo')}
            //         />
            //     </Block>
            //     <Block flex>
            //         <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            //             <DrawerItems {...this.props} />
            //             <TouchableOpacity onPress={() =>
            //                 Alert.alert(
            //                     'Log out',
            //                     'Do you want to logout?',
            //                     [
            //                         { text: 'Cancel' },
            //                         {
            //                             text: 'Confirm', onPress: () => this.logout()
            //                         }
            //                     ],
            //                     { cancelable: false }
            //                 )
            //             }>
            //                 <View style={{ flexDirection: 'row', ...styles.Logout }}>
            //                     <Icon type="material-community" name="logout" size={24} {...styles.LogoutColor} ></Icon>
            //                     <Text style={{ ...styles.LogoutText, ...styles.LogoutColor }}>Logout</Text>
            //                 </View>
            //             </TouchableOpacity>
            //         </ScrollView>
            //     </Block>
            // </Block>
        )
    }
}

// const Menu = {
//     contentComponent: props => <Drawer {...props} />,
//     drawerBackgroundColor: "white",
//     drawerWidth: width * 0.8,
//     contentOptions: {
//         activeTintColor: "white",
//         inactiveTintColor: "#000",
//         activeBackgroundColor: "transparent",
//         itemStyle: {
//             width: width * 0.75,
//             backgroundColor: "transparent"
//         },
//         labelStyle: {
//             fontSize: 18,
//             marginLeft: 12,
//             fontWeight: "normal"
//         },
//         itemsContainerStyle: {
//             paddingVertical: 16,
//             paddingHorizonal: 12,
//             justifyContent: "center",
//             alignContent: "center",
//             alignItems: "center",
//             overflow: "hidden"
//         }
//     }
// };

const styles = StyleSheet.create({
    Logout: {
        margin: 16
    },
    LogoutText: {
        fontWeight: 'bold',
        marginLeft: 33
    },
    LogoutColor: {
        color: 'red'
    },
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 28,
        paddingBottom: theme.SIZES.BASE,
        paddingTop: theme.SIZES.BASE * 3,
        justifyContent: 'center'
    }
})

const mapStateToProps = state => ({
    userId: state.loginReducer.userId,
    avatar: state.loginReducer.avatar,
    lastName: state.loginReducer.lastName
});

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ logoutAction }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomDrawerComponent);