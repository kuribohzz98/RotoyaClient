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
const required = value => value ? undefined : 'Không được bỏ trống trường này';
const email = value =>
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ?
        'Email không đúng' : undefined;
const maxLength = max => value =>
    value && (value + '').length > max ? `Chỉ được có ${max} ký tự hoặc ít hơn` : undefined;
const maxLength11 = maxLength(11);
const minLength = min => value =>
    value && (value + '').length < min ? `Ít nhât phải có ${min} ký tự` : undefined;
const minLength6 = minLength(6);
const minLength10 = minLength(10);
const character = value => value && /[A-Za-z]+/g.test(value) ? undefined : 'Chỉ được bao gồm chữ thường và chữ in hoa';
const comparePassword =  (value, allValues) => value && value == allValues.password ? undefined : 'Mật khẩu nhập lại không đúng';
const renderField = ({ input, label, secureTextEntry, icon, family, keyboardType = 'default', meta: { touched, error, warning } }) => (
    <Block>
        <Input
            borderless
            password={secureTextEntry}
            placeholder={label}
            keyboardType={keyboardType}
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
        {touched && ((error && <Text style={{ color: 'red' }}>{error}</Text>) || (warning && <Text>{warning}</Text>))}
    </Block>
)

let registerForm = props => {
    const { handleSubmit, onSubmitRegister } = props;
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
                                                        label="Họ, Tên đệm"
                                                        name="firstName"
                                                        icon="hat-3"
                                                        family="ArgonExtra"
                                                        component={renderField}
                                                        validate={[required, character]}
                                                    />
                                                </Block>
                                                <Block width={width * 0.38} style={{ marginBottom: 15 }}>
                                                    <Field
                                                        label="Tên"
                                                        name="lastName"
                                                        icon="hat-3"
                                                        family="ArgonExtra"
                                                        component={renderField}
                                                        validate={[required, character]}
                                                    />
                                                </Block>
                                            </Block>
                                            <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                                                <Field
                                                    label="Số điện thoại"
                                                    name="phone"
                                                    icon="phone"
                                                    family="font-awesome"
                                                    component={renderField}
                                                    keyboardType="numeric"
                                                    validate={[required, maxLength11, minLength10]}
                                                />
                                            </Block>
                                            <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                                                <Field
                                                    label="Email"
                                                    name="email"
                                                    icon="ic_mail_24px"
                                                    family="ArgonExtra"
                                                    component={renderField}
                                                    keyboardType="email-address"
                                                    validate={[required, email]}
                                                />
                                            </Block>
                                            <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                                                <Field
                                                    label="Mật khẩu"
                                                    name="password"
                                                    icon="padlock-unlocked"
                                                    family="ArgonExtra"
                                                    secureTextEntry={true}
                                                    component={renderField}
                                                    validate={[required, minLength6]}
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
                                                    label="Nhập lại mật khẩu"
                                                    name="confirmPassword"
                                                    icon="padlock-unlocked"
                                                    family="ArgonExtra"
                                                    secureTextEntry={true}
                                                    component={renderField}
                                                    validate={[required, minLength6, comparePassword]}
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
                                                    onPress={handleSubmit(onSubmitRegister.bind(this))}
                                                >
                                                    <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                                                        Tạo tài khoản
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