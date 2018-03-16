import { handleActions } from 'redux-actions';
import moment from 'moment';
import { get } from 'lodash';
import {
  isExchangeAvailable,
  fetchBalance,
  getBalancePrice as getPrice,
  asyncReduce,
} from '../../utils/exchanges';

// Actions
const ADD_REQUEST = 'exchanges/ADD_REQUEST';
const ADD_SUCCESS = 'exchanges/ADD_SUCCESS';
const ADD_FAILURE = 'exchanges/ADD_FAILURE';
const FETCH_BALANCE_REQUEST = 'exchanges/FETCH_BALANCE_REQUEST';
const FETCH_BALANCE_SUCCESS = 'exchanges/FETCH_BALANCE_SUCCESS';
const FETCH_BALANCE_FAILURE = 'exchanges/FETCH_BALANCE_FAILURE';

export const add = name => (dispatch) => {
  dispatch({ type: ADD_REQUEST });
  const isAvailable = isExchangeAvailable(name);
  return isAvailable ? dispatch({ type: ADD_SUCCESS }) : dispatch({ type: ADD_FAILURE });
};

export const fetchBalances = (currencies = ['BTC', 'USD', 'EUR']) => async (dispatch, getState) => {
  dispatch({ type: FETCH_BALANCE_REQUEST });

  try {
    const { exchanges: { synced } } = getState();
    const tasks = synced.map(async exchangeName => fetchBalance(exchangeName));

    if (!tasks.length) {
      throw new Error('There is no balances');
    }

    const tasksRes = await Promise.all(tasks);

    const balance = tasksRes.map((exchange, index) => ({
      id: synced[index],
      value: exchange.total,
      at: moment().format(),
    }));

    const balancWithPrice = await asyncReduce(currencies, async (b, c) => getPrice(b, c), balance);

    dispatch({ type: FETCH_BALANCE_SUCCESS, balance: balancWithPrice });
  } catch (error) {
    dispatch({ type: FETCH_BALANCE_FAILURE, message: error.message });
  }
};

// State
const initialState = {
  synced: ['kraken'],
  balanceHistory: [],
  balance: [],
  errorMessage: null,
  adding: false,
  fetchingBalance: false,
};

// Reducers
export default handleActions(
  {
    [ADD_REQUEST]: state => ({
      ...state,
      adding: true,
    }),
    [ADD_SUCCESS]: (state, action) => ({
      ...state,
      synced: [...state.arr, action.exchangeName],
      adding: false,
    }),
    [ADD_FAILURE]: (state, action) => ({
      ...state,
      errorMessage: action.message,
      adding: false,
    }),
    [FETCH_BALANCE_REQUEST]: state => ({
      ...state,
      fetchingBalance: true,
    }),
    [FETCH_BALANCE_SUCCESS]: (state, action) => ({
      ...state,
      balanceHistory: [...action.balance, ...state.balanceHistory],
      balance: action.balance,
      fetchingBalance: false,
    }),
    [FETCH_BALANCE_FAILURE]: (state, action) => ({
      ...state,
      errorMessage: action.message,
      fetchingBalance: false,
    }),
  },
  initialState,
);

// Selectors
export const getExchanges = ({ exchanges }) => exchanges.synced;
export const getBalance = ({ exchanges }) => exchanges.balance;
export const getLastUpdate = ({ exchanges }) => get(exchanges, 'balanceHistory[0].at');
export const getBalancePrice = ({ exchanges }, currency) =>
  get(exchanges, `balanceHistory[0].total.${currency}`);
