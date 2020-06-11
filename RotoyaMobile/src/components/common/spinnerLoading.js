import React from 'react';
import { Overlay } from 'react-native-elements';
import {
    ActivityIndicator
} from 'react-native';

export default class SpinnerLoading extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Overlay
                fullScreen
                isVisible={this.props.isVisible}
                overlayStyle={{ justifyContent: 'center', backgroundColor: "rgba(255, 255, 255, 0)" }}
            >
                <ActivityIndicator size={50} color="#55a66d" />
            </Overlay>
        )
    }
}