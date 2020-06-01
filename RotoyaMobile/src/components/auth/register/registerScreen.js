import React from 'react';
import RegisterComponent from './registerComponent';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { AuthService, StorageService } from '../../../service';
import { StorageConstants } from '../../../constants';
StorageConstants.AccessToken
class RegisterScreen extends React.Component {
    static navigationOptions = {
    };
    onSubmit = values => {
        console.log(values);
        // AuthService.registerService(
        //     {
        //         'username': values.username,
        //         'password': values.password
        //     })
        //     .then((response) => {
        //         // console.log(response.data);
        //         // this.props.loginAction(response.data.user.username);
        //         // StorageService.saveItem(StorageConstants.AccessToken, response.data.access_token);
        //         // this.props.navigation.navigate('Home');
        //     })
        //     .catch((err) => {
        //         // console.log(err);
        //         // this.props.navigation.navigate('Home');
        //     })
    }
    render() {
        return <RegisterComponent onSubmit={this.onSubmit} />
    }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen);