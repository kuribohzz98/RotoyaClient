import {
    View,
    Dimensions,
    ScrollView,
    ActivityIndicator,
    Animated,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Block, Text, Button } from "galio-framework";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setSportCentersAction } from '../../redux/action/sport.action';
import { Image, ListItem, Overlay, Icon, Divider } from 'react-native-elements';
import { Checkbox } from '../common/Form';
import { BookService, SportCenterService, SportCenterFavoriteService } from '../../service';
import { NotificationUtil, TimeUtil, DateUtil, NumberUtil } from '../../helper/util';
import { ComponentConstants, ApiConstants, Images } from '../../constants';

const { width, height } = Dimensions.get('window');

function AccordionAnimation({ children, style }) {
    const [fade, setFade] = useState(new Animated.Value(0.3));

    useEffect(() => {
        Animated.timing(fade, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true
        }).start();
    });

    return (
        <Animated.View style={{ ...style, opacity: fade }}>
            {children}
        </Animated.View>
    );
}

const equipmentField = ({
    input: { onChange, value },
    label,
    quantity
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
            <Text style={{ marginRight: 15 }}>{label}</Text>
            <TouchableOpacity style={{ marginRight: 10 }} onPress={() => onChange(decrementEquipment())}>
                <Icon name="remove" type="material"></Icon>
            </TouchableOpacity>
            <Text style={{ marginTop: 3 }}>{value || 0}</Text>
            <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => onChange(incrementEquipment())}>
                <Icon name="plus" type="material-community"></Icon>
            </TouchableOpacity>
        </View>
    )
}

const RenderSportEquipment = ({ sportCenter, slotSelecteds, dissmiss, onSubmit, handleSubmit }) => {
    let sportIds = [];
    (slotSelecteds || []).map(slot => {
        const sportId = (slot + '').split('_')[3];
        !sportIds.find(_ => _ == sportId) && sportIds.push(sportId);
    });
    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={dissmiss}>
                <Block style={styles.iconX}>
                    <Icon type="foundation" name="x" size={24} />
                </Block>
            </TouchableOpacity>
            <Block flex style={styles.containerEquipment}>
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    {
                        (sportCenter.sportCenterEquipments || []).map((scEquipment, index) => {
                            if (!sportIds.find(sportId => sportId == scEquipment.sportEquipment.sportId)) return null;
                            return (
                                <View>
                                    <ListItem
                                        containerStyle={{ ...styles.card, marginBottom: 15 }}
                                        key={index}
                                        leftAvatar={{ source: { uri: ApiConstants.URL_API + '/image/' + scEquipment.sportEquipment.image } }}
                                        title={scEquipment.sportEquipment.name}
                                        subtitle={'Giá: ' + NumberUtil.convertNumberToCurrency(scEquipment.price) + 'đ'}
                                        // rightElement={rightElement.bind(this, scEquipment.id, value.value)}
                                        bottomDivider
                                    />
                                    <Block style={{ marginLeft: 20 }}>
                                        {
                                            (slotSelecteds || []).map((slotSeleted, i) => {
                                                const slot = (slotSeleted + '').split('_');
                                                let startTime = 0;
                                                let endTime = 0;
                                                const amount = sportCenter.sportGrounds.reduce((pre, sportGround) => {
                                                    if (sportGround.sportId != slot[3]) return pre;
                                                    return pre + sportGround.sportGroundTimeSlots.reduce((pre1, timeslot) => {
                                                        if (timeslot.id != slot[1]) return pre1;
                                                        startTime = timeslot.startTime;
                                                        endTime = timeslot.endTime;
                                                        if (!timeslot.sportCenterEquipmentBookings.length) return pre1;
                                                        const sceBooking = timeslot.sportCenterEquipmentBookings.find(sceb => sceb.sportCenterEquipmentId == scEquipment.id);
                                                        if (!sceBooking) return pre1;
                                                        return pre1 + sceBooking.amount;
                                                    }, 0);
                                                }, 0);

                                                return (
                                                    <Block style={{ marginBottom: 15 }}>
                                                        <Field
                                                            name={scEquipment.id + "_" + slot[0] + "_" + slot[1]}
                                                            label={`(Còn: ${+scEquipment.quantity - amount})`}
                                                            component={equipmentField}
                                                            quantity={+scEquipment.quantity - amount}
                                                        />
                                                        <Block style={{ flexWrap: 'wrap' }}>
                                                            <Text style={{ marginBottom: 10 }}>
                                                                {TimeUtil.convertFloatToTime(startTime) + ' - ' + TimeUtil.convertFloatToTime(endTime) + ' / ' + DateUtil.getDateDDMM(new Date().getTime() + +slot[0] * 1000 * 60 * 60 * 24)}
                                                            </Text>
                                                            <Divider style={{ backgroundColor: 'blue' }} />
                                                        </Block>
                                                    </Block>
                                                )
                                            })
                                        }
                                    </Block>
                                </View>
                            )
                        })
                    }
                </ScrollView>
                <Button
                    color="info"
                    shadowless
                    size="small"
                    capitalize
                    round
                    onPress={handleSubmit(onSubmit.bind(this))}
                    style={{ flex: 0.08, alignSelf: 'center' }}
                >
                    Xác nhận
                </Button>
            </Block>
        </View>
    )
}

const SportEquipmentRenderForm = reduxForm({
    form: 'sportEquipment'
})(RenderSportEquipment)

class SportCenterScreen extends React.Component {
    nativeEventSubscription = null;
    constructor(props) {
        super(props);
        this.state = {
            info: { sportGrounds: [] },
            dateBook: this.getDataSelectDay(),
            showGround: [],
            showSubGround: [],
            visible: false,
            equipments: [],
            isFavorite: null,
            idFavorite: null,
            slotSelecteds: []
        }
    }

    componentDidMount() {
        this.getSportCenter();
    }

    async getSportCenter() {
        const res = await SportCenterService.getSportCenter(this.props.sportCenter.id, new Date().getTime());
        if (!res.data) console.error('not found sportCenter');
        this.setState({ info: res.data });
        const favorite = res.data.sportCenterFavorites.find(scFavorite => +scFavorite.userId == +this.props.user.userId);
        if (favorite) this.setState({ isFavorite: true, idFavorite: favorite.id });
        else this.setState({ isFavorite: false });
        // this.setState({
        //     sportGround: [],
        //     showSubGround: []
        // }, () => {

        // })
        let showGroundTemp = [];
        let showSubGroundTemp = [];
        res.data.sportGrounds.map(sportGround => {
            showGroundTemp.push(0);
            showSubGroundTemp.push([0, 0, 0]);
            // (sportGround.sportGroundEquipments || []).map(sportGroundEquipment => {
            //     this.setState({
            //         equipments: [...this.state.equipments, {
            //             id: sportGroundEquipment.id,
            //             value: 0,
            //             max: sportGroundEquipment.quantity,
            //             price: sportGroundEquipment.price,
            //             image: sportGroundEquipment.sportEquipment.image,
            //             name: sportGroundEquipment.sportEquipment.name
            //         }]
            //     });
            // })
        });
        this.setState({ showGround: showGroundTemp });
        this.setState({ showSubGround: showSubGroundTemp });
    }

    getDataSelectDay() {
        const current = new Date();
        let result = [];
        for (let i = 0; i < 3; i++) {
            result.push(DateUtil.getDateDDMM(current.getTime() + i * 1000 * 60 * 60 * 24));
        }
        return result;
    }

    openGround(index) {
        let showTemp = [...this.state.showGround];
        if (showTemp[index]) {
            showTemp[index] = 0;
            return this.setState({ showGround: showTemp });
        }
        showTemp[index] = 1;
        return this.setState({ showGround: showTemp });
    }

    openSubGround(index, subIndex) {
        let showTemp = [...this.state.showSubGround];
        if (showTemp[index][subIndex]) {
            showTemp[index][subIndex] = 0;
            return this.setState({ showSubGround: showTemp });
        }
        showTemp[index][subIndex] = 1;
        return this.setState({ showSubGround: showTemp });
    }

    async onSubmit(value) {
        const filter = [];
        Object.keys(value).map(key => {
            if (value[key]) filter.push(key);
        })
        console.log(filter);
        if (!filter.length) {
            NotificationUtil.error("Đặt lỗi", "Bạn chưa chọn sân");
            return;
        }
        const params = {};
        params.userId = this.props.user.userId;
        params.sportCenterId = this.props.sportCenter.id;
        params.bookDatas = filter.map(data => {
            const bookData_temp = {};
            const data_temp = data.split('_');
            bookData_temp.timeSlotId = data_temp[1];
            bookData_temp.bookingDate = new Date().getTime() + data_temp[0] * 1000 * 60 * 60 * 24;
            bookData_temp.price = data_temp[2];
            return bookData_temp;
        })
        params.equipments = this.state.equipments
            .map(equipment => {
                const scEquipment = this.state.info.sportCenterEquipments.find(scEquipment => scEquipment.id == equipment.sportCenterEquipmentId);
                return {
                    id: equipment.sportCenterEquipmentId,
                    amount: equipment.value,
                    price: equipment.value * +scEquipment.price,
                    name: scEquipment.sportEquipment.name,
                    timeSlotId: equipment.timeSlotId,
                    time: equipment.time
                }
            })

        const res = await BookService.bookingSportCenter(params);
        const { data } = res;
        if (data.error) {
            if (isNaN(+data.error)) {
                NotificationUtil.error("Booking failed", data.error);
                // this.getSportCenter();
                return;
            }
            (this.state.info.sportGrounds || []).map(sportGround => {
                (sportGround.sportGroundTimeSlots || []).map(timeSlot => {
                    if (+timeSlot.id == +data.error) {
                        NotificationUtil.error("Booking failed", `${sportGround.name} is not empty`)
                        // this.getSportCenter();
                    }
                })
            })
            return;
        }
        // showMessage({
        //     message: "Booking successful",
        //     description: "You have successfully booked",
        //     type: "success",
        //     icon: "success"
        // })
        this.props.navigation.navigate('Bill', {
            sportCenter: this.state.info,
            bookDatas: params.bookDatas,
            equipments: params.equipments,
            payment: data.data
        })

    }

    onSubmitEquipment(values) {
        console.log(values);
        let filters = [];
        Object.keys(values).map(key => {
            if (!!values[key]) {
                const key_split = key.split('_');
                filters.push({
                    sportCenterEquipmentId: key_split[0],
                    time: key_split[1],
                    timeSlotId: key_split[2],
                    value: values[key]
                })
            }
        })
        console.log(filters);
        this.setState({ visible: !this.state.visible, equipments: filters });
    }

    toggleOverlay(value) {
        const filter = [];
        Object.keys(value).map(key => {
            if (value[key]) filter.push(key);
        })
        console.log(filter);
        if (!filter.length) {
            NotificationUtil.error("Đặt lỗi", "Bạn chưa chọn sân");
            return;
        }
        this.setState({ visible: !this.state.visible, slotSelecteds: filter });
    }

    componentWillUnmount() {
        console.log('__ahihi');
    }

    // incrementEquipment(id) {
    //     let equipments = [...this.state.equipments];
    //     equipments.forEach(equipment => {
    //         if (equipment.id == id && equipment.value < equipment.max) equipment.value++;
    //     })
    //     this.setState({ equipments });
    // }

    // decrementEquipment(id) {
    //     let equipments = [...this.state.equipments];
    //     equipments.forEach(equipment => {
    //         if (equipment.id == id && equipment.value > 0) equipment.value--;
    //     })
    //     this.setState({ equipments });
    // }

    openPosition() {
        this.props.navigation.navigate('Position', {
            latitude: this.props.sportCenter.latitude,
            longitude: this.props.sportCenter.longitude
        })
    }

    async changeFavorite() {
        if (this.state.isFavorite) {
            await SportCenterFavoriteService.deleteFavorite(this.state.idFavorite);
            this.setState({ isFavorite: false, idFavorite: null });
            NotificationUtil.success('Xóa khỏi danh sách yêu thích thành công');
            return;
        }
        this.setState({ isFavorite: true });
        NotificationUtil.success('Thêm vào danh sách yêu thích thành công');
        await SportCenterFavoriteService.create(this.props.user.userId, this.props.sportCenter.id);
        this.getSportCenter();
    }

    render() {
        const { handleSubmit } = this.props;
        return (
            <Block flex safe style={styles.container}>
                <Overlay
                    isVisible={this.state.visible}
                    onBackdropPress={() => this.setState({ visible: !this.state.visible })}
                    overlayStyle={styles.equipment(width, height)}
                >
                    <SportEquipmentRenderForm
                        sportCenter={this.state.info}
                        dissmiss={() => this.setState({ visible: !this.state.visible })}
                        // incrementEquipment={this.incrementEquipment.bind(this)}
                        // decrementEquipment={this.decrementEquipment.bind(this)}
                        // values={this.state.equipments}
                        slotSelecteds={this.state.slotSelecteds}
                        onSubmit={this.onSubmitEquipment.bind(this)}
                    />
                </Overlay>
                <ScrollView>
                    <View style={styles.spaceRow}>
                        <Image
                            source={this.props.sportCenter.avatar ? { uri: ApiConstants.URL_API + '/image/' + this.props.sportCenter.avatar } : Images.DefaultImage}
                            style={{ width: width, height: height * 0.3 }}
                            PlaceholderContent={<ActivityIndicator size={50} color="#55a66d" />}
                        />
                    </View>
                    <Block style={styles.headIcon}>
                        <Button
                            onlyIcon
                            icon="map-marked-alt"
                            iconFamily="font-awesome-5"
                            iconSize={30}
                            color="primary"
                            iconColor="#fff"
                            style={{ width: 50, height: 50 }}
                            onPress={this.openPosition.bind(this)}
                        ></Button>
                        <Button
                            onlyIcon
                            icon="favorite"
                            iconFamily="material"
                            iconSize={30}
                            color={!this.state.isFavorite && this.state.isFavorite == null ? "#fff" : (!this.state.isFavorite ? "success" : "#fff")}
                            iconColor={!this.state.isFavorite && this.state.isFavorite == null ? "#fff" : (!this.state.isFavorite ? "#fff" : "#e32619")}
                            style={{ width: 50, height: 50 }}
                            onPress={this.changeFavorite.bind(this)}
                        ></Button>
                    </Block>
                    <Divider style={{ backgroundColor: 'blue', margin: 20 }} />
                    <Block style={styles.content}>
                        <Block style={{ alignItems: 'center', ...styles.spaceRow }}>
                            <Text style={{ textAlign: 'center' }} h3>{this.props.sportCenter.name}</Text>
                        </Block>
                        <Block row style={styles.spaceRow}>
                            <Text style={styles.lable}>Giờ mở cửa: </Text>
                            <Text
                                size={15}
                                color="#525F7F"
                            >
                                {TimeUtil.convertFloatToTime(this.props.sportCenter.timeOpen) + ' - ' + TimeUtil.convertFloatToTime(this.props.sportCenter.timeClose)}
                            </Text>
                        </Block>
                        <Block row style={{ ...styles.spaceRow, width: (width - 120) }}>
                            <Text style={styles.lable}>Địa chỉ: </Text>
                            <Block style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                                <Text
                                    size={15}
                                    color="#525F7F"
                                >
                                    {`${this.props.sportCenter.address ? this.props.sportCenter.address + ", " : ''}${this.props.sportCenter.commune}, `}
                                </Text>
                                <Text
                                    size={15}
                                    color="#525F7F"
                                >
                                    {`${this.props.sportCenter.district}, ${this.props.sportCenter.city}`}
                                </Text>
                            </Block>
                        </Block>
                        {/* <Block row style={styles.spaceRow}>
                            <Text style={styles.lable}>Vị trí: </Text>
                            <TouchableOpacity onPress={this.openPosition.bind(this)}>
                                <Text style={{ textDecorationLine: 'underline', marginTop: 2 }}>Xem bản đồ >></Text>
                            </TouchableOpacity>
                        </Block> */}
                        <Block style={styles.spaceRow}>
                            <Text style={styles.lable}>Các sân hiện có: </Text>
                            {(this.state.info.sportGrounds || []).map((sportGround, index) => {
                                let icon = this.state.info.sports.find(sport => sportGround.sportId == sport.id);
                                return (
                                    <Block style={{ marginTop: 10 }}>
                                        <ListItem
                                            containerStyle={styles.card}
                                            leftIcon={{
                                                type: "material-community",
                                                name: ComponentConstants.IconSports[icon.code]
                                            }}
                                            rightIcon={{
                                                type: "material",
                                                name: `keyboard-arrow-${!this.state.showGround[index] ? 'right' : 'down'}`,
                                                size: 40
                                            }}
                                            title={sportGround.name}
                                            subtitle={`Số lượng: ${sportGround.quantity} ${sportGround.type ? '\n type: ' + sportGround.type : ''}`}
                                            onPress={() => this.openGround(index)}
                                        />
                                        {
                                            this.state.showGround[index] ?
                                                <AccordionAnimation>
                                                    <Block card shadow style={{ backgroundColor: '#FFFFFF', padding: 20 }}>
                                                        {
                                                            (this.state.dateBook || []).map((data, i) => (
                                                                <Block>
                                                                    <ListItem
                                                                        rightIcon={{
                                                                            type: "material",
                                                                            name: `keyboard-arrow-${!this.state.showSubGround[index][i] ? 'right' : 'down'}`,
                                                                            size: 30
                                                                        }}
                                                                        title={data}
                                                                        onPress={() => this.openSubGround(index, i)}
                                                                    />
                                                                    {
                                                                        this.state.showSubGround[index][i] ? <AccordionAnimation>
                                                                            <Block style={{ marginLeft: 20 }}>
                                                                                {
                                                                                    (sportGround.sportGroundTimeSlots || []).map(timeSlot => {
                                                                                        let lateTime = false;
                                                                                        if (!i) {
                                                                                            let current = new Date(new Date().getTime() + 1000 * 60 * 10);
                                                                                            if (+timeSlot.startTime < +`${current.getHours()}.${current.getMinutes()}`) lateTime = true;
                                                                                        }
                                                                                        let totalBooked = (timeSlot.bookeds || []).find(booked => new Date(booked.date).getDate() == data.split(' - ')[0]) || { amount: 0 };
                                                                                        return (
                                                                                            <Block row style={{ marginBottom: 15 }}>
                                                                                                <Field
                                                                                                    name={i + "_" + timeSlot.id + "_" + timeSlot.price + "_" + sportGround.sportId}
                                                                                                    label={TimeUtil.convertFloatToTime(timeSlot.startTime) + ' - ' + TimeUtil.convertFloatToTime(timeSlot.endTime)}
                                                                                                    component={Checkbox}
                                                                                                    iconName={"check"}
                                                                                                    iconFamily={"font-awesome"}
                                                                                                    color={"success"}
                                                                                                    disabled={+totalBooked.amount >= +sportGround.quantity || lateTime}
                                                                                                />
                                                                                                <Block row style={{ marginLeft: 10, flexWrap: 'wrap' }}>
                                                                                                    <Text
                                                                                                        muted={+totalBooked.amount >= +sportGround.quantity || lateTime}
                                                                                                    >
                                                                                                        {`(Còn: ${+sportGround.quantity - +totalBooked.amount})`} - Giá: {NumberUtil.convertNumberToCurrency(timeSlot.price)}đ
                                                                                                    </Text>
                                                                                                    {
                                                                                                        +totalBooked.amount >= +sportGround.quantity || lateTime ?
                                                                                                            <Text muted> - {+totalBooked.amount == +sportGround.quantity ? 'Đã hết' : 'Quá giờ'}</Text>
                                                                                                            : null
                                                                                                    }
                                                                                                </Block>
                                                                                            </Block>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </Block>
                                                                        </AccordionAnimation> : null
                                                                    }
                                                                </Block>
                                                            ))

                                                        }
                                                    </Block>
                                                </AccordionAnimation>
                                                : null
                                        }
                                    </Block>
                                )
                            })}
                        </Block>
                        {
                            this.state.equipments.length > 0 ?
                                <Block style={{ marginTop: 20 }}>
                                    <Text style={styles.lable}>Dụng cụ thể thao: </Text>
                                    {
                                        this.state.info.sportCenterEquipments.map((scEquipment, index) => {
                                            const equip = this.state.equipments.find(equipment => equipment.sportCenterEquipmentId == scEquipment.id);
                                            if (!equip) return null;
                                            return (
                                                <Block>
                                                    <ListItem
                                                        containerStyle={{ ...styles.card, marginBottom: 15 }}
                                                        key={index}
                                                        leftAvatar={{ source: { uri: ApiConstants.URL_API + '/image/' + scEquipment.sportEquipment.image } }}
                                                        title={scEquipment.sportEquipment.name}
                                                        // subtitle={'Số lượng: ' + equipment.value + '\n' + 'Giá: ' + NumberUtil.convertNumberToCurrency(equipment.price * equipment.value) + 'đ'}
                                                        bottomDivider
                                                    />
                                                    <Block style={{ marginBottom: 15 }}>
                                                        <Block style={{ marginLeft: 20 }}>
                                                            {
                                                                this.state.equipments
                                                                    .filter(equip => equip.sportCenterEquipmentId == scEquipment.id)
                                                                    .map(equip => {
                                                                        let startTime = 0;
                                                                        let endTime = 0;
                                                                        this.state.info.sportGrounds.map(sportGround => {
                                                                            const timeSlot = sportGround.sportGroundTimeSlots.find(timeSlot_ => timeSlot_.id == equip.timeSlotId);
                                                                            if (!timeSlot) return null;
                                                                            startTime = timeSlot.startTime;
                                                                            endTime = timeSlot.endTime;
                                                                        })
                                                                        return (
                                                                            <Block style={{ flexWrap: 'wrap' }}>
                                                                                <Text style={{ marginBottom: 10 }}>
                                                                                    {TimeUtil.convertFloatToTime(startTime) + ' - ' + TimeUtil.convertFloatToTime(endTime) + ' / ' + DateUtil.getDateDDMM(new Date().getTime() + +equip.time * 1000 * 60 * 60 * 24)}
                                                                                </Text>
                                                                                <Text>Số lượng: {equip.value}</Text>
                                                                                <Text>Giá: {equip.value * scEquipment.price}</Text>
                                                                                <Divider style={{ backgroundColor: 'blue' }} />
                                                                            </Block>
                                                                        )
                                                                    })
                                                            }
                                                        </Block>
                                                    </Block>
                                                </Block>
                                            )
                                        })
                                    }
                                </Block> : null
                        }
                        <Block style={{ alignSelf: 'center', marginBottom: 20 }}>
                            <Button
                                color="info"
                                shadowless
                                size="small"
                                capitalize
                                round
                                onPress={handleSubmit(this.toggleOverlay.bind(this))}
                            >
                                + Thêm dụng cụ thể thao
                            </Button>
                        </Block>
                    </Block>
                </ScrollView>
                <Block style={{ justifyContent: 'flex-end', alignSelf: 'center', marginBottom: 20 }}>
                    <Button
                        color="error"
                        shadowless
                        uppercase
                        onPress={handleSubmit(this.onSubmit.bind(this))}
                    >
                        Đặt
                    </Button>
                </Block>
            </Block>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white'
    },
    spaceRow: {
        marginBottom: 15
    },
    lable: {
        fontWeight: 'bold',
        marginRight: 20,
        fontSize: 18
    },
    content: {
        marginLeft: 10,
        marginRight: 10
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
    equipment: (width, height) => ({
        width: width * 0.9,
        height: height * 0.9,
        shadowOffset: {
            width: 10,
            height: 10
        },
        shadowColor: 'black',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        borderRadius: 10,
        elevation: 4
    }),
    iconX: {
        alignSelf: 'flex-end',
        marginRight: 0,
        marginTop: 0
    },
    containerEquipment: {
        marginBottom: 40,
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10
    },
    headIcon: {
        justifyContent: 'space-around',
        flexDirection: 'row'
    }
})

const sportCenter = reduxForm({
    form: 'sportCenter'
})(SportCenterScreen)

const mapStateToProps = (state, ownProps) => {
    const { sportCenters } = state.sportReducer;
    let sportCenterResult = {};
    if (sportCenters && sportCenters.length) {
        sportCenterResult = sportCenters.find(sportCenter => sportCenter.id == ownProps.route.params.id);
    }
    return {
        sportCenter: sportCenterResult,
        user: state.authReducer
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ setSportCentersAction }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(sportCenter);