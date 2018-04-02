import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import { AsyncStorage as storage } from 'react-native';
import thunkMiddleware from 'redux-thunk';
import { persistReducer, persistStore } from 'redux-persist';
import immutableTransform from 'redux-persist-transform-immutable';
import { reducer as form } from 'redux-form';

import exchanges, { ExchangeRecord } from './modules/exchanges';

const middlewares = [thunkMiddleware];

const persistConfig = {
  transforms: [immutableTransform({ records: [ExchangeRecord] })],
  key: 'root',
  storage,
};

const reducers = {
  exchanges,
  form,
};

const reducer = combineReducers(reducers);
const persistedReducer = persistReducer(persistConfig, reducer);

const store = compose(
  applyMiddleware(...middlewares),
  global.reduxNativeDevTools ? global.reduxNativeDevTools() : noop => noop,
)(createStore)(persistedReducer);

export default store;
export const persistor = persistStore(store);
