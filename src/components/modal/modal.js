import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import RNModal from 'react-native-modal';

import styles from './styles';

class Modal extends Component {
  static propTypes = {
    children: PropTypes.node,
    isVisible: PropTypes.bool,
    fullSize: PropTypes.bool,
    height: PropTypes.number,
    onBackdropPress: PropTypes.func,
    onBackButtonPress: PropTypes.func,
    onCloseButtonPress: PropTypes.func,
  };
  static defaultProps = {
    children: <View />,
    isVisible: false,
    fullSize: false,
    height: 400,
    onBackdropPress: () => {},
    onBackButtonPress: () => {},
    onCloseButtonPress: () => {},
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
    this.props.onCloseButtonPress();
  };

  render() {
    const {
      children,
      onBackdropPress,
      onBackButtonPress,
      fullSize,
      height,
      ...restProps
    } = this.props;
    const { modalVisible } = this.state;
    return (
      <RNModal
        {...restProps}
        backdropOpacity={0.3}
        isVisible={modalVisible}
        onBackdropPress={() => {
          this.hideModal();
          onBackdropPress();
        }}
        onBackButtonPress={() => {
          this.hideModal();
          onBackButtonPress();
        }}
      >
        <View style={[styles.container, fullSize ? { flex: 1 } : { height }]}>
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
