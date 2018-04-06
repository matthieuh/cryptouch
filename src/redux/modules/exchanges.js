import { handleActions } from 'redux-actions';
import { reduce } from 'lodash';
import { fromJS, List, Map, Record } from 'immutable';
import { createSelector } from 'reselect';
import moment from 'moment';
import nearest from 'nearest-date';
import {
  fetchBalance,
  fetchTradeHistory,
  fetchOHLCV,
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
const FETCH_CHART_DATA_REQUEST = 'exchanges/FETCH_CHART_DATA_REQUEST';
const FETCH_CHART_DATA_SUCCESS = 'exchanges/FETCH_CHART_DATA_SUCCESS';
const FETCH_CHART_DATA_FAILURE = 'exchanges/FETCH_CHART_DATA_FAILURE';

// State
const initialStateJS = {
  synced: {},
  currentCurrency: 'EUR',
  currentScope: 'kraken',
  balances: {},
  totalBalancesValues: [],
  errorMessage: null,
  adding: false,
  fetchingBalance: false,
  fetchingChartData: false,
  chartData: null,
};
const initialState = fromJS(initialStateJS);
export const ExchangeRecord = Record(initialStateJS, 'Exchange');

// Selectors
const stateSelector = state => (state.get ? state.get('exchanges') : state.exchanges);
export const getCurrentScope = createSelector([stateSelector], state => state.get('currentScope'));
export const getSyncedExchanges = createSelector([stateSelector], state => state.get('synced'));
export const getSyncedExchange = createSelector([stateSelector], (state) => {
  const scope = state.get('currentScope');
  console.log('getSyncedExchange', state);
  console.log('CurrentScope', scope);
  return state.getIn(['synced', scope]);
});
export const getBalances = createSelector([stateSelector], state =>
  state.getIn(['balances', 'kraken', 0, 'balance']));
export const getChartData = createSelector([stateSelector], (state) => {
  const chartData = state.get('chartData');
  return chartData ? chartData.toJS() : [];
});
export const getLastUpdate = createSelector([stateSelector], state =>
  state.getIn(['balances', 'kraken', 0, 'at']));
export const getTotalBalancesValue = createSelector([stateSelector], state =>
  state.getIn(['totalBalancesValues', 0, 'value']));
export const getTopPrices = createSelector([stateSelector], state =>
  state.getIn(['balances', 'kraken', 0, 'topPrices']));

export const getCurrentCurrency = createSelector([stateSelector], state =>
  state.get('currentCurrency'));

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
  console.log('getState()', getState());
  const currentExchangeConf = getSyncedExchange(getState());
  console.log('currentExchangeConf', currentExchangeConf);
  await fetchTradeHistory('kraken', currentExchangeConf);

  try {
    const synced = getSyncedExchanges(getState()).toJS();
    const exchanges = Object.entries(synced);
    const tasks = exchanges.map(async ([name, config]) => fetchBalance(name, config));

    if (!tasks.length) {
      throw new Error('There is no balances');
    }

    const tasksRes = await Promise.all(tasks);

    const balancesTasks = tasksRes.map(async (balance, index) => {
      const [exchangeName, config] = exchanges[index];
      const topPrices = await getPrices(exchangeName, config);
      const btcBalance = await getBalanceIn(exchangeName, config, balance.total, 'BTC');

      return {
        [exchangeName]: {
          id: exchangeName,
          at: moment().format(),
          balance: balance.total,
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
    console.log('FETCH_BALANCE_FAILURE', error);
    dispatch({ type: FETCH_BALANCE_FAILURE, message: error.message });
  }
};

export const fetchChartData = () => async (dispatch, getState) => {
  try {
    dispatch({ type: FETCH_CHART_DATA_REQUEST });
    const config = getSyncedExchange(getState());
    const ohlcv = await fetchOHLCV('kraken', config);
    const totalBalancesValues = stateSelector(getState())
      .get('totalBalancesValues')
      .toJS();

    const times = ohlcv.map(d => new Date(d[0]));

    const res = totalBalancesValues.reverse().map((tb) => {
      const tbDate = new Date(tb.at);
      const index = nearest(times, tbDate);
      return ohlcv[index][4] * tb.value;
    });

    dispatch({ type: FETCH_CHART_DATA_SUCCESS, payload: res });
  } catch (error) {
    dispatch({ type: FETCH_CHART_DATA_FAILURE, message: error.message });
  }
};

export const addExchange = ({ name, ...restProps }) => async (dispatch) => {
  await dispatch({ type: ADD_REQUEST });
  await dispatch({ type: ADD_SUCCESS, payload: { name, ...restProps } });
  // dispatch({ type: ADD_FAILURE });
  dispatch(fetchBalances());
};

// Reducers
export default handleActions(
  {
    [ADD_REQUEST]: state => state.set('adding', true),
    [ADD_SUCCESS]: (state, action) =>
      state
        .update('synced', synced => synced.set(action.payload.name, action.payload))
        .set('adding', false),
    [ADD_FAILURE]: (state, action) =>
      state.set('errorMessage', action.message).set('adding', false),
    [FETCH_BALANCE_REQUEST]: state => state.set('errorMessage', null).set('fetchingBalance', true),
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
          (l || List()).unshift(Map({
            at: moment().format(),
            value: action.totalBalancesValue,
          })))
        .set('countingBalance', false),
    [COUNT_BALANCE_FAILURE]: (state, action) =>
      state.set('errorMessage', action.message).set('countingBalance', false),
    [FETCH_CHART_DATA_REQUEST]: state =>
      state.set('errorMessage', null).set('fetchingChartData', true),
    [FETCH_CHART_DATA_SUCCESS]: (state, action) =>
      state.set('chartData', fromJS(action.payload)).set('fetchingChartData', false),
    [FETCH_CHART_DATA_FAILURE]: (state, action) =>
      state.set('errorMessage', action.message).set('fetchingChartData', false),
  },
  initialState,
);
