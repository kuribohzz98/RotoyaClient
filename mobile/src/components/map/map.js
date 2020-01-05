import React from "react";
import { StyleSheet, View } from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";

MapboxGL.setAccessToken("sk.eyJ1Ijoia3VyaWJvaHp6OTgiLCJhIjoiY2s0ZzFiMnFyMHJ5dzNlbGhrejB1Y3U0ZSJ9.YzhAvEgqZfB-kLYNPCD3Qw");

export default class RotoyaMap extends React.Component {
    componentDidMount() {
        MapboxGL.setTelemetryEnabled(false);
    }
    render() {
        return (
            <View style={styles.map}>
                <MapboxGL.MapView
                    style={styles.map}
                    styleURL={MapboxGL.StyleURL.Street}
                    zoomLevel={15}
                    centerCoordinate={[11.256, 43.77]}
                />
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