import React from 'react';
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
        try {
            const res = await AuthService.loginService({
                username: values.username,
                password: values.password
            });
            this.setState({ isVisible: false });
            if (!res.data || res.status >= 400) {
                NotificationUtil.errorServer(res);
                return;
            }
            if (!res.data.user) {
                NotificationUtil.error('Tên tài khoản hoặc mật khẩu không chính xác');
                return;
            }
            this.props.loginAction(res.data.user);
            await Promise.all([
                StorageService.saveItem(StorageConstants.AccessToken, res.data.access_token),
                StorageService.saveItem(StorageConstants.Role, res.data.user.roles && res.data.user.roles.length ? res.data.user.roles[0] : ""),
                StorageService.saveItem(StorageConstants.UserId, res.data.user.id + '')
            ]);
            this.props.navigation.navigate('App');
        } catch (e) {
            this.setState({ isVisible: false });
            if (e.message == 'Request failed with status code 401') {
                NotificationUtil.error('Tên đăng nhập hoặc mật khẩu không chính xác');
                return;
            }
            NotificationUtil.error('Đã có lỗi xảy ra');
        }
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