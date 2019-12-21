import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import AppNavigation from './navigations/navigation';
import * as Font from 'expo-font';
import { FontImport } from './styles/fonts';
import { AppLoading } from 'expo';
import { ThemeProvider } from 'react-native-elements';

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
                <Provider store={store}>
                    <ThemeProvider>
                        <AppNavigation />
                    </ThemeProvider>
                </Provider>
            ) : <AppLoading />
        )
    }
}