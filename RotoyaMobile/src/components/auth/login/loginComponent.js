import React from 'react'
import { Field, reduxForm } from 'redux-form';
import {
    View,
    StyleSheet,
    ImageBackground,
    SafeAreaView,
    Dimensions,
    TouchableOpacity,
    Keyboard,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    StatusBar
} from 'react-native';
import { Block, Text } from "galio-framework";
import { Button, Icon, Input } from "../../common";
import { Images, argonTheme } from "../../../constants";
import SpinnerLoading from '../../common/spinnerLoading';

const { height, width } = Dimensions.get('window');
const required = value => value ? undefined : 'Không được bỏ trống trường này';
const maxLength = max => value =>
    value && (value + '').length > max ? `Chỉ được có ${max} ký tự hoặc ít hơn` : undefined;
const maxLength11 = maxLength(11);
const minLength = min => value =>
    value && (value + '').length < min ? `Ít nhât phải có ${min} ký tự` : undefined;
const minLength6 = minLength(6);
const minLength10 = minLength(10);

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

let LoginForm = props => {
    const { handleSubmit, navigation, isVisible } = props;
    return (
        <Block flex middle>
            <SpinnerLoading isVisible={isVisible} />
            <StatusBar hidden />
            <ImageBackground
                source={Images.RegisterBackground}
                style={{ width, height, zIndex: 1 }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <Block flex middle>
                        <SafeAreaView>
                            <Block style={styles.container}>
                                <Block flex>
                                    <Block flex={0.3} middle>
                                        <Text h3>Đăng nhập</Text>
                                    </Block>
                                    <Block flex center>
                                        <KeyboardAvoidingView
                                            style={{ flex: 1 }}
                                            behavior="padding"
                                            enabled
                                        >
                                            <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                                                <Field
                                                    label="Số điện thoại"
                                                    name="username"
                                                    icon="ic_mail_24px"
                                                    family="ArgonExtra"
                                                    component={renderField}
                                                    keyboardType="numeric"
                                                    validate={[required, maxLength11, minLength10]}
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
                                            </Block>
                                            {/* <View style={{ flexDirection: 'row', width: width * 0.8, justifyContent: 'center', marginBottom: 15 }}>
                                                <Text style={{ alignSelf: 'center', fontWeight: 'bold' }}>or login with </Text>
                                                <SocialIcon
                                                    type='facebook'
                                                    // title='Facebook'
                                                    // button
                                                    style={{ paddingLeft: 10, paddingRight: 10 }}
                                                />
                                                <SocialIcon
                                                    type='google'
                                                    // title='Google'
                                                    // button
                                                    style={{ paddingLeft: 10, paddingRight: 10 }}
                                                />
                                            </View> */}
                                            <View style={{ alignItems: 'center' }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ fontSize: 16 }}>
                                                        Bạn chưa có tài khoản???
                                                    </Text>
                                                </View>
                                                <TouchableOpacity
                                                    onPress={() => navigation.navigate('Register')}
                                                    style={{ marginTop: 20 }}
                                                >
                                                    <Text style={{ fontWeight: 'bold', fontSize: 16 }} textDecorationLine="underline">Đăng ký ngay</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')} style={{ marginTop: 20 }}>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Quên mật khẩu</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <Block middle>
                                                <Button
                                                    color="primary"
                                                    style={styles.createButton}
                                                    onPress={handleSubmit(props.onSubmit)}
                                                >
                                                    <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                                                        Đăng nhập
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
    container: {
        width: width * 0.9,
        height: height * 0.85,
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
    form: 'login'
})(LoginForm);