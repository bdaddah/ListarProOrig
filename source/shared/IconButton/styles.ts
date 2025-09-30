import {StyleSheet} from 'react-native';
import {Radius} from '../Consts';

export default StyleSheet.create({
  large: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  medium: {
    width: 40,
    height: 40,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  small: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  round: {
    borderRadius: Radius.M,
  },
});
