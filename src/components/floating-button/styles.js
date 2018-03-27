import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    elevation: 5,
    position: 'absolute',
    alignSelf: 'center',
    bottom: 16,
  },
  content: {
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    minWidth: 60,
    marginBottom: 24,
    borderRadius: 30,
    backgroundColor: '#FD2C60',
    shadowColor: '#FD2C60',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  text: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
});

export default styles;
