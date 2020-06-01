import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    TouchableWithoutFeedback,
    ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card } from 'react-native-elements';
import { SportCenterService } from '../../service';
import { ApiConstants } from '../../constants';

class FavoritesScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            sportCenters: []
        }
    }

    async componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            SportCenterService.getSportCenterFavorites().then(res => {
                const { data } = res;
                this.setState({ sportCenters: data })
            })
        })
    }

    async loadMore() {
        // const { limit, page } = this.props.optionsGetSportCenters;
        // if (this.props.sportCenters.length < limit) return;
        // if (this.props.sportCenters.length < limit * page) return;
        // this.setState({
        //     isLoading: true
        // })
        // const tempOptions = { ...this.props.optionsGetSportCenters };
        // tempOptions.page = tempOptions.page + 1;
        // this.props.setOptionsGetSportCenters(tempOptions);
        // SportCenterService.getSportCenters(tempOptions)
        //     .then(res => {
        //         this.setState({
        //             isLoading: false
        //         })
        //         this.props.addSportCenters(res.data || []);
        //     })
        //     .catch(err => this.setState({ isLoading: false }));
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
                    image={{ uri: ApiConstants.URL_API + '/image/' + item.avatar }}
                    imageProps={{ PlaceholderContent: <ActivityIndicator size={50} color="#55a66d" /> }}
                >
                    <Text style={{ marginBottom: 10 }}>
                        {`Địa chỉ: ${item.address ? item.address + ", " : ''}${item.commune}, ${item.district}, ${item.city}`}
                    </Text>
                </Card>
            </TouchableWithoutFeedback>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.listItems}>
                    <FlatList
                        onEndReached={() => this.loadMore()}
                        onEndReachedThreshold={1}
                        data={this.state.sportCenters}
                        ListFooterComponent={() => this.footerLoadMore()}
                        renderItem={this.renderItem.bind(this)}
                        keyExtractor={(item, index) => index.toString()}
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

});

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FavoritesScreen);