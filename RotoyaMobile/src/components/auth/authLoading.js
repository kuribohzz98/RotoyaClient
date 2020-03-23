import React from 'react';
import { StatusBar, ActivityIndicator, View, Platform, Linking } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { StorageService } from '../../service';
import { ComponentAction } from '../../redux/action';

class AuthLoadingScreen extends React.Component {
    
    async componentDidMount() {
        if (Platform.OS === 'android') {
            const url = await Linking.getInitialURL();
            this.navigate(url);
        } else {
            Linking.addEventListener('url', this.handleOpenURL);
        }
    }

    componentWillUnmount() {
        Linking.removeEventListener('url', this.handleOpenURL);
    }
    handleOpenURL = (event) => {
        this.navigate(event.url);
    }
    navigate = (url) => {
        console.log('___+++_____', url);
        this._bootstrapAsync(url);
        // const { navigate } = this.props.navigation;
        // const route = url.replace(/.*?:\/\//g, '');
        // const id = route.match(/\/([^\/]+)\/?$/)[1];
        // const routeName = route.split('/')[0];
        // this.props.navigation.navigate('App');
        // if (routeName === 'payment') {
        //     navigate('home')
        // };
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async (url) => {
        const userToken = await StorageService.getItem('userToken');
        const tempOpts = this.props.optionsGetSportCenters || {};
        tempOpts.limit = 5;
        tempOpts.page = 1;
        this.props.setOptionsGetSportCenters(tempOpts);
        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        // console.log(this.deepLink, '--hihi');
        if (url) {
            this.props.navigation.navigate('App');
            return;
        };
        this.props.navigation.navigate(userToken ? 'App' : 'Auth');
    };

    // Render any loading content that you like here
    render() {
        return (
            <View>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    optionsGetSportCenters: state.componentReducer.optionsGetSportCenters
});

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ setOptionsGetSportCenters: ComponentAction.setOptionsGetSportCenters }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoadingScreen);