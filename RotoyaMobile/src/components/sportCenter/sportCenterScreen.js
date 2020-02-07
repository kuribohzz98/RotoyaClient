import {
    View,
    Dimensions,
    ScrollView
} from 'react-native';
import React from 'react';
import { Block, Text, theme } from "galio-framework";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setSportCentersAction } from '../../redux/action/sport.action';
import { Image } from 'react-native-elements';

const { width, height } = Dimensions.get('window');

class SportCenterScreen extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            // <Block>
            <View style={{ flex: 1 }}>
                <ScrollView>
                    <View style={{ marginBottom: 15 }}>
                        <Image
                            source={{ uri: 'data:image/jpeg;base64,' + this.props.avatar }}
                            style={{ width: width, height: height * 0.3 }}
                        />
                    </View>
                    <Block style={{ marginLeft: 10, marginRight: 10}}>
                        <Block style={{ alignItems: 'center', marginBottom: 15 }}>
                            <Text style={{textAlign: 'center'}} h3>{this.props.name}</Text>
                        </Block>
                        <Block row style={{ marginBottom: 15 }}>
                            <Text size={18} style={{ fontWeight: 'bold', width: 100 }}>Address: </Text>
                            <Text
                                size={15}
                                color="#525F7F"
                                style={{ textAlign: "center", alignSelf: 'center' }}
                            >
                                {`${this.props.address ? this.props.address + ", " : ''}${this.props.commune}, ${this.props.district}, ${this.props.city}`}
                            </Text>
                        </Block>

                    </Block>
                </ScrollView>

            </View>
            // </Block>

        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { sportCenters } = state.sportReducer;
    let sportCenterResult = {};
    if (sportCenters && sportCenters.length) {
        sportCenterResult = sportCenters.find(sportCenter => sportCenter.id == ownProps.navigation.getParam('id'));
    }
    return {
        id: sportCenterResult.id,
        name: sportCenterResult.name,
        country: sportCenterResult.country,
        city: sportCenterResult.city,
        district: sportCenterResult.district,
        commune: sportCenterResult.commune,
        address: sportCenterResult.address,
        avatar: sportCenterResult.avatar,
        latitude: sportCenterResult.latitude,
        longitude: sportCenterResult.longitude
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ setSportCentersAction }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SportCenterScreen);