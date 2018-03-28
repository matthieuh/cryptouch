import React from 'react';
import PropTypes from 'prop-types';
import { get, Map } from 'immutable';

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
  console.log('btcValues', btcValues, currency);
  const currencyInBtc =
    btcValues && Map.isMap(btcValues) ? get(btcValues, currency) : btcValues[currency];
  const price = currencyInBtc * btcAmount;
  return (
    <View {...props} style={[styles.container, style]}>
      <Text style={styles.amountText}>
        {price &&
          price.toLocaleString('en-US', {
            style: 'currency',
            currency,
          })}
      </Text>
    </View>
  );
};

Price.defaultProps = defaultProps;
Price.propTypes = propTypes;

export default Price;
