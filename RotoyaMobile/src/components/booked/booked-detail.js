import React from "react";
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    ScrollView
} from "react-native";
import { Header } from "../common";
import { NumberUtil, TimeUtil, NotificationUtil, DateUtil } from "../../helper/util";
import { PaymentService } from "../../service";
import { CommonActions } from "@react-navigation/native";
import { ApiConstants } from "../../constants";
import { Image } from 'react-native-elements';
import { Button } from 'galio-framework';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import moment from 'moment';

const utcDateToString = (momentInUTC) => {
    let s = moment.utc(momentInUTC).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    return s;
};
class BookedDetailScreen extends React.Component {
    nativeEventSubscription = null;
    timeOutBook = null;

    constructor(props) {
        super(props);
        this.state = {
            payment: null
        }
    }

    addCalendar() {
        const { bookings, sportCenter } = this.state.payment;
        bookings.map(booking => {
            const eventConfig = {
                title: 'Rotoya: Có lịch tại ' + sportCenter.name,
                startDate: utcDateToString(moment.utc(moment(new Date(booking.bookingDate + 'T' + TimeUtil.convertFloatToTime(booking.sportGroundTimeSlot.startTime) + ':00.000Z'))).subtract(15, 'minutes')),
                endDate: utcDateToString(moment.utc(moment(new Date(booking.bookingDate + 'T' + TimeUtil.convertFloatToTime(booking.sportGroundTimeSlot.startTime) + ':00.000Z')))),
                notes: 'Sân: ' + booking.sportGroundTimeSlot.sportGround.name
            };
            AddCalendarEvent.presentEventCreatingDialog(eventConfig);
        })
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
                    title="Hóa đơn"
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
        if (payment) return (
            <View style={styles.root}>
                <View style={styles.qrcode}>
                    <Image
                        source={{ uri: ApiConstants.URL_API + '/image/' + payment.orderId + '.png' }}
                        style={{ width: 200, height: 200 }}
                        PlaceholderContent={<ActivityIndicator size={50} color="#55a66d" />}
                    ></Image>
                </View>
                <ScrollView style={styles.rect2} showsVerticalScrollIndicator={false}>
                    <View style={styles.cardRowContainer}>
                        <Text style={styles.cardTitle}>Mã đơn</Text>
                        <Text style={styles.cardContent}>{payment.orderId}</Text>
                    </View>
                    <View style={styles.cardRowContainer}>
                        <Text style={styles.cardTitle}>Trung tâm thể thao</Text>
                        <Text style={styles.cardContent}>{(payment.sportCenter || {}).name}</Text>
                    </View>
                    <View style={styles.cardRowContainer}>
                        <Text style={styles.cardTitle}>Trạng thái</Text>
                        <Text style={styles.cardContentGreen}>
                            Đã thanh toán
                        </Text>
                    </View>
                    <Text style={styles.cardTitle}>Sân</Text>
                    {
                        (payment.bookings || []).map(booking => {
                            return (
                                <View>
                                    <View style={styles.transactionStatusRow}>
                                        <Text style={styles.transactionStatus}>-</Text>
                                        <Text style={styles.success}>{booking.sportGroundTimeSlot.sportGround.name}</Text>
                                    </View>
                                    <View style={styles.cardRowContainer}>
                                        <Text style={styles.cardLitteTitle}>Ngày</Text>
                                        <Text style={styles.cardLitteContent}>{DateUtil.getDateDDMM(booking.bookingDate)}</Text>
                                    </View>
                                    <View style={styles.cardRowContainer}>
                                        <Text style={styles.cardLitteTitle}>Thời gian</Text>
                                        <Text style={styles.cardLitteContent}>{TimeUtil.convertFloatToTime(booking.sportGroundTimeSlot.startTime)} - {TimeUtil.convertFloatToTime(booking.sportGroundTimeSlot.endTime)}</Text>
                                    </View>
                                    <View style={styles.cardRowContainer}>
                                        <Text style={styles.cardLitteTitle}>Giá</Text>
                                        <Text style={styles.cardLitteContent}>{NumberUtil.convertNumberToCurrency(booking.sportGroundTimeSlot.price)} đ</Text>
                                    </View>
                                </View>
                            )
                        })
                    }
                    {
                        payment.bookings.some(booking => !!booking.sportCenterEquipmentBookings && !!booking.sportCenterEquipmentBookings.length) ?
                            <View>
                                <Text style={styles.cardTitle}>Dụng cụ thể thao</Text>
                                {
                                    payment.bookings.map(booking => {
                                        return booking.sportCenterEquipmentBookings.map(sgeBooking => {
                                            return (
                                                <View>
                                                    <View style={styles.transactionStatusRow}>
                                                        <Text style={styles.transactionStatus}>-</Text>
                                                        <Text style={styles.success}>{sgeBooking.sportGroundEquipment.sportEquipment.name}</Text>
                                                    </View>
                                                    <View style={styles.cardRowContainer}>
                                                        <Text style={styles.cardLitteTitle}>Số lượng</Text>
                                                        <Text style={styles.cardLitteContent}>{sgeBooking.amount}</Text>
                                                    </View>
                                                    <View style={styles.cardRowContainer}>
                                                        <Text style={styles.cardLitteTitle}>Ngày</Text>
                                                        <Text style={styles.cardLitteContent}>{booking.bookingDate}</Text>
                                                    </View>
                                                    <View style={styles.cardRowContainer}>
                                                        <Text style={styles.cardLitteTitle}>Thời gian</Text>
                                                        <Text style={styles.cardLitteContent}>{TimeUtil.convertFloatToTime(booking.sportGroundTimeSlot.startTime)} - {TimeUtil.convertFloatToTime(booking.sportGroundTimeSlot.endTime)}</Text>
                                                    </View>
                                                    <View style={styles.cardRowContainer}>
                                                        <Text style={styles.cardLitteTitle}>Giá</Text>
                                                        <Text style={styles.cardLitteContent}>{NumberUtil.convertNumberToCurrency(sgeBooking.price)} đ</Text>
                                                    </View>
                                                </View>
                                            )
                                        })
                                    })
                                }
                            </View> : null
                    }
                </ScrollView>
                <View style={styles.billingRow}>
                    <Text style={styles.billing}>Tổng</Text>
                    <Text style={styles.billing2}>{NumberUtil.convertNumberToCurrency(this.state.payment.amount || 0)} đ</Text>
                </View>
                {
                    !this.props.route.params.isBack ?
                        <View style={{ alignSelf: 'center', marginBottom: 20 }}>
                            <Button
                                color="info"
                                shadowless
                                size="small"
                                capitalize
                                round
                                onPress={this.addCalendar.bind(this)}
                            >
                                + Thêm vào lời nhắc
                            </Button>
                        </View>
                        : null
                }

            </View>
        );
        return null;
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
    },
    qrcode: {
        alignSelf: 'center',
        margin: 10,
        flex: 0.6
    }
});

export default BookedDetailScreen;