import React from 'react';
import RegisterComponent from './registerComponent';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { AuthService } from '../../../service';
import { NotificationUtil } from '../../../helper/util';
class RegisterScreen extends React.Component {
    static navigationOptions = {
    };
    onSubmit = async values => {
        try {
            const res = await AuthService.registerService(values);
            if (!res.data || res.status >= 400) {
                NotificationUtil.errorServer(res);
                return;
            }
            NotificationUtil.success('Đăng ký thành công');
            this.props.navigation.goBack();
        } catch (e) {
            NotificationUtil.error('Đã có lỗi xảy ra');
        }
    }
    render() {
        return <RegisterComponent onSubmitRegister={this.onSubmit.bind(this)} />
    }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen);