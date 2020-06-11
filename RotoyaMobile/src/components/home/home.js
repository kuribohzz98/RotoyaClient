import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Animated,
    Image,
    Dimensions,
    PermissionsAndroid,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import { Icon, Overlay } from 'react-native-elements';
import Geolocation from 'react-native-geolocation-service';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SportCenterService, SportService } from '../../service';
import { ComponentAction, SportAction } from '../../redux/action';
import { ApiConstants, ComponentConstants, Images } from '../../constants';
import { NumberUtil } from '../../helper/util';
import { Header } from '../common';
import { Slider, Select } from '../common/Form';
import { Field, reduxForm } from 'redux-form';
import { Button } from 'galio-framework';

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT + 20;

class filterForm extends React.Component {
    UNSAFE_componentWillMount() {
        const {
            sportSelected,
            distance
        } = this.props;
        this.props.initialize({
            distance,
            sport: ComponentConstants.SportConvertName[sportSelected]
        });
    }
    getDataSelectedSport() {
        return (this.props.sports || []).map(sport => ComponentConstants.SportConvertName[sport]);
    }

    render() {
        const { handleSubmit, onSubmitFilter } = this.props;
        return (
            <View style={{ padding: 20, flex: 1, alignItems: 'center' }}>
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <View style={{ marginTop: 20, flex: 1 }}>
                        <Field
                            name="distance"
                            label="Distance"
                            component={Slider}
                            maximumValue={20}
                            unit="Km"
                            minimumValue={1}
                        />
                    </View>
                    <View style={{ marginTop: 50, flex: 1 }}>
                        <Field
                            name="sport"
                            label="Môn thể thao"
                            component={Select}
                            options={this.getDataSelectedSport()}
                            width={200}
                        />
                    </View>
                    <View style={{ marginTop: 50, flex: 1 }}>
                        <Button
                            color="primary"
                            shadowless
                            uppercase
                            size="small"
                            onPress={handleSubmit(onSubmitFilter.bind(this))}
                        >
                            Xác nhận
                        </Button>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const RenderFilter = reduxForm({
    form: 'homeFilterForm'
})(filterForm)
class MyHomeScreen extends React.Component {
    index = 0;
    animation = new Animated.Value(0);
    interpolations = [];
    watchId = null;
    constructor(props) {
        super(props);
        this.state = {
            region: {
                latitude: 21.037681,
                longitude: 105.781559,
                latitudeDelta: 0.02864195044303443,
                longitudeDelta: 0.020142817690068,
            },
            sports: [],
            sportSelected: 'SOCCER',
            distance: 5
        };
    }

    UNSAFE_componentWillMount() {
        this.props.navigation.setOptions({
            header: ({ navigation, scene }) => (
                <Header
                    title={ComponentConstants.SportConvertName[this.state.sportSelected]}
                    navigation={navigation}
                    scene={scene}
                //   search
                />
            )
        })
    }

    initOptionsQuery() {
        const opts = {};
        opts.time = new Date().getTime();
        opts.sport = this.state.sportSelected;
        opts.distance = this.state.distance;
        opts.isByLocation = true;
        return opts;
    }

    async componentDidMount() {
        SportService.getSports()
            .then(res => {
                const list_code = (res.data || []).map(data => data.code);
                this.setState({ sports: list_code })
            })
            .catch(err => console.log(err));
        this.getSportCenters();
        this.watchId = Geolocation.watchPosition(position => {
            this.getSportCenters(position);
        })
    }

    componentWillUnmount() {
        Geolocation.clearWatch(this.watchId)
    }

    async getSportCenters(positionParam) {
        const granted = await this.requirePermissionAndroid();
        if (granted == PermissionsAndroid.RESULTS.GRANTED) {
            const position = positionParam || await this.requireCurrentLocation();
            const optionsGet = this.initOptionsQuery();
            optionsGet.latitude = position.coords.latitude;
            optionsGet.longitude = position.coords.longitude;
            const res = await SportCenterService.getSportCenters(optionsGet);
            this.animation.addListener(({ value }) => {
                let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
                if (index >= res.data.length) {
                    index = res.data.length - 1;
                }
                if (index <= 0) {
                    index = 0;
                }
                clearTimeout(this.regionTimeout);
                this.regionTimeout = setTimeout(() => {
                    if (this.index !== index) {
                        this.index = index;
                        const { latitude, longitude } = res.data[index];
                        this.map.animateToRegion(
                            {
                                latitude,
                                longitude,
                                latitudeDelta: this.state.region.latitudeDelta,
                                longitudeDelta: this.state.region.longitudeDelta,
                            },
                            350
                        );
                    }
                }, 10);
            });
            this.interpolations = res.data.map((sportCenter, index) => {
                const inputRange = [
                    (index - 1) * CARD_WIDTH,
                    index * CARD_WIDTH,
                    ((index + 1) * CARD_WIDTH),
                ];
                const scale = this.animation.interpolate({
                    inputRange,
                    outputRange: [1, 2.5, 1],
                    extrapolate: "clamp",
                });
                const opacity = this.animation.interpolate({
                    inputRange,
                    outputRange: [0.35, 1, 0.35],
                    extrapolate: "clamp",
                });
                return { scale, opacity };
            });
            this.props.setSportCentersAction(res.data);
            this.props.setOptionsGetSportCenters(optionsGet);
        }
    }

    async requirePermissionAndroid() {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted != PermissionsAndroid.RESULTS.GRANTED) {
            return this.requirePermissionAndroid();
        }
        return granted;
    }

    async requireCurrentLocation() {
        const data = await new Promise(resolve => {
            Geolocation.getCurrentPosition(position => {
                // this.setState({ currentLat: position.coords.latitude, currentLon: position.coords.longitude, accuracy: position.coords.accuracy });
                this.map.animateToRegion(
                    {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: this.state.region.latitudeDelta,
                        longitudeDelta: this.state.region.longitudeDelta,
                    },
                    350
                );
                resolve(position);
            }, (error) => {
                console.log(error.code, error.message);
                resolve(null);
            }, { enableHighAccuracy: true, timeout: 15000 })
        });
        if (!data) return this.requireCurrentLocation();
        return data;
    }

    calloutPress(id) {
        this.props.navigation.navigate('SportCenter', { id });
    }

    async onSubmitFilter(values) {
        console.log(values);
        this.props.setIsVisibleFilter(false);
        const sport = this.state.sports.find(sport => ComponentConstants.SportConvertName[sport] == values.sport);
        this.setState({
            distance: values.distance,
            sportSelected: sport
        }, () => this.getSportCenters());
    }

    render() {
        return (
            <View style={styles.container}>
                <Overlay
                    isVisible={this.props.isVisible || false}
                    onBackdropPress={() => this.props.isVisible && this.props.setIsVisibleFilter(false)}
                    overlayStyle={{ height: height / 2, width: width / 1.5 }}
                >
                    <RenderFilter
                        sports={this.state.sports}
                        sportSelected={this.state.sportSelected}
                        distance={this.state.distance}
                        onSubmitFilter={this.onSubmitFilter.bind(this)}
                    />
                </Overlay>
                <MapView
                    ref={map => this.map = map}
                    initialRegion={this.state.region}
                    style={styles.container}
                    showsUserLocation
                    followsUserLocation
                    showsMyLocationButton
                    provider={PROVIDER_GOOGLE}
                    showsBuildings
                    loadingEnabled
                >
                    {(this.props.sportCenters || []).map((sportCenter, index) => {
                        const opacityStyle = {
                            opacity: this.interpolations[index] ? this.interpolations[index].opacity : 1,
                        };
                        return (
                            <Marker
                                key={index}
                                coordinate={{ latitude: sportCenter.latitude, longitude: sportCenter.longitude }}
                                onCalloutPress={this.calloutPress.bind(this, sportCenter.id)}
                            >
                                <View style={{ flex: 1 }}>
                                    <Animated.View style={[styles.markerWrap, opacityStyle]}>
                                        <Icon type="material-community" name={ComponentConstants.IconSports[this.state.sportSelected]} size={30} />
                                    </Animated.View>
                                    <Callout style={styles.callout}>
                                        {/* <Image
                                            source={sportCenter.avatar ? { uri: ApiConstants.URL_API + '/image/' + sportCenter.avatar } : Images.DefaultImage}
                                            style={styles.cardImage}
                                            resizeMode="cover"
                                        /> */}
                                        <View style={styles.textContent}>
                                            <Text numberOfLines={1} style={styles.cardtitle}>{sportCenter.name}</Text>
                                            {sportCenter.distance ? <Text style={{ marginBottom: 10 }}>Khoảng cách: {NumberUtil.convertDistance(sportCenter.distance)} km</Text> : null}
                                            <Text numberOfLines={1} style={styles.cardDescription}>
                                                {`Địa chỉ: ${sportCenter.address ? sportCenter.address + ", " : ''}${sportCenter.commune}, ${sportCenter.district}, ${sportCenter.city}`}
                                            </Text>
                                        </View>
                                    </Callout>
                                </View>
                            </Marker>
                        );
                    })}
                </MapView>
                <Animated.ScrollView
                    horizontal
                    scrollEventThrottle={1}
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={CARD_WIDTH}
                    onScroll={Animated.event(
                        [
                            {
                                nativeEvent: {
                                    contentOffset: {
                                        x: this.animation,
                                    },
                                },
                            },
                        ],
                        { useNativeDriver: true }
                    )}
                    style={styles.scrollView}
                    contentContainerStyle={styles.endPadding}
                >
                    {(this.props.sportCenters || []).map((sportCenter, index) => (
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={this.calloutPress.bind(this, sportCenter.id)}
                        >
                            <View style={styles.card} key={index}>
                                <Image
                                    source={sportCenter.avatar ? { uri: ApiConstants.URL_API + '/image/' + sportCenter.avatar } : Images.DefaultImage}
                                    style={styles.cardImage}
                                    resizeMode="cover"
                                />
                                <View style={styles.textContent}>
                                    <Text numberOfLines={1} style={styles.cardtitle}>{sportCenter.name}</Text>
                                    {sportCenter.distance ? <Text style={{ marginBottom: 10 }}>Khoảng cách: {NumberUtil.convertDistance(sportCenter.distance)} km</Text> : null}
                                    <Text numberOfLines={1} style={styles.cardDescription}>
                                        {`Địa chỉ: ${sportCenter.address ? sportCenter.address + ", " : ''}${sportCenter.commune}, ${sportCenter.district}, ${sportCenter.city}`}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </Animated.ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        position: "absolute",
        bottom: 30,
        left: 0,
        right: 0,
        paddingVertical: 10,
    },
    endPadding: {
        paddingRight: width - CARD_WIDTH,
    },
    card: {
        backgroundColor: "#FFF",
        marginHorizontal: 10,
        height: CARD_HEIGHT,
        width: CARD_WIDTH,
        overflow: "hidden",
        borderRadius: 10,
        flex: 1
    },
    cardImage: {
        flex: 3,
        width: "100%",
        height: "100%",
        alignSelf: "center",
    },
    textContent: {
        flex: 1,
        margin: 10
    },
    cardtitle: {
        fontSize: 12,
        marginTop: 5,
        fontWeight: "bold",
    },
    cardDescription: {
        fontSize: 12,
        color: "#444",
    },
    markerWrap: {
        alignItems: "center",
        justifyContent: "center"
    },
    callout: {
        backgroundColor: "#FFF",
        marginHorizontal: 10,
        height: CARD_HEIGHT / 3.5,
        width: CARD_WIDTH,
        overflow: "hidden",
        borderRadius: 10,
        flex: 1
    }
});

const mapStateToProps = state => ({
    sportCenters: state.sportReducer.sportCenters,
    optionsGetSportCenters: state.componentReducer.optionsGetSportCenters,
    isVisible: state.componentReducer.isVisibleFilter
});

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        setSportCentersAction: SportAction.setSportCentersAction,
        setOptionsGetSportCenters: ComponentAction.setOptionsGetSportCenters,
        addSportCenters: SportAction.addSportCenters,
        setIsVisibleFilter: ComponentAction.setIsVisibleFilter
    }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(MyHomeScreen);