import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Platform,
  BackHandler,
  TouchableOpacity
} from "react-native";
import { Header } from "../common";
import componentConstants from "../../constants/component.constants";
import { BookService } from "../../service";
import { NumberUtil, TimeUtil, NotificationUtil, DateUtil } from "../../helper/util";

class BillScreen extends React.Component {
  nativeEventSubscription = null;
  timeOutBook = null;

  constructor(props) {
    super(props);
  }

  async goBack() {
    await BookService.rollbackBooking({ orderId: this.props.route.params.payment.orderId });
    this.props.navigation.goBack();
  }

  UNSAFE_componentWillMount() {
    this.props.navigation.setOptions({
      header: ({ navigation, scene }) => (
        <Header
          title="Bill"
          back
          goBack={this.goBack.bind(this)}
          navigation={navigation}
          scene={scene}
        />
      )
    })
  }

  rollbackBooking() {
    BookService.rollbackBooking({ orderId: this.props.route.params.payment.orderId });
  }

  componentDidMount() {
    // press back android
    if (Platform.OS == "android" && this.props.route.name == "Bill") {
      this.nativeEventSubscription = BackHandler.addEventListener("hardwareBackPress", () => {
        if (this.props.navigation.isFocused()) this.rollbackBooking();
      })
    }

    this.timeOutBook = setTimeout(() => {
      NotificationUtil.info("Your session has expired", "You will be redirected 'Home' screen");
      this.props.navigation.popToTop();
    }, componentConstants.TimeOutBooking)
  }

  componentWillUnmount() {
    if (this.nativeEventSubscription) {
      this.nativeEventSubscription.remove();
    }
    if (this.timeOutBook) {
      clearTimeout(this.timeOutBook);
    }
  }

  payment() {
    this.props.navigation.navigate('Payment', {
      orderId: this.props.route.params.payment.orderId,
      amount: this.props.route.params.payment.amount
    });
  }

  render() {
    const {
      sportCenter,
      bookDatas,
      payment
    } = this.props.route.params;
    return (
      <View style={styles.root}>
        <TouchableOpacity onPress={this.payment.bind(this)}>
          <View style={styles.group9}>
            <ImageBackground
              style={styles.rectangle}
              imageStyle={styles.rectangle_imageStyle}
              source={require("../../../assets/imgs/Gradient_0.png")}
            >
              <Text style={styles.reportIssue}>Payment</Text>
            </ImageBackground>
          </View>
        </TouchableOpacity>
        <View style={styles.billingRow}>
          <Text style={styles.billing}>Total</Text>
          <Text style={styles.billing2}>{NumberUtil.convertNumberToCurrency(payment.amount)} VNĐ</Text>
        </View>
        <View style={styles.rect2}>
          <View style={styles.transactionNoRow}>
            <Text style={styles.transactionNo}>TransactionId</Text>
            <Text style={styles.style1}>
              {payment.orderId}
            </Text>
          </View>
          <View style={styles.dateTimeRow}>
            <Text style={styles.dateTime}>Sport Center</Text>
            <Text style={styles.pm12092018}>
              {sportCenter.name}
            </Text>
          </View>
          <Text style={styles.toWallet}>SportGround</Text>
          {
            (sportCenter.sportGrounds || []).map((sportGround, index) => {
              return (sportGround.sportGroundTimeSlots || []).map(timeSlot => {
                const bookData = bookDatas.find(bookData => bookData.timeSlotId == timeSlot.id);
                if (bookData) {
                  return (
                    <View>
                      <View style={styles.transactionStatusRow}>
                        <Text style={styles.transactionStatus}>-</Text>
                        <Text style={styles.success}>{sportGround.name}</Text>
                      </View>
                      <View style={styles.amountRow}>
                        <Text style={styles.amount}>Date / time</Text>
                        <Text style={styles.style}>{DateUtil.getDateDDMM(timeSlot.bookingDate)} / {TimeUtil.convertFloatToTime(timeSlot.startTime)} - {TimeUtil.convertFloatToTime(timeSlot.endTime)}</Text>
                      </View>
                      <View style={styles.sportGroundRow}>
                        <Text style={styles.sportGround}>Price</Text>
                        <Text style={styles.usdWallet}>{NumberUtil.convertNumberToCurrency(timeSlot.price)} VNĐ</Text>
                      </View>
                    </View>
                  )
                }
              })
            })
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "white"
  },
  transactions: {
    color: "rgba(78,80,83,1)",
    fontSize: 32,
    fontFamily: "poppins-600",
    marginTop: 20,
    marginLeft: 25
  },
  group9: {
    width: 345,
    height: 60,
    shadowOpacity: 1,
    marginTop: 540,
    marginLeft: 25
  },
  rectangle: {
    borderRadius: 10,
    justifyContent: "center",
    flex: 1,
    overflow: "hidden"
  },
  rectangle_imageStyle: {},
  reportIssue: {
    width: 250,
    height: 30,
    backgroundColor: "transparent",
    color: "rgba(255,255,255,1)",
    fontSize: 20,
    fontFamily: "poppins-500",
    letterSpacing: 0.3,
    textAlign: "center",
    marginLeft: 35,
    alignSelf: "center"
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
    marginTop: -106,
    marginLeft: 25,
    marginRight: 27
  },
  rect2: {
    width: 360,
    height: 450,
    marginTop: -514,
    marginLeft: 25
  },
  transactionNo: {
    backgroundColor: "transparent",
    color: "rgba(204,204,204,1)",
    fontSize: 16,
    fontFamily: "poppins-600",
    letterSpacing: 0.3
  },
  style1: {
    width: 230,
    height: 50,
    backgroundColor: "transparent",
    color: "rgba(104,108,113,1)",
    fontSize: 16,
    fontFamily: "verdana-regular",
    letterSpacing: 0.3,
    textAlign: "right",
    marginLeft: 10
  },
  transactionNoRow: {
    height: 50,
    flexDirection: "row",
    marginTop: 36
  },
  dateTime: {
    backgroundColor: "transparent",
    color: "rgba(204,204,204,1)",
    fontSize: 16,
    fontFamily: "poppins-600",
    letterSpacing: 0.3
  },
  pm12092018: {
    width: 230,
    height: 50,
    backgroundColor: "transparent",
    color: "rgba(104,108,113,1)",
    fontSize: 16,
    fontFamily: "verdana-regular",
    letterSpacing: 0.3,
    textAlign: "right",
    marginLeft: 21,
    marginTop: 3
  },
  dateTimeRow: {
    height: 53,
    flexDirection: "row",
    marginRight: -1
  },
  toWallet: {
    backgroundColor: "transparent",
    color: "rgba(204,204,204,1)",
    fontSize: 16,
    fontFamily: "poppins-600",
    letterSpacing: 0.3,
    marginTop: 11
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
    marginLeft: 25,
    marginRight: -1
  },
  amount: {
    backgroundColor: "transparent",
    color: "rgba(204,204,204,1)",
    fontSize: 16,
    fontFamily: "poppins-600",
    letterSpacing: 0.3
  },
  style: {
    width: 200,
    height: 20,
    backgroundColor: "transparent",
    color: "rgba(104,108,113,1)",
    fontSize: 16,
    fontFamily: "poppins-500",
    letterSpacing: 0.3,
    textAlign: "right",
    marginLeft: 6
  },
  amountRow: {
    height: 20,
    flexDirection: "row",
    marginTop: 13,
    marginLeft: 47
  },
  sportGround: {
    backgroundColor: "transparent",
    color: "rgba(204,204,204,1)",
    fontSize: 16,
    fontFamily: "poppins-600",
    letterSpacing: 0.3
  },
  usdWallet: {
    width: 210,
    height: 20,
    backgroundColor: "transparent",
    color: "rgba(104,108,113,1)",
    fontSize: 16,
    fontFamily: "poppins-500",
    letterSpacing: 0.3,
    textAlign: "right",
    marginLeft: 39
  },
  sportGroundRow: {
    height: 20,
    flexDirection: "row",
    marginTop: 11,
    marginLeft: 47
  }
});

export default BillScreen;