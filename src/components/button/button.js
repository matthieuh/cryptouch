import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text, ViewPropTypes } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { isString } from 'lodash';

import styles from './styles';

const propTypes = {
  children: PropTypes.node,
  style: ViewPropTypes.style,
  floating: PropTypes.bool,
};

const defaultProps = {
  children: null,
  style: null,
  floating: false,
};

const FloatingButton = ({
  children, floating, style, ...props
}) => (
  <TouchableOpacity
    {...props}
    style={[styles.container, floating && styles.floatingContainer, style]}
  >
    <LinearGradient
      colors={['#FD2C60', '#F1577D']}
      style={[styles.content, floating && styles.floatingContent]}
    >
      {isString(children) ? <Text style={[styles.text]}>{children.toUpperCase()}</Text> : children}
    </LinearGradient>
  </TouchableOpacity>
);

FloatingButton.defaultProps = defaultProps;
FloatingButton.propTypes = propTypes;

export default FloatingButton;
