import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import SafeAreaView from 'react-native-safe-area-view';

import {
  fetchBalances,
  fetchChartData,
  getChartData,
  getTotalBalancesValue,
  getTopPrices,
  getCurrentCurrency,
  getLastUpdate,
  getSyncedExchanges,
} from '../../redux/modules/exchanges';

import AddExchangeForm from '../../containers/add-exchange-form';
import Chart from '../../components/chart';
import Button from '../../components/button';
import Modal from '../../components/modal';
import Price from '../../components/price';

import styles from './styles';

const mapStateToProps = state => ({
  totalBalancesValue: getTotalBalancesValue(state),
  lastUpdate: getLastUpdate(state),
  topPrices: getTopPrices(state),
  currentCurrency: getCurrentCurrency(state),
  syncedExchanges: getSyncedExchanges(state),
  chartData: getChartData(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ fetchBalances, fetchChartData }, dispatch);

class Root extends Component {
  static propTypes = {
    currentCurrency: PropTypes.string.isRequired,
    fetchBalances: PropTypes.func.isRequired,
    fetchChartData: PropTypes.func.isRequired,
    lastUpdate: PropTypes.string,
    syncedExchanges: PropTypes.shape({}),
    topPrices: PropTypes.shape({}),
    totalBalancesValue: PropTypes.number,
  };
  static defaultProps = {
    totalBalancesValue: null,
    lastUpdate: null,
    topPrices: {},
    syncedExchanges: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      addModalVisible: false,
    };
  }

  async componentDidMount() {
    // this.props.fetchChartData();
    await this.props.fetchBalances();
    this.props.fetchChartData();
  }

  toggleModalVisibility = () => {
    this.setState({ addModalVisible: !this.state.addModalVisible });
  };

  render() {
    const {
      chartData,
      totalBalancesValue,
      lastUpdate,
      topPrices,
      currentCurrency,
      syncedExchanges,
    } = this.props;
    const { addModalVisible } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.chartContainer}>
          <SafeAreaView style={styles.content}>
            <Price
              btcAmount={totalBalancesValue}
              btcValues={topPrices}
              currency={currentCurrency}
            />
            <Chart data={chartData} />
            <Text style={{ flex: 1, color: 'white', textAlign: 'center' }}>
              Last Update: {moment(lastUpdate).fromNow()}
            </Text>
          </SafeAreaView>
        </View>
        <Button onPress={this.toggleModalVisibility} floating>
          Add
        </Button>
        <Modal isVisible={addModalVisible}>
          <AddExchangeForm onSubmit={this.toggleModalVisibility} />
        </Modal>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Root);
