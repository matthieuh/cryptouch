import { handleActions } from 'redux-actions';
import moment from 'moment';
import { reduce } from 'lodash';
import { fromJS, List, Map, Record } from 'immutable';
import { createSelector } from 'reselect';
import {
  isExchangeAvailable,
  fetchBalance,
  getTopPrices as getPrices,
  getBalanceIn,
} from '../../utils/exchanges';

// Actions
const ADD_REQUEST = 'exchanges/ADD_REQUEST';
const ADD_SUCCESS = 'exchanges/ADD_SUCCESS';
const ADD_FAILURE = 'exchanges/ADD_FAILURE';
const FETCH_BALANCE_REQUEST = 'exchanges/FETCH_BALANCE_REQUEST';
const FETCH_BALANCE_SUCCESS = 'exchanges/FETCH_BALANCE_SUCCESS';
const FETCH_BALANCE_FAILURE = 'exchanges/FETCH_BALANCE_FAILURE';
const COUNT_BALANCE_REQUEST = 'exchanges/COUNT_BALANCE_REQUEST';
const COUNT_BALANCE_SUCCESS = 'exchanges/COUNT_BALANCE_SUCCESS';
const COUNT_BALANCE_FAILURE = 'exchanges/COUNT_BALANCE_FAILURE';

// Selectors
const stateSelector = state => (state.get ? state.get('exchanges') : state.exchanges);
export const getSyncedExchanges = createSelector([stateSelector], state => state.get('synced'));
export const getBalances = createSelector([stateSelector], state =>
  state.getIn(['balances', 'kraken', 0, 'balance']));
export const getLastUpdate = createSelector([stateSelector], state =>
  state.getIn(['balances', 'kraken', 0, 'at']));
export const getTotalBalancesValue = createSelector([stateSelector], state =>
  state.getIn(['totalBalancesValues', 0, 'value']));
export const getTopPrices = createSelector([stateSelector], state =>
  state.getIn(['balances', 'kraken', 0, 'topPrices']));

export const getCurrentCurrency = createSelector([stateSelector], state =>
  state.get('currentCurrency'));

export const add = name => (dispatch) => {
  dispatch({ type: ADD_REQUEST });
  const isAvailable = isExchangeAvailable(name);
  return isAvailable ? dispatch({ type: ADD_SUCCESS }) : dispatch({ type: ADD_FAILURE });
};

export const countBalancesValue = balances => async (dispatch) => {
  dispatch({ type: COUNT_BALANCE_REQUEST });

  try {
    const totalBalancesValue = reduce(
      balances,
      (total, b) => {
        const currentTotal = reduce(b.btcBalance, (cTotal, btcB = 0) => cTotal + btcB, 0);
        return total + currentTotal;
      },
      0,
    );
    dispatch({ type: COUNT_BALANCE_SUCCESS, totalBalancesValue });
  } catch (error) {
    dispatch({ type: COUNT_BALANCE_FAILURE, message: error.message });
  }
};

export const fetchBalances = () => async (dispatch, getState) => {
  dispatch({ type: FETCH_BALANCE_REQUEST });

  try {
    const synced = getSyncedExchanges(getState()).toJS();
    const tasks = synced.map(async exchangeName => fetchBalance(exchangeName));

    if (!tasks.length) {
      throw new Error('There is no balances');
    }

    const tasksRes = await Promise.all(tasks);

    const balancesTasks = tasksRes.map(async (exchange, index) => {
      const exchangeName = synced[index];
      const topPrices = await getPrices(exchangeName);
      const btcBalance = await getBalanceIn(exchangeName, exchange.total, 'BTC');

      return {
        [exchangeName]: {
          id: exchangeName,
          at: moment().format(),
          balance: exchange.total,
          btcBalance,
          topPrices,
        },
      };
    });

    const balancesArray = await Promise.all(balancesTasks);
    const balances = Object.assign({}, ...balancesArray);

    dispatch({ type: FETCH_BALANCE_SUCCESS, balances });
    dispatch(countBalancesValue(balances));
  } catch (error) {
    dispatch({ type: FETCH_BALANCE_FAILURE, message: error.message });
  }
};

const ExchangeRecord = Record(
  {
    synced: ['kraken'],
    currentCurrency: 'EUR',
    balances: {},
    totalBalancesValues: [],
    errorMessage: null,
    adding: false,
    fetchingBalance: false,
  },
  'Exchange',
);

// State
const initialState = fromJS({
  synced: ['kraken'],
  currentCurrency: 'EUR',
  balances: {},
  totalBalancesValues: [],
  errorMessage: null,
  adding: false,
  fetchingBalance: false,
});

// Reducers
export default handleActions(
  {
    [ADD_REQUEST]: state => state.set('adding', true),
    [ADD_SUCCESS]: (state, action) =>
      state.update('synced', list => list.push(action.exchangeName)).set('adding', false),
    [ADD_FAILURE]: (state, action) =>
      state.set('errorMessage', action.message).set('adding', false),
    [FETCH_BALANCE_REQUEST]: state => state.set('errorMessage', null).set('fetchingBalance', null),
    [FETCH_BALANCE_SUCCESS]: (state, action) =>
      fromJS(action.balances)
        .reduce(
          (acc, b, bName) => acc.updateIn(['balances', bName], l => (l || List()).push(fromJS(b))),
          state,
        )
        .set('fetchingBalance', false),
    [FETCH_BALANCE_FAILURE]: (state, action) =>
      state.set('errorMessage', action.message).set('fetchingBalance', false),
    [COUNT_BALANCE_REQUEST]: state => state.set('errorMessage', null).set('fetchingBalance', true),
    [COUNT_BALANCE_SUCCESS]: (state, action) =>
      state
        .update('totalBalancesValues', l =>
          (l || List()).set(
            0,
            Map({
              at: moment().format(),
              value: action.totalBalancesValue,
            }),
          ))
        .set('countingBalance', false),
    [COUNT_BALANCE_FAILURE]: (state, action) =>
      state.set('errorMessage', action.message).set('countingBalance', false),
  },
  initialState,
);
