import React from 'react';
import { Block, Text } from "galio-framework";
import {
    StatusBar,
    ImageBackground,
    Dimensions,
    TouchableWithoutFeedback,
    Keyboard,
    SafeAreaView,
    StyleSheet,
    KeyboardAvoidingView,
    TouchableOpacity
} from "react-native";
import { Images, argonTheme } from "../../constants";
import { Field, reduxForm } from "redux-form";
import { Input, Button } from '../common';
import { AuthService } from '../../service';
import { NotificationUtil } from '../../helper/util';
const { height, width } = Dimensions.get('window');

const required = value => value ? undefined : 'Không được bỏ trống trường này';
const email = value =>
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ?
        'Email không đúng' : undefined;

const renderField = ({ input, label, secureTextEntry, icon, family, keyboardType = 'default', meta: { touched, error, warning } }) => (
    <Block>
        <Input
            borderless
            password={secureTextEntry}
            placeholder={label}
            keyboardType={keyboardType}
            {...input}
        />
        {touched && ((error && <Text style={{ color: 'red' }}>{error}</Text>) || (warning && <Text>{warning}</Text>))}
    </Block>
)

const ForgetPasswordScreen = ({ handleSubmit, navigation }) => {
    const submitForgetPassword = async values => {
        if (values && values.email) {
            try {
                const res = await AuthService.forgetPassword(values);
                NotificationUtil.info(`Mật khẩu mới đã được gửi đến địa chỉ email: ${values.email}`);
                navigation.goBack();
            } catch (error) {
                if (error.message == 'Request failed with status code 400') {
                    NotificationUtil.error('Email chưa dùng để đăng ký tài khoản');
                    return;
                }
                NotificationUtil.error('Đã có lỗi xảy ra');
            }
        }
    }
    return (
        <Block flex middle>
            <ImageBackground
                source={Images.RegisterBackground}
                style={{ width, height }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <Block flex middle>
                        <SafeAreaView>
                            <Block style={styles.container}>
                                <Block flex>
                                    <Block flex={0.08} middle style={{ margin: 20, marginTop: 40 }}>
                                        <Text style={{ fontSize: 15, fontStyle: 'italic', fontWeight: 'bold' }}>Nhập email đã dùng để đăng ký tài khoản, mật khẩu mới sẽ được gửi tới email này !</Text>
                                    </Block>
                                    <Block flex center>
                                        <KeyboardAvoidingView
                                            style={{ flex: 1 }}
                                            behavior="padding"
                                            enabled
                                        >
                                            <Block width={width * 0.8} style={{ marginTop: 30 }}>
                                                <Field
                                                    label="Nhập email đăng ký tài khoản"
                                                    name="email"
                                                    component={renderField}
                                                    keyboardType="email-address"
                                                    validate={[required, email]}
                                                />
                                            </Block>
                                            <Block middle>
                                                <Button
                                                    color="primary"
                                                    style={styles.createButton}
                                                    onPress={handleSubmit(submitForgetPassword.bind(this))}
                                                >
                                                    <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                                                        Xác nhận
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
        height: height * 0.5,
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
    createButton: {
        width: width * 0.5,
        marginTop: 25
    }
})

export default reduxForm({
    form: 'forget-password'
})(ForgetPasswordScreen);