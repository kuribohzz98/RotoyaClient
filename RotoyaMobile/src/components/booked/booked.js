import React from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Text,
    TouchableOpacity,
    Platform,
    Linking
} from 'react-native';
import { PaymentService } from '../../service';
import { NotificationUtil, DateUtil, TimeUtil, NumberUtil } from '../../helper/util';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Booked extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            limit: 5,
            payments: [],
            isLoading: false
        }
    }

    async componentDidMount() {
        const res = await PaymentService.getPayments({
            userId: this.props.userId,
            page: this.state.page,
            limit: this.state.limit
        });
        if (res.status >= 400) {
            NotificationUtil.errorServer(res);
            return;
        }
        this.setState({ payments: res.data });
        if (Platform.OS === 'android') {
            const url = await Linking.getInitialURL();
            this.navigate(url);
        } else {
            Linking.addEventListener('url', this.handleOpenURL);
        }
    }

    componentWillUnmount() {
        Linking.removeEventListener('url', this.handleOpenURL);
    }

    handleOpenURL = (event) => {
        this.navigate(event.url);
    }

    navigate = (url) => {
        console.log('zzz______', url);
    }

    async loadMore() {
        const { payments, limit, page } = this.state;
        if (payments.length < limit * page) return;
        this.setState({ isLoading: true });
        const res = await PaymentService.getPayments({
            userId: this.props.userId,
            page: page + 1,
            limit
        });
        this.setState({ isLoading: false });
        if (res.status >= 400) {
            NotificationUtil.errorServer(res);
            return;
        }
        this.setState({
            page: page + 1,
            payments: [...payments, ...res.data]
        });
    }

    footerLoadMore() {
        return (
            this.state.isLoading ? <View style={styles.loadMore}>
                <ActivityIndicator size="small" color="#55a66d" />
            </View> : null
        )
    }

    redirectDetail(orderId) {
        this.props.navigation.navigate('BookedDetail', {
            orderId,
            isBack: true
        });
    }

    renderItem({ item, index }) {
        return (
            <TouchableOpacity onPress={this.redirectDetail.bind(this, item.orderId)}>
                <View style={styles.cardContainer}>
                    <View style={styles.cardRowContainer}>
                        <Text style={styles.cardTitle}>Mã đơn:</Text>
                        <Text style={styles.cardContent}>{item.orderId}</Text>
                    </View>
                    <View style={styles.cardRowContainer}>
                        <Text style={styles.cardTitle}>Trung tâm thể thao:</Text>
                        <Text style={styles.cardContent}>{item.sportCenter.name}</Text>
                    </View>
                    <View style={styles.cardRowContainer}>
                        <Text style={styles.cardTitle}>Ngày đặt:</Text>
                        <Text style={styles.cardContent}>{DateUtil.getDateDDMM(item.createdAt)} / {TimeUtil.getTime(item.createdAt)}</Text>
                    </View>
                    <View style={styles.cardRowContainer}>
                        <Text style={styles.cardTitle}>Giá:</Text>
                        <Text style={styles.cardContent}>{NumberUtil.convertNumberToCurrency(item.amount)} đ</Text>
                    </View>
                    <View style={styles.cardRowContainer}>
                        <Text style={styles.cardTitle}>Trạng thái:</Text>
                        <Text style={ styles.cardContentGreen}>
                            {/* {item.transactionId ? 'paid' : 'used'} */}
                            Đã thanh toán
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    onEndReached={() => this.loadMore()}
                    ListFooterComponent={() => this.footerLoadMore()}
                    onEndReachedThreshold={1}
                    data={this.state.payments}
                    renderItem={this.renderItem.bind(this)}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white'
    },
    cardContainer: {
        marginBottom: 10,
        backgroundColor: "rgba(255,255,255,1)",
        borderRadius: 10,
        shadowOffset: {
            height: 30,
            width: 30
        },
        shadowColor: "black",
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
        margin: 15,
        padding: 10
    },
    cardTitle: {
        backgroundColor: "transparent",
        color: "rgba(204,204,204,1)",
        fontSize: 16,
        fontFamily: "poppins-600",
        letterSpacing: 0.3,
        textAlign: 'left',
        width: 110,
    },
    cardContent: {
        width: 230,
        // height: 50,
        backgroundColor: "transparent",
        color: "rgba(104,108,113,1)",
        fontSize: 16,
        fontFamily: "verdana-regular",
        letterSpacing: 0.3,
        textAlign: "left",
        // marginLeft: 21,
        // marginTop: 3
    },
    cardContentRed: {
        width: 230,
        backgroundColor: "transparent",
        color: "rgba(219, 59, 59,1)",
        fontSize: 16,
        fontFamily: "verdana-regular",
        letterSpacing: 0.3,
        textAlign: "left",
    },
    cardContentGreen: {
        width: 250,
        backgroundColor: "transparent",
        color: "rgba(66, 179, 78,1)",
        fontSize: 16,
        fontFamily: "verdana-regular",
        letterSpacing: 0.3,
        textAlign: "left",
    },
    cardRowContainer: {
        flexDirection: "row",
        marginBottom: 5
    },
    loadMore: {
        marginTop: 10,
        alignSelf: 'center'
    },
});

const mapStateToProps = state => ({
    userId: state.authReducer.userId
})

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Booked);