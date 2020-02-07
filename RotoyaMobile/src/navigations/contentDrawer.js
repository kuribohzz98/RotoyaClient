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
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { logoutAction } from '../redux/action/auth.action';
import { Avatar, Icon, Divider } from 'react-native-elements';
import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
} from '@react-navigation/drawer';

class CustomDrawerComponent extends React.Component {
    logout = () => {
        this.props.logoutAction();
        this.props.navigation.navigate('Auth')
    }
    alertLogout = () => {
        return Alert.alert(
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
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <DrawerContentScrollView {...this.props}>
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
                    <DrawerItemList {...this.props} />
                    <DrawerItem
                        label="Logout"
                        focused
                        onPress={() => this.alertLogout()}
                        icon={() => <Icon type="material-community" name="logout" size={24} />}
                        activeTintColor="#de3535"
                    />
                </DrawerContentScrollView>
            </SafeAreaView>
            // <SafeAreaView style={{ flex: 1 }}>
            //     <View style={{ padding: 15 }}>
            //         <View>
            //             <Avatar
            //                 rounded
            //                 size="large"
            //                 source={{ uri: 'data:image/jpeg;base64,' + this.props.avatar }}
            //                 showEditButton
            //                 onPress={() => this.props.navigation.navigate('UserInfo')}
            //             />
            //         </View>
            //         <Block style={{ marginTop: 10 }}>
            //             <Text bold >{this.props.lastName}</Text>
            //         </Block>
            //     </View>
            //     <Divider style={{ backgroundColor: 'blue', marginBottom: 10 }} />
            //     <ScrollView>
            //         <DrawerItems {...this.props} />
            //         <TouchableOpacity onPress={() =>
            //             Alert.alert(
            //                 'Log out',
            //                 'Do you want to logout?',
            //                 [
            //                     { text: 'Cancel' },
            //                     {
            //                         text: 'Confirm', onPress: () => this.logout()
            //                     }
            //                 ],
            //                 { cancelable: false }
            //             )
            //         }>
            //             <View style={{ flexDirection: 'row', ...styles.Logout }}>
            //                 <Icon type="material-community" name="logout" size={24} {...styles.LogoutColor} ></Icon>
            //                 <Text style={{ ...styles.LogoutText, ...styles.LogoutColor }}>Logout</Text>
            //             </View>
            //         </TouchableOpacity>
            //     </ScrollView>
            // </SafeAreaView>
        )
    }
}

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