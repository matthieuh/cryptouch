import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Field } from 'redux-form';
import Button from '../../components/button';

import styles from './styles';

const renderInput = ({ input: { onChange, ...restInput } }) => (
  <TextInput
    style={styles.input}
    onChangeText={onChange}
    {...restInput}
    underlineColorAndroid="transparent"
  />
);

class AddExchangeForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
  };
  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <View style={styles.container}>
        <Field name="apiKey" component={renderInput} placeholder="API KEY" />
        <Field name="apiSecret" component={renderInput} placeholder="API SECRET" />
        <Button onPress={handleSubmit}>Add exchange</Button>
      </View>
    );
  }
}

export default AddExchangeForm;
