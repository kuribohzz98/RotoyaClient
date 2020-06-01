import React from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { reduxForm, Field } from 'redux-form';
import { Text, Button } from 'galio-framework';
import DatePicker from 'react-native-datepicker'
import { SportGroundService, BookService } from '../../service';
import { TimeUtil, NumberUtil, DateUtil, NotificationUtil } from '../../helper/util';
import { Checkbox } from '../common/Form';
import { Divider, ListItem, Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { ApiConstants } from '../../constants';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const equipmentField = ({
    input: { onChange, value },
    label,
    quantity,
    startTime,
    endTime,
    date
}) => {
    const incrementEquipment = () => {
        if (!value) return 1;
        if (value < quantity) return value + 1;
    }

    const decrementEquipment = () => {
        if (!value) return 0;
        if (value && value > 0) return value - 1;
    }
    return (
        <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity activeOpacity={0.6} style={{ marginRight: 10 }} onPress={() => onChange(decrementEquipment())}>
                <Icon name="remove" type="material"></Icon>
            </TouchableOpacity>
            <Text style={{ marginTop: 3 }}>{value || 0}</Text>
            <TouchableOpacity activeOpacity={0.6} style={{ marginLeft: 10 }} onPress={() => onChange(incrementEquipment())}>
                <Icon name="plus" type="material-community"></Icon>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', marginTop: 3 }}>
                <Text style={{ marginRight: 15 }}>{label}</Text>
                <Text>
                    {TimeUtil.convertFloatToTime(startTime) + ' - ' + TimeUtil.convertFloatToTime(endTime) + ' / ' + DateUtil.getDateDDMM(new Date(date).getTime())}
                </Text>
            </View>
        </View>
    )
}

class BookingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            sportGround: null,
            slotSelecteds: [],
            isLoading: true
        }
    }

    async componentDidMount() {
        this.getSportGround();
    }

    async getSportGround() {
        const { sportGroundId } = this.props.route.params;
        const res = await SportGroundService.getSportGround(sportGroundId, new Date(this.state.date).getTime());
        this.setState({ sportGround: res.data, isLoading: false });
    }

    onDateChange(date) {
        console.log(date);
        this.setState({ date }, () => this.getSportGround());
    }

    onSubmitSlotSelect(data) {
        const filter = [];
        Object.keys(data).map(key => {
            if (data[key] === true) filter.push(key);
        })
        console.log(filter);
        this.setState({ slotSelecteds: filter });
    }

    async onSubmit(values) {
        const { sportGround, date } = this.state;
        let bookDataFilter = [];
        let equipmentFilter = [];
        Object.keys(values).map(key => {
            if (values[key] === true) return bookDataFilter.push(key);
            if (!!values[key] && values[key] !== true) {
                const key_split = key.split('_');
                equipmentFilter.push({
                    sportCenterEquipmentId: key_split[0],
                    timeSlotId: key_split[1],
                    value: values[key]
                })
            }
        })
        const params = {};
        params.userId = this.props.userId;
        params.sportCenterId = sportGround.sportCenter.id;
        params.bookDatas = bookDataFilter.map(data => {
            const bookData_temp = {};
            const data_temp = data.split('_');
            bookData_temp.timeSlotId = data_temp[0];
            bookData_temp.bookingDate = new Date(date).getTime();
            bookData_temp.price = data_temp[1];
            return bookData_temp;
        })
        params.equipments = equipmentFilter.map(equipment => {
            const scEquipment = sportGround.sportCenter.sportCenterEquipments.find(scEquipment => scEquipment.id == equipment.sportCenterEquipmentId);
            return {
                id: equipment.sportCenterEquipmentId,
                amount: equipment.value,
                price: equipment.value * +scEquipment.price,
                name: scEquipment.sportEquipment.name,
                timeSlotId: equipment.timeSlotId
            }
        })
        const res = await BookService.bookingSportCenter(params);
        const { data } = res;
        if (data.error) {
            if (isNaN(+data.error)) {
                NotificationUtil.error("Booking failed", data.error);
                return;
            }
            (this.state.info.sportGrounds || []).map(sportGround => {
                (sportGround.sportGroundTimeSlots || []).map(timeSlot => {
                    if (+timeSlot.id == +data.error) {
                        NotificationUtil.error("Booking failed", `${sportGround.name} is not empty`)
                    }
                })
            })
            return;
        }
        this.props.navigation.navigate('Bill', {
            sportGround: sportGround,
            bookDatas: params.bookDatas,
            equipments: params.equipments,
            payment: data.data,
            date
        })
    }

    render() {
        const { date, sportGround, slotSelecteds, isLoading } = this.state;
        const { handleSubmit } = this.props;
        return !isLoading ? (
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <DatePicker
                        style={{ width: 200, alignSelf: 'center' }}
                        date={date}
                        mode="date"
                        placeholder="select date"
                        format="YYYY-MM-DD"
                        minDate={new Date()}
                        maxDate={new Date(new Date(date).getTime() + 1000 * 60 * 60 * 24 * 30)}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        androidMode="calendar"
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }
                        }}
                        onDateChange={(date) => this.onDateChange(date)}
                    />
                    <Divider style={{ backgroundColor: 'blue', margin: 20 }} />
                    {
                        sportGround ? <View style={{ flex: 0.5, marginLeft: 10 }}>
                            {
                                (sportGround.sportGroundTimeSlots || []).map(timeSlot => {
                                    let lateTime = false;
                                    if (new Date(date).toLocaleDateString() == new Date().toLocaleDateString()) {
                                        let current = new Date(new Date().getTime() + 1000 * 60 * 10);
                                        if (+timeSlot.startTime < +`${current.getHours()}.${current.getMinutes()}`) lateTime = true;
                                    }
                                    let totalBooked = timeSlot.bookeds.length ? timeSlot.bookeds : { amount: 0 };
                                    return (
                                        <View style={{ marginBottom: 15, flexDirection: 'row' }}>
                                            <Field
                                                name={timeSlot.id + "_" + timeSlot.price + "_" + sportGround.sportId}
                                                label={TimeUtil.convertFloatToTime(timeSlot.startTime) + ' - ' + TimeUtil.convertFloatToTime(timeSlot.endTime)}
                                                component={Checkbox}
                                                iconName={"check"}
                                                iconFamily={"font-awesome"}
                                                color={"success"}
                                                disabled={+totalBooked.amount >= +sportGround.quantity || lateTime}
                                                onSubmitSelect={handleSubmit(this.onSubmitSlotSelect.bind(this))}
                                            />
                                            <View style={{ marginLeft: 10, flexWrap: 'wrap', flexDirection: 'row' }}>
                                                <Text
                                                    muted={+totalBooked.amount >= +sportGround.quantity || lateTime}
                                                >
                                                    (Còn: {+sportGround.quantity - +totalBooked.amount}) - Giá: {NumberUtil.convertNumberToCurrency(timeSlot.price)}đ
                                                </Text>
                                                {
                                                    +totalBooked.amount >= +sportGround.quantity || lateTime ?
                                                        <Text muted> - {+totalBooked.amount == +sportGround.quantity ? 'Đã hết' : 'Quá giờ'}</Text>
                                                        : null
                                                }
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </View> : null
                    }
                    <Divider style={{ backgroundColor: 'blue', margin: 20 }} />
                    {
                        sportGround && sportGround.sportCenter.sportCenterEquipments.map((scEquipment, index) => {
                            return (
                                <View>
                                    <ListItem
                                        containerStyle={{ ...styles.card, marginBottom: 15 }}
                                        key={index}
                                        leftAvatar={{ source: { uri: ApiConstants.URL_API + '/image/' + scEquipment.sportEquipment.image } }}
                                        title={scEquipment.sportEquipment.name}
                                        subtitle={'Số lượng: ' + scEquipment.quantity + '\n' + 'Giá: ' + NumberUtil.convertNumberToCurrency(scEquipment.price) + 'đ'}
                                        bottomDivider
                                    />
                                    {
                                        slotSelecteds.map(slotSeleted => {
                                            const slot = (slotSeleted + '').split('_');
                                            let startTime = 0;
                                            let endTime = 0;
                                            const amount = sportGround.sportGroundTimeSlots.reduce((pre1, timeslot) => {
                                                if (timeslot.id != slot[0]) return pre1;
                                                startTime = timeslot.startTime;
                                                endTime = timeslot.endTime;
                                                if (!timeslot.sportCenterEquipmentBookings.length) return pre1;
                                                const sceBooking = timeslot.sportCenterEquipmentBookings.find(sceb => sceb.sportCenterEquipmentId == scEquipment.id);
                                                if (!sceBooking) return pre1;
                                                return pre1 + sceBooking.amount;
                                            }, 0);
                                            return (
                                                <View style={{ marginBottom: 15 }}>
                                                    <Field
                                                        name={scEquipment.id + "_" + slot[0]}
                                                        label={`(Còn: ${+scEquipment.quantity - amount})`}
                                                        component={equipmentField}
                                                        quantity={+scEquipment.quantity - amount}
                                                        startTime={startTime}
                                                        endTime={endTime}
                                                        date={date}
                                                    />
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            )
                        })
                    }
                </ScrollView>
                <View style={{ justifyContent: 'flex-end', alignSelf: 'center', marginBottom: 5 }}>
                    <Button
                        color="error"
                        shadowless
                        uppercase
                        onPress={handleSubmit(this.onSubmit.bind(this))}
                    >
                        Đặt
                    </Button>
                </View>
            </View>
        ) : <ActivityIndicator size={50} color="#55a66d" style={{ marginTop: 30, justifyContent: 'center' }} />;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20
    },
    card: {
        shadowOffset: {
            width: 10,
            height: 10
        },
        shadowColor: 'black',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        borderRadius: 10,
        elevation: 4
    },
})

const booking = reduxForm({
    form: 'booking'
})(BookingScreen);

const mapStateToProps = (state, ownProps) => {
    return {
        userId: state.authReducer.userId
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(booking);