import {
    View,
    Dimensions,
    ScrollView,
    ActivityIndicator,
    Animated,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Block, Text, Button } from "galio-framework";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setSportCentersAction } from '../../redux/action/sport.action';
import { Image, ListItem, Overlay, Icon, Divider, ButtonGroup } from 'react-native-elements';
import { Checkbox } from '../common/Form';
import { BookService, SportCenterService, SportCenterFavoriteService } from '../../service';
import { NotificationUtil, TimeUtil, DateUtil, NumberUtil } from '../../helper/util';
import { ComponentConstants, ApiConstants, Images } from '../../constants';

const { width, height } = Dimensions.get('window');

class SportCenterScreen extends React.Component {
    nativeEventSubscription = null;
    constructor(props) {
        super(props);
        this.state = {
            info: { sportGrounds: [] },
            isFavorite: null,
            idFavorite: null,
            isLoading: true,
            sportGroundSelecteds: []
        }
    }

    componentDidMount() {
        this.getSportCenter();
    }

    async getSportCenter() {
        const res = await SportCenterService.getSportCenter(this.props.sportCenter.id, new Date().getTime());
        if (!res.data) console.error('not found sportCenter');
        this.setState({ info: res.data, isLoading: false });
        const favorite = res.data.sportCenterFavorites.find(scFavorite => +scFavorite.userId == +this.props.user.userId);
        if (favorite) this.setState({ isFavorite: true, idFavorite: favorite.id });
        else this.setState({ isFavorite: false });
        let sportGroundSelectedsTemp = [];
        res.data.sportGrounds.map(sportGround => {
            sportGroundSelectedsTemp.push(false);
        });
        this.setState({
            sportGroundSelecteds: sportGroundSelectedsTemp
        });
    }

    selectGround(index) {
        if (this.state.sportGroundSelecteds[index]) return;
        let selectedGroundTemp = this.state.sportGroundSelecteds.map((data, i) => {
            if (i == index) return true;
            return false;
        })
        return this.setState({ sportGroundSelecteds: selectedGroundTemp });
    }

    async onSubmit() {
        const { sportGroundSelecteds, info } = this.state;
        const filter = sportGroundSelecteds.findIndex(data => data);
        if (filter == -1) {
            NotificationUtil.error("Đặt lỗi", "Bạn chưa chọn sân");
            return;
        }
        this.props.navigation.navigate('Booking', {
            sportGroundId: info.sportGrounds[filter].id
        })

    }

    openPosition() {
        this.props.navigation.navigate('Position', {
            latitude: this.props.sportCenter.latitude,
            longitude: this.props.sportCenter.longitude,
            name: this.props.sportCenter.name,
            avatar: this.props.sportCenter.avatar
        })
    }

    async changeFavorite() {
        if (this.state.isFavorite) {
            await SportCenterFavoriteService.deleteFavorite(this.state.idFavorite);
            this.setState({ isFavorite: false, idFavorite: null });
            NotificationUtil.success('Xóa khỏi danh sách yêu thích thành công');
            return;
        }
        this.setState({ isFavorite: true });
        NotificationUtil.success('Thêm vào danh sách yêu thích thành công');
        await SportCenterFavoriteService.create(this.props.user.userId, this.props.sportCenter.id);
        this.getSportCenter();
    }

    updateIndex(selectedIndex) {
        if (selectedIndex == 0) return this.openPosition();
        return this.changeFavorite();
    }

    initSportButton() {
        const { isFavorite } = this.state;
        const component1 = () => (
            <View style={{ justifyContent: 'center' }}>
                <Icon type="material-community" name="routes" />
                <Text>Chỉ đường</Text>
            </View>
        )
        const component2 = () => (
            <View style={{ justifyContent: 'center' }}>
                <Icon type="material" name="favorite" color={!isFavorite && isFavorite == null ? "#000" : (!isFavorite ? "#000" : "#e32619")} />
                <Text
                    style={{ color: !isFavorite && isFavorite == null ? "#000" : (!isFavorite ? "#000" : "#e32619") }}
                >{!isFavorite && isFavorite == null ? "Bỏ thích" : (!isFavorite ? "Thích" : "Bỏ thích")}</Text>
            </View>
        )
        return [
            { element: component1 },
            { element: component2 }
        ]
    }

    render() {
        const buttons = this.initSportButton();
        return !this.state.isLoading ? (
            <Block flex safe style={styles.container}>
                <ScrollView>
                    <View style={styles.spaceRow}>
                        <Image
                            source={this.props.sportCenter.avatar ? { uri: ApiConstants.URL_API + '/image/' + this.props.sportCenter.avatar } : Images.DefaultImage}
                            style={{ width: width, height: height * 0.3 }}
                            PlaceholderContent={<ActivityIndicator size={50} color="#55a66d" />}
                        />
                    </View>
                    <ButtonGroup
                        onPress={this.updateIndex.bind(this)}
                        buttons={buttons}
                        containerStyle={{ height: 60, backgroundColor: '#fff', borderColor: '#fff' }}
                        underlayColor="#e1e7f0"
                    />
                    <Divider style={{ backgroundColor: 'blue', marginTop: 10, marginBottom: 10, marginLeft: 20, marginRight: 20 }} />
                    <Block style={styles.content}>
                        <Block style={{ alignItems: 'center', ...styles.spaceRow }}>
                            <Text style={{ textAlign: 'center' }} h3>{this.props.sportCenter.name}</Text>
                        </Block>
                        <Block row style={styles.spaceRow}>
                            <Text style={styles.lable}>Giờ mở cửa: </Text>
                            <Text
                                size={15}
                                color="#525F7F"
                            >
                                {TimeUtil.convertFloatToTime(this.props.sportCenter.timeOpen) + ' - ' + TimeUtil.convertFloatToTime(this.props.sportCenter.timeClose)}
                            </Text>
                        </Block>
                        <Block row style={{ ...styles.spaceRow, width: (width - 120) }}>
                            <Text style={styles.lable}>Địa chỉ: </Text>
                            <Block style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                                <Text
                                    size={15}
                                    color="#525F7F"
                                >
                                    {`${this.props.sportCenter.address ? this.props.sportCenter.address + ", " : ''}${this.props.sportCenter.commune}, `}
                                </Text>
                                <Text
                                    size={15}
                                    color="#525F7F"
                                >
                                    {`${this.props.sportCenter.district}, ${this.props.sportCenter.city}`}
                                </Text>
                            </Block>
                        </Block>
                        <Block style={styles.spaceRow}>
                            <Text style={styles.lable}>Các sân hiện có: </Text>
                            {(this.state.info.sportGrounds || []).map((sportGround, index) => {
                                let icon = this.state.info.sports.find(sport => sportGround.sportId == sport.id);
                                return (
                                    <Block style={{ marginTop: 10 }}>
                                        <ListItem
                                            containerStyle={styles.card}
                                            leftIcon={{
                                                type: "material-community",
                                                name: ComponentConstants.IconSports[icon.code]
                                            }}
                                            title={sportGround.name}
                                            subtitle={`Số lượng: ${sportGround.quantity} ${sportGround.type ? '\n type: ' + sportGround.type : ''}`}
                                            onPress={() => this.selectGround(index)}
                                            checkBox={{ checked: this.state.sportGroundSelecteds[index], onPress: () => this.selectGround(index) }}
                                        />
                                    </Block>
                                )
                            })}
                        </Block>
                    </Block>
                </ScrollView>
                <Block style={{ justifyContent: 'flex-end', alignSelf: 'center', marginBottom: 20 }}>
                    <Button
                        color="error"
                        shadowless
                        uppercase
                        onPress={this.onSubmit.bind(this)}
                    >
                        Đặt
                    </Button>
                </Block>
            </Block>
        ) : <ActivityIndicator size={50} color="#55a66d" style={{ marginTop: 30, justifyContent: 'center' }} />;
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white'
    },
    spaceRow: {
        marginBottom: 15
    },
    lable: {
        fontWeight: 'bold',
        marginRight: 20,
        fontSize: 18
    },
    content: {
        marginLeft: 10,
        marginRight: 10
    },
    card: {
        shadowOffset: {
            width: 10,
            height: 10
        },
        shadowColor: 'black',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        borderRadius: 10,
        elevation: 4
    },
    equipment: (width, height) => ({
        width: width * 0.9,
        height: height * 0.9,
        shadowOffset: {
            width: 10,
            height: 10
        },
        shadowColor: 'black',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        borderRadius: 10,
        elevation: 4
    }),
    iconX: {
        alignSelf: 'flex-end',
        marginRight: 0,
        marginTop: 0
    },
    containerEquipment: {
        marginBottom: 40,
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10
    },
    headIcon: {
        justifyContent: 'space-around',
        flexDirection: 'row'
    }
})

const mapStateToProps = (state, ownProps) => {
    const { sportCenters } = state.sportReducer;
    let sportCenterResult = {};
    if (sportCenters && sportCenters.length) {
        sportCenterResult = sportCenters.find(sportCenter => sportCenter.id == ownProps.route.params.id);
    }
    return {
        sportCenter: sportCenterResult,
        user: state.authReducer
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ setSportCentersAction }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SportCenterScreen);