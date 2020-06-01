import React from "react";
import { StyleSheet, View, PermissionsAndroid} from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import MapViewDirections from 'react-native-maps-directions';
import { ApiConstants, Images } from '../../constants';
import WebView from "react-native-webview";

const GOOGLE_MAPS_APIKEY = 'AIzaSyCd-p2W5__trUamMGcohFQ97Gx2GGTpFuU';
const origin = { latitude: 21.037674, longitude: 105.781683 };

export default class RotoyaMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            region: {
                latitude: 21.037681,
                longitude: 105.781559,
                latitudeDelta: 0.02864195044303443,
                longitudeDelta: 0.020142817690068,
            },
            currentLat: null,
            currentLon: null
        }
    }

    async componentDidMount() {
        const granted = await this.requirePermissionAndroid();
        if (granted == PermissionsAndroid.RESULTS.GRANTED) {
            const position = await this.requireCurrentLocation();
            this.setState({ currentLat: position.coords.latitude, currentLon: position.coords.longitude });
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

    render() {
        const { latitude, longitude, name, avatar } = this.props.route.params;
        const { currentLat, currentLon } = this.state;
        console.log(currentLat, currentLon);
        return (
            <View style={styles.map}>
                {/* <MapView
                    initialRegion={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                /> */}
                {/* <WebView
                    source={{uri: `https://www.google.com/maps/place/${latitude || 21.005888} + ${longitude || 105.794319}`}}
                /> */}
                {/* <MapboxGL.MapView
                    style={styles.map}
                // styleURL={MapboxGL.mapStyles.Street}
                >
                    <MapboxGL.Camera
                        zoomLevel={15}
                        centerCoordinate={[105.781557, 21.037703]}
                    />
                </MapboxGL.MapView> */}
                <MapView
                    ref={map => this.map = map}
                    initialRegion={this.state.region}
                    style={styles.map}
                    showsUserLocation
                    followsUserLocation
                    showsMyLocationButton
                    provider={PROVIDER_GOOGLE}
                    showsBuildings
                    loadingEnabled
                >
                    <Marker
                        coordinate={{ latitude, longitude }}
                        title={name}
                        // image={avatar ? { uri: ApiConstants.URL_API + '/image/' + avatar } : Images.DefaultImage}

                    ></Marker>
                    {currentLat ? <MapViewDirections
                        style={styles.map}
                        origin={{ latitude: currentLat, longitude: currentLon}}
                        destination={{ latitude, longitude }}
                        apikey={GOOGLE_MAPS_APIKEY}
                        strokeWidth={3}
                        strokeColor="hotpink"
                    />: null}
                </MapView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF"
    },
    container: {
        height: 300,
        width: 300,
        backgroundColor: "tomato"
    },
    map: {
        flex: 1
    }
});