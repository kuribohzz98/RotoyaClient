import React from 'react';
import { Alert } from 'react-native';
import { loginService } from '../../../service/auth.service';
import LoginForm from './loginComponent';
import { saveItem } from '../../../service/storage.service';
import { StorageConstants } from '../../../constants/storage.constants';
import { loginAction } from '../../../redux/action/auth.action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setOptionsGetSportCenters } from '../../../redux/action/component.action';

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
        loginService(
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
                const tempOpts = this.props.optionsGetSportCenters || {};
                tempOpts.limit = 5;
                tempOpts.page = 1;
                this.props.setOptionsGetSportCenters(tempOpts);
                await saveItem(StorageConstants.ACCESS_TOKEN, response.data.access_token);
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
    return bindActionCreators({ loginAction, setOptionsGetSportCenters }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);