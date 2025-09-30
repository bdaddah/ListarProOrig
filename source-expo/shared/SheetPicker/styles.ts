import {StyleSheet} from 'react-native';
import {Radius, Spacing} from '../Consts';

export default StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.M,
    padding: Spacing.M,
    borderWidth: 1,
  },
});
