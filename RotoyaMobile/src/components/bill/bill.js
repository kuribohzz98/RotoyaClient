import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  BackHandler,
  ScrollView
} from "react-native";
import { Header } from "../common";
import componentConstants from "../../constants/component.constants";
import { BookService } from "../../service";
import { NumberUtil, TimeUtil, NotificationUtil, DateUtil } from "../../helper/util";
import { Button } from 'galio-framework';

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
          title="Hóa đơn"
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
      bookDatas,
      payment,
      equipments,
      sportCenter
    } = this.props.route.params;
    return (
      <View style={styles.root}>
        <ScrollView style={styles.rect2} showsVerticalScrollIndicator={false}>
          <View style={styles.cardRowContainer}>
            <Text style={styles.cardTitle}>Mã đơn</Text>
            <Text style={styles.cardContent}>{payment.orderId}</Text>
          </View>
          <View style={styles.cardRowContainer}>
            <Text style={styles.cardTitle}>Trung tâm thể thao</Text>
            <Text style={styles.cardContent}>{sportCenter.name}</Text>
          </View>
          <Text style={styles.cardTitle}>Sân</Text>
          {
            (sportCenter.sportGrounds || []).map(sportGround => {
              return (sportGround.sportGroundTimeSlots || []).map(timeSlot => {
                const bookData = bookDatas.find(bookData => bookData.timeSlotId == timeSlot.id);
                if (bookData) {
                  return (
                    <View>
                      <View style={styles.transactionStatusRow}>
                        <Text style={styles.transactionStatus}>-</Text>
                        <Text style={styles.success}>{sportGround.name}</Text>
                      </View>
                      <View style={styles.cardRowContainer}>
                        <Text style={styles.cardLitteTitle}>Ngày</Text>
                        <Text style={styles.cardLitteContent}>{DateUtil.getDateDDMM(bookData.bookingDate)}</Text>
                      </View>
                      <View style={styles.cardRowContainer}>
                        <Text style={styles.cardLitteTitle}>Thời gian</Text>
                        <Text style={styles.cardLitteContent}>{TimeUtil.convertFloatToTime(timeSlot.startTime)} - {TimeUtil.convertFloatToTime(timeSlot.endTime)}</Text>
                      </View>
                      <View style={styles.cardRowContainer}>
                        <Text style={styles.cardLitteTitle}>Giá</Text>
                        <Text style={styles.cardLitteContent}>{NumberUtil.convertNumberToCurrency(timeSlot.price)} đ</Text>
                      </View>
                    </View>
                  )
                }
              })
            })
          }
          {
            equipments && equipments.length ?
              <View>
                <Text style={styles.cardTitle}>Dụng cụ thể thao</Text>
                {
                  equipments.map(equipment => {
                    let timeSlot;
                    (sportCenter.sportGrounds || []).map(sportGround => {
                      timeSlot = (sportGround.sportGroundTimeSlots || []).find(timeSlot_ => timeSlot_.id == equipment.timeSlotId);
                    })
                    return (
                      <View>
                        <View style={styles.transactionStatusRow}>
                          <Text style={styles.transactionStatus}>-</Text>
                          <Text style={styles.success}>{equipment.name}</Text>
                        </View>
                        <View style={styles.cardRowContainer}>
                          <Text style={styles.cardLitteTitle}>Số lượng</Text>
                          <Text style={styles.cardLitteContent}>{equipment.amount}</Text>
                        </View>
                        <View style={styles.cardRowContainer}>
                          <Text style={styles.cardLitteTitle}>Ngày</Text>
                          <Text style={styles.cardLitteContent}>{DateUtil.getDateDDMM(new Date().getTime() + equipment.time * 1000 * 60 * 60 * 24)}</Text>
                        </View>
                        <View style={styles.cardRowContainer}>
                          <Text style={styles.cardLitteTitle}>Thời gian</Text>
                          <Text style={styles.cardLitteContent}>{TimeUtil.convertFloatToTime(timeSlot.startTime)} - {TimeUtil.convertFloatToTime(timeSlot.endTime)}</Text>
                        </View>
                        <View style={styles.cardRowContainer}>
                          <Text style={styles.cardLitteTitle}>Giá</Text>
                          <Text style={styles.cardLitteContent}>{NumberUtil.convertNumberToCurrency(equipment.price)} đ</Text>
                        </View>
                      </View>
                    )
                  })
                }
              </View> : null
          }
        </ScrollView>
        <View style={styles.billingRow}>
          <Text style={styles.billing}>Tổng</Text>
          <Text style={styles.billing2}>{NumberUtil.convertNumberToCurrency(payment.amount || 0)} đ</Text>
        </View>
        <View style={{ justifyContent: 'flex-end', alignSelf: 'center', marginBottom: 20, flex: 0.2 }}>
          <Button
            color="error"
            shadowless
            uppercase
            onPress={this.payment.bind(this)}
          >
            Thanh toán
          </Button>
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
    flex: 0.01,
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

export default BillScreen;