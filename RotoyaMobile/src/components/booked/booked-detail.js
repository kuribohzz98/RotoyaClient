import React from "react";
import {
    StyleSheet,
    View,
    Text
} from "react-native";
import { Header } from "../common";
import { NumberUtil, TimeUtil, NotificationUtil, DateUtil } from "../../helper/util";
import { PaymentService } from "../../service";
import { CommonActions } from "@react-navigation/native";

class BookedDetailScreen extends React.Component {
    nativeEventSubscription = null;
    timeOutBook = null;

    constructor(props) {
        super(props);
        this.state = {
            payment: {}
        }
    }

    goBack() {
        if (this.props.route.params.isBack) {
            return this.props.navigation.goBack();
        }
        this.props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Home' }]
            })
        );
    }

    UNSAFE_componentWillMount() {
        this.props.navigation.setOptions({
            header: ({ navigation, scene }) => (
                <Header
                    title="Bill"
                    back={this.props.route.params.isBack}
                    remove={!this.props.route.params.isBack}
                    goBack={this.goBack.bind(this)}
                    navigation={navigation}
                    scene={scene}
                />
            )
        })
    }

    async componentDidMount() {
        const res = await PaymentService.getPayment({ orderId: this.props.route.params.orderId });
        if (!res.data || res.status >= 400) {
            NotificationUtil.errorServer(res);
            return;
        }
        this.setState({ payment: res.data });
    }

    render() {
        const { payment } = this.state;
        return (
            <View style={styles.root}>
                <View style={styles.rect2}>
                    <View style={styles.cardRowContainer}>
                        <Text style={styles.cardTitle}>TransactionId</Text>
                        <Text style={styles.cardContent}>{payment.orderId}</Text>
                    </View>
                    <View style={styles.cardRowContainer}>
                        <Text style={styles.cardTitle}>Sport Center</Text>
                        <Text style={styles.cardContent}>{(payment.sportCenter || {}).name}</Text>
                    </View>
                    <View style={styles.cardRowContainer}>
                        <Text style={styles.cardTitle}>Status</Text>
                        <Text style={payment.transactionId ? styles.cardContentGreen : styles.cardContentRed}>
                            {payment.transactionId ? 'paid' : 'used'}
                        </Text>
                    </View>
                    <Text style={styles.cardTitle}>SportGround</Text>
                    {
                        (payment.bookings || []).map(booking => {
                            return (
                                <View>
                                    <View style={styles.transactionStatusRow}>
                                        <Text style={styles.transactionStatus}>-</Text>
                                        <Text style={styles.success}>{booking.sportGroundTimeSlot.sportGround.name}</Text>
                                    </View>
                                    <View style={styles.cardRowContainer}>
                                        <Text style={styles.cardLitteTitle}>Date</Text>
                                        <Text style={styles.cardLitteContent}>{DateUtil.getDateDDMM(booking.bookingDate)}</Text>
                                    </View>
                                    <View style={styles.cardRowContainer}>
                                        <Text style={styles.cardLitteTitle}>Time</Text>
                                        <Text style={styles.cardLitteContent}>{TimeUtil.convertFloatToTime(booking.sportGroundTimeSlot.startTime)} - {TimeUtil.convertFloatToTime(booking.sportGroundTimeSlot.endTime)}</Text>
                                    </View>
                                    <View style={styles.cardRowContainer}>
                                        <Text style={styles.cardLitteTitle}>Price</Text>
                                        <Text style={styles.cardLitteContent}>{NumberUtil.convertNumberToCurrency(booking.sportGroundTimeSlot.price)} VNĐ</Text>
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>
                <View style={styles.billingRow}>
                    <Text style={styles.billing}>Total</Text>
                    <Text style={styles.billing2}>{NumberUtil.convertNumberToCurrency(this.state.payment.amount || 0)} VNĐ</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "white",
        padding: 20
    },
    cardRowContainer: {
        flexDirection: "row",
        marginBottom: 15
    },
    cardTitle: {
        backgroundColor: "transparent",
        color: "rgba(204,204,204,1)",
        fontSize: 16,
        fontFamily: "poppins-600",
        letterSpacing: 0.3,
        textAlign: 'left',
        width: 130,
    },
    cardLitteTitle: {
        backgroundColor: "transparent",
        color: "rgba(204,204,204,1)",
        fontSize: 16,
        fontFamily: "poppins-600",
        letterSpacing: 0.3,
        textAlign: 'left',
        width: 80,
        marginLeft: 50
    },
    cardContent: {
        width: 230,
        backgroundColor: "transparent",
        color: "rgba(104,108,113,1)",
        fontSize: 16,
        fontFamily: "verdana-regular",
        letterSpacing: 0.3,
        textAlign: "left"
    },
    cardLitteContent: {
        width: 150,
        backgroundColor: "transparent",
        color: "rgba(104,108,113,1)",
        fontSize: 16,
        fontFamily: "verdana-regular",
        letterSpacing: 0.3,
        textAlign: "left"
    },
    cardContentRed: {
        width: 230,
        backgroundColor: "transparent",
        color: "rgba(219, 59, 59,1)",
        fontSize: 16,
        fontFamily: "verdana-regular",
        letterSpacing: 0.3,
        textAlign: "left",
    },
    cardContentGreen: {
        width: 250,
        backgroundColor: "transparent",
        color: "rgba(66, 179, 78,1)",
        fontSize: 16,
        fontFamily: "verdana-regular",
        letterSpacing: 0.3,
        textAlign: "left",
    },
    billing: {
        width: 90,
        height: 35,
        color: "rgba(179,180,181,1)",
        fontSize: 25,
        fontFamily: "verdana-regular"
    },
    billing2: {
        width: 240,
        height: 35,
        color: "rgba(78,80,83,1)",
        fontSize: 25,
        fontFamily: "poppins-600",
        textAlign: "right"
    },
    billingRow: {
        height: 35,
        flexDirection: "row",
        flex: 0.2,
        marginLeft: 25,
        marginRight: 27
    },
    rect2: {
        flex: 1
    },
    transactionStatus: {
        backgroundColor: "transparent",
        color: "rgba(204,204,204,1)",
        fontSize: 16,
        fontFamily: "poppins-600",
        letterSpacing: 0.3
    },
    success: {
        width: 277,
        height: 20,
        backgroundColor: "transparent",
        color: "rgba(104,108,113,1)",
        fontSize: 16,
        fontFamily: "verdana-regular",
        letterSpacing: 0.3,
        textAlign: "left",
        marginLeft: 16
    },
    transactionStatusRow: {
        height: 20,
        flexDirection: "row",
        marginTop: 9,
        marginBottom: 10,
        marginLeft: 25,
        marginRight: -1
    }
});

export default BookedDetailScreen;