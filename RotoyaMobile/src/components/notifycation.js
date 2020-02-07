import { Button, View } from 'react-native';
import React, { Component } from 'react';

export default class MyNotificationsScreen extends Component {
    static navigationOptions = {
        drawerLabel: 'Notifications',
        title: 'Notifications'
    };

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems:'center' }}>
                <Button
                    onPress={() => this.props.navigation.goBack()}
                    title="Go back home"
                />

                <Button
                    onPress={() => this.props.navigation.openDrawer()}
                    title="DrawerOpen"
                />
            </View>
        );
    }
}

// const styles = StyleSheet.create({
//     icon: {
//         width: 24,
//         height: 24,
//     },
// });