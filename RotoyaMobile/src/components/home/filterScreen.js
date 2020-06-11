// import React from 'react'
// import { Field, reduxForm } from 'redux-form';
// import {
//     View,
//     StyleSheet,
//     SafeAreaView,
//     Keyboard,
//     TouchableWithoutFeedback,
//     ScrollView,
//     PermissionsAndroid
// } from 'react-native';
// import { Block, Checkbox } from "galio-framework";
// import { Button, Text } from 'galio-framework';
// import { Slider, Select, Switch } from '../common/Form';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
// import Geolocation from 'react-native-geolocation-service';
// import { SportCenterService } from '../../service';
// import { ComponentAction, SportAction } from '../../redux/action';
// import { DateUtil } from '../../helper/util';

// const checkBoxField = ({ input: { onChange, value }, label, color }) => (
//     <View>
//         <Checkbox
//             color={color || "primary"}
//             label={label}
//             onChange={checked => onChange(checked)}
//             initialValue={value ? true : false}
//         />
//     </View>
// )

// class filterForm extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             disabledFilterByPosition: false,
//             showFilter: true,
//             dataSelectDay: this.getDataSelectDay(),
//             sportListName: []
//         }
//     }

//     componentDidMount() {
//     }

//     UNSAFE_componentWillMount() {
//         const {
//             isTimeSlostBlank,
//             isByLocation,
//             distance,
//             time
//         } = this.props.optionsGetSportCenters;
//         this.props.initialize({
//             findByDay: this.state.dataSelectDay[0],
//             isTimeSlostBlank,
//             isFilterByPosition: isByLocation,
//             distance,
//             findByDay: DateUtil.getDateDDMM(time)
//         });
//         if (isByLocation) this.setState({ disabledFilterByPosition: true });
//     }

//     disabledFilterByPosition(disabled) {
//         this.setState({
//             disabledFilterByPosition: disabled
//         })
//     }

//     getDataSelectDay() {
//         const current = new Date();
//         let result = [];
//         for (let i = 0; i < 3; i++) {
//             result.push(DateUtil.getDateDDMM(current.getTime() + i * 1000 * 60 * 60 * 24));
//         }
//         return result;
//     }

//     async submitFilter(value, dispatch) {
//         const {
//             distance,
//             findByDay,
//             isFilterByPosition,
//             isTimeSlostBlank
//         } = value;
//         const opts = {};
//         if (isFilterByPosition) {
//             const granted = await PermissionsAndroid.request(
//                 PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
//             );
//             if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//                 console.warn('device not grant rights use location');
//                 return;
//             }
//             await new Promise(resolve => {
//                 Geolocation.getCurrentPosition(position => {
//                     console.log("current_position: ", position);
//                     opts.latitude = position.coords.latitude;
//                     opts.longitude = position.coords.longitude;
//                     resolve(position);
//                 })
//             });
//         }
//         opts.time = findByDay ?
//             new Date(DateUtil.convertDateDDMMToMMDD(findByDay)).getTime() :
//             new Date().getTime();
//         opts.isTimeSlotBlank = isTimeSlostBlank;
//         opts.isByLocation = isFilterByPosition;
//         if (distance) opts.distance = distance;
//         opts.limit = 5;
//         opts.page = 1;
//         opts.sport = this.props.optionsGetSportCenters.sport;
//         console.log(opts, '-----');
//         SportCenterService.getSportCenters(opts).then(res => {
//             dispatch(SportAction.setSportCentersAction(res.data));
//             dispatch(ComponentAction.setOptionsGetSportCenters(opts));
//             this.props.navigation.navigate('Home');
//         })
//     }

//     render() {
//         const { handleSubmit } = this.props;
//         return (
//             <Block flex middle>
//                 <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
//                     <Block flex>
//                         {/* <Block style={styles.iconX}>
//                             <Icon type="foundation" name="x" size={24} />
//                         </Block> */}
//                         <SafeAreaView>
//                             <Block flex style={styles.container}>
//                                 {/* <View style={{ alignItems: 'center' }}>
//                                     <Text h3 >Search filter</Text>
//                                 </View> */}
//                                 <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
//                                     <View style={{ marginTop: 50, flex: 1 }}>
//                                         <Field
//                                             name="isTimeSlostBlank"
//                                             label="Find by time slot blank"
//                                             component={Switch}
//                                             color="info"
//                                         // initialValue={}
//                                         />
//                                     </View>
//                                     <View style={{ marginTop: 50, flex: 1 }}>
//                                         <Field
//                                             name="findByDay"
//                                             label="Select day find"
//                                             component={Select}
//                                             options={this.getDataSelectDay()}
//                                             width={200}
//                                         // initialValue={}
//                                         />
//                                     </View>
//                                     <View style={{ marginTop: 50, flex: 1 }}>
//                                         <Field
//                                             name="isFilterByPosition"
//                                             label="Filter By Position"
//                                             component={checkBoxField}
//                                             onChange={() => this.disabledFilterByPosition(!this.state.disabledFilterByPosition)}
//                                         />
//                                     </View>
//                                     <View style={{ marginTop: 50, flex: 1 }}>
//                                         <Field
//                                             name="distance"
//                                             label="Distance"
//                                             component={Slider}
//                                             maximumValue={20}
//                                             unit="Km"
//                                             disabled={this.state.disabledFilterByPosition}
//                                         />
//                                     </View>
//                                 </ScrollView>

//                                 <Block flex={0.1} style={{ alignSelf: 'center' }}>
//                                     <Block>
//                                         <Button
//                                             size="small"
//                                             color="error"
//                                             round
//                                             onPress={handleSubmit(this.submitFilter.bind(this))}
//                                         >
//                                             Submit
//                                         </Button>
//                                     </Block>
//                                 </Block>
//                             </Block>
//                         </SafeAreaView>
//                     </Block>
//                 </TouchableWithoutFeedback>
//             </Block>
//         )
//     }
// }

// const styles = StyleSheet.create({
//     createButton: (width) => ({
//         width: width * 0.3
//     }),
//     button: {
//         alignSelf: 'stretch',
//         margin: 10,
//     },
//     container: {
//         marginBottom: 40,
//         marginTop: -10
//     },
//     iconX: {
//         alignSelf: 'flex-end',
//         marginRight: -20,
//         marginTop: 10
//     }
// });

// const filterScreen = reduxForm({
//     form: 'homeFilterForm'
// })(filterForm)

// const mapStateToProps = state => ({
//     optionsGetSportCenters: state.componentReducer.optionsGetSportCenters
// });

// const mapDispatchToProps = (dispatch) => {
//     return bindActionCreators({}, dispatch);
// }

// export default connect(mapStateToProps, mapDispatchToProps)(filterScreen);
import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    TouchableWithoutFeedback,
    ActivityIndicator,
    PermissionsAndroid
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Card } from 'react-native-elements';
import Geolocation from 'react-native-geolocation-service';
import { SportCenterService } from '../../service';
import { ComponentAction, SportAction } from '../../redux/action';
import { ApiConstants, Images } from '../../constants';
import { NumberUtil } from '../../helper/util';

export default filterScreen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [reload, setReload] = useState(false);
    const nameSearch = useSelector(state => state.componentReducer.name);
    const sportCenters = useSelector(state => state.sportReducer.sportCenters);
    const optionsGetSportCenters = useSelector(state => state.componentReducer.optionsGetSportCenters);
    const dispatch = useDispatch();

    useEffect(() => {
        handlerUseEffect(nameSearch);
    }, [nameSearch]);

    const handlerUseEffect = async nameSearch => {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted == PermissionsAndroid.RESULTS.GRANTED) {
            const optionsGet = { limit: 5, page: 1 };
            await new Promise(resolve => {
                Geolocation.getCurrentPosition(position => {
                    optionsGet.latitude = position.coords.latitude;
                    optionsGet.longitude = position.coords.longitude;
                    optionsGet.isByLocation = true;
                    optionsGet.name = nameSearch || '';
                    optionsGet.distance = 5000;
                    resolve(position);
                }, (error) => {
                    console.log(error.code, error.message);
                }, { enableHighAccuracy: true, timeout: 15000 })
            });
            setReload(true);
            SportCenterService.getSportCenters(optionsGet).then(res => {
                setReload(false);
                const { data } = res;
                dispatch(SportAction.setSportCentersAction(data));
                dispatch(ComponentAction.setOptionsGetSportCenters(optionsGet));
            })
        }
    }

    const loadMore = () => {
        const { limit, page } = optionsGetSportCenters;
        if (sportCenters.length < limit) return;
        if (sportCenters.length < limit * page) return;
        setIsLoading(true);
        const tempOptions = { ...optionsGetSportCenters };
        tempOptions.page = tempOptions.page + 1;
        dispatch(ComponentAction.setOptionsGetSportCenters(tempOptions));
        SportCenterService.getSportCenters(tempOptions)
            .then(res => {
                setIsLoading(false);
                dispatch(SportAction.addSportCenters(res.data || []));
            })
            .catch(err => setIsLoading(false));
    }

    const footerLoadMore = () => (
        isLoading ? <View style={styles.loadMore}>
            <ActivityIndicator size="small" color="#55a66d" />
        </View> : null
    );


    const renderItem = ({ item }) => (
        <TouchableWithoutFeedback
            onPress={() => navigation.navigate('SportCenter', { id: item.id })}
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
    );

    const Empty = () => (
        <View style={{ alignSelf: 'center', margin: 20 }}>
            <Text style={{ fontSize: 14 }}>Không có sân phù hợp với dữ liệu tìm kiếm !</Text>
        </View>
    )

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            {
                !reload ? (
                    sportCenters && sportCenters.length ? <View style={styles.container}>
                        <View style={styles.listItems}>
                            <FlatList
                                onEndReached={() => loadMore()}
                                onEndReachedThreshold={1}
                                data={sportCenters}
                                ListFooterComponent={() => footerLoadMore()}
                                renderItem={renderItem.bind(this)}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                    </View> : <Empty />
                ) : <ActivityIndicator size={50} color="#55a66d" style={{ marginTop: 30, justifyContent: 'center' }} />
            }
        </View>
    );
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