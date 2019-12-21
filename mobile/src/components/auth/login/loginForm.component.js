import React from 'react'
import { Field, reduxForm } from 'redux-form';
import { Text, View, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { RotoyaButton, RotoyaTextInput } from '../../common/index';
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

const renderField = ({ input, label, secureTextEntry, icon }) => (
    <View style={{padding:10}}>
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
        <View style={{ flex: 1, justifyContent: 'flex-start', margin: 5 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', alignSelf: 'center' }}>Login</Text>
            <Field label="UserName" name="username" icon="user" component={renderField} />
            <Field label="Password" name="password" icon="lock" component={renderField} secureTextEntry={true} />
            {/* <TouchableOpacity onPress={handleSubmit(props.onSubmit)} style={{ margin: 10, alignItems: 'center' }}>
                <Text style={{backgroundColor: 'steelblue', color: 'white', fontSize: 16, height: 37, width: 200, textAlign:'center', padding: 10}}>Submit</Text>
            </TouchableOpacity> */}
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