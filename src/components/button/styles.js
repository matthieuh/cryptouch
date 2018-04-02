import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
  floatingContainer: {
    elevation: 5,
    position: 'absolute',
    bottom: 16,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FD2C60',
    shadowColor: '#FD2C60',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderRadius: 30,
  },
  floatingContent: {
    elevation: 5,
    width: 60,
    height: 60,
    minWidth: 60,
    borderRadius: 30,
    paddingHorizontal: 0,
    marginBottom: 24,
  },
  text: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
});

export default styles;
