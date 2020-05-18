import React from 'react';
import { StatusBar, ActivityIndicator, View, Platform, Linking } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Geolocation from 'react-native-geolocation-service';
import { StorageService } from '../../service';
import { ComponentAction } from '../../redux/action';
import { PermissionsAndroid } from 'react-native';

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
    _bootstrapAsync = async url => {
        console.log('___+++_____', url);
        const userToken = await StorageService.getItem('userToken');
        const tempOpts = this.props.optionsGetSportCenters || {};
        tempOpts.limit = 5;
        tempOpts.page = 1;
        this.props.setOptionsGetSportCenters(tempOpts)
        // const granted = await PermissionsAndroid.request(
        //     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        // );
        // if (granted == PermissionsAndroid.RESULTS.GRANTED) {
        //     new Promise(resolve => {
        //         Geolocation.getCurrentPosition(position => {
        //             tempOpts.latitude = position.coords.latitude;
        //             tempOpts.longitude = position.coords.longitude;
        //             tempOpts.isByLocation = true;
        //             tempOpts.distance = 10;
        //             console.log(tempOpts, '___+++______');
        //             resolve(position);
        //         })
        //     });
        // }
        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        // console.log(this.deepLink, '--hihi');
        if (url) {
            // const route = url.replace(/.*?:\/\//g, '');
            // const params = (route + '').split('&');
            // params.map(param => {
            //     const query = param.split('=');
            //     if (query[0] == 'requestId') this.props.navigation.navigate('App');
            // })
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