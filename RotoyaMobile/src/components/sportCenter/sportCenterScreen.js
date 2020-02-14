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
import { Block, Text, Button, Toast } from "galio-framework";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setSportCentersAction } from '../../redux/action/sport.action';
import { Image, ListItem } from 'react-native-elements';
import * as sportService from '../../service/sport.service';
import { convertFloatToTime } from '../../helper/util/time';
import { IconSports } from '../../constants/define.constants';
import { Checkbox } from '../common/Form';
import { getDateDDMM } from '../../helper/util/date';

const { width, height } = Dimensions.get('window');

function AccordionAnimation({ children, style }) {
    const [fade, setFade] = useState(new Animated.Value(0.3));

    useEffect(() => {
        Animated.timing(fade, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true
        }).start();
    });

    return (
        <Animated.View style={{ ...style, opacity: fade }}>
            {children}
        </Animated.View>
    );
}

// const formBook = props => {

//     return (

//     )
// }

class SportCenterScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            info: { sportGrounds: [] },
            dateBook: this.getDataSelectDay(),
            showGround: [],
            showSubGround: [0, 0, 0],
            showNotify: false
        }
    }

    async componentDidMount() {
        const res = await sportService.getSportCenter(this.props.id, new Date().getTime());
        console.log(res.data);
        if (!res.data) console.error('not found sportCenter');
        this.setState({ info: res.data });
        res.data.sportGrounds.map(sportGround => this.setState({ showGround: [...this.state.showGround, this.state.showGround.push(0)] }));
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
        let showTemp = [...this.state.showGround];
        if (showTemp[index]) {
            showTemp[index] = 0;
            return this.setState({ showGround: showTemp });
        }
        showTemp[index] = 1;
        return this.setState({ showGround: showTemp });
    }

    openSubGround(index) {
        let showTemp = [...this.state.showSubGround];
        if (showTemp[index]) {
            showTemp[index] = 0;
            return this.setState({ showSubGround: showTemp });
        }
        showTemp[index] = 1;
        return this.setState({ showSubGround: showTemp });
    }

    onSubmit(value) {
        console.log(value);
        // this.setState({
        //     showNotify: true
        // })
        console.log(this);
    }

    render() {
        const { handleSubmit } = this.props;
        return (
            <Block flex safe>
                <Toast isShow={this.state.showNotify} positionIndicator="top">This is a top positioned toast</Toast>
                <ScrollView>
                    <View style={styles.spaceRow}>
                        <Image
                            source={{ uri: 'data:image/jpeg;base64,' + this.props.avatar }}
                            style={{ width: width, height: height * 0.3 }}
                            PlaceholderContent={<ActivityIndicator size={50} color="#55a66d" />}
                        />
                    </View>
                    <Block style={styles.content}>
                        <Block style={{ alignItems: 'center', ...styles.spaceRow }}>
                            <Text style={{ textAlign: 'center' }} h3>{this.props.name}</Text>
                        </Block>
                        <Block row style={styles.spaceRow}>
                            <Text style={styles.lable}>Open time: </Text>
                            <Text
                                size={15}
                                color="#525F7F"
                            >
                                {convertFloatToTime(this.props.timeOpen) + ' - ' + convertFloatToTime(this.props.timeClose)}
                            </Text>
                        </Block>
                        <Block row style={{ ...styles.spaceRow, width: (width - 120) }}>
                            <Text style={styles.lable}>Address: </Text>
                            <Block style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                                <Text
                                    size={15}
                                    color="#525F7F"
                                >
                                    {`${this.props.address ? this.props.address + ", " : ''}${this.props.commune}, `}
                                </Text>
                                <Text
                                    size={15}
                                    color="#525F7F"
                                >
                                    {`${this.props.district}, ${this.props.city}`}
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
                                            leftIcon={{
                                                type: "material-community",
                                                name: IconSports[icon.code]
                                            }}
                                            rightIcon={{
                                                type: "material",
                                                name: `keyboard-arrow-${this.state.showGround[index] ? 'right' : 'down'}`,
                                                size: 40
                                            }}
                                            title={sportGround.name}
                                            subtitle={`Quantity: ${sportGround.quantity} ${sportGround.type ? '\n type: ' + sportGround.type : ''}`}
                                            onPress={() => this.openGround(index)}
                                        />
                                        {
                                            !this.state.showGround[index] ?
                                                <AccordionAnimation>
                                                    <Block card shadow style={{ backgroundColor: '#FFFFFF', padding: 20 }}>
                                                        {
                                                            (this.state.dateBook || []).map((data, i) => (
                                                                <Block>
                                                                    <ListItem
                                                                        rightIcon={{
                                                                            type: "material",
                                                                            name: `keyboard-arrow-${!this.state.showSubGround[i] ? 'right' : 'down'}`,
                                                                            size: 30
                                                                        }}
                                                                        title={data}
                                                                        onPress={() => this.openSubGround(i)}
                                                                    />
                                                                    {
                                                                        this.state.showSubGround[i] ? <AccordionAnimation>
                                                                            <Block style={{ marginLeft: 25 }}>
                                                                                {
                                                                                    (sportGround.sportGroundTimeSlots || []).map(timeSlot => {
                                                                                        let lateTime = false;
                                                                                        if (!i) {
                                                                                            let current = new Date(new Date().getTime() + 1000 * 60 * 10);
                                                                                            if (+timeSlot.startTime < +`${current.getHours()}.${current.getMinutes()}`) lateTime = true;
                                                                                        }
                                                                                        let totalBooked = (timeSlot.bookeds || []).find(booked => new Date(booked.date).getDate() == data.split(' - ')[0]) || { amount: 0 };
                                                                                        return (<Block row style={{ marginBottom: 15 }}>
                                                                                            <Field
                                                                                                name={i + "_" + timeSlot.id}
                                                                                                label={convertFloatToTime(timeSlot.startTime) + ' - ' + convertFloatToTime(timeSlot.endTime)}
                                                                                                component={Checkbox}
                                                                                                iconName={+totalBooked == +sportGround.quantity || lateTime ? "minus-circle" : "check"}
                                                                                                iconFamily={"font-awesome"}
                                                                                                color={+totalBooked == +sportGround.quantity || lateTime ? "#d90e00" : "success"}
                                                                                                disabled={+totalBooked == +sportGround.quantity || lateTime}
                                                                                            // initialValue={+totalBooked == +sportGround.quantity || lateTime}
                                                                                            />
                                                                                            <Block row style={{ marginLeft: 10, flexWrap: 'wrap' }}>
                                                                                                <Text
                                                                                                    muted={+totalBooked == +sportGround.quantity || lateTime}
                                                                                                >
                                                                                                    {`(residual: ${+sportGround.quantity - +totalBooked.amount})`}
                                                                                                </Text>
                                                                                                {
                                                                                                    +totalBooked == +sportGround.quantity || lateTime ?
                                                                                                        <Text muted> - {+totalBooked == +sportGround.quantity ? 'No more' : 'Late time'}</Text>
                                                                                                        : null
                                                                                                }
                                                                                            </Block>
                                                                                        </Block>)
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
                        onPress={handleSubmit(this.onSubmit)}
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
        id: sportCenterResult.id,
        name: sportCenterResult.name,
        country: sportCenterResult.country,
        city: sportCenterResult.city,
        district: sportCenterResult.district,
        commune: sportCenterResult.commune,
        address: sportCenterResult.address,
        avatar: sportCenterResult.avatar,
        latitude: sportCenterResult.latitude,
        longitude: sportCenterResult.longitude,
        timeOpen: sportCenterResult.timeOpen,
        timeClose: sportCenterResult.timeClose
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ setSportCentersAction }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(sportCenter);