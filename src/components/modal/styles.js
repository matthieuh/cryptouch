import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginHorizontal: 8,
    marginVertical: 16,
    padding: 40,
    paddingTop: 56,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#6F6F6F',
    shadowOffset: { width: 0, height: 11 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 16,
  },
  closeButtonText: {
    color: '#FD2C60',
    fontSize: 40,
  },
});

export default styles;
