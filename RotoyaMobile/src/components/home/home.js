import React from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    PermissionsAndroid,
    TouchableOpacity,
    Text,
    FlatList,
    TouchableWithoutFeedback,
    ActivityIndicator
} from 'react-native';
import { Icon, Divider } from 'react-native-elements';
import * as sportService from '../../service/sport.service';
import { IconSports } from '../../constants/define.constants';
import FilterScreen from './filterScreen';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setSportCentersAction, addSportCenters } from '../../redux/action/sport.action';
import { setLocationAction } from '../../redux/action/map.action';
import {
    setShowFilterHomeAction,
    setOptionsGetSportCenters
} from '../../redux/action/component.action';
import { Card } from 'react-native-elements';
import { Block } from 'galio-framework';
import Geolocation from 'react-native-geolocation-service';
import Modal from "react-native-modal";
import { convertDateDDMMToMMDD } from '../../helper/util/date';

const { height, width } = Dimensions.get('window');
class MyHomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sports: [],
            isLoading: false,
            sportListName: [],
        }
    }
    UNSAFE_componentWillMount() {
        this.addHeaderRight();
    }
    addHeaderRight() {
        this.props.navigation.setOptions({
            headerRight: () => (
                <View style={{ marginRight: 5 }}>
                    <TouchableOpacity onPress={() => this.openFilterModel()}>
                        <Icon name="filter" type="font-awesome" />
                    </TouchableOpacity>
                </View>
            )
        });
    }

    async componentDidMount() {
        //network
        sportService.getSports().then(res => {
            this.setState({
                sports: res.data,
                sportListName: res.data.map(sport => sport.name)
            });
        })
        console.log(this.props.optionsGetSportCenters);
        sportService.getSportCenters(this.props.optionsGetSportCenters).then(res => {
            const { data } = res;
            // this.setPage(data.length);
            this.props.setSportCentersAction(data);
        })

    }

    openFilterModel() {
        this.props.setShowFilterHomeAction(true);
    }

    async loadMore() {  
        const { limit, page } = this.props.optionsGetSportCenters;
        if (this.props.sportCenters.length < limit) return;
        if (this.props.sportCenters.length < limit * page) return;
        this.setState({
            isLoading: true
        })
        const tempOptions = { ...this.props.optionsGetSportCenters };
        tempOptions.page = tempOptions.page + 1;
        this.props.setOptionsGetSportCenters(tempOptions);
        sportService.getSportCenters(tempOptions)
            .then(res => {
                this.setState({
                    isLoading: false
                })
                this.props.addSportCenters(res.data || []);
            })
            .catch(err => this.setState({ isLoading: false }));
    }

    async submitFilter(value, dispatch) {
        const {
            distance,
            sport,
            findByDay,
            isFilterByPosition,
            isTimeSlostBlank
        } = value;
        dispatch(setShowFilterHomeAction(false));
        console.log(value);
        const opts = {};
        if (isFilterByPosition) {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                console.warn('device not grant rights use location');
                return;
            }
            await new Promise(resolve =>
                Geolocation.getCurrentPosition(position => {
                    console.log("current_position: ", position);
                    opts.latitude = position.coords.latitude;
                    opts.longitude = position.coords.longitude;
                    resolve();
                }));
        }
        if (findByDay) {
            opts.time = new Date(convertDateDDMMToMMDD(findByDay)).getTime();
        }
        opts.isTimeSlotBlank = isTimeSlostBlank;
        opts.isByLocation = isFilterByPosition;
        if (sport) opts.sport = sport;
        if (distance) opts.distance = distance;
        opts.limit = 5;
        opts.page = 1;
        console.log(opts);
        sportService.getSportCenters(opts).then(res => {
            dispatch(setSportCentersAction(res.data));
            dispatch(setOptionsGetSportCenters(opts));
        })
    }

    setShowFilter(control) {
        control.props.showFilterHome ? control.props.setShowFilterHomeAction(false) : null;
    }

    footerLoadMore() {
        return (
            this.state.isLoading ? <View style={styles.loadMore}>
                <ActivityIndicator size="small" color="#55a66d" />
            </View> : null
        )
    }

    render() {
        const { sports, sportListName } = this.state;
        return (
            <View style={styles.container}>
                <Modal
                    isVisible={this.props.showFilterHome}
                    onBackdropPress={() => this.props.setShowFilterHomeAction(false)}
                    onSwipeComplete={() => this.props.setShowFilterHomeAction(false)}
                    swipeDirection="left"
                    style={{ backgroundColor: 'white', borderRadius: 15 }}
                >
                    <View style={{ flex: 1 }}>
                        <FilterScreen
                            width={width * 0.9}
                            height={height * 0.85}
                            sportList={sportListName}
                            sports={sports}
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
                                />
                            )
                        })
                    }
                </View>
                <View style={styles.listItems}>
                    <Divider style={styles.drivider} />
                    <FlatList
                        onEndReached={() => this.loadMore()}
                        onEndReachedThreshold={1}
                        data={this.props.sportCenters}
                        ListFooterComponent={() => this.footerLoadMore()}
                        renderItem={({ item }) => (
                            <TouchableWithoutFeedback
                                onPress={() => this.props.navigation.navigate('SportCenter', { id: item.id })}
                            >
                                <Card
                                    title={item.name}
                                    image={{ uri: 'data:image/jpeg;base64,' + item.avatar }}
                                    imageProps={{PlaceholderContent: <ActivityIndicator size={50} color="#55a66d" />}}
                                >
                                    <Text style={{ marginBottom: 10 }}>
                                        {`Address: ${item.address ? item.address + ", " : ''}${item.commune}, ${item.district}, ${item.city}`}
                                    </Text>
                                </Card>
                            </TouchableWithoutFeedback>
                        )}
                    />
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
    },
    loadMore: {
        marginTop: 10,
        alignSelf: 'center'
    }
});

const mapStateToProps = state => ({
    sportCenters: state.sportReducer.sportCenters,
    showFilterHome: state.componentReducer.showFilterHome,
    optionsGetSportCenters: state.componentReducer.optionsGetSportCenters
});

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        setSportCentersAction,
        setShowFilterHomeAction,
        setOptionsGetSportCenters,
        addSportCenters
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MyHomeScreen);