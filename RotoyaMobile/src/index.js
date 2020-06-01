import React from 'react';
import { Provider } from 'react-redux';
import Storage from './redux/store';
import AppNavigation from './navigations/navigation';
import { ThemeProvider } from 'react-native-elements';
import { PersistGate } from 'redux-persist/integration/react';
import { GalioProvider, Block } from 'galio-framework';
import { argonTheme } from './constants';
import FlashMessage from "react-native-flash-message";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        console.disableYellowBox = true;
    }
    render() {
        return (
            <Provider store={Storage.store}>
                {/* <PersistGate loading={null} persistor={persistor}> */}
                <GalioProvider theme={argonTheme}>
                    <Block flex>
                        <ThemeProvider>
                            <AppNavigation />
                        </ThemeProvider>
                        <FlashMessage
                            position="top"
                            duration={4000}
                        />
                    </Block>
                </GalioProvider>
                {/* </PersistGate> */}
            </Provider>
        )
    }
}