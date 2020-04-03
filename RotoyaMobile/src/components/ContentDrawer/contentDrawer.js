import React from 'react';
import {
    SafeAreaView,
    View,
    Alert
} from 'react-native';
import { Block, Text } from "galio-framework";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Avatar, Icon, Divider } from 'react-native-elements';
import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
} from '@react-navigation/drawer';
import { AuthAction } from '../../redux/action';
import { ApiConstants } from '../../constants';
import ColorConstants from '../../constants/color.constants';

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
                                source={{uri: ApiConstants.URL_API + '/image/' + this.props.avatar}}
                                showEditButton
                                onPress={() => this.props.navigation.navigate('UserInfo')}
                            />
                        </View>
                        <Block style={{ marginTop: 10 }}>
                            <Text bold >{this.props.lastName}</Text>
                        </Block>
                    </View>
                    <Divider style={{ backgroundColor: ColorConstants.DrawerNavigation.ActiveBackground}} />
                    <Divider style={{ backgroundColor: ColorConstants.DrawerNavigation.ActiveBackground, marginBottom: 10 }} />
                    <DrawerItemList {...this.props} />
                    <DrawerItem
                        label="Logout"
                        focused
                        onPress={() => this.alertLogout()}
                        icon={() => <Icon type="material-community" name="logout" size={24} color={ColorConstants.DrawerNavigation.Logout}/>}
                        activeTintColor={ColorConstants.DrawerNavigation.Logout}
                    />
                </DrawerContentScrollView>
            </SafeAreaView>
        )
    }
}

const mapStateToProps = state => ({
    userId: state.authReducer.userId,
    avatar: state.authReducer.avatar,
    lastName: state.authReducer.lastName
});

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ logoutAction: AuthAction.logoutAction }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomDrawerComponent);