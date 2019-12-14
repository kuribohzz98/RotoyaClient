import React from 'react'
import { Field, reduxForm } from 'redux-form';
import { Text, View, TouchableOpacity, TextInput } from 'react-native';

const renderField = ({input, label, secureTextEntry }) => (
    <View style={{flexDirection:'row', height: 50, alignItems:'center'}}>
        <Text style={{fontSize: 14, fontWeight:'bold', width: 80}}>{label}</Text>
        <TextInput  style={{borderColor: 'steelblue', borderWidth: 1, height: 37, width: 220, padding: 5}}
                    secureTextEntry={secureTextEntry}
                    {...input}
        ></TextInput>
    </View>
)

let LoginForm = props => {
    const { handleSubmit } = props;
    return (
        <View style={{ flex: 1, flexDirection: 'column', margin: 40, justifyContent: 'flex-start' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', width: 200, textAlign: 'center', margin: 10 }}>Login</Text>
            <Field  label="UserName: " name="username" component={renderField} />
            <Field  label="Password: " name="password" component={renderField} secureTextEntry={true}/>
            <TouchableOpacity onPress={handleSubmit(props.onSubmit)} style={{ margin: 10, alignItems: 'center' }}>
                <Text style={{backgroundColor: 'steelblue', color: 'white', fontSize: 16, height: 37, width: 200, textAlign:'center', padding: 10}}>Submit</Text>
            </TouchableOpacity>
        </View>
    )
}

export default reduxForm({
    form: 'login'
})(LoginForm);