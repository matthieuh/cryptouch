import React from 'react';
import PropTypes from 'prop-types';
import { AreaChart, Path } from 'react-native-svg-charts';
import * as shape from 'd3-shape';

// import styles from './styles';

const propTypes = {
  data: PropTypes.arrayOf(PropTypes.number),
};

const defaultProps = {
  data: [],
};

const LinePropTypes = {
  line: PropTypes.node.isRequired,
};

const ExtraLine = ({ line }) => <Path key="line " d={line} stroke="rgb(253, 44, 96)" fill="none" />;
ExtraLine.propTypes = LinePropTypes;

const FloatingButton = ({ data, ...restProps }) => (
  <AreaChart
    style={{ height: 220 }}
    data={data}
    contentInset={{ top: 20, bottom: 20 }}
    showGrid={false}
    svg={{ fill: 'rgba(253, 44, 96, 0.2)' }}
    // curve={shape.curveNatural}
    extras={[ExtraLine]}
    animate
    {...restProps}
  />
);

FloatingButton.defaultProps = defaultProps;
FloatingButton.propTypes = propTypes;

export default FloatingButton;
