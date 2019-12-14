import React from 'react';
import LoginScreen from './login';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loginAction } from '../../../redux/action/auth.action';

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({loginAction}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);