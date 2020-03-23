import {
    View,
    Dimensions,
    ScrollView,
    ActivityIndicator,
    Animated,
    StyleSheet
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Block, Text, Button } from "galio-framework";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setSportCentersAction } from '../../redux/action/sport.action';
import { Image, ListItem } from 'react-native-elements';
import { Checkbox } from '../common/Form';
import { getDateDDMM } from '../../helper/util/date';
import { BookService, SportService } from '../../service';
import { NotificationUtil, TimeUtil } from '../../helper/util';
import { ComponentConstants, ApiConstants } from '../../constants';

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

class SportCenterScreen extends React.Component {
    nativeEventSubscription = null;
    constructor(props) {
        super(props);
        this.state = {
            info: { sportGrounds: [] },
            dateBook: this.getDataSelectDay(),
            showGround: [],
            showSubGround: []
        }
    }

    componentDidMount() {
        this.getSportCenter();
    }

    async getSportCenter() {
        const res = await SportService.getSportCenter(this.props.sportCenter.id, new Date().getTime());
        console.log('____________')
        console.log(res.data.sportGrounds);
        if (!res.data) console.error('not found sportCenter');
        this.setState({ info: res.data });
        this.setState({
            sportGround: [],
            showSubGround: []
        }, () => {
            let showGroundTemp = [];
            let showSubGroundTemp = [];
            res.data.sportGrounds.map(() => {
                showGroundTemp.push(0);
                showSubGroundTemp.push([0, 0, 0]);
            });
            this.setState({ showGround: showGroundTemp });
            this.setState({ showSubGround: showSubGroundTemp })
        })
    }

    getDataSelectDay() {
        const current = new Date();
        let result = [];
        for (let i = 0; i < 3; i++) {
            result.push(getDateDDMM(current.getTime() + i * 1000 * 60 * 60 * 24));
        }
        return result;
    }

    openGround(index) {
        console.log(index);
        let showTemp = [...this.state.showGround];
        if (showTemp[index]) {
            showTemp[index] = 0;
            return this.setState({ showGround: showTemp });
        }
        showTemp[index] = 1;
        return this.setState({ showGround: showTemp });
    }

    openSubGround(index, subIndex) {
        console.log(index, subIndex);
        let showTemp = [...this.state.showSubGround];
        if (showTemp[index][subIndex]) {
            showTemp[index][subIndex] = 0;
            return this.setState({ showSubGround: showTemp });
        }
        showTemp[index][subIndex] = 1;
        return this.setState({ showSubGround: showTemp });
    }

    async onSubmit(value) {
        console.log(value);
        const filter = [];
        Object.keys(value).map(key => {
            if (value[key]) filter.push(key);
        })
        console.log(filter);
        if (!filter.length) {
            NotificationUtil.notifyError("Booking failed", "You haven't selected");
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

        const res = await BookService.bookingSportCenter(params);
        const { data } = res;
        console.log(data);
        if (data.error) {
            if (isNaN(+data.error)) {
                NotificationUtil.notifyError("Booking failed", data.error);
                // this.getSportCenter();
                return;
            }
            (this.state.info.sportGrounds || []).map(sportGround => {
                (sportGround.sportGroundTimeSlots || []).map(timeSlot => {
                    if (+timeSlot.id == +data.error) {
                        NotificationUtil.notifyError("Booking failed", `${sportGround.name} is not empty`)
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
            payment: data.data
        })

    }

    componentWillUnmount() {
        console.log('__ahihi');
    }

    render() {
        const { handleSubmit } = this.props;
        return (
            <Block flex safe style={styles.container}>
                <ScrollView>
                    <View style={styles.spaceRow}>
                        <Image
                            source={{ uri: ApiConstants.URL_API + '/image/' + this.props.sportCenter.avatar }}
                            style={{ width: width, height: height * 0.3 }}
                            PlaceholderContent={<ActivityIndicator size={50} color="#55a66d" />}
                        />
                    </View>
                    <Block style={styles.content}>
                        <Block style={{ alignItems: 'center', ...styles.spaceRow }}>
                            <Text style={{ textAlign: 'center' }} h3>{this.props.sportCenter.name}</Text>
                        </Block>
                        <Block row style={styles.spaceRow}>
                            <Text style={styles.lable}>Open time: </Text>
                            <Text
                                size={15}
                                color="#525F7F"
                            >
                                {TimeUtil.convertFloatToTime(this.props.sportCenter.timeOpen) + ' - ' + TimeUtil.convertFloatToTime(this.props.sportCenter.timeClose)}
                            </Text>
                        </Block>
                        <Block row style={{ ...styles.spaceRow, width: (width - 120) }}>
                            <Text style={styles.lable}>Address: </Text>
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
                        <Block style={styles.spaceRow}>
                            <Text style={styles.lable}>Rental services: </Text>
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
                                            subtitle={`Quantity: ${sportGround.quantity} ${sportGround.type ? '\n type: ' + sportGround.type : ''}`}
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
                                                                            <Block style={{ marginLeft: 25 }}>
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
                                                                                                    name={i + "_" + timeSlot.id + "_" + timeSlot.price}
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
                                                                                                        {`(residual: ${+sportGround.quantity - +totalBooked.amount})`}
                                                                                                    </Text>
                                                                                                    {
                                                                                                        +totalBooked.amount >= +sportGround.quantity || lateTime ?
                                                                                                            <Text muted> - {+totalBooked.amount == +sportGround.quantity ? 'No more' : 'Late time'}</Text>
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
                    </Block>
                </ScrollView>
                <Block style={{ justifyContent: 'flex-end', alignSelf: 'center', marginBottom: 20 }}>
                    <Button
                        color="error"
                        shadowless
                        uppercase
                        onPress={handleSubmit(this.onSubmit.bind(this))}
                    // loading
                    >
                        Book
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
        user: state.loginReducer
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ setSportCentersAction }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(sportCenter);