import React from 'react';
import { SafeAreaView, ScrollView, ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import { DrawerItems } from 'react-navigation-drawer';
import Icon from 'react-native-vector-icons/FontAwesome';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { logoutService } from '../service/auth.service';
import { logoutAction } from '../redux/action/auth.action';
import { Avatar } from 'react-native-elements';

class CustomDrawerComponent extends React.Component {
    logout = () => {
        // logoutService({userId: this.props.userId})
        // .then(result => {

        // })
        this.props.navigation.navigate('Auth')
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <ImageBackground source={require('../../assets/topBarBg.png')} style={{ height: 150 }} >
                    <Text>Abc</Text>
                    <Avatar
                        rounded
                        size="large"
                        source={{
                            uri:
                                'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
                        }}
                        showEditButton
                        onPress={() => this.props.navigation.navigate('UserInfo')}
                    />
                </ImageBackground>
                <ScrollView>
                    <DrawerItems {...this.props} />
                    <TouchableOpacity onPress={() => this.logout()}>
                        <View>
                            <Text>Logout</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        )
    }
}



const mapStateToProps = (state) => ({
    userId: state.userId
});

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ logoutAction }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomDrawerComponent);