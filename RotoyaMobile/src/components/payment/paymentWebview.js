import React from "react";
import { StyleSheet, View, Platform, BackHandler } from "react-native";
import { WebView } from 'react-native-webview';
import { Header } from "../common";
import { PaymentService } from "../../service";
import { NotificationUtil } from "../../helper/util";
import { CommonActions } from '@react-navigation/native';

class PaymnetWebViewScreen extends React.Component {
    nativeEventSubscription = null;

    constructor(props) {
        super(props);
    }

    UNSAFE_componentWillMount() {
        const { navigation, isBankPayment } = this.props;
        navigation.setOptions({
            header: ({ navigation, scene }) => (
                <Header
                    title={isBankPayment ? "Cổng thanh toán Napas" : "Thanh toán với Momo"}
                    back
                    goBack={this.goBack.bind(this)}
                    navigation={navigation}
                    scene={scene}
                />
            )
        })
    }

    async goBackUseButtonBackAndroid() {
        const res = await PaymentService.getPayment({ orderId: this.props.route.params.orderId });
        if (res.status != 200) {
            NotificationUtil.error(`Server error ${res.status}`, res.statusText);
            return;
        }
        const payment = res.data;
        if (payment && payment.transactionId) {
            // this.props.navigation.popToTop();
            this.props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        { name: 'BookedDetail', params: { orderId: payment.orderId } }
                    ]
                })
            )
            return true;
        }
        return;
    }

    componentDidMount() {
        if (Platform.OS == "android" && this.props.route.name == "PaymentWebView") {
            this.nativeEventSubscription = BackHandler.addEventListener("hardwareBackPress", () => {
                if (this.props.navigation.isFocused()) this.goBackUseButtonBackAndroid();
            })
        }
    }

    componentWillUnmount() {
        if (this.nativeEventSubscription) {
            this.nativeEventSubscription.remove();
        }
    }

    async goBack() {
        const backed = await this.goBackUseButtonBackAndroid();
        if (backed) return;
        // await rollbackBooking({ orderId: this.props.route.params.payment.orderId });
        this.props.navigation.goBack();
    }

    render() {
        return (
            <View style={styles.root}>
                <WebView
                    source={{ uri: this.props.route.params.payUrl }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "white"
    }
});

export default PaymnetWebViewScreen;
