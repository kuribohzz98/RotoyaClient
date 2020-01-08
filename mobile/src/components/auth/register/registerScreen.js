import React from 'react';
import { registerService } from '../../../service/auth.service';
import RegisterComponent from './registerComponent';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { saveItem } from '../../../service/storage.service';
import { StorageConstants } from '../../../constants/storage.constants';

class RegisterScreen extends React.Component {
    static navigationOptions = {
    };
    onSubmit = values => {
        console.log(values);
        // registerService(
        //     {
        //         'username': values.username,
        //         'password': values.password
        //     })
        //     .then((response) => {
        //         // console.log(response.data);
        //         // this.props.loginAction(response.data.user.username);
        //         // saveItem(StorageConstants.ACCESS_TOKEN, response.data.access_token);
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
    return bindActionCreators({ registerService }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen);