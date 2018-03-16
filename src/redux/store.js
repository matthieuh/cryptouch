import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import { AsyncStorage } from 'react-native';

import exchanges from './modules/exchanges';

const middlewares = [thunkMiddleware];

const exchangesPersistConfig = {
  key: 'form',
  storage: AsyncStorage,
};

const reducer = combineReducers({
  exchanges: persistReducer(exchangesPersistConfig, exchanges),
});

const store = compose(
  applyMiddleware(...middlewares),
  global.reduxNativeDevTools ? global.reduxNativeDevTools() : noop => noop,
)(createStore)(reducer);

export const persistor = persistStore(store);

export default store;
