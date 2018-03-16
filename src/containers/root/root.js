import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SafeAreaView from 'react-native-safe-area-view';
import moment from 'moment';

import { fetchBalances, getBalancePrice, getLastUpdate } from '../../redux/modules/exchanges';

import Modal from '../../components/modal';
import Chart from '../../components/chart';
import FloatingButton from '../../components/floating-button';
import Price from '../../components/price';

import styles from './styles';

const mapStateToProps = state => ({
  balanceValue: getBalancePrice(state, 'EUR'),
  lastUpdate: getLastUpdate(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({ fetchBalances }, dispatch);

class Root extends Component {
  static propTypes = {
    fetchBalances: PropTypes.func.isRequired,
    balanceValue: PropTypes.number,
    lastUpdate: PropTypes.string,
  };
  static defaultProps = {
    balanceValue: null,
    lastUpdate: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      addModalVisible: false,
    };
  }

  componentDidMount() {
    this.props.fetchBalances();
    this.tick = setInterval(this.props.fetchBalances, 3 * 60 * 1000);
  }

  handleAddPress = () => {
    this.setState({ addModalVisible: true });
  };

  render() {
    const { balanceValue, lastUpdate } = this.props;
    const { addModalVisible } = this.state;
    const chartData = [50, 10, 40, 95, 85, 91, 35, 53, 24, 50];
    return (
      <View style={styles.container}>
        <View style={styles.chartContainer}>
          <SafeAreaView style={styles.content}>
            <Price amount={balanceValue} />
            <Chart data={chartData} />
            <Text style={{ color: 'white' }}>Last Update: {moment(lastUpdate).fromNow()}</Text>
          </SafeAreaView>
        </View>
        <FloatingButton onPress={this.handleAddPress}>Add</FloatingButton>
        <Modal isVisible={addModalVisible}>
          <View>
            <Text>Add </Text>
          </View>
        </Modal>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Root);
