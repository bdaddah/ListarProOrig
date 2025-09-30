import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  large: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  medium: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  small: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  badge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
