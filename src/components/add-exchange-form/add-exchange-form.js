import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import { Field } from 'redux-form';
import { Body, Picker, Item, Input, Title } from 'native-base';
import Button from '../../components/button';

import styles from './styles';

const renderInput = ({
  input, label, placeholder, type, meta: { touched, error, warning },
}) => {
  let hasError = false;
  if (error !== undefined) {
    hasError = true;
  }
  return (
    <Item error={hasError}>
      <Input {...input} placeholder={placeholder} />
      {hasError ? <Text>{error}</Text> : <Text />}
    </Item>
  );
};

const renderSelect = ({
  input, label, meta: { touched, error }, ...restProps
}) => {
  let hasError = false;
  if (error !== undefined) {
    hasError = true;
  }
  return (
    <Item error={hasError}>
      <Picker
        {...input}
        selectedValue={input.value}
        onValueChange={input.onChange}
        {...restProps}
      />
      {hasError ? <Text>{error}</Text> : <Text />}
    </Item>
  );
};

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
    const availableExchanges = [
      {
        key: 'krk',
        value: 'kraken',
        label: 'Kraken',
      },
      {
        key: 'cnb',
        value: 'coinbase',
        label: 'Coinbase',
      },
      {
        key: 'bfx',
        value: 'bitfinex',
        label: 'Bitfinex',
      },
    ];
    const exchangeItems = availableExchanges.map(itemProps => <Item {...itemProps} />);
    return (
      <View style={styles.container}>
        <Field
          name="exchange"
          component={renderSelect}
          placeholder="Exchange"
          iosHeader="Select one"
        >
          {exchangeItems}
        </Field>
        <Field name="apiKey" component={renderInput} placeholder="API key" />
        <Field name="apiSecret" component={renderInput} placeholder="API secret" />
        <Button onPress={handleSubmit}>Add exchange</Button>
      </View>
    );
  }
}

export default AddExchangeForm;
