import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import SafeAreaView from 'react-native-safe-area-view';

import Modal from '../../components/modal';
import Chart from '../../components/chart';
import FloatingButton from '../../components/floating-button';
import Price from '../../components/price';

import styles from './styles';

const mapStateToProps = () => ({});
const mapDispatchToProps = () => ({});

class Root extends Component {
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      addModalVisible: false,
    };
  }

  handleAddPress = () => {
    this.setState({ addModalVisible: true });
  };

  render() {
    const { addModalVisible } = this.state;
    const chartData = [50, 10, 40, 95, 85, 91, 35, 53, 24, 50];
    return (
      <View style={styles.container}>
        <View style={styles.chartContainer}>
          <SafeAreaView style={styles.content}>
            {/* <Text>{this.state.mode}</Text> */}
            <Price amount={5200} />
            <Chart data={chartData} />
          </SafeAreaView>
        </View>
        <Text>addModalVisible: {addModalVisible ? 'true' : 'false'}</Text>
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
