import React from 'react';
import { loginService } from '../../../service/auth.service';
import LoginForm from './loginComponent';
import { saveItem } from '../../../service/storage.service';
import { StorageConstants } from '../../../constants/storage.constants';
import { loginAction } from '../../../redux/action/auth.action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false
        }
    }
    static navigationOptions = {

    };
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
            .then((response) => {
                this.setState({
                    isVisible: false
                })
                if (!response.data.user) {
                    console.log('login fail');
                    return;
                }
                this.props.loginAction(response.data.user);
                saveItem(StorageConstants.ACCESS_TOKEN, response.data.access_token);
                this.props.navigation.navigate('Home');
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    isVisible: false
                })
                // this.props.navigation.navigate('Home');
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
});

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ loginAction }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);