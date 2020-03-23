import React from 'react';
import { Button, View } from 'react-native';

export default class BookedDetail extends React.Component {

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems:'center' }}>
                {/* <Button
                    onPress={() => this.props.navigation.goBack()}
                    title="Go back home"
                />

                <Button
                    onPress={() => this.props.navigation.openDrawer()}
                    title="DrawerOpen"
                /> */}
            </View>
        );
    }
}

// const styles = StyleSheet.create({
//     icon: {
//         width: 24,
//         height: 24,
//     },
// });