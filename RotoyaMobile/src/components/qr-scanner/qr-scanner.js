import React, { useEffect, useState } from 'react';

import {
    StyleSheet,
    Text,
    View
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { SportCenterService, PaymentService } from '../../service';
import { useSelector } from 'react-redux';
import { NotificationUtil } from '../../helper/util';

export default QrScannerScreen = ({ navigation }) => {
    const [sportCenters, setSportCenters] = useState([]);
    const userId = useSelector(state => state.authReducer.userId);
    useEffect(() => {
        fetchSportCenters();
    })
    const fetchSportCenters = async () => {
        try {
            const res = await SportCenterService.getSportCenters({ userId });
            setSportCenters(res.data || []);
            console.log(res.data);
        } catch (e) {
            NotificationUtil.error('Đã có lỗi xảy ra');
        }

    }
    const onSuccess = async e => {
        if (!sportCenters || !sportCenters.length) {
            NotificationUtil.error('Tài khoản chưa quản lý trung tâm thể thao');
            return;
        }
        const obj = JSON.parse(e.data);
        try {
            const res = await PaymentService.getPayment({ orderId: obj.orderId });
            console.log(res.data);
            if (sportCenters.some(sportCenter => sportCenter.id == res.data.sportCenterId)) {
                navigation.navigate('BookedScanner', {
                    payment: res.data
                })
                return;
            }
            NotificationUtil.error('Hoá đơn không phải của trung tâm bạn quản lý');
        } catch (e) {
            NotificationUtil.error('Đã có lỗi xảy ra');
        }
        // navigation.navigate('BookedScanner', {
        //     orderId: obj.orderId
        // })
    };

    const topContent = () => (
        <Text style={styles.centerText}>
            Quét mã QR trong hóa đơn của khách hàng tại đây
        </Text>
    )


    const bottomContent = () => {
        return <View></View>;
    }

    return (
        <QRCodeScanner
            onRead={onSuccess}
            flashMode={RNCamera.Constants.FlashMode.torch}
            topContent={topContent()}
            bottomContent={bottomContent()}
        />
    );

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