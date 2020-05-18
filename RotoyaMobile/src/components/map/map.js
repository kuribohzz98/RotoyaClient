import React from "react";
import { StyleSheet, View } from "react-native";
// import MapboxGL from '@react-native-mapbox-gl/maps';
// import MapView from 'react-native-maps';
import WebView from "react-native-webview";

// MapboxGL.setAccessToken("sk.eyJ1Ijoia3VyaWJvaHp6OTgiLCJhIjoiY2s0ZzFiMnFyMHJ5dzNlbGhrejB1Y3U0ZSJ9.YzhAvEgqZfB-kLYNPCD3Qw");

export default class RotoyaMap extends React.Component {
    componentDidMount() {
        // MapboxGL.setTelemetryEnabled(false);
    }
    render() {
        const {latitude, longitude} = this.props.route.params;
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
                <WebView
                    source={{uri: `https://www.google.com/maps/place/${latitude || 21.005888} + ${longitude || 105.794319}`}}
                />
                {/* <MapboxGL.MapView
                    style={styles.map}
                // styleURL={MapboxGL.mapStyles.Street}
                >
                    <MapboxGL.Camera
                        zoomLevel={15}
                        centerCoordinate={[105.781557, 21.037703]}
                    />
                </MapboxGL.MapView> */}
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