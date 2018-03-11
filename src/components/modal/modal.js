import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import RNModal from 'react-native-modal';

import styles from './styles';

class Modal extends Component {
  static propTypes = {
    children: PropTypes.node,
    isVisible: PropTypes.bool,
  };
  static defaultProps = {
    children: <View />,
    isVisible: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      modalVisible: props.isVisible,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isVisible !== this.state.modalVisible) {
      this.setState({ modalVisible: nextProps.isVisible });
    }
  }

  hideModal = () => {
    this.setState({ modalVisible: false });
  };

  render() {
    const { children, ...restProps } = this.props;
    const { modalVisible } = this.state;
    return (
      <RNModal
        {...restProps}
        backdropOpacity={0.1}
        isVisible={modalVisible}
        onBackdropPress={this.hideModal}
        onBackButtonPress={this.hideModal}
      >
        <View style={styles.container}>
          <TouchableOpacity onPress={this.hideModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>&#10005;</Text>
          </TouchableOpacity>
          {children}
        </View>
      </RNModal>
    );
  }
}

export default Modal;
