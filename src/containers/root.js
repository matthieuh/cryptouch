import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Home from '../screens/home';

import {
  addExchange,
  fetchBalances,
  fetchChartData,
  getChartData,
  getTotalBalancesValue,
  getTopPrices,
  getCurrentCurrency,
  getLastUpdate,
  getSyncedExchanges,
  setCurrentScope,
} from '../redux/modules/exchanges';

const mapStateToProps = state => ({
  totalBalancesValue: getTotalBalancesValue(state),
  lastUpdate: getLastUpdate(state),
  topPrices: getTopPrices(state),
  currentCurrency: getCurrentCurrency(state),
  syncedExchanges: getSyncedExchanges(state),
  chartData: getChartData(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchBalances,
      fetchChartData,
      addExchange,
      setCurrentScope,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Home);
