import { handleActions } from 'redux-actions';
import moment from 'moment';
import { get, reduce } from 'lodash';
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
        const currentTotal = reduce(
          b.btcBalance,
          (cTotal, btcB = 0) => {
            console.log('btcB', btcB, cTotal);
            return cTotal + btcB;
          },
          0,
        );
        console.log('currentTotal', currentTotal);
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
    const { exchanges: { synced } } = getState();
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

// State
const initialState = {
  synced: ['kraken'],
  currentCurrency: 'EUR',
  balances: {},
  totalBalancesValues: [],
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
      errorMessage: null,
      fetchingBalance: true,
    }),
    [FETCH_BALANCE_SUCCESS]: (state, action) => ({
      ...state,
      balances: reduce(
        action.balances,
        (res, b, bName) => {
          const newRes = res;
          (newRes[bName] = []).push(b);
          return newRes;
        },
        state.balances,
      ),
      fetchingBalance: false,
    }),
    [FETCH_BALANCE_FAILURE]: (state, action) => ({
      ...state,
      errorMessage: action.message,
      fetchingBalance: false,
    }),
    [COUNT_BALANCE_REQUEST]: state => ({
      ...state,
      errorMessage: null,
      countingBalance: true,
    }),
    [COUNT_BALANCE_SUCCESS]: (state, action) => ({
      ...state,
      totalBalancesValues: [
        {
          at: moment().format(),
          value: action.totalBalancesValue,
        },
        ...state.totalBalancesValues,
      ],
      countingBalance: false,
    }),
    [COUNT_BALANCE_FAILURE]: (state, action) => ({
      ...state,
      errorMessage: action.message,
      countingBalance: false,
    }),
  },
  initialState,
);

// Selectors
export const getExchanges = ({ exchanges }) => exchanges.synced;
export const getBalances = ({ exchanges }) => get(exchanges, 'balances[0].balance');
export const getLastUpdate = ({ exchanges }) => get(exchanges, 'balances[0].at');
export const getTotalBalancesValue = ({ exchanges }) =>
  get(exchanges, 'totalBalancesValues[0].value');
export const getTopPrices = ({ exchanges }) => get(exchanges, 'balances.kraken.[0].topPrices');
export const getCurrentCurrency = ({ exchanges }) => exchanges.currentCurrency;
