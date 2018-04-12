import React, { Component } from 'react';
import { View, ScrollView, Text, Dimensions, RefreshControl, Platform } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import SafeAreaView from 'react-native-safe-area-view';

import AddExchangeForm from '../../containers/add-exchange-form';
import Chart from '../../components/chart';
import Button from '../../components/button';
import Modal from '../../components/modal';
import Price from '../../components/price';

import styles from './styles';

class Home extends Component {
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
      refreshingData: false,
      addModalVisible: false,
    };
  }

  componentDidMount() {
    this.refreshData();
  }

  refreshData = async () => {
    this.setState({ refreshingData: true });

    const syncedExchangesArray = Object.keys(this.props.syncedExchanges);
    console.log('syncedExchanges', syncedExchangesArray);
    if (syncedExchangesArray.length) {
      await this.props.setCurrentScope(syncedExchangesArray[0]);
      await this.props.fetchChartData();
    }

    this.setState({ refreshingData: false });
  };

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
      addExchange,
      setCurrentScope,
    } = this.props;
    const { addModalVisible } = this.state;
    const fullHeight = Dimensions.get('window').height;

    const syncedExchangesArray = Object.entries(syncedExchanges);
    console.log('syncedExchangesArray', syncedExchanges, syncedExchangesArray);

    // if (syncedExchangesArray.length) {
    // setCurrentScope('kraken-1523058183493');
    // }
    //
    const refreshControl = (
      <RefreshControl
        refreshing={this.state.refreshingData}
        onRefresh={this.refreshData}
        tintColor="#fff"
      />
    );

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#2C4A83' }}>
        {/* <StatusBar translucent /> */}
        <View style={styles.container}>
          <ScrollView style={styles.scrollContainer} refreshControl={refreshControl}>
            <View style={[styles.containerOverflow, { height: fullHeight, top: -fullHeight }]} />
            {Platform.OS === 'ios' && refreshControl}
            <View style={styles.chartContainer}>
              <Price
                btcAmount={totalBalancesValue}
                btcValues={topPrices}
                currency={currentCurrency}
              />
              <Chart data={chartData} />
              <Text style={{ flex: 1, color: 'white', textAlign: 'center' }}>
                Last Update: {moment(lastUpdate).fromNow()}
              </Text>
            </View>
            <View style={styles.content}>
              {!!syncedExchangesArray.length &&
                syncedExchangesArray.map(([syncedExchange]) => (
                  <View
                    style={{ backgroundColor: 'grey' }}
                    key={`${syncedExchange.name}-${Date.now()}`}
                  >
                    <Text>{syncedExchange.name}</Text>
                  </View>
                ))}
            </View>
          </ScrollView>
          <Modal
            isVisible={addModalVisible}
            onBackdropPress={this.toggleModalVisibility}
            onBackButtonPress={this.toggleModalVisibility}
            onCloseButtonPress={this.toggleModalVisibility}
          >
            <AddExchangeForm onSubmit={addExchange} onSubmitSuccess={this.toggleModalVisibility} />
          </Modal>
          <Button onPress={this.toggleModalVisibility} floating>
            Add
          </Button>
        </View>
      </SafeAreaView>
    );
  }
}

export default Home;
