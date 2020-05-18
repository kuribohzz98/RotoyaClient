import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    TouchableWithoutFeedback,
    ActivityIndicator,
    Platform,
    Linking,
    PermissionsAndroid
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card, ButtonGroup, Icon } from 'react-native-elements';
import Geolocation from 'react-native-geolocation-service';
import { SportCenterService, SportService } from '../../service';
import { ComponentAction, SportAction } from '../../redux/action';
import { ApiConstants, ComponentConstants, Images } from '../../constants';
import { NumberUtil } from '../../helper/util';

class MyHomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            selectedIndex: 0,
            sports: [],
            reload: false
        }
        this.updateIndex = this.updateIndex.bind(this);
    }

    async componentDidMount() {
        const optionsGet = this.initOptionsQuery();
        const res_sport = await SportService.getSports();
        this.setState({ sports: res_sport.data });
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted == PermissionsAndroid.RESULTS.GRANTED) {
            await new Promise(resolve => {
                Geolocation.getCurrentPosition(position => {
                    optionsGet.latitude = position.coords.latitude;
                    optionsGet.longitude = position.coords.longitude;
                    optionsGet.isByLocation = true;
                    optionsGet.distance = 10;
                    console.log(optionsGet, '___+++______');
                    resolve(position);
                }, (error) => {
                    // See error code charts below.
                    console.log(error.code, error.message);
                }, { enableHighAccuracy: true, timeout: 15000 })
            });
        }
        this.setState({ reload: true });
        // console.log(optionsGet, '______');
        SportCenterService.getSportCenters(optionsGet).then(res => {
            this.setState({ reload: false });
            const { data } = res;
            this.props.setSportCentersAction(data);
            this.props.setOptionsGetSportCenters(optionsGet);
        })
        // if (this.props.route.params.orderId) {
        //     this.props.navigation.navigate('BookedDetail', { orderId: this.props.route.params.orderId });
        // }
        if (Platform.OS === 'android') {
            const url = await Linking.getInitialURL();
            this.navigate(url);
        } else {
            Linking.addEventListener('url', this.handleOpenURL);
        }
    }

    initOptionsQuery() {
        const opts = {};
        opts.time = new Date().getTime();
        opts.sport = 'SOCCER';
        opts.limit = 5;
        opts.page = 1;
        return opts;
    }

    componentWillUnmount() {
        Linking.removeEventListener('url', this.handleOpenURL);
    }
    handleOpenURL = (event) => {
        this.navigate(event.url);
    }

    navigate = (url) => {
        console.log('home_____', url);
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
        SportCenterService.getSportCenters(tempOptions)
            .then(res => {
                this.setState({
                    isLoading: false
                })
                this.props.addSportCenters(res.data || []);
            })
            .catch(err => this.setState({ isLoading: false }));
    }

    footerLoadMore() {
        return (
            this.state.isLoading ? <View style={styles.loadMore}>
                <ActivityIndicator size="small" color="#55a66d" />
            </View> : null
        )
    }

    renderItem({ item }) {
        return (
            <TouchableWithoutFeedback
                onPress={() => this.props.navigation.navigate('SportCenter', { id: item.id })}
            >
                <Card
                    containerStyle={styles.card}
                    title={item.name}
                    image={item.avatar ? { uri: ApiConstants.URL_API + '/image/' + item.avatar } : Images.DefaultImage}
                    imageProps={{ PlaceholderContent: <ActivityIndicator size={50} color="#55a66d" /> }}
                >
                    {item.distance ? <Text style={{ marginBottom: 10 }}>Khoảng cách: {NumberUtil.convertDistance(item.distance)} km</Text> : null}
                    <Text style={{ marginBottom: 10 }}>
                        {`Địa chỉ: ${item.address ? item.address + ", " : ''}${item.commune}, ${item.district}, ${item.city}`}
                    </Text>
                </Card>
            </TouchableWithoutFeedback>
        )
    }

    updateIndex(selectedIndex) {
        this.setState({ reload: true });
        this.setState({ selectedIndex });
        const opts = {};
        opts.time = new Date().getTime();
        opts.sport = this.state.sports.find(sport => +ComponentConstants.SportEnum[sport.code] == +selectedIndex).code;
        opts.limit = 5;
        opts.page = 1;
        const opts_merge = Object.assign({}, this.props.optionsGetSportCenters, opts)
        SportCenterService.getSportCenters(opts_merge).then(res => {
            this.setState({ reload: false });
            this.props.setSportCentersAction(res.data);
            this.props.setOptionsGetSportCenters(opts_merge);
        })
    }

    initSportButton() {
        return this.state.sports
            .sort((a, b) => ComponentConstants.SportEnum[a.code] - ComponentConstants.SportEnum[b.code])
            .map(sport => {
                const component = () => (
                    <View style={{ justifyContent: 'center' }}>
                        <Icon type="material-community" name={ComponentConstants.IconSports[sport.code]} />
                        <Text>{ComponentConstants.SportConvertName[sport.code]}</Text>
                    </View>
                )
                return { element: component }
            })
    }

    render() {
        const buttons = this.initSportButton();
        const { selectedIndex } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <ButtonGroup
                    onPress={this.updateIndex.bind(this)}
                    selectedIndex={selectedIndex}
                    buttons={buttons}
                    containerStyle={{ height: 60 }}
                    selectedButtonStyle={{ backgroundColor: '#dbffe9', borderBottomColor: '#32995b', borderBottomWidth: 5 }}
                />
                {
                    !this.state.reload ? <View style={styles.container}>
                        <View style={styles.listItems}>
                            <FlatList
                                onEndReached={() => this.loadMore()}
                                onEndReachedThreshold={1}
                                data={this.props.sportCenters}
                                ListFooterComponent={() => this.footerLoadMore()}
                                renderItem={this.renderItem.bind(this)}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                    </View> : <ActivityIndicator size={50} color="#55a66d" style={{ marginTop: 30, justifyContent: 'center' }} />
                }
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
        flex: 8,
        backgroundColor: 'white'
    },
    loadMore: {
        marginTop: 10,
        alignSelf: 'center'
    },
    card: {
        shadowOffset: {
            width: 30,
            height: 30
        },
        shadowColor: 'black',
        shadowOpacity: 1,
        shadowRadius: 10,
        borderRadius: 10,
        elevation: 10
    }
});

const mapStateToProps = state => ({
    sportCenters: state.sportReducer.sportCenters,
    optionsGetSportCenters: state.componentReducer.optionsGetSportCenters
});

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        setSportCentersAction: SportAction.setSportCentersAction,
        setOptionsGetSportCenters: ComponentAction.setOptionsGetSportCenters,
        addSportCenters: SportAction.addSportCenters
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MyHomeScreen);