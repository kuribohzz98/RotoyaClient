import {
    View,
    StyleSheet,
    ScrollView,
    Dimensions,
    PermissionsAndroid,
    TouchableOpacity,
    Alert
} from 'react-native';
import React from 'react';
import { Icon, Divider, Overlay } from 'react-native-elements';
import * as sportService from '../../service/sport.service';
import { IconSports } from '../../constants/define.constants';
import FilterScreen from './filterScreen';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setSportCentersAction } from '../../redux/action/sport.action';
import { setLocationAction } from '../../redux/action/map.action';
import { setShowFilterHomeAction } from '../../redux/action/component.action';
import { Card } from 'react-native-elements';
import { Block } from 'galio-framework';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Geolocation from 'react-native-geolocation-service';
import Modal from "react-native-modal";

const { height, width } = Dimensions.get('window');
class MyHomeScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            headerRight: (
                <View style={{ marginRight: 5 }}>
                    <TouchableOpacity onPress={() => params.control.openFilterModel()}>
                        <Icon name="filter" type="font-awesome" />
                    </TouchableOpacity>
                </View>
            )
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            sports: []
        }
    }

    async componentDidMount() {
        //network
        this.props.navigation.setParams({
            control: this
        })
        sportService.getSports().then(res => {
            this.setState({
                sports: res.data,
                sportListName: res.data.map(sport => sport.name)
            });
        })
        sportService.getSportCenters().then(res => {
            const { data } = res;
            this.props.setSportCentersAction(data);
        })
    }

    openFilterModel() {
        this.props.setShowFilterHomeAction(true);
    }

    async submitFilter(value, dispatch) {
        dispatch(setShowFilterHomeAction(false));
        if (value.isFilterByPosition) {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('You can use the ACCESS_FINE_LOCATION');
                    if (value.distance) {
                        Geolocation.getCurrentPosition(
                            position => {
                                console.log("current_position: ", position);
                                dispatch(setLocationAction({ lat: position.coords.latitude, lon: position.coords.longitude }));
                                if (value.sport) {
                                    sportService.getSportCentersFilter(
                                        position.coords.latitude,
                                        position.coords.longitude,
                                        value.distance,
                                        value.sport
                                    ).then(res => {
                                        const { data } = res;
                                        dispatch(setSportCentersAction(data));
                                    })
                                } else {
                                    sportService.getSportCentersByGeolocation(
                                        position.coords.latitude,
                                        position.coords.longitude,
                                        value.distance,
                                    ).then(res => dispatch(setSportCentersAction(res.data)))
                                }
                            },
                            error => console.log(error.message),
                            {
                                timeout: 5000,
                                enableHighAccuracy: true
                            }
                        )
                    } else {
                        Alert.alert(
                            'Problem',
                            'Distance require more than 0',
                            [
                                { text: 'OK', style: 'cancel' },
                            ]
                        );
                    }

                } else {
                    console.log('ACCESS_FINE_LOCATION permission denied');
                }
            } catch (err) {
                console.warn(err);
            }
        } else {
            if (value.sport) {
                sportService.getSportCenterSport(value.sport).then(res => dispatch(setSportCentersAction(res.data)));
                return;
            }
            sportService.getSportCenters().then(res => dispatch(setSportCentersAction(res.data)));
        }
        console.log(value)
    }

    setShowFilter(control) {
        control.props.showFilterHome ? control.props.setShowFilterHomeAction(false) : null;
    }

    render() {
        const { sports } = this.state;
        return (
            <View style={styles.container}>
                {/* <Overlay
                    visible={showFilter}
                    onBackdropPress={() => this.setState({ showFilter: false })}
                    width={width * 0.9}
                    height={height * 0.85}
                >
                    <FilterScreen
                        width={width * 0.9}
                        height={height * 0.85}
                        sportList={this.state.sportListName}
                        onSubmit={this.submitFilter}
                        controlParent={this}
                    />
                </Overlay> */}
                <Modal
                    isVisible={this.props.showFilterHome}
                    onBackdropPress={() => this.props.setShowFilterHomeAction(false)}
                    onSwipeComplete={() => this.props.setShowFilterHomeAction(false)}
                    swipeDirection="left"
                    style={{ backgroundColor: 'white' }}
                >
                    <View style={{ flex: 1 }}>
                        <FilterScreen
                            width={width * 0.9}
                            height={height * 0.85}
                            sportList={this.state.sportListName}
                            onSubmit={this.submitFilter}
                            controlParent={this}
                        />
                    </View>
                </Modal>
                <View style={styles.listIcon}>
                    {
                        sports.map(sport => {
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
                <View style={styles.listItems}>
                    <Divider style={styles.drivider} />
                    <ScrollView>
                        {
                            this.props.sportCenters ? this.props.sportCenters.map(sportCenter => {
                                return (
                                    <Block>
                                        <TouchableWithoutFeedback
                                            onPress={() => this.props.navigation.navigate('SportCenter', { id: sportCenter.id })}
                                        >
                                            <Card
                                                title={sportCenter.name}
                                                image={'data:image/jpeg;base64,' + sportCenter.avatar}
                                            >
                                                <Text style={{ marginBottom: 10 }}>
                                                    {`Address: ${sportCenter.address ? sportCenter.address + ", " : ''}${sportCenter.commune}, ${sportCenter.district}, ${sportCenter.city}`}
                                                </Text>
                                            </Card>
                                        </TouchableWithoutFeedback>
                                    </Block>
                                )
                            }) : null
                        }
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
    },
    drivider: {
        backgroundColor: 'red'
    },
    listItems: {
        flex: 8
    }
});

const mapStateToProps = state => ({
    sportCenters: state.sportReducer.sportCenters,
    showFilterHome: state.componentReducer.showFilterHome
});

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ setSportCentersAction, setShowFilterHomeAction }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MyHomeScreen);