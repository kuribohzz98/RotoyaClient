import React from 'react';

import {
    StyleSheet,
    Text
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

export default class QrScannerScreen extends React.Component {
    onSuccess = e => {
        const obj = JSON.parse(e.data);
        this.props.navigation.navigate('BookedScanner', {
            orderId: obj.orderId
        })
    };

    topContent() {
        return (
            <Text style={styles.centerText}>
                Quét mã QR trong hóa đơn của khách hàng tại đây
            </Text>
        )
    }

    bottomContent() {
        return null;
    }

    render() {
        return (
            <QRCodeScanner
                onRead={this.onSuccess}
                flashMode={RNCamera.Constants.FlashMode.torch}
                topContent={this.topContent()}
                bottomContent={this.bottomContent()}
            />
        );
    }
}

const styles = StyleSheet.create({
    centerText: {
        flex: 1,
        fontSize: 16,
        padding: 15,
        color: '#777',
        marginTop: 20
    },
    textBold: {
        fontWeight: '500',
        color: '#000'
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
    },
    buttonTouchable: {
        padding: 16
    }
});