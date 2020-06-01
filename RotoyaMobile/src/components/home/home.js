// import React from 'react';
// import {
//     View,
//     StyleSheet,
//     Text,
//     FlatList,
//     TouchableWithoutFeedback,
//     ActivityIndicator,
//     Platform,
//     Linking,
//     PermissionsAndroid
// } from 'react-native';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
// import { Card, ButtonGroup, Icon } from 'react-native-elements';
// import Geolocation from 'react-native-geolocation-service';
// import { SportCenterService, SportService } from '../../service';
// import { ComponentAction, SportAction } from '../../redux/action';
// import { ApiConstants, ComponentConstants, Images } from '../../constants';
// import { NumberUtil } from '../../helper/util';

// class MyHomeScreen extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             isLoading: false,
//             selectedIndex: 0,
//             sports: [],
//             reload: false
//         }
//         this.updateIndex = this.updateIndex.bind(this);
//     }

//     async componentDidMount() {
//         const optionsGet = this.initOptionsQuery();
//         const res_sport = await SportService.getSports();
//         this.setState({ sports: res_sport.data });
//         const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
//         );
//         if (granted == PermissionsAndroid.RESULTS.GRANTED) {
//             await new Promise(resolve => {
//                 Geolocation.getCurrentPosition(position => {
//                     optionsGet.latitude = position.coords.latitude;
//                     optionsGet.longitude = position.coords.longitude;
//                     optionsGet.isByLocation = true;
//                     optionsGet.distance = 10;
//                     console.log(optionsGet, '___+++______');
//                     resolve(position);
//                 }, (error) => {
//                     // See error code charts below.
//                     console.log(error.code, error.message);
//                 }, { enableHighAccuracy: true, timeout: 15000 })
//             });
//         }
//         this.setState({ reload: true });
//         // console.log(optionsGet, '______');
//         SportCenterService.getSportCenters(optionsGet).then(res => {
//             this.setState({ reload: false });
//             const { data } = res;
//             this.props.setSportCentersAction(data);
//             this.props.setOptionsGetSportCenters(optionsGet);
//         })
//         // if (this.props.route.params.orderId) {
//         //     this.props.navigation.navigate('BookedDetail', { orderId: this.props.route.params.orderId });
//         // }
//         if (Platform.OS === 'android') {
//             const url = await Linking.getInitialURL();
//             this.navigate(url);
//         } else {
//             Linking.addEventListener('url', this.handleOpenURL);
//         }
//     }

//     initOptionsQuery() {
//         const opts = {};
//         opts.time = new Date().getTime();
//         opts.sport = 'SOCCER';
//         opts.limit = 5;
//         opts.page = 1;
//         return opts;
//     }

//     componentWillUnmount() {
//         Linking.removeEventListener('url', this.handleOpenURL);
//     }
//     handleOpenURL = (event) => {
//         this.navigate(event.url);
//     }

//     navigate = (url) => {
//         console.log('home_____', url);
//     }

//     async loadMore() {
//         const { limit, page } = this.props.optionsGetSportCenters;
//         if (this.props.sportCenters.length < limit) return;
//         if (this.props.sportCenters.length < limit * page) return;
//         this.setState({
//             isLoading: true
//         })
//         const tempOptions = { ...this.props.optionsGetSportCenters };
//         tempOptions.page = tempOptions.page + 1;
//         this.props.setOptionsGetSportCenters(tempOptions);
//         SportCenterService.getSportCenters(tempOptions)
//             .then(res => {
//                 this.setState({
//                     isLoading: false
//                 })
//                 this.props.addSportCenters(res.data || []);
//             })
//             .catch(err => this.setState({ isLoading: false }));
//     }

//     footerLoadMore() {
//         return (
//             this.state.isLoading ? <View style={styles.loadMore}>
//                 <ActivityIndicator size="small" color="#55a66d" />
//             </View> : null
//         )
//     }

//     renderItem({ item }) {
//         return (
//             <TouchableWithoutFeedback
//                 onPress={() => this.props.navigation.navigate('SportCenter', { id: item.id })}
//             >
//                 <Card
//                     containerStyle={styles.card}
//                     title={item.name}
//                     image={item.avatar ? { uri: ApiConstants.URL_API + '/image/' + item.avatar } : Images.DefaultImage}
//                     imageProps={{ PlaceholderContent: <ActivityIndicator size={50} color="#55a66d" /> }}
//                 >
//                     {item.distance ? <Text style={{ marginBottom: 10 }}>Khoảng cách: {NumberUtil.convertDistance(item.distance)} km</Text> : null}
//                     <Text style={{ marginBottom: 10 }}>
//                         {`Địa chỉ: ${item.address ? item.address + ", " : ''}${item.commune}, ${item.district}, ${item.city}`}
//                     </Text>
//                 </Card>
//             </TouchableWithoutFeedback>
//         )
//     }

//     updateIndex(selectedIndex) {
//         this.setState({ reload: true });
//         this.setState({ selectedIndex });
//         const opts = {};
//         opts.time = new Date().getTime();
//         opts.sport = this.state.sports.find(sport => +ComponentConstants.SportEnum[sport.code] == +selectedIndex).code;
//         opts.limit = 5;
//         opts.page = 1;
//         const opts_merge = Object.assign({}, this.props.optionsGetSportCenters, opts)
//         SportCenterService.getSportCenters(opts_merge).then(res => {
//             this.setState({ reload: false });
//             this.props.setSportCentersAction(res.data);
//             this.props.setOptionsGetSportCenters(opts_merge);
//         })
//     }

//     initSportButton() {
//         return this.state.sports
//             .sort((a, b) => ComponentConstants.SportEnum[a.code] - ComponentConstants.SportEnum[b.code])
//             .map(sport => {
//                 const component = () => (
//                     <View style={{ justifyContent: 'center' }}>
//                         <Icon type="material-community" name={ComponentConstants.IconSports[sport.code]} />
//                         <Text>{ComponentConstants.SportConvertName[sport.code]}</Text>
//                     </View>
//                 )
//                 return { element: component }
//             })
//     }

//     render() {
//         const buttons = this.initSportButton();
//         const { selectedIndex } = this.state;
//         return (
//             <View style={{ flex: 1, backgroundColor: 'white' }}>
//                 <ButtonGroup
//                     onPress={this.updateIndex.bind(this)}
//                     selectedIndex={selectedIndex}
//                     buttons={buttons}
//                     containerStyle={{ height: 60 }}
//                     selectedButtonStyle={{ backgroundColor: '#dbffe9', borderBottomColor: '#32995b', borderBottomWidth: 5 }}
//                 />
//                 {
//                     !this.state.reload ? <View style={styles.container}>
//                         <View style={styles.listItems}>
//                             <FlatList
//                                 onEndReached={() => this.loadMore()}
//                                 onEndReachedThreshold={1}
//                                 data={this.props.sportCenters}
//                                 ListFooterComponent={() => this.footerLoadMore()}
//                                 renderItem={this.renderItem.bind(this)}
//                                 keyExtractor={(item, index) => index.toString()}
//                             />
//                         </View>
//                     </View> : <ActivityIndicator size={50} color="#55a66d" style={{ marginTop: 30, justifyContent: 'center' }} />
//                 }
//             </View>
//         );
//     }
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         flexDirection: 'column'
//     },
//     listIcon: {
//         flex: 1,
//         justifyContent: 'space-around',
//         flexDirection: 'row'
//     },
//     drivider: {
//         backgroundColor: 'red'
//     },
//     listItems: {
//         flex: 8,
//         backgroundColor: 'white'
//     },
//     loadMore: {
//         marginTop: 10,
//         alignSelf: 'center'
//     },
//     card: {
//         shadowOffset: {
//             width: 30,
//             height: 30
//         },
//         shadowColor: 'black',
//         shadowOpacity: 1,
//         shadowRadius: 10,
//         borderRadius: 10,
//         elevation: 10
//     }
// });

// const mapStateToProps = state => ({
//     sportCenters: state.sportReducer.sportCenters,
//     optionsGetSportCenters: state.componentReducer.optionsGetSportCenters
// });

// const mapDispatchToProps = (dispatch) => {
//     return bindActionCreators({
//         setSportCentersAction: SportAction.setSportCentersAction,
//         setOptionsGetSportCenters: ComponentAction.setOptionsGetSportCenters,
//         addSportCenters: SportAction.addSportCenters
//     }, dispatch);
// }

// export default connect(mapStateToProps, mapDispatchToProps)(MyHomeScreen);
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
    TouchableOpacity
} from 'react-native';
import { Icon } from 'react-native-elements';
import Geolocation from 'react-native-geolocation-service';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SportCenterService, SportService } from '../../service';
import { ComponentAction, SportAction } from '../../redux/action';
import { ApiConstants, ComponentConstants, Images } from '../../constants';
import { NumberUtil } from '../../helper/util';

// const Images = [
//     { uri: "https://i.imgur.com/sNam9iJ.jpg" },
//     { uri: "https://i.imgur.com/N7rlQYt.jpg" },
//     { uri: "https://i.imgur.com/UDrH0wm.jpg" },
//     { uri: "https://i.imgur.com/Ka8kNST.jpg" }
// ]
const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT + 20;
class MyHomeScreen extends React.Component {
    index = 0;
    animation = new Animated.Value(0);
    interpolations = [];
    constructor(props) {
        super(props);
        this.state = {
            // markers: [
            //     {
            //         coordinate: {
            //             latitude: 45.524548,
            //             longitude: -122.6749817,
            //         },
            //         title: "Best Place",
            //         description: "This is the best place in Portland",
            //         image: Images[0],
            //     },
            //     {
            //         coordinate: {
            //             latitude: 45.524698,
            //             longitude: -122.6655507,
            //         },
            //         title: "Second Best Place",
            //         description: "This is the second best place in Portland",
            //         image: Images[1],
            //     },
            //     {
            //         coordinate: {
            //             latitude: 45.5230786,
            //             longitude: -122.6701034,
            //         },
            //         title: "Third Best Place",
            //         description: "This is the third best place in Portland",
            //         image: Images[2],
            //     },
            //     {
            //         coordinate: {
            //             latitude: 45.521016,
            //             longitude: -122.6561917,
            //         },
            //         title: "Fourth Best Place",
            //         description: "This is the fourth best place in Portland",
            //         image: Images[3],
            //     },
            // ],
            region: {
                latitude: 21.037681,
                longitude: 105.781559,
                latitudeDelta: 0.02864195044303443,
                longitudeDelta: 0.020142817690068,
            }
        };
    }

    initOptionsQuery() {
        const opts = {};
        opts.time = new Date().getTime();
        opts.sport = 'SOCCER';
        opts.distance = 5;
        opts.isByLocation = true;
        return opts;
    }

    componentWillMount() {
        // this.interpolations = this.state.markers.map((marker, index) => {
        //     const inputRange = [
        //         (index - 1) * CARD_WIDTH,
        //         index * CARD_WIDTH,
        //         ((index + 1) * CARD_WIDTH),
        //     ];
        //     const scale = this.animation.interpolate({
        //         inputRange,
        //         outputRange: [1, 2.5, 1],
        //         extrapolate: "clamp",
        //     });
        //     const opacity = this.animation.interpolate({
        //         inputRange,
        //         outputRange: [0.35, 1, 0.35],
        //         extrapolate: "clamp",
        //     });
        //     return { scale, opacity };
        // });
        this.index = 0;
        this.animation = new Animated.Value(0);
    }
    async componentDidMount() {
        // We should detect when scrolling has stopped then animate
        // We should just debounce the event listener here

        const granted = await this.requirePermissionAndroid();
        if (granted == PermissionsAndroid.RESULTS.GRANTED) {
            const position = await this.requireCurrentLocation();
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

    render() {
        return (
            <View style={styles.container}>
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
                                        <Icon type="material-community" name="soccer" size={30} />
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