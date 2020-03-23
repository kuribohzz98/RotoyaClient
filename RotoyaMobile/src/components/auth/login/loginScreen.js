import React from 'react';
import { Alert } from 'react-native';
import LoginForm from './loginComponent';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { AuthService, StorageService } from '../../../service';
import { AuthAction } from '../../../redux/action';
import { StorageConstants } from '../../../constants';

class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false
        }
    }
    onSubmit = values => {
        console.log(values);
        this.setState({
            isVisible: true
        })
        AuthService.loginService(
            {
                'username': values.username,
                'password': values.password
            })
            .then(async response => {
                this.setState({
                    isVisible: false
                })
                if (!response.data.user) {
                    console.log('login fail');
                    Alert.alert(
                        'Problem',
                        'Username or password is correct',
                        [
                            { text: 'OK', style: 'cancel' },
                        ]
                    );
                    return;
                }
                this.props.loginAction(response.data.user);
                await StorageService.saveItem(StorageConstants.AccessToken, response.data.access_token);
                this.props.navigation.navigate('App');
            })
            .catch((err) => {
                console.error(err);
                this.setState({
                    isVisible: false
                })
            })
    }
    render() {
        return <LoginForm
            onSubmit={this.onSubmit}
            navigation={this.props.navigation}
            isVisible={this.state.isVisible}
        />
    }
}

const mapStateToProps = (state) => ({
    optionsGetSportCenters: state.componentReducer.optionsGetSportCenters
});

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ loginAction: AuthAction.loginAction }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);