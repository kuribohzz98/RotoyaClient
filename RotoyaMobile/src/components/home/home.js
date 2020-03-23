import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    TouchableWithoutFeedback,
    ActivityIndicator,
    Linking
} from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card } from 'react-native-elements';
import { SportService } from '../../service';
import { ComponentAction, SportAction } from '../../redux/action';
import { ApiConstants } from '../../constants';

class MyHomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sports: [],
            isLoading: false,
            sportListName: [],
        }
    }

    async componentDidMount() {
        //network
        SportService.getSports().then(res => {
            this.setState({
                sports: res.data,
                sportListName: res.data.map(sport => sport.name)
            });
        })
        console.log(this.props.optionsGetSportCenters);
        SportService.getSportCenters(this.props.optionsGetSportCenters).then(res => {
            const { data } = res;
            this.props.setSportCentersAction(data);
        })
        Linking.getInitialURL().then((url) => {
            // console.log(url, '-=====');
            if (url) {
                console.log('Initial url is: ' + url);
            }
        }).catch(err => console.error('An error occurred', err));
        // Linking.addEventListener('url', event => console.log(event.url));

    }
    componentWillUnmount() {
        console.log('ahihi');
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
        SportService.getSportCenters(tempOptions)
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

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.listItems}>
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
                                    containerStyle={styles.card}
                                    title={item.name}
                                    image={{ uri: ApiConstants.URL_API + '/image/' + item.avatar }}
                                    imageProps={{ PlaceholderContent: <ActivityIndicator size={50} color="#55a66d" /> }}
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