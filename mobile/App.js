import React from 'react';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import AppNavigation from './src/navigations/navigation';

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigation />
    </Provider>
  );
}