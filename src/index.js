import React from 'react';
import { Provider } from 'react-redux';
import Root from './containers/root';
import store from './redux/store';

const AppProvider = () => (
  <Provider store={store}>
    <Root />
  </Provider>
);

export default AppProvider;
