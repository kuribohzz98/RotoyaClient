import React from 'react'
import { Field, reduxForm } from 'redux-form';
import {
    View,
    StyleSheet,
    SafeAreaView,
    Keyboard,
    TouchableWithoutFeedback,
    ScrollView
} from 'react-native';
import { Block, Checkbox } from "galio-framework";
import { Button, Text } from 'galio-framework';
import { Slider, Select, Switch } from '../common/Form';
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setOptionsGetSportCenters } from '../../redux/action/component.action';
import { getDateDDMM } from '../../helper/util/date';

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
            dataSelectDay: this.getDataSelectDay()
        }
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
            findByDay: getDateDDMM(time)
        });
        if (isByLocation) this.setState({disabledFilterByPosition: true});
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
            result.push(getDateDDMM(current.getTime() + i * 1000 * 60 * 60 * 24));
        }
        return result;
    }

    render() {
        const {
            handleSubmit,
            sportList,
            width,
            controlParent,
            height
        } = this.props;
        return (
            <Block flex middle>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <Block flex>
                        <Block style={styles.iconX}>
                            <Icon type="foundation" name="x" size={24} />
                        </Block>
                        <SafeAreaView>
                            <Block flex style={styles.container}>
                                <View style={{ alignItems: 'center' }}>
                                    <Text h3 >Search filter</Text>
                                </View>
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
                                    <View style={{ marginTop: 50, width: width * 0.8, flex: 1 }}>
                                        <Field
                                            name="sport"
                                            label="Sport"
                                            options={sportList}
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
                                            onPress={handleSubmit(this.props.onSubmit)}
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
    return bindActionCreators({ setOptionsGetSportCenters }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(filterScreen);