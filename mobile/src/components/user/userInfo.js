import { View, StyleSheet } from 'react-native';
import React, { Component } from 'react';
import { RotoyaButton } from '../common';
import { colors, fonts } from '../../styles';

export default class UserInfoScreen extends Component {
    static navigationOptions = {
        title: 'Info'
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <RotoyaButton
                    large
                    secondary
                    rounded
                    style={styles.button}
                    caption="DrawerOpen"
                    onPress={() => this.props.navigation.openDrawer()}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 50,
        justifyContent: 'space-around',
    },
    nerdImage: {
        width: 80,
        height: 80,
    },
    availableText: {
        color: colors.white,
        fontFamily: fonts.primaryRegular,
        fontSize: 40,
        marginVertical: 3,
    },
    textContainer: {
        alignItems: 'center',
    },
    buttonsContainer: {
        alignItems: 'center',
        alignSelf: 'stretch',
    },
    button: {
        alignSelf: 'stretch',
        margin: 10,
    },
});