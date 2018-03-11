import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';

import exchanges from './modules/exchanges';

const middlewares = [thunkMiddleware];

const reducer = combineReducers({
  exchanges,
});

const store = compose(
  applyMiddleware(...middlewares),
  global.reduxNativeDevTools ? global.reduxNativeDevTools() : noop => noop,
)(createStore)(reducer);

export default store;
