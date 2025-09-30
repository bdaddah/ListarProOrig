import {StyleSheet} from 'react-native';
import {Radius, Spacing} from '../Consts';

export default StyleSheet.create({
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: Radius.XS,
    borderWidth: 2,
    marginRight: Spacing.S,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
