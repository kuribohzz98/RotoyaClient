import React from 'react'
import { Field, reduxForm } from 'redux-form';
import { Text, View, StyleSheet, ImageBackground, SafeAreaView, Dimensions } from 'react-native';
import { RotoyaButton } from '../../common/index';
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

const { height } = Dimensions.get('window');

const renderField = ({ input, label, secureTextEntry, icon }) => (
    <View style={{ padding: 10 }}>
        <Input
            placeholder={label}
            secureTextEntry={secureTextEntry}
            {...input}
            label={label}
            leftIcon={
                <Icon
                    name={icon}
                    size={24}
                    color='black'
                />
            }
        />
    </View>
)

let LoginForm = props => {
    const { handleSubmit } = props;
    return (
        <View style={{ flex: 1, justifyContent: 'flex-start' }}>
            <ImageBackground source={require('../../../../assets/background.png')} style={{ flex: 1, height }}>
                <SafeAreaView>
                    <View style={{ margin: 5 }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', alignSelf: 'center' }}>Login</Text>
                        <Field label="UserName" name="username" icon="user" component={renderField} />
                        <Field label="Password" name="password" icon="lock" component={renderField} secureTextEntry={true} />
                        <RotoyaButton
                            large
                            secondary
                            rounded
                            boderd
                            style={styles.button}
                            caption="Login"
                            onPress={handleSubmit(props.onSubmit)}
                        />
                    </View>
                </SafeAreaView>
            </ImageBackground>
        </View>
    )
}

export default reduxForm({
    form: 'login'
})(LoginForm);

const styles = StyleSheet.create({
    button: {
        alignSelf: 'stretch',
        margin: 10,
    }
})