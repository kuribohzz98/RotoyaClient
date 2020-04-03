import React from 'react'
import { Field, reduxForm } from 'redux-form';
import {
    View,
    StyleSheet,
    SafeAreaView,
    Keyboard,
    TouchableWithoutFeedback,
    ScrollView,
    PermissionsAndroid
} from 'react-native';
import { Block, Checkbox } from "galio-framework";
import { Button, Text } from 'galio-framework';
import { Slider, Select, Switch } from '../common/Form';
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Geolocation from 'react-native-geolocation-service';
import { SportService } from '../../service';
import { ComponentAction, SportAction } from '../../redux/action';
import { DateUtil } from '../../helper/util';

const checkBoxField = ({ input: { onChange, value }, label, color }) => (
    <View>
        <Checkbox
            color={color || "primary"}
            label={label}
            onChange={checked => onChange(checked)}
            initialValue={value ? true : false}
        />
    </View>
)

class filterForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabledFilterByPosition: false,
            showFilter: true,
            dataSelectDay: this.getDataSelectDay(),
            sportListName: [],
            sports: []
        }
    }

    componentDidMount() {
        SportService.getSports().then(res => {
            this.setState({
                sportListName: res.data.map(sport => sport.name),
                sport: res.data
            });
        })
    }

    UNSAFE_componentWillMount() {
        const {
            isTimeSlostBlank,
            isByLocation,
            distance,
            sport,
            time
        } = this.props.optionsGetSportCenters;
        this.props.initialize({
            findByDay: this.state.dataSelectDay[0],
            isTimeSlostBlank,
            isFilterByPosition: isByLocation,
            distance,
            sport,
            findByDay: DateUtil.getDateDDMM(time)
        });
        if (isByLocation) this.setState({ disabledFilterByPosition: true });
    }

    disabledFilterByPosition(disabled) {
        this.setState({
            disabledFilterByPosition: disabled
        })
    }

    getDataSelectDay() {
        const current = new Date();
        let result = [];
        for (let i = 0; i < 3; i++) {
            result.push(DateUtil.getDateDDMM(current.getTime() + i * 1000 * 60 * 60 * 24));
        }
        return result;
    }

    async submitFilter(value, dispatch) {
        const {
            distance,
            sport,
            findByDay,
            isFilterByPosition,
            isTimeSlostBlank
        } = value;
        console.log(value);
        const opts = {};
        if (isFilterByPosition) {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                console.warn('device not grant rights use location');
                return;
            }
            await new Promise(resolve => {
                Geolocation.getCurrentPosition(position => {
                    console.log("current_position: ", position);
                    opts.latitude = position.coords.latitude;
                    opts.longitude = position.coords.longitude;
                    resolve(position);
                })
            });

        }
        opts.time = findByDay ?
            new Date(DateUtil.convertDateDDMMToMMDD(findByDay)).getTime() :
            new Date().getTime();
        opts.isTimeSlotBlank = isTimeSlostBlank;
        opts.isByLocation = isFilterByPosition;
        if (sport) opts.sport = sport;
        if (distance) opts.distance = distance;
        opts.limit = 5;
        opts.page = 1;
        if (sport) {
            const sportTemp = this.state.sports.find(sport => sport.name == sport);
            if (sportTemp) opts.sportId = sportTemp.id;
        }
        console.log(opts, '-----');
        SportService.getSportCenters(opts).then(res => {
            dispatch(SportAction.setSportCentersAction(res.data));
            dispatch(ComponentAction.setOptionsGetSportCenters(opts));
            this.props.navigation.navigate('Home');
        })
    }

    render() {
        const { handleSubmit } = this.props;
        return (
            <Block flex middle>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <Block flex>
                        {/* <Block style={styles.iconX}>
                            <Icon type="foundation" name="x" size={24} />
                        </Block> */}
                        <SafeAreaView>
                            <Block flex style={styles.container}>
                                {/* <View style={{ alignItems: 'center' }}>
                                    <Text h3 >Search filter</Text>
                                </View> */}
                                <ScrollView style={{ flex: 1 }}>
                                    <View style={{ marginTop: 50, flex: 1 }}>
                                        <Field
                                            name="isTimeSlostBlank"
                                            label="Find by time slot blank"
                                            component={Switch}
                                            color="info"
                                        // initialValue={}
                                        />
                                    </View>
                                    <View style={{ marginTop: 50, flex: 1 }}>
                                        <Field
                                            name="findByDay"
                                            label="Select day find"
                                            component={Select}
                                            options={this.getDataSelectDay()}
                                            width={200}
                                        // initialValue={}
                                        />
                                    </View>
                                    <View style={{ marginTop: 50, flex: 1 }}>
                                        <Field
                                            name="sport"
                                            label="Sport"
                                            options={this.state.sportListName}
                                            component={Select}
                                            width={200}
                                        // row
                                        />
                                    </View>
                                    <View style={{ marginTop: 50, flex: 1 }}>
                                        <Field
                                            name="isFilterByPosition"
                                            label="Filter By Position"
                                            component={checkBoxField}
                                            onChange={() => this.disabledFilterByPosition(!this.state.disabledFilterByPosition)}
                                        />
                                    </View>
                                    <View style={{ marginTop: 50, flex: 1 }}>
                                        <Field
                                            name="distance"
                                            label="Distance"
                                            component={Slider}
                                            maximumValue={20}
                                            unit="Km"
                                            disabled={this.state.disabledFilterByPosition}
                                        />
                                    </View>
                                </ScrollView>

                                <Block flex={0.1} style={{ alignSelf: 'center' }}>
                                    <Block>
                                        <Button
                                            size="small"
                                            color="error"
                                            round
                                            onPress={handleSubmit(this.submitFilter.bind(this))}
                                        >
                                            Submit
                                        </Button>
                                    </Block>
                                </Block>
                            </Block>
                        </SafeAreaView>
                    </Block>
                </TouchableWithoutFeedback>
            </Block>
        )
    }
}

const styles = StyleSheet.create({
    createButton: (width) => ({
        width: width * 0.3
    }),
    button: {
        alignSelf: 'stretch',
        margin: 10,
    },
    container: {
        marginBottom: 40,
        marginTop: -10
    },
    iconX: {
        alignSelf: 'flex-end',
        marginRight: -20,
        marginTop: 10
    }
});

const filterScreen = reduxForm({
    form: 'homeFilterForm'
})(filterForm)

const mapStateToProps = state => ({
    optionsGetSportCenters: state.componentReducer.optionsGetSportCenters
});

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(filterScreen);