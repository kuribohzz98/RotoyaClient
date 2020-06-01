import React from 'react';
import { Alert } from 'react-native';
import LoginForm from './loginComponent';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { AuthService, StorageService } from '../../../service';
import { AuthAction } from '../../../redux/action';
import { StorageConstants } from '../../../constants';
import { NotificationUtil } from '../../../helper/util';

class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false
        }
    }
    onSubmit = async values => {
        console.log(values);
        if (!values || Object.keys(values).length != 2) {
            NotificationUtil.error('Thiếu thông tin đăng nhập');
            return;
        }
        this.setState({ isVisible: true });
        const res = await AuthService.loginService({
            username: values.username,
            password: values.password
        });
        this.setState({ isVisible: false });
        if (!res.data || res.status >= 400) {
            NotificationUtil.errorServer(res);
            return;
        }
        this.setState({ isVisible: false });
        if (!res.data.user) {
            console.log('login faild');
            Alert.alert(
                'Problem',
                'Username or password is correct',
                [
                    { text: 'OK', style: 'cancel' },
                ]
            );
            return;
        }
        this.props.loginAction(res.data.user);
        await Promise.all([
            StorageService.saveItem(StorageConstants.AccessToken, res.data.access_token),
            StorageService.saveItem(StorageConstants.Role, res.data.user.roles && res.data.user.roles.length ? res.data.user.roles[0] : null),
            StorageService.saveItem(StorageConstants.UserId, res.data.user.id + '')
        ]);
        this.props.navigation.navigate('App');
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