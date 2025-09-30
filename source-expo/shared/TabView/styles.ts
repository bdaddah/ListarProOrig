import {StyleSheet} from 'react-native';
import {Radius, Spacing} from '../Consts';

export default StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    width: '100%',
    minHeight: 48,
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: Spacing.M,
  },
  indicator: {
    height: 3,
    borderTopLeftRadius: Radius.XS,
    borderTopRightRadius: Radius.XS,
    width: '100%',
  },
});
