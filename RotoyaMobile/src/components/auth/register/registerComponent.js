import React from 'react'
import { Field, reduxForm } from 'redux-form';
import {
    StyleSheet,
    ImageBackground,
    SafeAreaView,
    Dimensions,
    Keyboard,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    ScrollView,
    StatusBar
} from 'react-native';
import { Block, Checkbox, Text, theme } from "galio-framework";
import { Button, Icon, Input, Select } from "../../common";
import { Images, argonTheme } from "../../../constants";

const { height, width } = Dimensions.get('window');

const renderField = ({ input, label, secureTextEntry, icon, family }) => (
    <Block>
        <Input
            borderless
            password={secureTextEntry}
            placeholder={label}
            {...input}
            iconContent={
                <Icon
                    size={16}
                    color={argonTheme.COLORS.ICON}
                    name={icon}
                    family={family}
                    style={styles.inputIcons}
                />
            }
        />
    </Block>
)

let registerForm = props => {
    const { handleSubmit } = props;
    return (
        <Block flex middle>
            <StatusBar hidden />
            <ImageBackground
                source={Images.RegisterBackground}
                style={{ width, height }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <Block flex middle>
                        <SafeAreaView>
                            <Block style={styles.registerContainer}>
                                <Block flex>
                                    <Block flex={0.08} middle>
                                        {/* <Text h5>Create Account</Text> */}
                                    </Block>
                                    <Block flex center>
                                        <KeyboardAvoidingView
                                            style={{ flex: 1 }}
                                            behavior="padding"
                                            enabled
                                        >
                                            <Block row>
                                                <Block width={width * 0.38} style={{ marginBottom: 15, marginRight: width * 0.04 }}>
                                                    <Field
                                                        label="First name"
                                                        name="firstName"
                                                        icon="hat-3"
                                                        family="ArgonExtra"
                                                        component={renderField}
                                                    />
                                                </Block>
                                                <Block width={width * 0.38} style={{ marginBottom: 15 }}>
                                                    <Field
                                                        label="Last name"
                                                        name="lastName"
                                                        icon="hat-3"
                                                        family="ArgonExtra"
                                                        component={renderField}
                                                    />
                                                </Block>
                                            </Block>
                                            <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                                                <Field
                                                    label="Phone number"
                                                    name="phone"
                                                    icon="phone"
                                                    family="font-awesome"
                                                    component={renderField}
                                                />
                                            </Block>
                                            <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                                                <Field
                                                    label="Email"
                                                    name="email"
                                                    icon="ic_mail_24px"
                                                    family="ArgonExtra"
                                                    component={renderField}
                                                />
                                            </Block>
                                            <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                                                <Field
                                                    label="Password"
                                                    name="password"
                                                    icon="padlock-unlocked"
                                                    family="ArgonExtra"
                                                    secureTextEntry={true}
                                                    component={renderField}
                                                />
                                                {/* <Block row style={styles.passwordCheck}>
                                            <Text size={12} color={argonTheme.COLORS.MUTED}>
                                                password strength:
                                            </Text>
                                            <Text bold size={12} color={argonTheme.COLORS.SUCCESS}>
                                                {" "}
                                                strong
                                            </Text>
                                        </Block> */}
                                            </Block>
                                            <Block width={width * 0.8}>
                                                <Field
                                                    label="Confirm password"
                                                    name="confirmPassword"
                                                    icon="padlock-unlocked"
                                                    family="ArgonExtra"
                                                    secureTextEntry={true}
                                                    component={renderField}
                                                />
                                            </Block>
                                            <Block row width={width * 0.75}>
                                                {/* <Checkbox
                                            checkboxStyle={{
                                                borderWidth: 3
                                            }}
                                            color={argonTheme.COLORS.PRIMARY}
                                            label="I agree with the"
                                        />
                                        <Button
                                            style={{ width: 100 }}
                                            color="transparent"
                                            textStyle={{
                                                color: argonTheme.COLORS.PRIMARY,
                                                fontSize: 14
                                            }}
                                        >
                                            Privacy Policy
                                        </Button> */}
                                            </Block>
                                            <Block middle>
                                                <Button
                                                    color="primary"
                                                    style={styles.createButton}
                                                    onPress={handleSubmit(props.onSubmit)}
                                                >
                                                    <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                                                        CREATE ACCOUNT
                                                    </Text>
                                                </Button>
                                            </Block>
                                        </KeyboardAvoidingView>
                                    </Block>
                                </Block>
                            </Block>
                        </SafeAreaView>
                    </Block>
                </TouchableWithoutFeedback>
            </ImageBackground>
        </Block>
    )
}

const styles = StyleSheet.create({
    registerContainer: {
        width: width * 0.9,
        height: height * 0.78,
        backgroundColor: "#F4F5F7",
        borderRadius: 4,
        shadowColor: argonTheme.COLORS.BLACK,
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowRadius: 8,
        shadowOpacity: 0.1,
        elevation: 1,
        overflow: "hidden"
    },
    socialConnect: {
        backgroundColor: argonTheme.COLORS.WHITE,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "#8898AA"
    },
    socialButtons: {
        width: 120,
        height: 40,
        backgroundColor: "#fff",
        shadowColor: argonTheme.COLORS.BLACK,
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowRadius: 8,
        shadowOpacity: 0.1,
        elevation: 1
    },
    socialTextButtons: {
        color: argonTheme.COLORS.PRIMARY,
        fontWeight: "800",
        fontSize: 14
    },
    inputIcons: {
        marginRight: 12
    },
    passwordCheck: {
        paddingLeft: 15,
        paddingTop: 13,
        paddingBottom: 30
    },
    createButton: {
        width: width * 0.5,
        marginTop: 25
    }
});

export default reduxForm({
    form: 'register'
})(registerForm);