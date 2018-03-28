import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { AreaChart, Path, XAxis, YAxis } from 'react-native-svg-charts';
import * as scale from 'd3-scale';

const propTypes = {
  // data: PropTypes.arrayOf(PropTypes.number),
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
  <View style={{ height: 200, flexDirection: 'row' }}>
    {/* <YAxis
      data={data}
      contentInset={{ top: 20, bottom: 20 }}
      svg={{
        fill: 'white',
        fontSize: 10,
      }}
      numberOfTicks={10}
      formatLabel={value => value}
    /> */}
    <AreaChart
      style={{ height: 220, flex: 1 }}
      data={data}
      contentInset={{ top: 20, bottom: 20 }}
      showGrid={false}
      svg={{ fill: 'rgba(253, 44, 96, 0.2)' }}
      // curve={shape.curveNatural}
      extras={[ExtraLine]}
      animate
      {...restProps}
    />
    {/* <XAxis
      style={{ marginTop: 10 }}
      data={data}
      scale={scale.scaleBand}
      xAccessor={v => v}
      svg={{ fontWeight: 'bold' }}
    /> */}
  </View>
);

FloatingButton.defaultProps = defaultProps;
FloatingButton.propTypes = propTypes;

export default FloatingButton;
