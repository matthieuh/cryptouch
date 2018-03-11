import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    marginHorizontal: 8,
    marginVertical: 24,
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#6F6F6F',
    shadowOffset: { width: 0, height: 11 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 6,
    right: 10,
  },
  closeButtonText: {
    color: '#FD2C60',
    fontSize: 26,
  },
});

export default styles;
