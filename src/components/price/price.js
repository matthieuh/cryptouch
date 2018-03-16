import React from 'react';
import PropTypes from 'prop-types';

import { View, ViewPropTypes, Text } from 'react-native';
import styles from './styles';

const propTypes = {
  style: ViewPropTypes.style,
  amount: PropTypes.number,
};

const defaultProps = { style: null, amount: null };

const Price = ({ amount, style, ...props }) => (
  <View {...props} style={[styles.container, style]}>
    <Text style={styles.amountText}>{amount && amount.toFixed(2)}</Text>
    <Text style={styles.currencyText}>€</Text>
  </View>
);

Price.defaultProps = defaultProps;
Price.propTypes = propTypes;

export default Price;
