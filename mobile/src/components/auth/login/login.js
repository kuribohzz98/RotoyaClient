import React from 'react';
import { loginService } from '../../../service/auth.service';
import LoginForm from './loginForm.component';
import { saveItem } from '../../../service/storage.service';
import { StorageConstants } from '../../../constants/storage.constants';

export default class LoginScreen extends React.Component {
    static navigationOptions = {
        
    };
    onSubmit = values => {
        console.log(values);
        loginService(
            {
                'username': values.username,
                'password': values.password
            })
            .then((response) => {
                console.log(response.data);
                this.props.loginAction(response.data.user.username);
                saveItem(StorageConstants.ACCESS_TOKEN, response.data.access_token);
                this.props.navigation.navigate('Home');
            })
            .catch((err) => {
                console.log(err);
                this.props.navigation.navigate('Home');
            })
    }
    render() {
        return <LoginForm onSubmit={this.onSubmit} />
    }
}