import { Button, View, Text } from 'react-native';
import React, { Component } from 'react';

export default class MyHomeScreen extends Component {
    static navigationOptions = {
        drawerLabel: 'Home',
        title: 'Home'
    };

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems:'center' }}>
                <Button
                    onPress={() => this.props.navigation.openDrawer()}
                    title="DrawerOpen"
                />
            </View>
        );
    }
}