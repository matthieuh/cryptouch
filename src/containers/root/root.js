import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SafeAreaView from 'react-native-safe-area-view';

import {
  fetchBalances,
  getTotalBalancesValue,
  getTopPrices,
  getCurrentCurrency,
  getLastUpdate,
  getSyncedExchanges,
} from '../../redux/modules/exchanges';

import Modal from '../../components/modal';
import Chart from '../../components/chart';
import FloatingButton from '../../components/floating-button';
import Price from '../../components/price';

import styles from './styles';

const mapStateToProps = state => ({
  totalBalancesValue: getTotalBalancesValue(state),
  lastUpdate: getLastUpdate(state),
  topPrices: getTopPrices(state),
  currentCurrency: getCurrentCurrency(state),
  syncedExchanges: getSyncedExchanges(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({ fetchBalances }, dispatch);

class Root extends Component {
  static propTypes = {
    currentCurrency: PropTypes.string.isRequired,
    fetchBalances: PropTypes.func.isRequired,
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

  componentDidMount() {
    this.props.fetchBalances();
    // this.tick = setInterval(this.props.fetchBalances, 3 * 60 * 1000);
  }

  handleAddPress = () => {
    this.setState({ addModalVisible: true });
  };

  render() {
    const {
      totalBalancesValue,
      lastUpdate,
      topPrices,
      currentCurrency,
      syncedExchanges,
    } = this.props;
    const { addModalVisible } = this.state;
    const chartData = [50, 10, 40, 95, 85, 91, 35, 53, 24, 50];
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
            <Text style={{ color: 'white' }}>
              Last Update: {JSON.stringify(lastUpdate)} - {JSON.stringify(topPrices)} -{' '}
              {JSON.stringify(totalBalancesValue)} - {JSON.stringify(currentCurrency)} -{' '}
              {syncedExchanges}
            </Text>
          </SafeAreaView>
        </View>
        <FloatingButton onPress={this.handleAddPress}>Add</FloatingButton>
        <Modal isVisible={addModalVisible}>
          <View>
            <Text>Add</Text>
          </View>
        </Modal>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Root);
