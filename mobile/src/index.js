import React from 'react';
import { Provider } from 'react-redux';
import Storage from './redux/store';
import AppNavigation from './navigations/navigation';
import * as Font from 'expo-font';
import { FontImport } from './styles/fonts';
// import { AppLoading } from 'expo';
import { ThemeProvider } from 'react-native-elements';
import { PersistGate } from 'redux-persist/integration/react';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { fontLoaded: false };
    }
    async componentDidMount() {
        await Font.loadAsync(FontImport);
        this.setState({ fontLoaded: true })
    }
    render() {
        return (
            this.state.fontLoaded ? (
                <Provider store={Storage.store}>
                    {/* <PersistGate loading={null} persistor={persistor}> */}
                        <ThemeProvider>
                            <AppNavigation />
                        </ThemeProvider>
                    {/* </PersistGate> */}
                </Provider>
            ) : null
        )
    }
}