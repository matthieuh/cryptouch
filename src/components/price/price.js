import React from 'react';
import PropTypes from 'prop-types';

import { View, ViewPropTypes, Text } from 'react-native';
import styles from './styles';

const propTypes = {
  style: ViewPropTypes.style,
  btcAmount: PropTypes.number,
};

const defaultProps = { style: null, btcAmount: null };

const Price = ({
  btcAmount, btcValues = {}, currency, style, ...props
}) => {
  const price = btcValues[currency] * btcAmount;
  return (
    <View {...props} style={[styles.container, style]}>
      <Text style={styles.amountText}>{price && price.toFixed(2)}</Text>
      <Text style={styles.currencyText}>€</Text>
    </View>
  );
};

Price.defaultProps = defaultProps;
Price.propTypes = propTypes;

export default Price;
