import {StyleSheet} from 'react-native';
import {Radius, Spacing} from '../index';

export default StyleSheet.create({
  step: {
    width: 32,
    height: 32,
    borderRadius: Radius.L,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    minWidth: 32,
    height: 28,
    paddingHorizontal: Spacing.XXS,
    borderRadius: Radius.S,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.S,
  },
});
