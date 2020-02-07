import React from 'react';
import { Overlay } from 'react-native-elements';
import {
    ActivityIndicator
} from 'react-native';

export default class SpinnerLoading extends React.Component {
    constructor(props) {
        super(props);
        props = {
            isVisible: false
        }
    }
    render() {
        return (
            <Overlay
                fullScreen
                isVisible={this.props.isVisible}
                overlayBackgroundColor="rgba(255, 255, 255, 0)"
                overlayStyle={{ justifyContent: 'center' }}
            >
                <ActivityIndicator size={50} color="#55a66d" />
            </Overlay>
        )
    }
}