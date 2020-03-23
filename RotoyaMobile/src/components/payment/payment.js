import React from "react";
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity
} from "react-native";
import { PaymentService } from "../../service";
import { NotificationUtil } from "../../helper/util";
import { PaymentConstants } from "../../constants";

class PaymnetScreen extends React.Component {

    async payment(bankCode) {
        const { amount, orderId } = this.props.route.params;
        const body = {};
        body.returnUrl = 'rotoya://app/home';
        body.amount = amount;
        body.orderId = orderId;
        if (bankCode) body.bankCode = bankCode;
        const res = bankCode ? await PaymentService.atmInland(body) : await PaymentService.paymentMomo(body);
        console.log('_0***', res.data);
        if (!res.data || res.status != 200) {
            NotificationUtil.notifyError(`Server Error ${res.status}`, res.statusText);
            return;
        }
        this.props.navigation.navigate('PaymentWebView', {
            payUrl: res.data.payUrl,
            orderId,
            isBankPayment: !!bankCode
        })
    }

    renderBank() {
        return (
            Object.keys(PaymentConstants.BankCode).map(key => {
                return (
                    <TouchableOpacity onPress={this.payment.bind(this, key)}>
                        <View style={styles.rect14}>
                            <Image
                                source={PaymentConstants.BankCode[key].image}
                                resizeMode="contain"
                                style={styles.image1}
                            ></Image>
                            <Text style={styles.abBank3}>{PaymentConstants.BankCode[key].name}</Text>
                        </View>
                    </TouchableOpacity>
                )
            })
        )
    }

    render() {
        return (
            <View style={styles.root}>
                <View>
                    <Text>Momo</Text>
                    <TouchableOpacity onPress={this.payment.bind(this, null)}>
                        <View style={styles.rect14}>
                            <Image
                                source={require('../../../assets/imgs/logo-momo.jpg')}
                                resizeMode="contain"
                                style={styles.image1}
                            ></Image>
                        </View>
                    </TouchableOpacity>
                </View>
                <Text>Bank Inland</Text>
                <ScrollView>
                    <View style={styles.scroll}>
                        {this.renderBank()}
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "white"
    },
    scroll: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        margin: 20,
        flex: 1,
        justifyContent: 'space-between'
    },
    rect14: {
        marginBottom: 10,
        backgroundColor: "rgba(255,255,255,1)",
        borderRadius: 10,
        shadowOffset: {
            height: 30,
            width: 30
        },
        shadowColor: "black",
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8
    },
    image1: {
        width: 96,
        height: 60,
        marginTop: 11
    },
    abBank3: {
        width: 80,
        height: 30,
        marginBottom: 5,
        backgroundColor: "transparent",
        color: "rgba(104,108,113,1)",
        fontSize: 12,
        fontFamily: "poppins-700",
        letterSpacing: 0.26,
        textAlign: "center",
        marginTop: 10,
        marginLeft: 8
    }
});

export default PaymnetScreen;
