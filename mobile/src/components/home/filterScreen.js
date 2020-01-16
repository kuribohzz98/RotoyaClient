import React from 'react'
import { Field, reduxForm, Form } from 'redux-form';
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
import { Button } from "../common";
import { Slider, Select } from '../common/Form';

const checkBoxField = ({ input: { onChange }, label, color }) => (
    <View>
        <Checkbox
            color={color || "primary"}
            label={label}
            onChange={checked => onChange(checked)}
        />
    </View>
)

class filterForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabledFilterByPosition: false,
            showFilter: true
        }
    }

    disabledFilterByPosition(disabled) {
        this.setState({
            disabledFilterByPosition: disabled
        })
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
            <Block flex middle >
                <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss} accessible={false}>
                    <Block flex>
                        <SafeAreaView>
                            <Block flex>
                                <ScrollView style={{ flex: 1 }}>
                                    <View style={{ marginBottom: 15, marginTop: 5, width: width * 0.8 }}>
                                        <Field
                                            name="sport"
                                            label="Sport"
                                            options={sportList}
                                            component={Select}
                                            width={200}
                                        // row
                                        />
                                    </View>
                                    <View style={{ marginBottom: 15 }}>
                                        <Field
                                            name="isFilterByPosition"
                                            label="Filter By Position"
                                            component={checkBoxField}
                                            onChange={() => this.disabledFilterByPosition(!this.state.disabledFilterByPosition)}
                                        />
                                    </View>
                                    <View style={{ marginBottom: 15 }}>
                                        <Field
                                            name="distance"
                                            label="Distance"
                                            component={Slider}
                                            maximumValue={20}
                                            disabled={this.state.disabledFilterByPosition}
                                        />
                                    </View>
                                </ScrollView>

                                <Block flex={0.1} style={{ flexDirection: 'row-reverse' }}>
                                    <Block>
                                        <Button
                                            color="error"
                                            style={{ width: width * 0.2 }}
                                            onPress={() => controlParent.setShowFilter(controlParent)}
                                        >
                                            Close
                                        </Button>
                                    </Block>
                                    <Block style={{ paddingRight: 2 }}>
                                        <Button
                                            color="primary"
                                            style={styles.createButton(width)}
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
        width: width * 0.3,
        // marginTop: 25
    }),
    button: {
        alignSelf: 'stretch',
        margin: 10,
    }
});

export default reduxForm({
    form: 'homeFilterForm'
})(filterForm);