import { View, StyleSheet, Text, ScrollView } from 'react-native';
import React, { Component } from 'react';
import { RotoyaButton } from '../common';
import { Icon, Divider, Card } from 'react-native-elements';
import * as sportService from '../../service/sport.service';
import { IconSports } from '../../constants/define.constants';

export default class MyHomeScreen extends Component {
    static navigationOptions = {
        drawerIcon: ({ tintColor }) => (
            <Icon type="material-community" name="home" size={24} color={tintColor}></Icon>
        )
    }

    constructor(props) {
        super(props);
        this.state = {
            sports: []
        }
    }

    componentDidMount() {
        //network
        sportService.getSports().then(res => {
            this.setState({
                sports: res.data
            });
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.listIcon}>
                    {
                        this.state.sports.map(sport => {
                            return (
                                <Icon
                                    type="material-community"
                                    name={IconSports[sport.code.toUpperCase()]}
                                    style={{ flex: 1 }}
                                    raised
                                >
                                </Icon>
                            )
                        })
                    }
                </View>
                <View style={{ flex: 8 }}>
                    <Divider style={{ backgroundColor: 'red' }} />
                    <ScrollView>
                        <Card>

                        </Card>
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    listIcon: {
        flex: 1,
        justifyContent: 'space-around',
        flexDirection: 'row'
    }
});