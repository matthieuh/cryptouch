import { handleActions } from 'redux-actions';
import { isExchangeAvailable } from '../../utils/exchanges';

// Actions
const ADD_REQUEST = 'exchanges/ADD_SUCCESS';
const ADD_SUCCESS = 'exchanges/ADD_SUCCESS';
const ADD_FAILURE = 'exchanges/ADD_SUCCESS';

export const add = name => (dispatch) => {
  dispatch({ type: ADD_REQUEST });
  const isAvailable = isExchangeAvailable(name);
  return isAvailable ? dispatch({ type: ADD_SUCCESS }) : dispatch({ type: ADD_FAILURE });
};

// State
const initialState = {
  synced: [],
  errorMessage: null,
  loading: false,
};

// Reducers
export default handleActions(
  {
    [ADD_REQUEST]: state => ({
      ...state,
      loading: true,
    }),
    [ADD_SUCCESS]: (state, action) => ({
      ...state,
      synced: [...state.arr, action.exchangeName],
      loading: false,
    }),
    [ADD_FAILURE]: (state, action) => ({
      ...state,
      errorMessage: action.message,
      loading: false,
    }),
  },
  initialState,
);

// Selectors
export const getExchanges = ({ exchanges }) => exchanges.synced;
