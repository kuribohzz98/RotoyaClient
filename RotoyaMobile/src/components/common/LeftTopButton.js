import React from 'react';
import { View, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class LeftTopButton extends React.Component {
    constructor() {
        super();
        
    }
    render() {
        return (
            <TouchableHighlight onPress={() => this.props.navigation.openDrawer()}>
                <View style={{ marginLeft: 5 }}>
                    <Icon
                        name='bars'
                        size={24}
                        color='black'
                    />
                </View>
            </TouchableHighlight>
        )
    }
}